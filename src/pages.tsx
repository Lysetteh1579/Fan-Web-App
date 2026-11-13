import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { useClerk, useUser } from "@clerk/react";
import "./pages.css";

type SiteHeaderProps = {
  activePath?: string;
};

const summitSlug = "lash-pro-summit-2026";

const disciplines = [
  {
    number: "01",
    category: "artistry",
    title: "Artistry",
    name: "Elena Rostova",
    role: "Master Lash Educator & Founder",
    description:
      "Pioneer in mega-volume techniques, lash mapping, and retention optimization.",
  },
  {
    number: "02",
    category: "health",
    title: "Ocular health",
    name: "Dr. Aris Thorne, OD",
    role: "Ophthalmologist & Eye Health Specialist",
    description:
      "Specializes in corneal safety, blepharitis prevention, and allergy mitigation.",
  },
  {
    number: "03",
    category: "chemistry",
    title: "Chemistry",
    name: "Dr. Sarah Lin, PhD",
    role: "Cosmetic Chemist",
    description:
      "Formulator focused on cyanoacrylate polymer chemistry and serum active ingredients.",
  },
  {
    number: "04",
    category: "business",
    title: "Business",
    name: "Marcus Vance",
    role: "Beauty Brand Strategist",
    description:
      "Scales boutique lash studios into multi-location franchises and product lines.",
  },
];

const agendaSessions = [
  { id: "agenda-1", number: "01", time: "To be announced", topic: "To be announced", speaker: "To be announced" },
  { id: "agenda-2", number: "02", time: "To be announced", topic: "To be announced", speaker: "To be announced" },
  { id: "agenda-3", number: "03", time: "To be announced", topic: "To be announced", speaker: "To be announced" },
  { id: "agenda-4", number: "04", time: "To be announced", topic: "To be announced", speaker: "To be announced" },
];

export function SiteHeader({ activePath = "/" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const closeMenu = () => setMenuOpen(false);
  const homeAnchor = (anchor: string) => activePath === "/" ? `#${anchor}` : `/#${anchor}`;

  return (
    <header className="lps-header">
      <div className="lps-shell lps-header-inner">
        <a className="lps-brand" href="/" aria-label="Lash Pro Summit 2026 home" onClick={closeMenu}>
          <span className="lps-brand-mark" aria-hidden="true">L<span>·</span>P</span>
          <span className="lps-brand-name">Lash Pro <span>Summit</span></span>
        </a>
        <button
          className="lps-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="lps-primary-nav"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav
          className={`lps-primary-nav${menuOpen ? " is-open" : ""}`}
          id="lps-primary-nav"
          aria-label="Main navigation"
        >
          <a href={homeAnchor("speakers")} onClick={closeMenu}>Speakers</a>
          <a href={activePath === "/" ? "#agenda" : "/agenda"} aria-current={activePath === "/agenda" ? "page" : undefined} onClick={closeMenu}>Agenda</a>
          <a href={homeAnchor("about")} onClick={closeMenu}>About</a>
          <a href="/dashboard" aria-current={activePath === "/dashboard" ? "page" : undefined} onClick={closeMenu}>Dashboard</a>
          <a href="/registration" aria-current={activePath === "/registration" ? "page" : undefined} onClick={closeMenu}>Registration</a>
          <div className="lps-header-auth">
            {isLoaded && user ? (
              <>
                <span className="lps-auth-greeting">Hi, {user.firstName || "member"}</span>
                <button className="lps-auth-link lps-logout-button" type="button" onClick={() => { closeMenu(); void signOut({ redirectUrl: "/" }); }}>Sign out</button>
              </>
            ) : (
              <>
                <a className="lps-auth-link" href="/sign-in" onClick={closeMenu}>Sign in</a>
                <a className="lps-button lps-button-small lps-button-outline" href="/sign-up" onClick={closeMenu}>Create account</a>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="lps-footer">
      <div className="lps-shell lps-footer-main">
        <a className="lps-brand" href="/" aria-label="Lash Pro Summit 2026 home">
          <span className="lps-brand-mark" aria-hidden="true">L<span>·</span>P</span>
          <span className="lps-brand-name">Lash Pro <span>Summit</span></span>
        </a>
        <p>A virtual global masterclass<br />for lash professionals.</p>
        <div className="lps-footer-links">
          <a href="/">Home</a><a href="/agenda">Agenda</a><a href="/registration">Registration</a>
        </div>
        <p className="lps-footer-note">Social links will be announced.</p>
      </div>
      <div className="lps-shell lps-footer-bottom">
        <span>© 2026 Lash Pro Summit</span>
        <span>Accessibility: We aim to meet WCAG 2.2 AA guidelines.</span>
        <span>Built for the details.</span>
      </div>
    </footer>
  );
}

function PageFrame({ children, activePath }: { children: ReactNode; activePath: string }) {
  return (
    <>
      <a className="lps-skip-link" href="#main">Skip to content</a>
      <SiteHeader activePath={activePath} />
      {children}
      <SiteFooter />
    </>
  );
}

function AgendaRows({ compact = false }: { compact?: boolean }) {
  const [openSession, setOpenSession] = useState<string | null>(null);
  const idPrefix = useId();
  return (
    <div className={`lps-agenda-list${compact ? " is-compact" : ""}`}>
      {agendaSessions.map((session) => {
        const isOpen = openSession === session.id;
        const detailId = `${idPrefix}-${session.id}`;
        return (
          <article className={`lps-agenda-item${isOpen ? " is-open" : ""}`} key={session.id}>
            <button
              className="lps-agenda-trigger"
              type="button"
              aria-expanded={isOpen}
              aria-controls={detailId}
              onClick={() => setOpenSession(isOpen ? null : session.id)}
            >
              <span className="lps-agenda-number">{session.number}</span>
              <span className="lps-agenda-label">
                <strong>{session.topic}</strong>
                <small>{session.time}</small>
              </span>
              <span className="lps-agenda-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="lps-agenda-detail" id={detailId}>
                <p><span>Speaker</span>{session.speaker}</p>
                <p><span>Session</span>{session.topic}</p>
                <p><span>Time</span>{session.time}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function HomePage() {
  const [remaining, setRemaining] = useState({ days: "—", hours: "—", minutes: "—", seconds: "—", live: false });
  const [speakerFilter, setSpeakerFilter] = useState("all");
  useEffect(() => {
    let expired = false;
    const updateCountdown = () => {
      if (expired) return;
      const distance = new Date("2026-12-01T14:00:00Z").getTime() - Date.now();
      if (distance <= 0) {
        expired = true;
        setRemaining({ days: "00", hours: "00", minutes: "00", seconds: "00", live: true });
        return;
      }
      const totalSeconds = Math.floor(distance / 1000);
      setRemaining({
        days: String(Math.floor(totalSeconds / 86400)).padStart(2, "0"),
        hours: String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0"),
        minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
        seconds: String(totalSeconds % 60).padStart(2, "0"),
        live: false,
      });
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <PageFrame activePath="/">
      <main id="main">
        <section className="lps-hero lps-shell" aria-labelledby="lps-hero-title">
          <div className="lps-hero-copy">
            <p className="lps-eyebrow"><span className="lps-eyebrow-line" />A virtual global masterclass</p>
            <h1 id="lps-hero-title">Lash Pro<br /><em>Summit</em> <span className="lps-hero-year">2026</span></h1>
            <p className="lps-hero-subtitle">Master artistry, science,<br className="lps-desktop-break" /> &amp; business strategy.</p>
            <p className="lps-hero-description">A gathering for the professionals shaping what comes next in lash artistry—where precision meets practice, and craft meets care.</p>
            <div className="lps-hero-actions">
              <a className="lps-button lps-button-primary" href="/registration">Claim your seat <span aria-hidden="true">↗</span></a>
              <a className="lps-text-link" href="/agenda">Explore the agenda <span aria-hidden="true">↓</span></a>
            </div>
            <div className="lps-event-meta">
              <span className="lps-meta-symbol" aria-hidden="true">✳</span>
              <span><strong>December 1, 2026</strong><small>9:00 AM EST · Live interactive stream</small></span>
            </div>
          </div>
          <div className="lps-hero-art" role="img" aria-label="Abstract lash-inspired line illustration">
            <div className="lps-art-orbit lps-orbit-one" />
            <div className="lps-art-orbit lps-orbit-two" />
            <div className="lps-art-disc"><span className="lps-disc-index">01 / 04</span><span className="lps-disc-label">Artistry<br />in focus</span></div>
            <div className="lps-lash-lines" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>
            <span className="lps-art-caption">The craft. The science.<br />The whole picture.</span>
            <span className="lps-art-cross" aria-hidden="true">+</span>
          </div>
          <div className="lps-hero-footnote"><span>01</span><span className="lps-footnote-rule" /><span>For the next generation of lash professionals</span></div>
        </section>

        <section className="lps-countdown-band" aria-labelledby="lps-countdown-title">
          <div className="lps-shell lps-countdown-inner">
            <div className="lps-countdown-intro"><p className="lps-eyebrow">The moment is approaching</p><h2 id="lps-countdown-title">Save the date.</h2></div>
            {remaining.live ? (
              <p className="lps-live-message" role="status">Event Live Now!</p>
            ) : (
              <>
                <div className="lps-countdown" aria-label="Time remaining until the summit">
                  <div className="lps-count-unit"><span className="lps-count-number">{remaining.days}</span><span className="lps-count-label">Days</span></div>
                  <span className="lps-count-separator" aria-hidden="true">:</span>
                  <div className="lps-count-unit"><span className="lps-count-number">{remaining.hours}</span><span className="lps-count-label">Hours</span></div>
                  <span className="lps-count-separator" aria-hidden="true">:</span>
                  <div className="lps-count-unit"><span className="lps-count-number">{remaining.minutes}</span><span className="lps-count-label">Minutes</span></div>
                  <span className="lps-count-separator" aria-hidden="true">:</span>
                  <div className="lps-count-unit"><span className="lps-count-number">{remaining.seconds}</span><span className="lps-count-label">Seconds</span></div>
                </div>
                <p className="lps-countdown-aside">December 1, 2026</p>
              </>
            )}
          </div>
        </section>

        <section className="lps-section lps-shell" id="speakers" aria-labelledby="lps-speakers-title">
          <div className="lps-section-heading">
            <div><p className="lps-eyebrow"><span className="lps-eyebrow-line" />The people behind the practice</p><h2 id="lps-speakers-title">Meet the <em>panel.</em></h2></div>
            <p className="lps-section-aside">Four disciplines.<br />One sharper point of view.</p>
          </div>
          <div className="lps-speaker-filters" role="group" aria-label="Filter speakers by specialty">
            {[
              { id: "all", label: "All" },
              { id: "artistry", label: "Artistry" },
              { id: "health", label: "Ocular Health" },
              { id: "chemistry", label: "Chemistry" },
              { id: "business", label: "Business" },
            ].map((filter) => (
              <button
                className={`lps-filter-button${speakerFilter === filter.id ? " is-active" : ""}`}
                type="button"
                key={filter.id}
                aria-pressed={speakerFilter === filter.id}
                onClick={() => setSpeakerFilter(filter.id)}
              >
                {filter.label}{filter.id === "all" && <span>04</span>}
              </button>
            ))}
          </div>
          <div className="lps-speaker-grid" aria-live="polite">
            {disciplines.filter((person) => speakerFilter === "all" || person.category === speakerFilter).map((person) => (
              <article className="lps-speaker-card" key={person.number}>
                <div className="lps-speaker-portrait" aria-hidden="true"><span className="lps-portrait-index">{person.number} / 04</span><span className="lps-speaker-initials">{person.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span></div>
                <div className="lps-speaker-card-body">
                  <span className="lps-speaker-category">{person.title}</span>
                  <h3>{person.name}</h3>
                  <p className="lps-speaker-role">{person.role}</p>
                  <p className="lps-speaker-bio">{person.description}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="lps-directory-note"><span aria-hidden="true">✳</span> Independent expertise, brought into the same room.</p>
        </section>

        <section className="lps-agenda-section" id="agenda" aria-labelledby="lps-agenda-title">
          <div className="lps-shell lps-agenda-layout">
            <div className="lps-agenda-intro">
              <p className="lps-eyebrow"><span className="lps-eyebrow-line" />One day, four perspectives</p>
              <h2 id="lps-agenda-title">The day,<br /><em>in focus.</em></h2>
              <p>Session timings and topics will be announced when confirmed. The programme will bring each discipline into conversation.</p>
              <span className="lps-agenda-stamp" aria-hidden="true">LPS<br /><b>26</b></span>
            </div>
            <AgendaRows compact />
          </div>
        </section>

        <section className="lps-about-section lps-shell" id="about" aria-labelledby="lps-about-title">
          <div className="lps-about-index"><span>01</span><span className="lps-index-rule" /><span>Our point of view</span></div>
          <div className="lps-about-content">
            <p className="lps-eyebrow">Better work begins with a wider lens</p>
            <h2 id="lps-about-title">A beautiful result<br />starts <em>before the first lash.</em></h2>
            <p className="lps-about-body">The best work is never one-dimensional. Lash Pro Summit is a virtual global masterclass bringing artistry, ocular health, chemistry, and business strategy together—because the strongest practice makes room for all four.</p>
            <div className="lps-about-pillars" aria-label="Summit focus areas">
              {disciplines.map((discipline) => <span key={discipline.number}>{discipline.number} <b>{discipline.title}</b></span>)}
            </div>
          </div>
          <div className="lps-about-mark" aria-hidden="true"><span>L</span><span>P</span><i /></div>
        </section>

        <section className="lps-closing-cta">
          <div className="lps-shell lps-closing-inner">
            <p className="lps-eyebrow">December 1, 2026 · Virtual global masterclass</p>
            <h2>Make space for<br /><em>what's next.</em></h2>
            <a className="lps-button lps-button-primary" href="/registration">Claim your seat <span aria-hidden="true">↗</span></a>
          </div>
          <span className="lps-closing-outline" aria-hidden="true">LPS</span>
        </section>
      </main>
    </PageFrame>
  );
}

export function DashboardPage() {
  const { user, isLoaded } = useUser();
  const firstName = user?.firstName?.trim();
  const greeting = isLoaded ? (firstName ? `Welcome back, ${firstName}.` : "Welcome back.") : "Your summit, at a glance.";

  return (
    <PageFrame activePath="/dashboard">
      <main className="lps-member-main" id="main">
        <div className="lps-shell">
          <div className="lps-member-kicker"><span className="lps-eyebrow-line" />Member dashboard <span className="lps-member-kicker-index">01 / 03</span></div>
          <section className="lps-dashboard-hero" aria-labelledby="dashboard-title">
            <div>
              <p className="lps-eyebrow">Lash Pro Summit · December 1, 2026</p>
              <h1 id="dashboard-title">{greeting}</h1>
              <p className="lps-dashboard-lede">Your place to prepare for a day of artistry, ocular health, chemistry, and business strategy.</p>
            </div>
            <div className="lps-dashboard-emblem" aria-hidden="true"><span>01</span><b>LPS</b><span>2026</span></div>
          </section>
          <div className="lps-dashboard-grid">
            <section className="lps-dashboard-feature">
              <div className="lps-feature-topline"><span>Your event</span><span className="lps-status-dot" />Virtual</div>
              <p className="lps-feature-date">01 <span>DEC</span></p>
              <h2>One day.<br /><em>A wider lens.</em></h2>
              <p className="lps-feature-copy">A virtual global masterclass for lash professionals.</p>
              <a className="lps-button lps-button-primary" href="/registration">View your registration <span aria-hidden="true">↗</span></a>
            </section>
            <section className="lps-dashboard-agenda">
              <div className="lps-card-heading"><div><p className="lps-eyebrow">The programme</p><h2>In focus.</h2></div><a href="/agenda" className="lps-small-link">Full agenda <span aria-hidden="true">↗</span></a></div>
              <AgendaRows compact />
            </section>
          </div>
          <section className="lps-dashboard-disciplines" aria-labelledby="dashboard-disciplines-title">
            <div className="lps-discipline-heading"><p className="lps-eyebrow">Four disciplines, one practice</p><h2 id="dashboard-disciplines-title">What brings us <em>together.</em></h2></div>
            <div className="lps-discipline-list">{disciplines.map((item) => <div className="lps-discipline-row" key={item.number}><span>{item.number}</span><strong>{item.title}</strong><span className="lps-discipline-rule" /><span>{item.name}</span></div>)}</div>
          </section>
          <div className="lps-dashboard-bottom">
            <p>Session timings and topics will be announced when confirmed.</p>
            <a href="/agenda" className="lps-text-link">See the current agenda <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </main>
    </PageFrame>
  );
}

export function AgendaPage() {
  return (
    <PageFrame activePath="/agenda">
      <main id="main" className="lps-agenda-page">
        <div className="lps-shell">
          <div className="lps-member-kicker"><span className="lps-eyebrow-line" />The programme <span className="lps-member-kicker-index">01 / 04</span></div>
          <section className="lps-agenda-page-heading" aria-labelledby="agenda-page-title">
            <div>
              <p className="lps-eyebrow">One day, four perspectives</p>
              <h1 id="agenda-page-title">The day,<br /><em>in focus.</em></h1>
            </div>
            <div className="lps-agenda-page-note">
              <span className="lps-agenda-page-date">December 1, 2026</span>
              <p>Session timings and topics will be announced when confirmed. The programme will bring each discipline into conversation.</p>
            </div>
          </section>
          <section className="lps-programme" aria-label="Summit schedule">
            <div className="lps-programme-label"><span>Programme</span><span>All details pending confirmation</span></div>
            <AgendaRows />
            <p className="lps-programme-footnote"><span className="lps-footnote-rule" />Times, topics, and speaker assignments are to be announced.</p>
          </section>
          <section className="lps-agenda-bottom">
            <div><p className="lps-eyebrow">A virtual global masterclass</p><h2>Make space for<br /><em>the whole picture.</em></h2></div>
            <a className="lps-button lps-button-primary" href="/registration">Go to registration <span aria-hidden="true">↗</span></a>
          </section>
        </div>
      </main>
    </PageFrame>
  );
}

type Registration = {
  id: string;
  eventSlug: string;
  createdAt: string;
};

type RegistrationResponse = {
  registration: Registration | null;
};

export function RegistrationPage() {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [retryIndex, setRetryIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");
    fetch("/api/registrations/me", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 401 ? "Sign in to check your registration status." : "We couldn't load your registration status. Please try again.");
        return response.json() as Promise<RegistrationResponse>;
      })
      .then((data) => setRegistration(data.registration))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(error instanceof Error ? error.message : "We couldn't load your registration status. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retryIndex]);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || registration) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ eventSlug: summitSlug }),
      });
      if (!response.ok) {
        throw new Error(response.status === 401 ? "Your session may have expired. Sign in again, then retry." : "We couldn't complete your RSVP. Please try again.");
      }
      const data = (await response.json()) as RegistrationResponse;
      if (!data.registration) throw new Error("We couldn't confirm your RSVP. Please try again.");
      setRegistration(data.registration);
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't complete your RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageFrame activePath="/registration">
      <main className="lps-registration-page" id="main">
        <div className="lps-shell">
          <div className="lps-member-kicker"><span className="lps-eyebrow-line" />Your place at the summit <span className="lps-member-kicker-index">01 / 02</span></div>
          <div className="lps-registration-layout">
            <section className="lps-registration-intro" aria-labelledby="registration-title">
              <p className="lps-eyebrow">December 1, 2026 · Virtual global masterclass</p>
              <h1 id="registration-title">Claim your<br /><em>seat.</em></h1>
              <p className="lps-registration-description">A gathering for the professionals shaping what comes next in lash artistry—where precision meets practice, and craft meets care.</p>
              <div className="lps-registration-meta">
                <span className="lps-meta-symbol" aria-hidden="true">✳</span>
                <span><strong>December 1, 2026</strong><small>9:00 AM EST · Live interactive stream</small></span>
              </div>
              <a className="lps-text-link" href="/agenda">Review the agenda <span aria-hidden="true">↗</span></a>
            </section>
            <section className="lps-rsvp-panel" aria-label="Event RSVP">
              <div className="lps-rsvp-panel-top"><span className="lps-brand-mark" aria-hidden="true">L<span>·</span>P</span><span>Lash Pro Summit 2026</span></div>
              {loading ? (
                <div className="lps-rsvp-state" role="status" aria-live="polite">
                  <div className="lps-skeleton-line" /><div className="lps-skeleton-line is-short" /><div className="lps-skeleton-block" />
                  <span className="lps-sr-only">Checking your registration status…</span>
                </div>
              ) : loadError ? (
                <div className="lps-rsvp-state" role="alert">
                  <p className="lps-eyebrow">Status unavailable</p><h2>Let's try that again.</h2>
                  <p className="lps-rsvp-copy">{loadError}</p>
                  <button className="lps-button lps-button-outline" type="button" onClick={() => setRetryIndex((value) => value + 1)}>Retry status check</button>
                  {loadError.includes("Sign in") && <a className="lps-small-link lps-inline-auth-link" href="/sign-in">Sign in <span aria-hidden="true">↗</span></a>}
                </div>
              ) : registration ? (
                <div className="lps-rsvp-state" role="status" aria-live="polite">
                  <span className="lps-confirmation-mark" aria-hidden="true">✓</span>
                  <p className="lps-eyebrow">Registration confirmed</p><h2>You're on the list.</h2>
                  <p className="lps-rsvp-copy">Your place at Lash Pro Summit 2026 is registered. We look forward to having you with us.</p>
                  <div className="lps-confirmation-detail"><span>Event</span><strong>Lash Pro Summit 2026</strong></div>
                  <div className="lps-confirmation-detail"><span>Date</span><strong>December 1, 2026</strong></div>
                  <a className="lps-button lps-button-outline" href="/dashboard">Return to dashboard <span aria-hidden="true">↗</span></a>
                </div>
              ) : (
                <div className="lps-rsvp-state">
                  <p className="lps-eyebrow">Your next chapter starts here</p>
                  <h2>Be part of<br /><em>the conversation.</em></h2>
                  <p className="lps-rsvp-copy">Reserve your place at a virtual global masterclass for lash professionals.</p>
                  <div className="lps-confirmation-detail"><span>When</span><strong>December 1, 2026</strong></div>
                  <div className="lps-confirmation-detail"><span>Format</span><strong>Virtual · Live interactive stream</strong></div>
                  <form onSubmit={handleRegister}>
                    {submitError && <p className="lps-form-error" role="alert">{submitError}</p>}
                    <button className="lps-button lps-button-primary lps-rsvp-submit" type="submit" disabled={submitting}>
                      {submitting ? "Submitting your RSVP…" : "Complete registration"} <span aria-hidden="true">{submitting ? "…" : "↗"}</span>
                    </button>
                  </form>
                  <p className="lps-rsvp-note">Your RSVP is confirmed only after successful submission.</p>
                </div>
              )}
            </section>
          </div>
          <div className="lps-registration-footnote"><span>01</span><span className="lps-footnote-rule" /><span>For the next generation of lash professionals</span></div>
        </div>
      </main>
    </PageFrame>
  );
}
