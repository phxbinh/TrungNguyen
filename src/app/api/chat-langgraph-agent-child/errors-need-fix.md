
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

## Error type 2
- Lỗi hiển thị thông tin cho AirPods pro 2 (Nó chỉ trả id).
```json
{
  "input": "Tìm AirPods pro 2 và chi tiết iphone 16. hướng dẫn giặt áo sợi tre và quần jean",
  "intents": [
    "PRODUCT_SEARCH",
    "PRODUCT_DETAIL",
    "DOCS"
  ],
  "productQuery": "AirPods pro 2 và chi tiết iphone 16",
  "docsQuery": "hướng dẫn giặt áo sợi tre và quần jean",
  "products": [],
  "product": {
    "id": "iphone 16",
    "name": "iPhone 16 Pro",
    "price": "28.990.000 VNĐ",
    "specs": "Màn hình 6.3 inch, Chip A18 Pro, Camera 48MP",
    "stock": "Còn hàng"
  },
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
  "productAnswer": "Dưới đây là thông tin chi tiết về sản phẩm bạn yêu cầu:\n\n**AirPods pro 2:**\n*   ID: AirPods pro 2\n*   Tên: iPhone 16 Pro\n*   Giá: 28.990.000 VNĐ\n*   Thông số kỹ thuật: Màn hình 6.3 inch, Chip A18 Pro, Camera 48MP\n*   Tình trạng: Còn hàng\n\n**iPhone 16:**\n*   ID: iphone 16\n*   Tên: iPhone 16 Pro\n*   Giá: 28.990.000 VNĐ\n*   Thông số kỹ thuật: Màn hình 6.3 inch, Chip A18 Pro, Camera 48MP\n*   Tình trạng: Còn hàng",
  "answer": "Chào anh/chị,\n\nBên em xin gửi thông tin anh/chị yêu cầu như sau ạ:\n\n*   **Về AirPods Pro 2:** Hiện tại, bên em chưa tìm thấy thông tin chi tiết về sản phẩm AirPods Pro 2 trong hệ thống. Rất tiếc chưa thể hỗ trợ anh/chị ngay được ạ.\n*   **Về iPhone 16 Pro:**\n    *   Tên: iPhone 16 Pro\n    *   Giá: 28.990.000 VNĐ\n    *   Thông số kỹ thuật: Màn hình 6.3 inch, Chip A18 Pro, Camera 48MP\n    *   Tình trạng: Còn hàng\n*   **Hướng dẫn giặt áo sợi tre:** Anh/chị nên giặt áo ở nhiệt độ dưới 35 độ.\n*   **Hướng dẫn giặt quần jean:** Anh/chị giặt ở nhiệt độ dưới 35 độ và ưu tiên giặt bằng tay với chất tẩy nhẹ ạ.\n\nNếu anh/chị cần hỗ trợ thêm thông tin nào khác, đừng ngần ngại báo bên em nhé!"
}
```




