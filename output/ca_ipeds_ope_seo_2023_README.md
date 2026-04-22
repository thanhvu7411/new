# California IPEDS Dataset (OPE + SEO)

Dataset file: `output/ca_ipeds_ope_seo_2023.csv`

## Nguồn dữ liệu
- IPEDS HD2023: `https://nces.ed.gov/ipeds/datacenter/data/HD2023.zip`

## Tiêu chí lọc (để ra 300–500 trường)
- `STABBR = CA` (toàn California)
- `CYACTIVE in {1,2}` (trường đang hoạt động trong chu kỳ)
- `POSTSEC = 1` (postsecondary)
- `DEGGRANT = 1` (degree-granting)
- `OPEID` hợp lệ (`!= "", 0, -1, -2`)

Kết quả hiện tại: **459 trường**.

## Chuẩn hóa OPE
- `opeid_raw`: giá trị gốc IPEDS
- `opeid8`: chuẩn 8 chữ số (right-most 8 digits, zero-padded)
- `opeid6`: 6 chữ số đầu của `opeid8`

## Enrichment SEO
- `seo_slug`
- `seo_focus_keyword`
- `seo_secondary_keyword`
- `seo_title_vi`
- `seo_h1_vi`
- `seo_meta_description_vi`
- `seo_content_cluster`
- `seo_search_intent`

## Dùng với Excel / Google Sheets
1. Mở file CSV trực tiếp bằng Excel, hoặc:
2. Google Sheets > File > Import > Upload > chọn `ca_ipeds_ope_seo_2023.csv`
3. Chọn "Replace current sheet" hoặc "Insert new sheet".

## Regenerate dataset
Chạy:
- `python3 scripts/build_ca_ipeds_ope_seo_dataset.py`
