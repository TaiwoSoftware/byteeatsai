import { guideResponses } from "./guideResponses";

export function getGuideResponse(input: string): string {
  const text = input.toLowerCase();

  // 🏠 ABOUT WEBSITE (expanded coverage)
  if (
    text.includes("what is this") ||
    text.includes("about") ||
    text.includes("what does this website do") ||
    text.includes("what is this website about") ||
    text.includes("explain this website")
  ) {
    return guideResponses.about_website;
  }

  // 🍔 ORDER
  if (text.includes("order") || text.includes("buy") || text.includes("food")) {
    return guideResponses.order_food;
  }

  // 🛒 CART
  if (text.includes("cart")) return guideResponses.view_cart;

  // 💳 CHECKOUT
  if (text.includes("checkout") || text.includes("pay")) {
    return guideResponses.checkout;
  }

  // 📦 TRACKING
  if (text.includes("track") || text.includes("order status")) {
    return guideResponses.track_order;
  }

  // 🧑‍💼 VENDOR
  if (
    text.includes("vendor") ||
    text.includes("sell food") ||
    text.includes("become a vendor") ||
    text.includes("create shop") ||
    text.includes("vendor corner")
  ) {
    return guideResponses.vendor_flow;
  }

  return guideResponses.default;
}