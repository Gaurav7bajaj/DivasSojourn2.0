export const paymentMethods = [
  {
    id: "bank-transfer",
    label: "Bank Transfer",
    details: [
      { key: "A/C No", value: "389005001548", monospace: true },
      { key: "A/C Name", value: "Divas Sojourn Experiences Private Limited" },
      { key: "IFSC Code", value: "ICIC0003890", monospace: true },
      { key: "Bank Name", value: "ICICI Bank" },
    ],
  },
  {
    id: "upi-payment",
    label: "UPI Payment",
    details: [
      {
        key: "UPI us at (Google Pay/BHIM/PhonePe)",
        value: "DivasSojourn@icici",
        monospace: true,
      },
      { key: "UPI Name", value: "Divas Sojourn Experiences Private Limited" },
    ],
  },
  {
    id: "razorpay-link",
    label: "Razorpay Link",
    details: [
      {
        key: "Payment via Razorpay",
        value: "https://razorpay.me/@payDivasSojourn",
        href: "https://razorpay.me/@payDivasSojourn",
      },
    ],
  },
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

export const policyNotes = [
  "For issuance of flight tickets, we require full payment of airfare.",
  "Non-refundable services in the tour package have to be paid in full at the time of booking.",
  "Payment policy is non-negotiable and has to be paid accordingly.",
  "Payment schedule may vary based on destination and travel date, such as events or peak season. Kindly confirm the exact payment timeline with your sales agent.",
];
