# 📝 TỔNG HỢP CÚ PHÁP MARKDOWN ĐẦY ĐỦ

## 1. Định Dạng Văn Bản Cơ Bản
* **Chữ in đậm:** `**Văn bản cần in đậm**` hoặc `__Văn bản cần in đậm__`
* *Chữ in nghiêng:* `*Văn bản in nghiêng*` hoặc `_Văn bản in nghiêng_`
* ***Đậm và nghiêng xuýt soát:*** `***Văn bản vừa đậm vừa nghiêng***`
* ~~Chữ gạch ngang:~~ `~~Văn bản bị gạch ngang~~`
* `Code inline (mã ngắn):` Sử dụng cặp dấu backtick \` để bao bọc, ví dụ: `const x = 10;`

> 💡 **Mẹo xuống dòng:** Để xuống dòng dòng bình thường trong cùng 1 đoạn, hãy gõ 2 dấu cách ở cuối dòng trước khi nhấn Enter.

---

## 2. Các Cấp Tiêu Đề (Headings)
Sử dụng ký tự `#` ở đầu dòng, theo sau là một dấu cách.
# Tiêu đề cấp 1 (H1 - Lớn nhất)
## Tiêu đề cấp 2 (H2)
### Tiêu đề cấp 3 (H3)
#### Tiêu đề cấp 4 (H4)
##### Tiêu đề cấp 5 (H5)
###### Tiêu đề cấp 6 (H6 - Nhỏ nhất)

---

## 3. Danh Sách (Lists)

### Danh sách không thứ tự (Bullet Points)
Sử dụng dấu `-`, `*` hoặc `+` kèm dấu cách. Để tạo mục con, lùi vào 2 hoặc 4 dấu cách.
- Mục lớn thứ nhất
  - Mục con cấp 1
  - Mục con cấp 2
- Mục lớn thứ hai

### Danh sách có thứ tự (Numbered Lists)
1. Bước đầu tiên
2. Bước kế tiếp
   1. Bước phụ bên trong

### Danh sách công việc (Task Lists)
- [x] Việc đã hoàn thành xong
- [ ] Việc còn đang bỏ ngỏ

---

## 4. Khối Trích Dẫn (Blockquotes)
Sử dụng dấu `>` ở đầu dòng để làm nổi bật văn bản.
> Đây là một đoạn trích dẫn. Bạn có thể xuống dòng bằng cách thêm dấu `>` ở mỗi dòng tiếp theo.

---

## 5. Đường Kẻ Ngang (Horizontal Rule)
Sử dụng 3 dấu gạch ngang liên tiếp ở một dòng riêng biệt để phân chia các phần:
```text
---
```

---

## 6. Chèn Link và Hình Ảnh
* **Chèn Link:** `[Tên hiển thị](Đường-dẫn-URL)`
  * *Ví dụ:* `[Google](https://google.com)`
* **Chèn Hình Ảnh:** `![Tên thay thế khi ảnh lỗi](Đường-dẫn-ảnh-URL)`
  * *Ví dụ:* `![Logo](https://example.com/logo.png)`

---

## 7. Khối Code Nhiều Dòng (Code Blocks)
Sử dụng 3 dấu backtick (\`\`\`) để mở đầu và kết thúc khối code. Hãy viết thêm tên ngôn ngữ lập trình ngay sau 3 dấu backtick đầu tiên để được tự động tô màu cú pháp (Syntax Highlighting).

```javascript
// Ví dụ về khối code Javascript
function xinChao() {
    console.log("Hello World!");
}
```

```html
<!-- Ví dụ về khối code HTML -->
<div class="container">
    <p>Xin chào mọi người</p>
</div>
```

---

## 8. Tạo Bảng (Tables)
Sử dụng dấu gạch đứng `|` để phân tách cột và dấu gạch ngang `-` để tách hàng tiêu đề. Thêm dấu hai chấm `:` để căn lề.

| Tên sản phẩm | Số lượng | Giá thành |
| :--- | :---: | ---: |
| Căn lề trái | Căn lề giữa | Căn lề phải |
| Bàn phím cơ | 1 | 1.200.000đ |
| Chuột Bluetooth | 2 | 450.000đ |
