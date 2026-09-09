export type AnalyticsConsentChoice = "granted" | "denied";
export type AnalyticsConsent = AnalyticsConsentChoice | "unknown";

export const ANALYTICS_CONSENT_KEY = "analytics-consent-v1";
export const ANALYTICS_CONSENT_EVENT = "analytics-consent-change";

let sessionConsent: AnalyticsConsent = "unknown";

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "unknown";
  if (sessionConsent !== "unknown") return sessionConsent;

  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    return "unknown";
  }
}

function removeAnalyticsCookies(): void {
  try {
    const names = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("=")[0])
      .filter((name) => /^_ga(?:_|$)/.test(name));
    const labels = window.location.hostname.split(".");
    const domains = [""];
    for (let index = 0; index < labels.length; index += 1) {
      const domain = labels.slice(index).join(".");
      domains.push(`; Domain=${domain}`, `; Domain=.${domain}`);
    }
    const paths = new Set(["/"]);
    const segments = window.location.pathname.split("/");
    for (let index = 1; index <= segments.length; index += 1) {
      const path = segments.slice(0, index).join("/") || "/";
      paths.add(path);
      paths.add(path.endsWith("/") ? path : `${path}/`);
    }
    for (const name of names) {
      for (const domain of domains) {
        for (const path of paths) {
          document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}${domain}`;
        }
      }
    }
  } catch {
    return;
  }
}

function persistAnalyticsConsent(choice: AnalyticsConsentChoice): boolean {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
    return true;
  } catch {
    try {
      window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
    } catch {
      return false;
    }
    return false;
  }
}

export function setAnalyticsConsent(choice: AnalyticsConsentChoice): void {
  if (choice !== "granted" && choice !== "denied") {
    throw new TypeError("Analytics consent must be granted or denied");
  }
  if (typeof window === "undefined") return;

  sessionConsent = persistAnalyticsConsent(choice) ? "unknown" : choice;
  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: { analytics: choice } }),
  );
  if (choice === "denied") removeAnalyticsCookies();
}
