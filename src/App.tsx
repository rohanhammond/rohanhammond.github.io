import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Menu,
  Play,
  X,
} from "lucide-react";

type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  category: string;
  year?: string;
  featured?: boolean;
};

type CampaignStat = {
  value: string;
  label: string;
  detail: string;
};

type CampaignRole = {
  role: string;
  context: string;
  period: string;
  points: string[];
};

const profile = {
  name: "Rohan Hammond",
  brand: "Amalfi Media",
  tagline: "Campaign media for Liberal teams that need speed, reach, and discipline.",
  intro:
    "Perth-based media producer working across WA Liberal state campaigns, federal campaign events, parliamentary offices, and community storytelling through fast-turnaround video, photography, press materials, and paid/social strategy.",
  location: "Perth / Liberal Campaigns / Photo / Video / Strategy",
  contactLabel: "amalfi.media",
  contactHref: "https://amalfi.media",
};

const services = [
  "Rapid reels and same-day campaign edits",
  "Candidate photography and event coverage",
  "Press releases, statements, and talking points",
  "Paid Meta creative and social strategy",
];

const campaignStats: CampaignStat[] = [
  {
    value: "25",
    label: "WA Liberal state campaigns supported",
    detail:
      "Contracted across the 2025 state election, contributing media and communications in varying capacities to every seat won by the WA Liberals.",
  },
  {
    value: "4",
    label: "Metropolitan Liberal federal campaigns",
    detail:
      "Supported the 2025 federal campaign cycle and photographed Hon. Peter Dutton MP across multiple campaign events.",
  },
  {
    value: "Millions",
    label: "Organic short-form video views",
    detail:
      "Produced reels and social-first video across Instagram, TikTok, and Facebook for campaign and parliamentary audiences.",
  },
  {
    value: "7,000+",
    label: "Facebook following grown from zero",
    detail:
      "Built the Jonathan Huston MLA Facebook audience into one of the strongest followings in the WA Liberal parliamentary team.",
  },
];

const campaignRoles: CampaignRole[] = [
  {
    role: "Electorate Officer & Media Producer",
    context: "Office of Jonathan Huston MLA",
    period: "Sep 2025 - Present",
    points: [
      "Leads full-stack media operations: filming, photography, editing, creative direction, and social-first content strategy.",
      "Runs paid advertising across Meta, newspaper, and YouTube while supporting electorate work, stakeholder liaison, and media enquiries.",
    ],
  },
  {
    role: "Media Producer to the Leader of the WA Liberals",
    context: "Hon. Libby Mettam MLA / 2025 WA State Election",
    period: "Jan 2025 - Mar 2025",
    points: [
      "Embedded in the Leader's office during the state campaign, delivering rapid reels, highlight videos, press conference coverage, and community event content.",
      "Researched news cycles, voter concerns, and public sector reports to shape content that could move quickly and land clearly.",
    ],
  },
  {
    role: "Founder & Director",
    context: "Amalfi Media",
    period: "Nov 2024 - Present",
    points: [
      "Built a Perth media agency specialising in political leaders, eCommerce founders, personal brands, and high-trust public-facing content.",
      "Supported 25 Liberal state campaigns and four metropolitan federal campaigns through production, campaign content, and communications support.",
    ],
  },
];

const mediaItems: MediaItem[] = [
  {
    id: "campaign-video",
    type: "video",
    src: "/media/amalfi-media-strategy.mp4",
    poster: "/media/amalfi-media-strategy-poster.jpg",
    title: "Media Strategy Reel",
    category: "Video",
    year: "2025",
    featured: true,
  },
  {
    id: "corporate-event",
    type: "image",
    src: "/media/amalfi-event-hall.jpg",
    title: "Corporate Event Coverage",
    category: "Photography",
    year: "2025",
    featured: true,
  },
  {
    id: "public-speaking",
    type: "image",
    src: "/media/amalfi-speaking.jpg",
    title: "Speaker & Workshop Coverage",
    category: "Event Story",
    year: "2025",
    featured: true,
  },
  {
    id: "west-co",
    type: "video",
    src: "/media/amalfi-west-co.mp4",
    poster: "/media/amalfi-west-co-poster.jpg",
    title: "West Co The Label",
    category: "Brand Video",
    year: "2025",
    featured: true,
  },
  {
    id: "interview",
    type: "image",
    src: "/media/amalfi-interview.jpg",
    title: "Interview-Led Storytelling",
    category: "Campaign",
    year: "2025",
  },
  {
    id: "community",
    type: "image",
    src: "/media/amalfi-community.jpg",
    title: "Community Initiative",
    category: "Photography",
    year: "2025",
  },
  {
    id: "food-detail",
    type: "image",
    src: "/media/amalfi-food-detail.jpg",
    title: "Event Detail Study",
    category: "Photography",
    year: "2025",
  },
  {
    id: "portrait",
    type: "image",
    src: "/media/amalfi-portrait.jpg",
    title: "Portrait Session",
    category: "Portrait",
    year: "2025",
  },
];

function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const featuredItems = useMemo(
    () => mediaItems.filter((item) => item.featured),
    [],
  );
  const archiveItems = useMemo(
    () => mediaItems.filter((item) => !item.featured),
    [],
  );

  const activeItem = activeIndex === null ? null : mediaItems[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % mediaItems.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? current
            : (current - 1 + mediaItems.length) % mediaItems.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("is-locked");

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("is-locked");
    };
  }, [activeIndex]);

  const openItem = (item: MediaItem) => {
    setActiveIndex(mediaItems.findIndex((media) => media.id === item.id));
  };

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === null
        ? current
        : (current - 1 + mediaItems.length) % mediaItems.length,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % mediaItems.length,
    );
  };

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Go to top">
          <span>{profile.name}</span>
          <small>{profile.brand}</small>
        </a>

        <button
          className="icon-button nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            Work
          </a>
          <a href="#campaigns" onClick={() => setMenuOpen(false)}>
            Campaigns
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Capabilities
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a
            href={profile.contactHref}
            rel="noreferrer"
            target="_blank"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{profile.location}</p>
            <h1 id="hero-title">{profile.tagline}</h1>
            <p>{profile.intro}</p>

            <div className="hero-actions">
              <a className="hero-link" href="#campaigns">
                View campaign experience
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href="#work">
                See the media
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="hero-visual" aria-label="About image">
            <img src="/media/amalfi-founder.jpg" alt="" />
            <div className="hero-note">
              <span>Founder / Political Media Producer</span>
              <strong>Campaign judgement behind the camera, not just the shot.</strong>
            </div>
          </aside>
        </section>

        <section className="proof-strip" aria-labelledby="proof-title">
          <p className="eyebrow" id="proof-title">
            Political Proof
          </p>
          <div className="proof-grid">
            {campaignStats.map((stat) => (
              <article className="proof-item" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <p>{stat.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="campaign-section"
          id="campaigns"
          aria-labelledby="campaigns-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Liberal Campaign Experience</p>
            <h2 id="campaigns-title">
              Built for leader-level pressure, electorate work, and campaign field days.
            </h2>
          </div>

          <div className="campaign-layout">
            <div className="campaign-summary">
              <p>
                Rohan has worked inside the tempo of Liberal campaigns and
                parliamentary offices: fast news cycles, candidate travel, local
                issues, press conferences, paid placements, volunteer energy,
                and the practical need to turn content around while the moment
                is still useful.
              </p>
              <p>
                The value is not just that he can film and edit. It is that he
                can identify the story, understand the political risk, draft the
                surrounding comms, and package the content for the platform,
                audience, and campaign objective.
              </p>
            </div>

            <div className="role-list">
              {campaignRoles.map((role) => (
                <article className="role-item" key={role.role}>
                  <div className="role-kicker">{role.period}</div>
                  <h3>{role.role}</h3>
                  <p>{role.context}</p>
                  <ul>
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-band" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p className="eyebrow">Visual Proof</p>
            <h2 id="work-title">Campaign, event, and community visuals.</h2>
          </div>

          <div className="featured-grid">
            {featuredItems.map((item) => (
              <MediaCard key={item.id} item={item} onOpen={openItem} />
            ))}
          </div>
        </section>

        <section
          className="services-section"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="section-heading compact">
            <p className="eyebrow">Capabilities</p>
            <h2 id="services-title">Media that can brief, shoot, edit, write, and land.</h2>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <div className="service-item" key={service}>
                {service}
              </div>
            ))}
          </div>
        </section>

        <section className="archive-section" aria-labelledby="archive-title">
          <div className="section-heading compact">
            <p className="eyebrow">More Work</p>
            <h2 id="archive-title">Field days, community rooms, and campaign detail.</h2>
          </div>

          <div className="archive-grid">
            {archiveItems.map((item) => (
              <MediaCard key={item.id} item={item} onOpen={openItem} compact />
            ))}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <figure className="about-portrait">
            <img src="/media/amalfi-founder.jpg" alt="" />
            <figcaption>Perth-based political media, content creation, and strategy.</figcaption>
          </figure>

          <div>
            <p className="eyebrow">About</p>
            <h2 id="about-title">A compact creative studio with real campaign instincts.</h2>
            <div className="about-copy">
              <p>
                Amalfi Media exists because campaign teams need someone who
                understands both the political stakes and the production
                pipeline. Rohan can read the news cycle, find the usable story,
                film it, edit it, write around it, and ship it while the moment
                still matters.
              </p>
              <p>
                His work has covered leader's office campaigning, electorate
                office media, paid advertising, community events, press
                conferences, parliamentary statements, and high-volume social
                content for Liberal candidates and MPs across state and federal
                contests.
              </p>
              <a
                className="contact-link"
                href={profile.contactHref}
                rel="noreferrer"
                target="_blank"
              >
                {profile.contactLabel}
                <ExternalLink size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>{profile.name} / {profile.brand}</span>
        <span>Portfolio / 2026</span>
      </footer>

      {activeItem && (
        <Lightbox
          item={activeItem}
          onClose={() => setActiveIndex(null)}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </>
  );
}

type MediaCardProps = {
  item: MediaItem;
  compact?: boolean;
  onOpen: (item: MediaItem) => void;
};

function MediaCard({ item, compact = false, onOpen }: MediaCardProps) {
  return (
    <article className={compact ? "media-card compact" : "media-card"}>
      <button
        className="media-button"
        type="button"
        aria-label={`Open ${item.title}`}
        onClick={() => onOpen(item)}
      >
        {item.type === "image" ? (
          <img src={item.src} alt="" loading="lazy" />
        ) : (
          <>
            <img src={item.poster} alt="" loading="lazy" />
            <span className="play-indicator" aria-hidden="true">
              <Play size={18} fill="currentColor" />
            </span>
          </>
        )}
      </button>

      <div className="media-meta">
        <div>
          <h3>{item.title}</h3>
          <p>{item.category}</p>
        </div>
        {item.year && <span>{item.year}</span>}
      </div>
    </article>
  );
}

type LightboxProps = {
  item: MediaItem;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function Lightbox({ item, onClose, onPrevious, onNext }: LightboxProps) {
  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} preview`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="lightbox-toolbar">
        <button
          className="icon-button"
          type="button"
          aria-label="Previous media"
          onClick={onPrevious}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="Next media"
          onClick={onNext}
        >
          <ChevronRight size={20} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="Close preview"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <figure className="lightbox-panel">
        <div className="lightbox-media">
          {item.type === "image" ? (
            <img src={item.src} alt={item.title} />
          ) : (
            <video
              key={item.id}
              src={item.src}
              poster={item.poster}
              controls
              playsInline
              autoPlay
            />
          )}
        </div>
        <figcaption>
          <span>{item.category}</span>
          <strong>{item.title}</strong>
          {item.year && <span>{item.year}</span>}
        </figcaption>
      </figure>
    </div>
  );
}

export default App;
