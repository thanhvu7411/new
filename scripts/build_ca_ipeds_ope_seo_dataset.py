#!/usr/bin/env python3
"""
Build California IPEDS dataset (OPE-standardized + SEO enrichment).

Output format is CSV (UTF-8 with BOM) for easy import into Excel/Google Sheets.
"""

from __future__ import annotations

import csv
import io
import re
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List
from urllib.request import urlopen


IPEDS_HD2023_URL = "https://nces.ed.gov/ipeds/datacenter/data/HD2023.zip"
OUTPUT_PATH = Path("output/ca_ipeds_ope_seo_2023.csv")


CONTROL_MAP = {
    "1": "Public",
    "2": "Private nonprofit",
    "3": "Private for-profit",
}


ICLEVEL_MAP = {
    "1": "4-year",
    "2": "2-year",
    "3": "Less-than-2-year",
}


LOCALE_MAP = {
    "11": "City: Large",
    "12": "City: Midsize",
    "13": "City: Small",
    "21": "Suburb: Large",
    "22": "Suburb: Midsize",
    "23": "Suburb: Small",
    "31": "Town: Fringe",
    "32": "Town: Distant",
    "33": "Town: Remote",
    "41": "Rural: Fringe",
    "42": "Rural: Distant",
    "43": "Rural: Remote",
}


@dataclass
class SchoolRow:
    unitid: str
    institution_name: str
    alias_name: str
    city: str
    county_name: str
    state: str
    zip_code: str
    control_code: str
    control_label: str
    sector_code: str
    iclevel_code: str
    iclevel_label: str
    locale_code: str
    locale_label: str
    web_address: str
    admissions_url: str
    financial_aid_url: str
    net_price_url: str
    application_url: str
    opeid_raw: str
    opeid8: str
    opeid6: str
    source_year: str
    source_table: str
    source_url: str
    seo_slug: str
    seo_focus_keyword: str
    seo_secondary_keyword: str
    seo_title_vi: str
    seo_h1_vi: str
    seo_meta_description_vi: str
    seo_content_cluster: str
    seo_search_intent: str


def clean(value: str) -> str:
    return " ".join((value or "").strip().split())


def valid_ope(ope_value: str) -> bool:
    value = clean(ope_value)
    return value not in {"", "0", "-1", "-2"}


def standardize_ope(ope_value: str) -> tuple[str, str]:
    digits = "".join(ch for ch in clean(ope_value) if ch.isdigit())
    if not digits:
        return "", ""
    # Keep the right-most 8 digits and pad if needed.
    opeid8 = digits[-8:].zfill(8)
    return opeid8, opeid8[:6]


def slugify(text: str) -> str:
    lowered = clean(text).lower()
    slug = re.sub(r"[^a-z0-9]+", "-", lowered).strip("-")
    return re.sub(r"-{2,}", "-", slug)


def content_cluster_from_iclevel(iclevel_code: str) -> str:
    if iclevel_code == "1":
        return "university-college-review"
    if iclevel_code == "2":
        return "community-college-review"
    return "career-school-review"


def build_row(raw: Dict[str, str]) -> SchoolRow:
    inst = clean(raw.get("INSTNM", ""))
    city = clean(raw.get("CITY", ""))
    state = clean(raw.get("STABBR", ""))
    control_code = clean(raw.get("CONTROL", ""))
    iclevel_code = clean(raw.get("ICLEVEL", ""))
    locale_code = clean(raw.get("LOCALE", ""))

    opeid_raw = clean(raw.get("OPEID", ""))
    opeid8, opeid6 = standardize_ope(opeid_raw)

    seo_slug = slugify(f"{inst}-{city}-california")
    seo_focus_keyword = clean(f"review {inst} california")
    seo_secondary_keyword = clean(f"hoc phi {inst} 2026")
    seo_title_vi = clean(f"{inst} review 2026: hoc phi, dieu kien, OPEID")
    seo_h1_vi = clean(f"Review {inst} o California cho du hoc sinh Viet Nam")
    seo_meta_description_vi = clean(
        f"Tong hop IPEDS cho {inst} tai {city}, California: loai truong, cap dao tao,"
        " website, va ma OPE chuan de lam SEO."
    )

    return SchoolRow(
        unitid=clean(raw.get("UNITID", "")),
        institution_name=inst,
        alias_name=clean(raw.get("IALIAS", "")),
        city=city,
        county_name=clean(raw.get("COUNTYNM", "")),
        state=state,
        zip_code=clean(raw.get("ZIP", "")),
        control_code=control_code,
        control_label=CONTROL_MAP.get(control_code, "Unknown"),
        sector_code=clean(raw.get("SECTOR", "")),
        iclevel_code=iclevel_code,
        iclevel_label=ICLEVEL_MAP.get(iclevel_code, "Unknown"),
        locale_code=locale_code,
        locale_label=LOCALE_MAP.get(locale_code, "Unknown"),
        web_address=clean(raw.get("WEBADDR", "")),
        admissions_url=clean(raw.get("ADMINURL", "")),
        financial_aid_url=clean(raw.get("FAIDURL", "")),
        net_price_url=clean(raw.get("NPRICURL", "")),
        application_url=clean(raw.get("APPLURL", "")),
        opeid_raw=opeid_raw,
        opeid8=opeid8,
        opeid6=opeid6,
        source_year="2023",
        source_table="HD2023",
        source_url=IPEDS_HD2023_URL,
        seo_slug=seo_slug,
        seo_focus_keyword=seo_focus_keyword,
        seo_secondary_keyword=seo_secondary_keyword,
        seo_title_vi=seo_title_vi,
        seo_h1_vi=seo_h1_vi,
        seo_meta_description_vi=seo_meta_description_vi,
        seo_content_cluster=content_cluster_from_iclevel(iclevel_code),
        seo_search_intent="informational-commercial",
    )


def download_hd2023_rows() -> Iterable[Dict[str, str]]:
    with urlopen(IPEDS_HD2023_URL, timeout=60) as response:
        raw_zip = response.read()

    with zipfile.ZipFile(io.BytesIO(raw_zip)) as archive:
        csv_names = [name for name in archive.namelist() if name.lower().endswith(".csv")]
        if not csv_names:
            raise RuntimeError("HD2023 zip did not contain a CSV file.")

        with archive.open(csv_names[0]) as file_handle:
            reader = csv.DictReader(io.TextIOWrapper(file_handle, encoding="latin-1", newline=""))
            for row in reader:
                normalized: Dict[str, str] = {}
                for key, value in row.items():
                    fixed_key = (key or "").lstrip("\ufeff").lstrip("ï»¿")
                    normalized[fixed_key] = value
                yield normalized


def filter_california_ope_degree_granting(rows: Iterable[Dict[str, str]]) -> List[SchoolRow]:
    selected: List[SchoolRow] = []
    for row in rows:
        if clean(row.get("STABBR", "")) != "CA":
            continue
        if clean(row.get("CYACTIVE", "")) not in {"1", "2"}:
            continue
        if clean(row.get("POSTSEC", "")) != "1":
            continue
        if clean(row.get("DEGGRANT", "")) != "1":
            continue
        if not valid_ope(row.get("OPEID", "")):
            continue

        built = build_row(row)
        if not built.opeid8:
            continue
        selected.append(built)

    selected.sort(key=lambda school: (school.institution_name.lower(), school.unitid))
    return selected


def write_csv(rows: List[SchoolRow], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8-sig", newline="") as file_handle:
        writer = csv.DictWriter(file_handle, fieldnames=list(SchoolRow.__annotations__.keys()))
        writer.writeheader()
        for school in rows:
            writer.writerow(school.__dict__)


def main() -> None:
    rows = list(download_hd2023_rows())
    selected = filter_california_ope_degree_granting(rows)
    write_csv(selected, OUTPUT_PATH)
    print(f"Generated {len(selected)} rows -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
