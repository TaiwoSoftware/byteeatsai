// chatbotKnowledge.ts
//
// The chatbot's entire "understanding" of the website lives here.
// Each Topic has:
//  - keywords: words/phrases that should trigger this answer
//  - answer: what the bot says
//  - link + linkLabel (optional): a button the bot shows to send the
//    user straight to the right page
//
// To teach the bot something new, just add a Topic below — no other
// code needs to change.

export interface Topic {
  id: string;
  keywords: string[];
  answer: string;
  link?: string;
  linkLabel?: string;
}

export const topics: Topic[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "sup", "yo", "good morning", "good afternoon"],
    answer:
      "Hey there! 👋 I'm the ByteEats assistant. I can help you find restaurants, manage your cart, track orders, or set up your account. What do you need?",
  },
  {
    id: "browse-restaurants",
    keywords: ["restaurant", "food", "menu", "order food", "browse", "vendors", "shops", "hungry"],
    answer:
      "You can browse restaurants and menus right from the home page. Tap any restaurant to see its full menu and add items to your cart.",
    link: "/",
    linkLabel: "Browse restaurants",
  },
  {
    id: "cart",
    keywords: ["cart", "basket", "checkout", "my order", "items in cart", "remove item"],
    answer:
      "Your cart shows everything you've added, with quantities and prices. You can adjust quantities or remove items there before checking out.",
    link: "/cart",
    linkLabel: "Go to cart",
  },
  {
    id: "checkout-payment",
    keywords: ["pay", "payment", "checkout", "card", "how do i pay", "place order"],
    answer:
      "Once your cart looks right, head to checkout to enter your delivery details and payment info, then confirm to place your order.",
    link: "/cart",
    linkLabel: "Go to checkout",
  },
  {
    id: "order-tracking",
    keywords: ["track", "where is my order", "order status", "delivery time", "eta", "how long"],
    answer:
      "You can see all your past and current orders — with items, totals, and timestamps — on your Profile page under Recent Orders.",
    link: "/profile",
    linkLabel: "View my orders",
  },
  {
    id: "profile",
    keywords: ["profile", "account details", "my info", "email", "user id"],
    answer:
      "Your Profile page shows your account info (email, user ID, join date) and your recent order history all in one place.",
    link: "/profile",
    linkLabel: "Go to profile",
  },
  {
    id: "settings",
    keywords: ["settings", "change password", "update account", "preferences", "edit profile"],
    answer:
      "Account settings — like updating your details or preferences — are on your Profile page under the Settings section.",
    link: "/profile#settings",
    linkLabel: "Open settings",
  },
  {
    id: "logout",
    keywords: ["log out", "logout", "sign out", "signout"],
    answer:
      "You can log out anytime using the Logout button on your Profile page.",
    link: "/profile",
    linkLabel: "Go to profile",
  },
  {
    id: "login-signup",
    keywords: ["login", "log in", "sign up", "signup", "register", "create account", "forgot password"],
    answer:
      "You can log in or create an account from the login page. If you're stuck, look for a 'forgot password' option there to reset it.",
    link: "/user",
    linkLabel: "Go to login",
  },
  {
    id: "vendor-dashboard",
    keywords: ["vendor", "sell", "shop dashboard", "become a vendor", "my shop", "restaurant owner", "list my restaurant"],
    answer:
      "If you run a restaurant, your Shop Dashboard is where you manage your listing, menu, and incoming orders.",
    link: "/vendor_dashboard",
    linkLabel: "Open shop dashboard",
  },
  {
    id: "contact-support",
    keywords: ["help", "support", "contact", "problem", "issue", "complaint", "human", "agent"],
    answer:
      "I can help with most how-to questions here in the chat. For account-specific issues or something I can't solve, please reach out to our support team through the Settings page.",
    link: "/profile#settings",
    linkLabel: "Contact support",
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank you", "appreciate", "cool", "great", "awesome"],
    answer: "You're welcome! Anything else I can help you find?",
  },
];

// Shown as quick-reply chips when the chat first opens.
export const suggestedQuestions = [
  "How do I track my order?",
  "How does checkout work?",
  "How do I become a vendor?",
  "How do I log out?",
];

export const fallbackAnswer =
  "I'm not sure about that one — I only know about using the ByteEats website. Try asking about restaurants, your cart, orders, your profile, or vendor setup, or tap Contact Support below.";