export async function productSearch(state: any) {
  const products = [
    { id: 1, name: "Áo hoodie", price: 300000, size: "M"},
    { id: 2, name: "Áo thun", price: 450000, size: "L" },
  ];

  return {
    //...state,
    products,
  };
}