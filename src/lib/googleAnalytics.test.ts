import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type AnalyticsWindow = Window & { dataLayer?: unknown[] };

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  delete (window as AnalyticsWindow).dataLayer;
  document.getElementById("analytics-gtm")?.remove();
  window.history.replaceState(
    {},
    "",
    "/cards?q=fictional-private-search&page=1",
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Google Tag Manager client", () => {
  it("does not load or queue GTM before consent", async () => {
    const { initializeGoogleAnalytics, trackPageView } =
      await import("./googleAnalytics");

    initializeGoogleAnalytics();
    trackPageView({ pathname: "/cards", title: "Pokemon cards" });

    expect(document.getElementById("google-analytics-gtag")).toBeNull();
    expect((window as AnalyticsWindow).dataLayer).toBeUndefined();
  });

  it("loads the correct container after consent without query text", async () => {
    localStorage.setItem("analytics-consent-v1", "granted");
    const { GTM_CONTAINER_ID, initializeGoogleAnalytics, trackPageView } =
      await import("./googleAnalytics");

    initializeGoogleAnalytics();
    trackPageView({
      pathname: "/cards?q=fictional-private-search&page=1",
      title: "Pokemon cards",
    });

    expect(GTM_CONTAINER_ID).toBe("GTM-TWGDBWJQ");
    const script = document.getElementById(
      "analytics-gtm",
    ) as HTMLScriptElement | null;
    expect(script?.src).toBe(
      "https://www.googletagmanager.com/gtm.js?id=GTM-TWGDBWJQ",
    );

    const dataLayer = (window as AnalyticsWindow).dataLayer ?? [];
    const consentUpdate = dataLayer.find(
      (entry) =>
        Array.isArray(entry) && entry[0] === "consent" && entry[1] === "update",
    ) as unknown[] | undefined;
    const pageView = dataLayer.find(
      (entry) =>
        Array.isArray(entry) &&
        entry[0] === "event" &&
        entry[1] === "page_view",
    ) as unknown[] | undefined;

    expect(consentUpdate?.[2]).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    expect(pageView?.[2]).toMatchObject({
      page_location: "http://localhost:3000/cards",
      page_title: "Pokemon cards",
    });
    expect(JSON.stringify(dataLayer)).not.toContain("fictional-private-search");
    expect(JSON.stringify(dataLayer)).not.toContain("G-GWD4BQMFEC");
  });
});
