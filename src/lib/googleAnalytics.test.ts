import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type AnalyticsWindow = Window & { dataLayer?: unknown[] };

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  delete (window as AnalyticsWindow).dataLayer;
  document.getElementById("google-analytics-gtag")?.remove();
  window.history.replaceState(
    {},
    "",
    "/cards?q=fictional-private-search&page=1",
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Google Analytics client", () => {
  it("does not load or queue Google Analytics before consent", async () => {
    const { initializeGoogleAnalytics, trackPageView } =
      await import("./googleAnalytics");

    initializeGoogleAnalytics();
    trackPageView({ pathname: "/cards", title: "Pokemon cards" });

    expect(document.getElementById("google-analytics-gtag")).toBeNull();
    expect((window as AnalyticsWindow).dataLayer).toBeUndefined();
  });

  it("loads the correct property after consent without query text", async () => {
    localStorage.setItem("analytics-consent-v1", "granted");
    const { GA_MEASUREMENT_ID, initializeGoogleAnalytics, trackPageView } =
      await import("./googleAnalytics");

    initializeGoogleAnalytics();
    trackPageView({
      pathname: "/cards?q=fictional-private-search&page=1",
      title: "Pokemon cards",
    });

    expect(GA_MEASUREMENT_ID).toBe("G-GWD4BQMFEC");
    const script = document.getElementById(
      "google-analytics-gtag",
    ) as HTMLScriptElement | null;
    expect(script?.src).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-GWD4BQMFEC",
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
  });
});
