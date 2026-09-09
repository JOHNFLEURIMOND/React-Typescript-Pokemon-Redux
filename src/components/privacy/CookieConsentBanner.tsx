import { useEffect, useId, useRef, useState } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  readAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsentChoice,
} from "../../lib/analyticsConsent";
import { Button } from "../ui/button";

export default function CookieConsentBanner(): JSX.Element {
  const [consent, setConsent] = useState(readAnalyticsConsent);
  const [open, setOpen] = useState(() => readAnalyticsConsent() === "unknown");
  const settingsRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const focusOnOpen = useRef(false);
  const panelId = useId();
  const headingId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const updateConsent = () => setConsent(readAnalyticsConsent());
    const updateStoredConsent = (event: StorageEvent) => {
      if (
        event.storageArea === window.localStorage &&
        (event.key === ANALYTICS_CONSENT_KEY || event.key === null)
      ) {
        updateConsent();
      }
    };
    window.addEventListener(ANALYTICS_CONSENT_EVENT, updateConsent);
    window.addEventListener("storage", updateStoredConsent);
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, updateConsent);
      window.removeEventListener("storage", updateStoredConsent);
    };
  }, []);

  useEffect(() => {
    if (open && focusOnOpen.current) {
      panelRef.current?.focus();
      focusOnOpen.current = false;
    }
  }, [open]);

  function closeSettings(): void {
    setOpen(false);
    settingsRef.current?.focus();
  }

  function chooseConsent(choice: AnalyticsConsentChoice): void {
    setAnalyticsConsent(choice);
    closeSettings();
  }

  function openSettings(): void {
    if (open) {
      panelRef.current?.focus();
    } else {
      focusOnOpen.current = true;
      setOpen(true);
    }
  }

  return (
    <div className="border-b border-slate-200 bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <button
          ref={settingsRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={openSettings}
          className="min-h-11 rounded px-2 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        >
          Cookie settings
        </button>
        <section
          ref={panelRef}
          id={panelId}
          hidden={!open}
          aria-labelledby={headingId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeSettings();
            }
          }}
          className="py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        >
          <h2 id={headingId} className="text-lg font-bold">
            Analytics cookies
          </h2>
          <p
            id={descriptionId}
            className="mt-2 max-w-3xl text-sm leading-relaxed"
          >
            We would like to use Google Analytics cookies to understand site
            usage. Analytics will only run with your permission. No advertising
            cookies. You can change your choice at any time.
          </p>
          <p className="mt-2 text-sm">
            Current choice:{" "}
            {consent === "granted"
              ? "analytics allowed"
              : consent === "denied"
                ? "analytics rejected"
                : "not set (analytics off)"}
            .
          </p>
          <div className="mt-3 flex max-w-xl flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => chooseConsent("granted")}
              className="h-auto min-h-11 min-w-0 flex-1 whitespace-normal py-2 motion-reduce:transition-none"
            >
              Accept analytics
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => chooseConsent("denied")}
              className="h-auto min-h-11 min-w-0 flex-1 whitespace-normal py-2 motion-reduce:transition-none"
            >
              Reject analytics
            </Button>
          </div>
          <button
            type="button"
            onClick={closeSettings}
            className="mt-2 min-h-11 rounded px-2 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            Close cookie settings
          </button>
        </section>
      </div>
    </div>
  );
}
