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
        typeof entry === "object" &&
        entry !== null &&
        "event" in entry &&
        entry.event === "page_view",
    );

    expect(consentUpdate?.[2]).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    expect(pageView).toMatchObject({
      app_name: "pokemon_redux",
      environment: "test",
      event: "page_view",
      page_location: "http://localhost:3000/cards",
      page_path: "/cards",
      page_title: "Pokemon cards",
      page_type: "tcg_catalog",
    });
    expect(JSON.stringify(dataLayer)).not.toContain("fictional-private-search");
    expect(
      dataLayer.some((entry) => Array.isArray(entry) && entry[0] === "config"),
    ).toBe(false);
  });

  it("queues structured application events only after consent", async () => {
    const { trackAnalyticsEvent } = await import("./googleAnalytics");

    expect(
      trackAnalyticsEvent({
        event: "pokemon_search",
        query_length_bucket: "4_10",
        search_scope: "pokemon",
      }),
    ).toBe(false);
    expect((window as AnalyticsWindow).dataLayer).toBeUndefined();

    localStorage.setItem("analytics-consent-v1", "granted");

    expect(
      trackAnalyticsEvent({
        event: "pokemon_search",
        query_length_bucket: "4_10",
        search_scope: "pokemon",
      }),
    ).toBe(true);
    expect((window as AnalyticsWindow).dataLayer).toContainEqual({
      app_name: "pokemon_redux",
      environment: "test",
      event: "pokemon_search",
      page_type: "tcg_catalog",
      query_length_bucket: "4_10",
      search_scope: "pokemon",
    });
  });

  it("tracks query-only navigation once without exposing query values", async () => {
    localStorage.setItem("analytics-consent-v1", "granted");
    const { trackPageView } = await import("./googleAnalytics");

    expect(trackPageView({ navigationKey: "first", pathname: "/cards" })).toBe(
      true,
    );
    expect(trackPageView({ navigationKey: "second", pathname: "/cards" })).toBe(
      true,
    );
    expect(trackPageView({ navigationKey: "second", pathname: "/cards" })).toBe(
      false,
    );

    const pageViews = ((window as AnalyticsWindow).dataLayer ?? []).filter(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        "event" in entry &&
        entry.event === "page_view",
    );
    expect(pageViews).toHaveLength(2);
    expect(JSON.stringify(pageViews)).not.toContain("fictional-private-search");
  });

  it("redacts a user-controlled Pokemon route segment", async () => {
    localStorage.setItem("analytics-consent-v1", "granted");
    const { trackPageView } = await import("./googleAnalytics");

    trackPageView({
      navigationKey: "private-detail",
      pathname: "/pokemon/fictional-private-search",
    });

    const dataLayer = (window as AnalyticsWindow).dataLayer ?? [];
    expect(dataLayer).toContainEqual(
      expect.objectContaining({
        event: "page_view",
        page_location: "http://localhost:3000/pokemon/:nameOrId",
        page_path: "/pokemon/:nameOrId",
        page_type: "pokemon_detail",
      }),
    );
    expect(JSON.stringify(dataLayer)).not.toContain("fictional-private-search");
  });
});
