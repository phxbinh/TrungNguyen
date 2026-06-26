export async function docsRag(state: any) {
  const docs = [
    {
      title: "Hướng dẫn giặt áo hoodie",
      content: "Giặt ở nhiệt độ dưới 30 độ",
    },
  ];

  return {
    ...state,
    docs,
  };
}