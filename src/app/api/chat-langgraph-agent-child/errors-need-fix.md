
- Lỗi detected intents:
  - Đúng là phải: product: iPhone, doc: áo sợi tre và quần jean.

```json
{
  "input": "Tìm iPhone 16, hướng dẫn giặt áo sợi tre và quần jean",
  "intents": [
    "PRODUCT_SEARCH",
    "DOCS"
  ],
  "productQuery": "iPhone 16, quần jean",
  "docsQuery": "hướng dẫn giặt áo sợi tre",
  "products": [],
  "product": [],
  "docs": [
    {
      "title": "Hướng dẫn giặt áo hoodie",
      "content": "Giặt ở nhiệt độ dưới 30 độ"
    },
    {
      "title": "Hướng dẫn giặt áo sợi tre",
      "content": "Giặt ở nhiệt độ dưới 35 độ"
    },
    {
      "title": "Hướng dẫn giặt quần jean",
      "content": "Giặt ở nhiệt độ dưới 35 độ, giặt bằng tay với chất giặt có chất tẩy nhẹ"
    }
  ],
  "productAnswer": "Chúng tôi tìm thấy sản phẩm iPhone 16 Pro (Điện thoại) với giá 28.990.000đ.\nChúng tôi không tìm thấy sản phẩm nào cho \"quần jean\".",
  "answer": "Chào anh/chị, bên em rất vui được hỗ trợ ạ.\n\nBên em tìm thấy sản phẩm **iPhone 16 Pro (Điện thoại)** với giá 28.990.000đ. Đây là lựa chọn gần nhất anh/chị có thể tham khảo ạ.\n\nVề hướng dẫn giặt sản phẩm:\n*   **Áo sợi tre:** Anh/chị vui lòng giặt ở nhiệt độ dưới 35 độ.\n*   **Quần jean:** Anh/chị nên giặt ở nhiệt độ dưới 35 độ và giặt bằng tay với chất giặt có chất tẩy nhẹ nhé.\n\nNếu anh/chị cần thêm thông tin chi tiết về sản phẩm hoặc có bất kỳ câu hỏi nào khác, đừng ngần ngại cho bên em biết ạ!"
}
```