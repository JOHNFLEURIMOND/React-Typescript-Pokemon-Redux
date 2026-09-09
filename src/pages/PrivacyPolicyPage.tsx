import { Link } from "react-router-dom";

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-3xl text-slate-700">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm">Effective September 9, 2026</p>
      </header>

      <p className="mt-6 leading-7">
        This policy explains how Pokemon Explorer handles information when you
        browse Pokemon and trading cards. You can use the catalog without
        allowing analytics.
      </p>

      <section>
        <h2 className="mt-8 text-2xl font-bold text-slate-950">
          Analytics and your choice
        </h2>
        <p className="mt-3 leading-7">
          Analytics is off unless you select <strong>Accept analytics</strong>.
          If you accept, the site loads its Google Tag Manager container, which
          sends approved page-view events only to the site&apos;s Google
          Analytics 4 property. Advertising storage, ad personalization, and
          Google signals remain disabled.
        </p>
        <p className="mt-3 leading-7">
          Page-view events may include the page path and title and the previous
          page. Page URLs exclude query strings and fragments, so search terms
          and pagination parameters are not sent in the recorded page URL.
        </p>
      </section>

      <section>
        <h2 className="mt-8 text-2xl font-bold text-slate-950">
          Cookies and local storage
        </h2>
        <p className="mt-3 leading-7">
          The site stores your analytics choice in your browser under
          <code> analytics-consent-v1</code>. After opt-in, Google Analytics may
          set cookies whose names begin with <code>_ga</code>. Selecting
          <strong> Reject analytics</strong> disables analytics and removes
          those cookies where the browser permits it. Rejecting analytics does
          not limit catalog features.
        </p>
        <p className="mt-3 leading-7">
          Use the <strong>Cookie settings</strong> control on any page to review
          or change your choice.
        </p>
      </section>

      <section>
        <h2 className="mt-8 text-2xl font-bold text-slate-950">
          Services and data sharing
        </h2>
        <p className="mt-3 leading-7">
          Catalog requests use PokeAPI and the Pokemon TCG API. Those services
          may receive technical request information under their own privacy
          terms. Google processes consented analytics data as our analytics
          service provider, and the hosting provider may process ordinary
          request and security logs needed to deliver the site. We do not use
          the site to sell personal information or send data to advertising
          platforms.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <a className="underline" href="https://policies.google.com/privacy">
              Google Privacy Policy
            </a>
          </li>
          <li>
            <a className="underline" href="https://pokeapi.co/about">
              PokeAPI information
            </a>
          </li>
          <li>
            <a className="underline" href="https://pokemontcg.io/privacy">
              Pokemon TCG API privacy policy
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mt-8 text-2xl font-bold text-slate-950">
          Contact and policy changes
        </h2>
        <p className="mt-3 leading-7">
          This policy may change when the site or its data practices change. The
          effective date above will be updated. For privacy questions, use the{" "}
          <a className="underline" href="https://johnfleurimond.com/contact">
            contact page
          </a>
          .
        </p>
        <p className="mt-6">
          <Link className="font-semibold underline" to="/">
            Return to Pokemon Explorer
          </Link>
        </p>
      </section>
    </article>
  );
}
