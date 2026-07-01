/*
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
*/
export function routeIntent(state: any) {
  const routes = [];

  if (
    state.intents?.includes("PRODUCT_SEARCH") ||
    state.intents?.includes("PRODUCT_DETAIL")
  ) {
    routes.push("productAgent");
  }

  if (state.intents?.includes("DOCS")) {
    routes.push("docsRag");
  }

  if (!routes.length) {
    routes.push("generalChat");
  }

  return routes;
}