export function routeIntent(state: any) {
  switch (state.intent) {
    case "PRODUCT_SEARCH":
      return "productSearch";

    case "PRODUCT_DETAIL":
      return "productDetail";

    case "DOCS":
      return "docsRag";

    default:
      return "generalChat";
  }
}