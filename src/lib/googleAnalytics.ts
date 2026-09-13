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
type PageView = { navigationKey?: string; pathname?: string; title?: string };
type PageType =
  "pokemon_catalog" | "pokemon_detail" | "tcg_catalog" | "not_found";
type AnalyticsEventInput =
  | {
      event: "pokemon_api_error";
      api_name: "pokeapi" | "pokemon_tcg";
      error_type:
        | "network"
        | "timeout"
        | "rate_limited"
        | "not_found"
        | "server"
        | "unknown";
      operation: "catalog" | "detail" | "search";
      request_status: number;
    }
  | {
      event: "pokemon_detail_view";
      pokemon_id: string;
      pokemon_type?: string;
    }
  | {
      event: "pokemon_search";
      query_length_bucket: "empty" | "1_3" | "4_10" | "11_plus";
      search_scope: "pokemon" | "tcg";
    }
  | {
      event: "pokemon_select";
      list_position: number;
      pokemon_id: string;
      source: "pokemon_catalog";
    };
type AnalyticsEvent = AnalyticsEventInput & {
  app_name: "pokemon_redux";
  environment: "production" | "development" | "test";
  page_type: PageType;
};

let initialized = false;
let configured = false;
let unloading = false;
let lastPageViewIdentity: string | null = null;
let previousPageLocation: string | null = null;
let pendingPageView: PageView | null = null;

function gtag(...args: unknown[]): void {
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(args);
}

function pushEvent(event: AnalyticsEvent | Record<string, string>): void {
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(event);
}

function getEnvironment(): AnalyticsEvent["environment"] {
  if (import.meta.env.MODE === "production") return "production";
  if (import.meta.env.MODE === "test") return "test";
  return "development";
}

function getPageType(pathname = window.location.pathname): PageType {
  if (pathname === "/") return "pokemon_catalog";
  if (pathname === "/cards") return "tcg_catalog";
  if (pathname.startsWith("/pokemon/")) return "pokemon_detail";
  return "not_found";
}

function sanitizePageLocation(pathname?: string): string {
  const rawPath =
    typeof pathname === "string" && pathname.startsWith("/")
      ? pathname.split(/[?#]/, 1)[0]
      : window.location.pathname;
  const path = rawPath.replace(/^\/pokemon\/[^/]+\/?$/, "/pokemon/:nameOrId");
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

function sendPageView({ navigationKey, pathname, title }: PageView): boolean {
  if (readAnalyticsConsent() !== "granted") return false;
  if (!configured && !loadAnalyticsContainer()) return false;

  const pageLocation = sanitizePageLocation(pathname);
  const pageViewIdentity = navigationKey || pageLocation;
  if (pageViewIdentity === lastPageViewIdentity) return false;

  const parameters: Record<string, string> = {
    app_name: "pokemon_redux",
    environment: getEnvironment(),
    page_location: pageLocation,
    page_path: new URL(pageLocation).pathname,
    page_title: title || document.title,
    page_type: getPageType(new URL(pageLocation).pathname),
  };
  if (previousPageLocation) parameters.page_referrer = previousPageLocation;

  pushEvent({ event: "page_view", ...parameters });
  previousPageLocation = pageLocation;
  lastPageViewIdentity = pageViewIdentity;
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

export function trackAnalyticsEvent(event: AnalyticsEventInput): boolean {
  if (typeof window === "undefined") return false;
  if (readAnalyticsConsent() !== "granted") return false;
  if (!configured && !loadAnalyticsContainer()) return false;

  pushEvent({
    app_name: "pokemon_redux",
    environment: getEnvironment(),
    page_type: getPageType(),
    ...event,
  });
  return true;
}

export function getQueryLengthBucket(
  query: string,
): "empty" | "1_3" | "4_10" | "11_plus" {
  const length = query.trim().length;
  if (length === 0) return "empty";
  if (length <= 3) return "1_3";
  if (length <= 10) return "4_10";
  return "11_plus";
}
