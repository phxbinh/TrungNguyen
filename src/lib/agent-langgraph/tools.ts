import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Tool 1: Tìm kiếm sản phẩm
export const productSearchTool = tool(
  async ({ query }) => {
    console.log(`[Tool] product_search: "${query}"`);
    
    // Dữ liệu giả để test nhanh
    const mockProducts = [
      { id: "1", name: "iPhone 16 Pro", price: "28.990.000", category: "Điện thoại" },
      { id: "2", name: "MacBook Air M3", price: "32.990.000", category: "Laptop" },
      { id: "3", name: "AirPods Pro 2", price: "5.990.000", category: "Âm thanh" },
    ];

    return {
      products: mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      ),
      message: `Đã tìm thấy một số sản phẩm phù hợp với "${query}".`
    };
  },
  {
    name: "product_search",
    description: "Tìm kiếm sản phẩm theo từ khóa. Rất hữu ích khi khách hỏi về sản phẩm.",
    schema: z.object({
      query: z.string().describe("Từ khóa tìm kiếm sản phẩm"),
    }),
  }
);

// Tool 2: Xem chi tiết sản phẩm
export const productDetailTool = tool(
  async ({ productId }) => {
    console.log(`[Tool] product_detail: ${productId}`);

    const mockDetail = {
      id: productId,
      name: "iPhone 16 Pro",
      price: "28.990.000 VNĐ",
      specs: "Màn hình 6.3 inch, Chip A18 Pro, Camera 48MP",
      stock: "Còn hàng",
    };

    return { 
      product: mockDetail,
      message: `Thông tin chi tiết sản phẩm ${productId}` 
    };
  },
  {
    name: "product_detail",
    description: "Lấy thông tin chi tiết của một sản phẩm khi biết ID hoặc tên.",
    schema: z.object({
      productId: z.string().describe("ID hoặc tên sản phẩm cần xem chi tiết"),
    }),
  }
);

// Tool 3: Tìm kiếm tài liệu / FAQ
export const docsSearchTool = tool(
  async ({ query }) => {
    console.log(`[Tool] docs_search: "${query}"`);

    return {
      docs: [
        { 
          title: "Chính sách đổi trả", 
          content: "Sản phẩm được đổi trả trong 30 ngày nếu còn nguyên seal và hóa đơn." 
        }
      ],
      message: `Đã tìm thấy thông tin liên quan đến "${query}".`
    };
  },
  {
    name: "docs_search",
    description: "Tìm kiếm thông tin trong tài liệu, FAQ, chính sách, hướng dẫn sử dụng.",
    schema: z.object({
      query: z.string().describe("Câu hỏi hoặc từ khóa cần tra cứu"),
    }),
  }
);