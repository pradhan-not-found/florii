/** Sponsor prices, fixed on the server so they can't be changed from the browser. Amounts are in the smallest unit. */
export const SPONSOR_PRICES = {
  card: { amount: 4999, currency: "USD" },   // $49.99, cards from anywhere
  upi: { amount: 419900, currency: "INR" },  // ₹4,199, UPI in India
} as const;

/** The most a single sponsorship can be, so a typo can't create a huge charge. */
export const SPONSOR_MAX = { card: 500000, upi: 42000000 } as const; // $5,000 and ₹4,20,000
