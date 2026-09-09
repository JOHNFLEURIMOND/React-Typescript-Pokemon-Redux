import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  readAnalyticsConsent,
} from "./analyticsConsent";

export const GTM_CONTAINER_ID = "GTM-TWGDBWJQ";

const SCRIPT_ID = "analytics-gtm";
const DENIED_CONSENT = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;
const ANALYTICS_ONLY_CONSENT = {
  ...DENIED_CONSENT,
  analytics_storage: "granted",
} as const;

type AnalyticsWindow = Window & { dataLayer?: unknown[] };
type PageView = { pathname?: string; title?: string };

let initialized = false;
let configured = false;
let unloading = false;
let lastPageLocation: string | null = null;
let previousPageLocation: string | null = null;
let pendingPageView: PageView | null = null;

function gtag(...args: unknown[]): void {
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(args);
}

function sanitizePageLocation(pathname?: string): string {
  const path =
    typeof pathname === "string" && pathname.startsWith("/")
      ? pathname.split(/[?#]/, 1)[0]
      : window.location.pathname;
  return new URL(path, window.location.origin).href;
}

function loadAnalyticsContainer(): boolean {
  if (configured || unloading || readAnalyticsConsent() !== "granted")
    return false;

  gtag("consent", "default", DENIED_CONSENT);
  gtag("consent", "update", ANALYTICS_ONLY_CONSENT);
  gtag("set", "ads_data_redaction", true);
  gtag("set", "allow_google_signals", false);
  gtag("set", "allow_ad_personalization_signals", false);
  (window as AnalyticsWindow).dataLayer?.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
    document.head.appendChild(script);
  }

  configured = true;
  return true;
}

function sendPageView({ pathname, title }: PageView): boolean {
  if (readAnalyticsConsent() !== "granted") return false;
  if (!configured && !loadAnalyticsContainer()) return false;

  const pageLocation = sanitizePageLocation(pathname);
  if (pageLocation === lastPageLocation) return false;

  const parameters: Record<string, string> = {
    page_location: pageLocation,
    page_title: title || document.title,
  };
  if (previousPageLocation) parameters.page_referrer = previousPageLocation;

  gtag("event", "page_view", parameters);
  previousPageLocation = pageLocation;
  lastPageLocation = pageLocation;
  return true;
}

function flushPendingPageView(): boolean {
  if (!pendingPageView || readAnalyticsConsent() !== "granted") return false;
  const pageView = pendingPageView;
  pendingPageView = null;
  return sendPageView(pageView);
}

function applyConsent(): void {
  const consent = readAnalyticsConsent();

  if (consent === "granted") {
    if (!configured) loadAnalyticsContainer();
    else gtag("consent", "update", ANALYTICS_ONLY_CONSENT);
    flushPendingPageView();
    return;
  }

  if (configured && !unloading) {
    unloading = true;
    gtag("consent", "update", DENIED_CONSENT);
    document.getElementById(SCRIPT_ID)?.remove();
    window.location.reload();
  }
}

export function initializeGoogleAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  window.addEventListener(ANALYTICS_CONSENT_EVENT, applyConsent);
  window.addEventListener("storage", (event) => {
    if (event.key === ANALYTICS_CONSENT_KEY || event.key === null)
      applyConsent();
  });

  applyConsent();
}

export function trackPageView(pageView: PageView = {}): boolean {
  if (typeof window === "undefined") return false;
  if (!initialized) initializeGoogleAnalytics();

  pendingPageView = pageView;
  return flushPendingPageView();
}
