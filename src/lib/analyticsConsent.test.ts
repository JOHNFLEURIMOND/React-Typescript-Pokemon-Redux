import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const storageKey = "analytics-consent-v1";
const eventName = "analytics-consent-change";

describe("analytics consent", () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
    document.cookie = "_ga=; Max-Age=0; Path=/";
    document.cookie = "_ga_TEST=; Max-Age=0; Path=/";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([null, "", "true", "GRANTED", '{"analytics":"granted"}'])(
    "fails closed for missing or invalid storage: %s",
    async (stored) => {
      if (stored !== null) window.localStorage.setItem(storageKey, stored);
      const dispatch = vi.spyOn(window, "dispatchEvent");
      const write = vi.spyOn(Storage.prototype, "setItem");
      const { readAnalyticsConsent } = await import("./analyticsConsent");
      expect(readAnalyticsConsent()).toBe("unknown");
      expect(dispatch).not.toHaveBeenCalled();
      expect(write).not.toHaveBeenCalled();
    },
  );

  it.each(["granted", "denied"] as const)(
    "reads only the valid stored choice %s",
    async (choice) => {
      window.localStorage.setItem(storageKey, choice);
      const { readAnalyticsConsent } = await import("./analyticsConsent");
      expect(readAnalyticsConsent()).toBe(choice);
    },
  );

  it("persists explicit choices and dispatches the exact synchronous event", async () => {
    const { readAnalyticsConsent, setAnalyticsConsent } =
      await import("./analyticsConsent");
    const choices: unknown[] = [];
    const listener = (event: Event) => {
      choices.push((event as CustomEvent).detail);
      expect(readAnalyticsConsent()).toBe(
        (event as CustomEvent).detail.analytics,
      );
    };
    window.addEventListener(eventName, listener);
    try {
      setAnalyticsConsent("granted");
      expect(window.localStorage.getItem(storageKey)).toBe("granted");
      setAnalyticsConsent("denied");
      expect(window.localStorage.getItem(storageKey)).toBe("denied");
      expect(choices).toEqual([
        { analytics: "granted" },
        { analytics: "denied" },
      ]);
    } finally {
      window.removeEventListener(eventName, listener);
    }
  });

  it("fails closed when storage access throws but honors explicit in-memory choices", async () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    const { readAnalyticsConsent, setAnalyticsConsent } =
      await import("./analyticsConsent");
    expect(readAnalyticsConsent()).toBe("unknown");
    setAnalyticsConsent("granted");
    expect(readAnalyticsConsent()).toBe("granted");
    setAnalyticsConsent("denied");
    expect(readAnalyticsConsent()).toBe("denied");
    vi.resetModules();
    const restarted = await import("./analyticsConsent");
    expect(restarted.readAnalyticsConsent()).toBe("unknown");
  });

  it("keeps failed writes in memory without trusting an older stored grant", async () => {
    window.localStorage.setItem(storageKey, "granted");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });
    const { readAnalyticsConsent, setAnalyticsConsent } =
      await import("./analyticsConsent");
    setAnalyticsConsent("denied");
    expect(readAnalyticsConsent()).toBe("denied");
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    vi.resetModules();
    const restarted = await import("./analyticsConsent");
    expect(restarted.readAnalyticsConsent()).toBe("unknown");
  });

  it("observes a persisted revocation from another tab after a local grant", async () => {
    const { readAnalyticsConsent, setAnalyticsConsent } =
      await import("./analyticsConsent");
    setAnalyticsConsent("granted");
    window.localStorage.setItem(storageKey, "denied");
    expect(readAnalyticsConsent()).toBe("denied");
  });

  it("removes GA cookies on rejection without removing consent or unrelated cookies", async () => {
    document.cookie = "_ga=example; Path=/";
    document.cookie = "_ga_TEST=example; Path=/";
    document.cookie = "essential=example; Path=/";
    const { setAnalyticsConsent } = await import("./analyticsConsent");
    setAnalyticsConsent("granted");
    expect(document.cookie).toContain("_ga=example");
    setAnalyticsConsent("denied");
    expect(document.cookie).not.toMatch(/_ga(?:_|=)/);
    expect(document.cookie).toContain("essential=example");
    expect(window.localStorage.getItem(storageKey)).toBe("denied");
  });

  it("signals revocation before cookie cleanup and expires current and parent domains", async () => {
    const order: string[] = [];
    vi.stubGlobal("window", {
      localStorage,
      location: { hostname: "app.example.test", pathname: "/catalog/page" },
      dispatchEvent: () => order.push("event"),
    });
    vi.spyOn(document, "cookie", "get").mockReturnValue(
      "_ga=example; _ga_TEST=example",
    );
    const cookies = vi
      .spyOn(document, "cookie", "set")
      .mockImplementation(() => {
        order.push("cookie");
      });
    const { setAnalyticsConsent } = await import("./analyticsConsent");
    setAnalyticsConsent("denied");
    expect(order[0]).toBe("event");
    for (const name of ["_ga", "_ga_TEST"]) {
      for (const domain of [
        "",
        "; Domain=app.example.test",
        "; Domain=.app.example.test",
        "; Domain=example.test",
        "; Domain=.example.test",
      ]) {
        expect(cookies).toHaveBeenCalledWith(
          `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/${domain}`,
        );
      }
    }
    expect(cookies).toHaveBeenCalledWith(
      expect.stringContaining("Path=/catalog;"),
    );
  });

  it("rejects invalid runtime choices without side effects", async () => {
    const { setAnalyticsConsent } = await import("./analyticsConsent");
    const dispatch = vi.spyOn(window, "dispatchEvent");
    expect(() => setAnalyticsConsent("yes" as "granted")).toThrow(TypeError);
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
