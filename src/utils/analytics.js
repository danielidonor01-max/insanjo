export const GA_ID = "G-GD8BNQSQ1F";

export function initializeAnalytics() {
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_ID);
}

export function trackEvent(name, params = {}) {
  if (window.gtag) {
    window.gtag("event", name, params);
  }
}