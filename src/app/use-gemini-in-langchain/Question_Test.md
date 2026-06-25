
# QUESTION FOR TEST APPLICATON
## 1. Test searchProducts
* Tìm cho tôi điện thoại iPhone
* Có sản phẩm Samsung nào không?
* Tìm sản phẩm chứa chữ iPhone
-> Kỳ vọng nó trả:
```plaintext
tool-searchProducts
→ output [{"id":1,"name":"iPhone 15"}]
```

## 2. Test askLangchain
Hỏi kiểu phân tích/giải thích
* So sánh iPhone 15 và Samsung S24
* Điện thoại nào phù hợp để chơi game?
* Phân tích ưu nhược điểm của điện thoại flagship
-> Kỳ vọng nó trả:
```plaintext
tool-askLangchain
→ output = nội dung từ LangChain model
```

## 3. Test mixed (có thể gọi cả 2)
* Tìm iPhone và phân tích xem có đáng mua không
```plaintext
tool-searchProducts
tool-askLangchain
assistant final response
```
### Nếu muốn ép chắc chắn gọi tool để debug:
* Dùng tool searchProducts để tìm iPhone
* Dùng tool askLangchain để phân tích Samsung S24
