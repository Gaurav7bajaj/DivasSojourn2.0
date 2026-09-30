export const paymentMethods = [
  {
    id: "upi-payment",
    tag: "UPI",
    title: "Google Pay · PhonePe · BHIM",
    subtitle: "Pay instantly from any UPI app.",
    details: [
      { key: "UPI ID", value: "DivasSojourn@icici", monospace: true },
      { key: "Registered name", value: "Divas Sojourn Experiences Private Limited" },
    ],
  },
  {
    id: "bank-transfer",
    tag: "Bank Transfer",
    title: "NEFT / RTGS / IMPS",
    subtitle: "Transfer directly to our current account.",
    details: [
      { key: "Account number", value: "389005001548", monospace: true },
      { key: "Account name", value: "Divas Sojourn Experiences Private Limited" },
      { key: "IFSC code", value: "ICIC0003890", monospace: true },
      { key: "Bank", value: "ICICI Bank" },
    ],
  },
  {
    id: "razorpay-link",
    tag: "Card · Netbanking",
    title: "Pay online via Razorpay",
    subtitle: "Cards, netbanking and wallets through a secure payment link.",
    badge: "+3% gateway fee",
    details: [
      {
        key: "Payment link",
        value: "https://razorpay.me/@payDivasSojourn",
        href: "https://razorpay.me/@payDivasSojourn",
        monospace: true,
      },
    ],
  },
];

/** Safety notice bullets (shortened from the original notes). */
export const safetyNoticeBullets = [
  "Do not make payments to any other account. We are not responsible for losses from payments to unauthorised accounts.",
  "A 3% payment gateway charge applies when you pay via the Razorpay link.",
  "Unsure about anything? Call us on 99900 22835 before paying.",
];

export const paymentNotes = [
  "To ensure your payment is securely processed, please make payments only to the official bank details provided on our website.",
  "Do not make payments to any other account. We will not be responsible for any losses incurred if payments are made to unauthorized bank accounts.",
  "If you have any questions or concerns, please contact us on - 99900 22835.",
  "A payment gateway charge 3% will be levied on using above given payment link.",
];

export const shortHaulDestinations = [
  "Domestic Trips",
  "Bhutan",
  "Nepal",
  "Sri Lanka",
  "Thailand",
  "Singapore",
  "Bali",
  "Dubai",
  "Kazakhstan",
  "Azerbaijan",
  "Vietnam",
  "Malaysia",
  "Maldives",
  "Mauritius",
];

export const longHaulDestinations = [
  "Europe",
  "UK",
  "Scotland",
  "Ireland",
  "USA",
  "Canada",
  "Japan",
  "South Korea",
  "Turkey",
  "Egypt",
  "Australia",
  "New Zealand",
  "South Africa",
  "Kenya",
  "South America",
  "Jordan",
  "Israel",
];

/** Raw policy rows (kept for reference / exact wording). */
export const shortHaulPolicy = [
  {
    timing: "At the time of booking",
    amount:
      "25% of the full tour cost or cancellation charges whichever is higher (non-refundable and non-transferable)",
  },
  {
    timing: "Within 45 Days from Departure Date",
    amount:
      "50% of the Full Tour Cost or cancellation charges whichever is higher (non-refundable and non-transferable)",
  },
  {
    timing: "Within 30 Days from Date of Departure",
    amount:
      "75% of the Full Tour Cost or cancellation charges whichever is higher (non-refundable and non-transferable)",
  },
  {
    timing: "20 Days from Date of Departure",
    amount: "100% of the Full Tour Cost",
  },
];

export const longHaulPolicy = [
  {
    timing: "At the time of booking",
    amount:
      "INR 40,000 Per Person or cancellation charges whichever is higher (non-refundable and non-transferable)",
  },
  {
    timing: "Within 60 Days from Departure Date",
    amount:
      "50% of the Full Tour Cost or cancellation charges whichever is higher (non-refundable and non-transferable)",
  },
  {
    timing: "Within 45 Days from Departure Date",
    amount:
      "75% of the Full Tour Cost or cancellation charges whichever is higher (non-refundable and non-transferable)",
  },
  {
    timing: "30 Days from Departure Date",
    amount: "100% of the Full Tour cost",
  },
];

export const scheduleConfig = {
  short: {
    id: "short",
    label: "Short haul",
    destinationsLabel: "Short haul destinations",
    destinations: shortHaulDestinations,
    steps: [
      {
        when: "At booking",
        amount: "25%",
        detail: "of the tour cost or cancellation charges, whichever is higher*",
      },
      {
        when: "45 days before",
        amount: "50%",
        detail: "of the tour cost or cancellation charges, whichever is higher*",
      },
      {
        when: "30 days before",
        amount: "75%",
        detail: "of the tour cost or cancellation charges, whichever is higher*",
      },
      {
        when: "20 days before",
        amount: "100%",
        detail: "of the full tour cost",
      },
    ],
  },
  long: {
    id: "long",
    label: "Long haul",
    destinationsLabel: "Long haul destinations",
    destinations: longHaulDestinations,
    steps: [
      {
        when: "At booking",
        amount: "₹40,000",
        detail: "per person or cancellation charges, whichever is higher*",
      },
      {
        when: "60 days before",
        amount: "50%",
        detail: "of the tour cost or cancellation charges, whichever is higher*",
      },
      {
        when: "45 days before",
        amount: "75%",
        detail: "of the tour cost or cancellation charges, whichever is higher*",
      },
      {
        when: "30 days before",
        amount: "100%",
        detail: "of the full tour cost",
      },
    ],
  },
};

export const scheduleFootnote =
  "* Paid instalments are non-refundable and non-transferable. Where cancellation charges are higher than the percentage shown, the higher amount applies.";

export const policyNotes = [
  "For issuance of flight tickets, we require full payment of airfare.",
  "Non-refundable services in the tour package have to be paid in full at the time of booking.",
  "Payment policy is non-negotiable and has to be paid accordingly.",
  "Payment schedule may vary based on destination and travel date, such as events or peak season. Kindly confirm the exact payment timeline with your sales agent.",
];

export const importantNoteCards = [
  {
    title: "Flights",
    text: "For issuance of flight tickets, we require full payment of airfare.",
  },
  {
    title: "Non-refundable services",
    text: "Non-refundable services in the tour package have to be paid in full at the time of booking.",
  },
  {
    title: "Fixed policy",
    text: "Payment policy is non-negotiable and has to be paid accordingly.",
  },
  {
    title: "Peak dates may differ",
    text: "Payment schedule may vary based on destination and travel date, such as events or peak season. Kindly confirm the exact payment timeline with your sales agent.",
  },
];

export const WHATSAPP_URL = "https://wa.me/919990022835";
export const PHONE_DISPLAY = "99900 22835";
export const PHONE_HREF = "tel:+919990022835";
