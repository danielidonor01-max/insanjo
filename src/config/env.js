const mockAuthFlag = import.meta.env.VITE_MOCK_AUTH;

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://api.insanjo.com",
  isQA: import.meta.env.VITE_QA === "true" || false,
  // Demo auth (accounts + referral codes kept in this browser) until the backend
  // endpoints exist. On by default in dev; set VITE_MOCK_AUTH=true for a QA build.
  useMockAuth: mockAuthFlag ? mockAuthFlag === "true" : import.meta.env.DEV,
};
