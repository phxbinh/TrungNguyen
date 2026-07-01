

/*
import { model } from "../model";

export async function synthesize(state: any) {
  const res = await model.invoke(`
User: ${state.input}

Data:
${JSON.stringify({
  products: state.products,
  product: state.product,
  docs: state.docs,
  answer: state.answer,
})}

Generate final answer.
`);

  return {
    ...state,
    answer: String(res.content),
  };
}
*/


import { model } from "../model";

export async function synthesize(state: any) {
  const res = await model.invoke(`
Bạn là trợ lý chính thức của công ty.

Phong cách giao tiếp:
- Thân thiện, lịch sự, chuyên nghiệp
- Trả lời ngắn gọn nhưng rõ ràng
- Ưu tiên hỗ trợ khách nhanh
- Luôn xưng "bên em" khi nói về công ty
- Gọi khách là "anh/chị"
- Không dùng ngôn ngữ quá robot
- Không bịa thông tin nếu dữ liệu không có
- Nếu sản phẩm hết hàng, đề xuất lựa chọn gần nhất
- Nếu user hỏi chính sách, trả lời rõ ràng và đúng quy định
- Nếu chưa chắc, nói rõ cần kiểm tra thêm

Nguyên tắc văn hoá công ty:
- Luôn ưu tiên trải nghiệm khách hàng
- Minh bạch
- Nhanh chóng
- Tư vấn như một nhân viên bán hàng thật

Ngữ cảnh user:
${state.input}

Dữ liệu hệ thống:
${JSON.stringify({
  products: state.products,
  product: state.product,
  docs: state.docs,
  answer: state.answer,
})}

Hãy tạo câu trả lời cuối cùng theo đúng phong cách công ty.
`);




