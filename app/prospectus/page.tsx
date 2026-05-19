import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "./calculator";

export const metadata: Metadata = {
  title: "The Swim Up — Prospectus",
  description:
    "Interactive operating model and revenue projections for The Swim Up.",
  robots: { index: false, follow: false },
};

export default function ProspectusPage() {
  return (
    <>
      <div className="strip">
        <div className="pair">
          <Link href="/">← The Swim Up</Link>
          <span>Prospectus · Q2 2026</span>
        </div>
        <div className="pair">
          <span>Illustrative</span>
          <span>v0.1</span>
        </div>
      </div>

      <article className="prospectus">
        <header className="prospectus-head">
          <span className="eyebrow">— Operating Model —</span>
          <h1>
            A members&apos; club where<br />
            <em>work meets water.</em>
          </h1>
          <p className="lede">
            584 4th St · 5,350 sq ft · a heated pool, a kitchen, a long bar, and
            the desks you actually want to sit at. The model below sizes the
            business across membership, F&amp;B, events, and partner subleases.
            Tweak the dials — every number recalculates in real time.
          </p>
          <p className="caveat">
            Numbers are working assumptions, not commitments. F&amp;B is modeled
            as pass-through to a kitchen partner (e.g. Marlowe), with our share
            configurable. Treat this as a conversation starter, not an offering
            document.
          </p>
        </header>

        <Calculator />

        <footer className="prospectus-foot">
          <p>
            <strong>The Swim Up</strong> &nbsp;·&nbsp; San Francisco &nbsp;·&nbsp;
            Opening Spring 2026
          </p>
          <p className="fine">
            This document is for informational purposes only and does not
            constitute an offer to sell or solicit any security. All projections
            are illustrative.
          </p>
        </footer>
      </article>
    </>
  );
}
