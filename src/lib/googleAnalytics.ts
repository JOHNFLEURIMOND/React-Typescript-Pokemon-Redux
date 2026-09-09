import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  readAnalyticsConsent,
} from "./analyticsConsent";

export const GA_MEASUREMENT_ID = "G-GWD4BQMFEC";

const SCRIPT_ID = "google-analytics-gtag";
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

function loadGoogleTag(): boolean {
  if (configured || readAnalyticsConsent() !== "granted") return false;

  gtag("consent", "default", DENIED_CONSENT);
  gtag("consent", "update", ANALYTICS_ONLY_CONSENT);
  gtag("set", "ads_data_redaction", true);
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  configured = true;
  return true;
}

function sendPageView({ pathname, title }: PageView): boolean {
  if (readAnalyticsConsent() !== "granted") return false;
  if (!configured && !loadGoogleTag()) return false;

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
    if (!configured) loadGoogleTag();
    else gtag("consent", "update", ANALYTICS_ONLY_CONSENT);
    flushPendingPageView();
    return;
  }

  if (configured) gtag("consent", "update", DENIED_CONSENT);
}

export function initializeGoogleAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  window.addEventListener(ANALYTICS_CONSENT_EVENT, applyConsent);
  window.addEventListener("storage", (event) => {
    if (event.key === ANALYTICS_CONSENT_KEY || event.key === null) applyConsent();
  });

  applyConsent();
}

export function trackPageView(pageView: PageView = {}): boolean {
  if (typeof window === "undefined") return false;
  if (!initialized) initializeGoogleAnalytics();

  pendingPageView = pageView;
  return flushPendingPageView();
}
