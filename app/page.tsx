import { InquireForm } from "./inquire-form";

export default function Home() {
  return (
    <>
      <div className="strip">
        <div className="pair">
          <span>EST. 2026</span>
          <span>SAN FRANCISCO</span>
        </div>
        <div className="pair">
          <a href="#work">Work</a>
          <a href="/menu">Menu</a>
          <a href="#swim">Swim</a>
          <a href="#inquire">Members</a>
        </div>
      </div>

      <section className="hero">
        <div className="hero-photo" aria-hidden="true" />
        <div className="ripples" aria-hidden="true">
          <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="r1" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.25" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,180 Q300,140 600,180 T1200,180"
              stroke="url(#r1)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0,260 Q300,220 600,260 T1200,260"
              stroke="url(#r1)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0,360 Q300,320 600,360 T1200,360"
              stroke="url(#r1)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0,460 Q300,420 600,460 T1200,460"
              stroke="url(#r1)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <span className="wordmark">THE SWIM UP</span>
        <h1>
          POOL<span className="slash">/</span>BAR
          <span className="slash">/</span>
          <span className="last">DESK.</span>
        </h1>
        <p className="sub">
          Three things, done well. One membership. Year-round heated pool, the
          kitchen open from breakfast to last call, and a desk to call your own.
        </p>
        <div className="meta">
          <span>
            OPENING
            <b>Spring 2026</b>
          </span>
          <span>
            MEMBERS
            <b>Capped at 300</b>
          </span>
          <span>
            POOL
            <b>Heated, 25m, year-round</b>
          </span>
        </div>
      </section>

      <section className="pillars">
        <article className="pillar work" id="work">
          <div>
            <div className="num">01</div>
            <h2>WORK.</h2>
          </div>
          <p>
            Library, long desks, phone rooms. Wifi worth bragging about. Coffee
            not worth complaining about.
          </p>
        </article>
        <article className="pillar eat" id="eat">
          <div>
            <div className="num">02</div>
            <h2>EAT.</h2>
          </div>
          <p>
            Six dishes done well, not thirty done halfway. Breakfast to dinner.
            A long lunch table for anyone who shows up.
          </p>
        </article>
        <article className="pillar drink" id="drink">
          <div>
            <div className="num">03</div>
            <h2>DRINK.</h2>
          </div>
          <p>
            A short cocktail list, a longer wine list, and a bartender
            who&apos;s already pouring before you sit down.
          </p>
        </article>
        <article className="pillar swim" id="swim">
          <div>
            <div className="num">04</div>
            <h2>SWIM.</h2>
          </div>
          <p>
            Heated, 25 metres, open every day. Laps before the meeting. A long
            float between them. A sauna that actually delivers.
          </p>
        </article>
      </section>

      <section className="philosophy">
        <span className="eyebrow">— The Pitch —</span>
        <blockquote>
          The office got <em>boring.</em> So we built one with a{" "}
          <em>pool.</em>
        </blockquote>
        <div className="attrib">— Founders</div>
      </section>

      <section className="cta-band" id="inquire">
        <h2>BECOME A MEMBER.</h2>
        <InquireForm />
      </section>

      <footer className="footer">
        <span className="mark">THE SWIM UP</span>
        <span>Pool · Bar · Desk · 2026</span>
        <span>San Francisco · Always Heated</span>
      </footer>
    </>
  );
}
