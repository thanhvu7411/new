import os
import io
import re
import json
import time
import markdown
from pathlib import Path
from flask import (
    Flask, render_template, request,
    jsonify, send_file, Response, stream_with_context
)
from dotenv import load_dotenv
from google import genai
from google.genai import types as genai_types
from weasyprint import HTML as WeasyHTML
from prompts import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# ── Gemini client ──────────────────────────────────────────────────────────────
def get_client(api_key: str = "") -> genai.Client:
    key = api_key or GEMINI_API_KEY
    if not key:
        raise ValueError("GEMINI_API_KEY chưa được thiết lập.")
    return genai.Client(api_key=key)


# ── Markdown → clean HTML (for preview + PDF) ─────────────────────────────────
ARTICLE_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Merriweather',Georgia,serif;font-size:16.5px;line-height:1.9;color:#1c1c2e;background:#fff;padding:48px 56px 60px;max-width:820px;margin:0 auto}
h1{font-family:'Inter',sans-serif;font-size:2rem;font-weight:800;line-height:1.22;color:#00356b;margin:0 0 28px;padding-bottom:20px;border-bottom:3px solid #00356b}
h2{font-family:'Inter',sans-serif;font-size:1.28rem;font-weight:700;color:#00356b;margin:44px 0 14px;padding-bottom:9px;border-bottom:2px solid #c8daf0}
h3{font-family:'Inter',sans-serif;font-size:1.05rem;font-weight:700;color:#1a3a5c;margin:28px 0 10px}
p{margin-bottom:18px}
blockquote{background:#fffbea;border-left:4px solid #e8a000;border-radius:0 8px 8px 0;padding:16px 20px;margin:24px 0;font-style:italic;color:#5a3e00;font-size:0.96rem;line-height:1.8}
blockquote p{margin:0}
table{width:100%;border-collapse:collapse;margin:22px 0 8px;font-family:'Inter',sans-serif;font-size:0.88rem;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,53,107,.10)}
thead{background:#00356b;color:#fff}
thead th{padding:11px 16px;text-align:left;font-size:0.76rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase}
tbody tr:nth-child(even){background:#f0f5fb}
tbody tr:hover{background:#ddeaf7}
td{padding:10px 16px;border-bottom:1px solid #dde6f0;vertical-align:middle}
td:first-child{font-weight:600;color:#00356b;width:50%}
em{font-style:italic;color:#666;font-size:0.83rem}
ul,ol{margin:0 0 18px 22px}
li{margin-bottom:6px}
strong{font-weight:700}
hr{border:none;border-top:1px solid #e0e0e0;margin:32px 0}
@media print{body{padding:24px 32px}h1{font-size:1.6rem}h2{font-size:1.1rem}}
"""


def md_to_html(md_text: str) -> str:
    """Convert Markdown article to full HTML page."""
    body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "nl2br", "sane_lists"],
    )
    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Review Trường Mỹ</title>
  <style>{ARTICLE_CSS}</style>
</head>
<body>{body}</body>
</html>"""


def extract_metadata(md_text: str) -> dict:
    """Pull SEO metadata lines from top of the article."""
    meta = {}
    for line in md_text.splitlines()[:12]:
        for key in ("SEO Title", "Meta Description", "Slug",
                    "Focus Keyword", "Secondary Keywords"):
            if line.startswith(f"**{key}:**") or line.startswith(f"{key}:"):
                val = re.sub(rf"^\*?\*?{re.escape(key)}:\*?\*?\s*", "", line).strip()
                meta[key] = val
    return meta


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    """SSE streaming endpoint — yields chunks of Markdown text."""
    data = request.get_json(force=True)
    school_name = data.get("school_name", "").strip()
    school_level = data.get("school_level", "university")
    style = data.get("style", "storytelling")
    api_key = data.get("api_key", "").strip()

    if not school_name:
        return jsonify({"error": "Vui lòng nhập tên trường."}), 400
    if not api_key and not GEMINI_API_KEY:
        return jsonify({"error": "GEMINI_API_KEY chưa cấu hình."}), 500

    def generate_stream():
        try:
            client = get_client(api_key)
            prompt = build_user_prompt(school_name, school_level, style)
            stream = client.models.generate_content_stream(
                model="gemini-2.0-flash",
                contents=prompt,
                config=genai_types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.85,
                    max_output_tokens=8192,
                ),
            )
            for chunk in stream:
                text = chunk.text if hasattr(chunk, "text") else ""
                if text:
                    payload = json.dumps({"chunk": text})
                    yield f"data: {payload}\n\n"
                    time.sleep(0.01)
            yield "data: [DONE]\n\n"
        except Exception as exc:
            err = json.dumps({"error": str(exc)})
            yield f"data: {err}\n\n"

    return Response(
        stream_with_context(generate_stream()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.route("/export/html", methods=["POST"])
def export_html():
    data = request.get_json(force=True)
    md_text = data.get("content", "")
    school_name = data.get("school_name", "truong-my")

    html_content = md_to_html(md_text)
    buf = io.BytesIO(html_content.encode("utf-8"))
    buf.seek(0)
    filename = f"review-{school_name.lower().replace(' ', '-')}.html"
    return send_file(
        buf,
        mimetype="text/html",
        as_attachment=True,
        download_name=filename,
    )


@app.route("/export/pdf", methods=["POST"])
def export_pdf():
    data = request.get_json(force=True)
    md_text = data.get("content", "")
    school_name = data.get("school_name", "truong-my")

    html_content = md_to_html(md_text)
    pdf_bytes = WeasyHTML(string=html_content).write_pdf()
    buf = io.BytesIO(pdf_bytes)
    buf.seek(0)
    filename = f"review-{school_name.lower().replace(' ', '-')}.pdf"
    return send_file(
        buf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename,
    )


@app.route("/export/markdown", methods=["POST"])
def export_markdown():
    data = request.get_json(force=True)
    md_text = data.get("content", "")
    school_name = data.get("school_name", "truong-my")

    buf = io.BytesIO(md_text.encode("utf-8"))
    buf.seek(0)
    filename = f"review-{school_name.lower().replace(' ', '-')}.md"
    return send_file(
        buf,
        mimetype="text/markdown",
        as_attachment=True,
        download_name=filename,
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
