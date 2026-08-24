const inrFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export const INR_TO_USD_RATE = 100;

export function inrToUsd(amountInInr) {
  return Math.round(amountInInr / INR_TO_USD_RATE);
}

export function formatDualPrice(amountInInr, options = {}) {
  const { suffix = "/-", useRupeeSymbol = false } = options;
  const inr = inrFormatter.format(amountInInr);
  const usd = usdFormatter.format(inrToUsd(amountInInr));

  if (useRupeeSymbol) {
    return `₹${inr} / $${usd}`;
  }

  return `Rs. ${inr}${suffix} / $${usd}`;
}

export function formatDualPriceLabel(amountInInr, label = "") {
  const base = formatDualPrice(amountInInr);
  return label ? `${base} ${label}` : base;
}
