import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CookieConsentBanner from "./CookieConsentBanner";
import { setAnalyticsConsent } from "../../lib/analyticsConsent";

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("starts nonmodal without moving focus and offers equally styled accessible choices", () => {
    const dispatch = vi.spyOn(window, "dispatchEvent");
    const previousFocus = document.activeElement;
    render(<CookieConsentBanner />);
    expect(
      screen.getByRole("region", { name: "Analytics cookies" }),
    ).toHaveAccessibleDescription(/only run with your permission/);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const accept = screen.getByRole("button", { name: "Accept analytics" });
    const reject = screen.getByRole("button", { name: "Reject analytics" });
    expect(accept.className).toBe(reject.className);
    expect(accept).toHaveAttribute("type", "button");
    expect(reject).toHaveAttribute("type", "button");
    expect(document.activeElement).toBe(previousFocus);
    expect(dispatch).not.toHaveBeenCalled();
    expect(window.localStorage.getItem("analytics-consent-v1")).toBeNull();
  });

  it("closes and reopens without granting consent or emitting an event, and restores focus", () => {
    const dispatch = vi.spyOn(window, "dispatchEvent");
    render(<CookieConsentBanner />);
    const settings = screen.getByRole("button", { name: "Cookie settings" });
    fireEvent.click(
      screen.getByRole("button", { name: "Close cookie settings" }),
    );
    expect(settings).toHaveFocus();
    expect(settings).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(settings);
    const panel = screen.getByRole("region", { name: "Analytics cookies" });
    expect(panel).toHaveFocus();
    expect(settings).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(panel, { key: "Escape" });
    expect(settings).toHaveFocus();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("accepts, reopens, revokes, and preserves the choice on remount", () => {
    const dispatch = vi.spyOn(window, "dispatchEvent");
    const { unmount } = render(<CookieConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: "Accept analytics" }));
    expect(window.localStorage.getItem("analytics-consent-v1")).toBe("granted");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    const settings = screen.getByRole("button", { name: "Cookie settings" });
    expect(settings).toHaveFocus();
    fireEvent.click(settings);
    expect(
      screen.getByText("Current choice: analytics allowed."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reject analytics" }));
    expect(settings).toHaveFocus();
    expect(window.localStorage.getItem("analytics-consent-v1")).toBe("denied");
    expect(dispatch).toHaveBeenCalledTimes(2);
    unmount();
    render(<CookieConsentBanner />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cookie settings" }),
    ).toBeVisible();
  });

  it("reflects revocation and storage clearing in another tab", () => {
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: "Accept analytics" }));
    fireEvent.click(screen.getByRole("button", { name: "Cookie settings" }));
    window.localStorage.setItem("analytics-consent-v1", "denied");
    fireEvent(
      window,
      new StorageEvent("storage", {
        key: "analytics-consent-v1",
        newValue: "denied",
        storageArea: window.localStorage,
      }),
    );
    expect(
      screen.getByText("Current choice: analytics rejected."),
    ).toBeInTheDocument();
    window.localStorage.clear();
    fireEvent(
      window,
      new StorageEvent("storage", { storageArea: window.localStorage }),
    );
    expect(
      screen.getByText("Current choice: not set (analytics off)."),
    ).toBeInTheDocument();
  });

  it("reflects helper changes and remains usable when persistence fails", () => {
    setAnalyticsConsent("denied");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: "Cookie settings" }));
    fireEvent.click(screen.getByRole("button", { name: "Accept analytics" }));
    fireEvent.click(screen.getByRole("button", { name: "Cookie settings" }));
    expect(
      screen.getByText("Current choice: analytics allowed."),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reject analytics" }));
    expect(
      screen.getByRole("button", { name: "Cookie settings" }),
    ).toHaveFocus();
  });
});
