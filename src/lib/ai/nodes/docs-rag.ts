export async function docsRag(state: any) {
  const query = state.docsQuery ?? state.input;
  const docs = [
    {
      title: "Hướng dẫn giặt áo hoodie",
      content: "Giặt ở nhiệt độ dưới 30 độ",
    },
    {
      title: "Hướng dẫn giặt áo sợi tre",
      content: "Giặt ở nhiệt độ dưới 35 độ",
    },
    {
      title: "Hướng dẫn giặt quần jean",
      content: "Giặt ở nhiệt độ dưới 35 độ, giặt bằng tay với chất giặt có chất tẩy nhẹ",
    },
  ];

  return {
    ...state,
    docs,
  };
}