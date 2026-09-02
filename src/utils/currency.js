const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
  GHS: "₵",
  KES: "KSh",
  ZAR: "R",
  XOF: "CFA",
  XAF: "FCFA",
};

export const getCurrencySymbol = (currency) => CURRENCY_SYMBOLS[currency] || currency || "₦";

export const formatPrice = (price, currency = "NGN") => {
  const num = Number(price ?? 0);
  return `${getCurrencySymbol(currency)} ${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
