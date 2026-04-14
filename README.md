# Blog Review Trường Mỹ – Tài liệu dự án

Website blog review tất cả các trường từ cấp 2, cấp 3, cao đẳng, đại học và sau đại học tại Mỹ.
Đối tượng: phụ huynh và học sinh Việt Nam đang tìm hiểu về du học.
Ngôn ngữ: Tiếng Việt. Platform: WordPress.

---

## Cấu trúc thư mục

```
/
├── assets/
│   └── css/
│       └── blog-style.css          # CSS dán vào WP > Appearance > Customize > Additional CSS
├── posts/
│   └── harvard-university-review.html   # Bài mẫu đầy đủ – Harvard University
├── templates/
│   └── school-review-template.html     # Template tái sử dụng cho mọi trường
└── README.md
```

---

## Hướng dẫn sử dụng nhanh

### 1. Thêm CSS vào WordPress
Vào **Appearance → Customize → Additional CSS**, dán toàn bộ nội dung file
`assets/css/blog-style.css`.

Hoặc cài plugin **"Simple Custom CSS"** và dán vào đó.

### 2. Đăng bài mới
- Mở file `posts/harvard-university-review.html` (bài mẫu) hoặc
  `templates/school-review-template.html` (template trắng).
- Trong WordPress editor, chọn block **"Custom HTML"** (Gutenberg) hoặc
  chuyển sang **"Text/HTML"** tab (Classic Editor).
- Dán toàn bộ nội dung HTML vào.
- Điền SEO Title, Meta Description, Slug vào Yoast SEO / RankMath
  theo gợi ý comment ở cuối mỗi file HTML.

### 3. Viết bài cho trường mới (dùng template)
1. Copy `templates/school-review-template.html`
2. Tìm & thay thế `{{SCHOOL_NAME}}` → tên trường tiếng Anh
3. Tìm & thay thế `{{SCHOOL_NAME_VI}}` → tên tiếng Việt (nếu có)
4. Tìm & thay thế `{{SCHOOL_SHORT}}` → tên viết tắt
5. Điền tất cả `[STAT: ...]` bằng số liệu từ US News / Common Data Set
6. Viết các `[MÔ TẢ: ...]` theo phong cách storytelling

---

## Từ khóa SEO trọng tâm (gợi ý theo nhóm)

### Nhóm 1 – Từ khóa tổng quan du học Mỹ (traffic cao)
| Từ khóa | Mục đích |
|---|---|
| du học Mỹ 2025 | Trang chủ / Hub page |
| điều kiện du học Mỹ 2025 | Bài hướng dẫn tổng quan |
| chi phí du học Mỹ | Bài tổng hợp chi phí |
| học bổng du học Mỹ | Bài hướng dẫn học bổng |
| lộ trình du học Mỹ | Bài A-Z cho học sinh |
| du học Mỹ cần GPA bao nhiêu | FAQ / bài hỏi-đáp |
| du học Mỹ cần IELTS bao nhiêu | FAQ / bài hỏi-đáp |
| visa du học Mỹ F1 | Bài hướng dẫn visa |
| trường tốt nhất ở Mỹ cho sinh viên quốc tế | Bài xếp hạng |
| trường đại học Mỹ học phí rẻ | Bài xếp hạng giá rẻ |

### Nhóm 2 – Review từng trường (long-tail, conversion cao)
Mẫu từ khóa cho mỗi bài review:
```
[Tên trường] review du học
[Tên trường] học phí 2025
điều kiện vào [Tên trường]
[Tên trường] acceptance rate 2025
[Tên trường] có tốt không
học tại [Tên trường] như thế nào
[Tên trường] SAT GPA yêu cầu
```

Ví dụ cụ thể (Harvard):
- `Harvard University review du học`
- `Harvard học phí 2025`
- `điều kiện vào Harvard`
- `Harvard acceptance rate 2025`

### Nhóm 3 – Từ khóa theo cấp học
| Từ khóa | Cấp |
|---|---|
| trường cấp 2 ở Mỹ cho học sinh Việt Nam | Middle school |
| boarding school Mỹ là gì | High school |
| trường cấp 3 tốt nhất ở Mỹ | High school |
| community college Mỹ là gì | Cao đẳng |
| liberal arts college là gì | Đại học |
| top đại học Mỹ 2025 | Đại học |
| MBA ở Mỹ | Sau đại học |
| học thạc sĩ ở Mỹ | Sau đại học |

### Nhóm 4 – Từ khóa theo địa lý / tiểu bang
```
trường đại học ở California cho du học sinh
trường ở New York phù hợp sinh viên quốc tế
trường ở Texas học phí rẻ
trường Mỹ miền Đông vs miền Tây
```

### Nhóm 5 – Từ khóa theo ngành học
```
trường Mỹ tốt nhất ngành Computer Science
trường Mỹ tốt nhất ngành Business
học y ở Mỹ cần gì
trường Mỹ tốt cho ngành Engineering
```

---

## Cấu trúc URL gợi ý (WordPress Permalink)

```
/review-truong/harvard-university/
/review-truong/mit/
/review-truong/stanford-university/
/review-truong/uc-berkeley/
/huong-dan/chi-phi-du-hoc-my/
/huong-dan/visa-du-hoc-f1/
/xep-hang/top-10-truong-dai-hoc-my-2025/
/xep-hang/top-truong-boarding-school-my/
```

---

## Danh sách trường ưu tiên viết (gợi ý theo lượt tìm kiếm)

### Nhóm Ivy League & Elite Universities
1. Harvard University *(bài mẫu đã có)*
2. MIT – Massachusetts Institute of Technology
3. Stanford University
4. Yale University
5. Princeton University
6. Columbia University
7. University of Pennsylvania (UPenn)
8. Cornell University
9. Dartmouth College
10. Brown University

### Nhóm Top Public Universities
11. UC Berkeley
12. UCLA – University of California Los Angeles
13. University of Michigan
14. University of Virginia
15. University of North Carolina at Chapel Hill

### Nhóm Liberal Arts Colleges (ít người biết nhưng rất tốt)
16. Williams College
17. Amherst College
18. Swarthmore College

### Nhóm Cao đẳng / Community College
19. Santa Monica College (cửa ngõ vào UCLA/USC)
20. De Anza College
21. Pasadena City College

### Nhóm Trường Cấp 3 / Boarding School
22. Phillips Exeter Academy
23. Andover (Phillips Academy)
24. The Hotchkiss School
25. Choate Rosemary Hall

---

## Schema JSON-LD gợi ý cho mỗi bài review

Dán vào phần `<head>` hoặc dùng plugin RankMath/Yoast để điền:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Harvard University Review – Học Phí, Điều Kiện & Trải Nghiệm Du Học 2025",
  "description": "Review chi tiết Harvard University: học phí $64.796...",
  "author": {
    "@type": "Organization",
    "name": "[Tên website]"
  },
  "datePublished": "2025-04-01",
  "dateModified": "2025-04-14",
  "image": "https://[domain]/wp-content/uploads/harvard-campus.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "[Tên website]",
    "logo": {
      "@type": "ImageObject",
      "url": "https://[domain]/logo.png"
    }
  }
}
```

---

## Lưu ý kỹ thuật SEO quan trọng

- **Internal linking**: Mỗi bài review nên link sang ít nhất 2–3 bài khác liên quan
  (VD: review Harvard → link sang "Top 10 Ivy League" và "Chi phí du học Mỹ")
- **Cập nhật định kỳ**: Số liệu học phí, acceptance rate thay đổi mỗi năm.
  Cập nhật trước mùa nộp hồ sơ (tháng 8–10 hàng năm).
- **Ảnh**: Tối ưu alt text theo mẫu `[tên trường] campus [mùa] [năm]`
- **Core Web Vitals**: Nén ảnh trước khi upload (dùng WebP, max 200KB/ảnh)
- **Breadcrumb**: Cài Yoast SEO và bật breadcrumb – giúp Google hiểu cấu trúc site
