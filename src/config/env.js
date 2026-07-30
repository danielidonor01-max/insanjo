export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://api.insanjo.com",
  isQA: import.meta.env.VITE_QA === "true" || false,
};