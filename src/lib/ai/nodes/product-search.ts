export async function productSearch(state: any) {
  const products = [
    { id: 1, name: "Áo hoodie" },
    { id: 2, name: "Áo thun" },
  ];

  return {
    ...state,
    products,
  };
}