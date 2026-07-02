
export function routeIntent(state: any) {
  switch (state.intent) {
    case "PRODUCT_SEARCH":
    case "PRODUCT_DETAIL":
      return "productAgent";

    case "DOCS":
      return "docsRag";

    default:
      return "generalChat";
  }
}
