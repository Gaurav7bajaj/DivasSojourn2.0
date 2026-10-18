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

/** Advance deposits charged at booking (₹). */
export const ADVANCE_INDIA_INR = 5100;
export const ADVANCE_INTERNATIONAL_INR = 11000;

export const indiaTripExamples = [
  "Domestic India trips",
  "Himalayan escapes",
  "Spiritual circuits",
  "North East trails",
  "Beach & backwaters",
  "Desert & heritage",
];

export const internationalTripExamples = [
  "Asia",
  "Europe",
  "UK & Ireland",
  "Middle East",
  "Africa",
  "Americas",
  "Australia & NZ",
  "Island getaways",
];

/**
 * Public schedule UI + checkout rules.
 * Percentage stages are cumulative targets of the amount remaining after the advance.
 */
export const scheduleConfig = {
  india: {
    id: "india",
    label: "India Trips",
    destinationsLabel: "India trips",
    destinations: indiaTripExamples,
    advanceInr: ADVANCE_INDIA_INR,
    steps: [
      {
        when: "At booking",
        amount: "₹5,100",
        detail: "Advance payment to confirm your seat",
      },
      {
        when: "45 days before",
        amount: "25%",
        detail: "of the remaining trip amount",
      },
      {
        when: "30 days before",
        amount: "50%",
        detail: "of the remaining trip amount",
      },
      {
        when: "15 days before",
        amount: "100%",
        detail: "of the remaining trip amount must be paid",
      },
    ],
  },
  international: {
    id: "international",
    label: "International Trips",
    destinationsLabel: "International trips",
    destinations: internationalTripExamples,
    advanceInr: ADVANCE_INTERNATIONAL_INR,
    steps: [
      {
        when: "At booking",
        amount: "₹11,000",
        detail: "Advance payment to confirm your seat",
      },
      {
        when: "45 days before",
        amount: "50%",
        detail: "of the remaining trip amount",
      },
      {
        when: "30 days before",
        amount: "100%",
        detail: "of the remaining trip amount must be paid",
      },
    ],
  },
};

export const scheduleFootnote =
  "All payments must be made within the specified timelines to confirm and retain your booking. Paid instalments are non-refundable and non-transferable unless stated otherwise in your booking terms.";

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
