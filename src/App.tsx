import { useEffect, useMemo, useRef, useState } from "react";
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
  orientation?: "landscape" | "portrait";
  previewAutoPlay?: boolean;
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

type CampaignMediaTab = "videos" | "reels";

type ExternalCampaignEmbed = {
  id: string;
  title: string;
  context: string;
  category: string;
  src: string;
  orientation?: "landscape" | "portrait";
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
      "Built the Jonathan Huston Facebook audience into one of the strongest followings in the WA Liberal parliamentary team.",
  },
];

const campaignRoles: CampaignRole[] = [
  {
    role: "Electorate Officer & Media Producer",
    context: "Jonathan Huston",
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

const campaignVideoItems: MediaItem[] = [
  {
    id: "jono-door-knocking-recap",
    type: "video",
    src: "/media/campaign-videos/jono-door-knocking-recap.mp4",
    poster: "/media/campaign-videos/jono-door-knocking-recap-poster.jpg",
    title: "Door Knocking Recap",
    category: "Jonathan Huston",
    year: "2025",
    orientation: "landscape",
  },
  {
    id: "jono-bowling-club",
    type: "video",
    src: "/media/campaign-videos/jono-bowling-club.mp4",
    poster: "/media/campaign-videos/jono-bowling-club-poster.jpg",
    title: "Dalkeith Nedlands Bowling Club",
    category: "Community Issue",
    year: "2025",
    orientation: "landscape",
  },
  {
    id: "jono-traffic",
    type: "video",
    src: "/media/campaign-videos/jono-traffic.mp4",
    poster: "/media/campaign-videos/jono-traffic-poster.jpg",
    title: "Thomas Street Traffic",
    category: "Local Issue",
    year: "2025",
    orientation: "landscape",
  },
  {
    id: "jono-high-rise",
    type: "video",
    src: "/media/campaign-videos/jono-high-rise.mp4",
    poster: "/media/campaign-videos/jono-high-rise-poster.jpg",
    title: "High-Rise Planning",
    category: "Planning Issue",
    year: "2025",
    orientation: "portrait",
  },
  {
    id: "jono-iga-door-knocking",
    type: "video",
    src: "/media/campaign-videos/jono-iga-door-knocking.mp4",
    poster: "/media/campaign-videos/jono-iga-door-knocking-poster.jpg",
    title: "IGA Door Knocking Ad",
    category: "Field Campaign",
    year: "2024",
    orientation: "landscape",
  },
  {
    id: "jono-hospital-services",
    type: "video",
    src: "/media/campaign-videos/jono-hospital-services.mp4",
    poster: "/media/campaign-videos/jono-hospital-services-poster.jpg",
    title: "Hospital Services",
    category: "Health Services",
    year: "2024",
    orientation: "portrait",
  },
];

const externalCampaignEmbeds: ExternalCampaignEmbed[] = [
  {
    id: "liam-trish-vince-broll",
    title: "Liam, Trish & Vince B-roll",
    context: "Federal / Candidate Video",
    category: "Liam, Trish & Vince",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRUul58E3usQLbSR6B8gEy1AZm8L9BobVHzsEMbX4Gcjms?width=1920&height=1080",
  },
  {
    id: "jonathan-huston-door-knocking",
    title: "Jonathan Huston Door Knocking",
    context: "State Campaign Video",
    category: "Jonathan Huston",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSiaTAmA04yR5iYTG0ZkaQkAZQv5V7RTDSoiG8PPGHjABk?width=3840&height=2160",
  },
  {
    id: "hayley-edwards-presser",
    title: "Hayley Edwards Presser",
    context: "State Campaign Video",
    category: "Hayley Edwards + Libby Mettam",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQQ926QY6NjQYdaPgW-YG5jAT4wxJVaIwO3xIZQTXhEJYQ?width=1920&height=1080",
  },
  {
    id: "sean-ayres-field-work",
    title: "Sean Ayres Campaign Field Work",
    context: "Federal Campaign Photography",
    category: "Sean Ayres for Burt",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQTRlGg3NdGxRZGbuZp7qciNAdlEKJgJy0DCtO2I9GVzq6w?width=5933&height=3955",
  },
  {
    id: "nitin-vashisht-local-club",
    title: "Nitin Vashisht Local Club Piece",
    context: "Candidate Campaign Video",
    category: "Nitin Vashisht",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQSYxP_w-dBQqj4sRDlHHuHAWxK8bGaz_eRiBjDeGx8Dhk?width=3840&height=2160",
  },
  {
    id: "sandra-brewer-coverage",
    title: "Sandra Brewer Campaign Coverage",
    context: "State Campaign Photography",
    category: "Sandra Brewer",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQTlRO_MKOFtSbLqUpcXPTBZAe7KmqVql53oCXWknrVIh6Q?width=2773&height=4160",
    orientation: "portrait",
  },
];

const portfolioMediaItems: MediaItem[] = [
  {
    id: "campaign-video",
    type: "video",
    src: "/media/amalfi-media-strategy.mp4",
    poster: "/media/amalfi-media-strategy-poster.jpg",
    title: "Media Strategy Reel",
    category: "Video",
    year: "2025",
    featured: true,
    orientation: "landscape",
    previewAutoPlay: true,
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

const mediaItems = [...campaignVideoItems, ...portfolioMediaItems];

function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [campaignMediaTab, setCampaignMediaTab] =
    useState<CampaignMediaTab>("videos");

  const featuredItems = useMemo(
    () => portfolioMediaItems.filter((item) => item.featured),
    [],
  );
  const archiveItems = useMemo(
    () => portfolioMediaItems.filter((item) => !item.featured),
    [],
  );
  const campaignVideos = useMemo(
    () =>
      campaignVideoItems.filter((item) => item.orientation !== "portrait"),
    [],
  );
  const campaignReels = useMemo(
    () => campaignVideoItems.filter((item) => item.orientation === "portrait"),
    [],
  );
  const activeCampaignMedia = useMemo(
    () => (campaignMediaTab === "videos" ? campaignVideos : campaignReels),
    [campaignMediaTab, campaignReels, campaignVideos],
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
          <a href="#campaign-media" onClick={() => setMenuOpen(false)}>
            Videos
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

        <section
          className="campaign-video-section"
          id="campaign-media"
          aria-labelledby="campaign-media-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Jonathan Huston</p>
            <h2 id="campaign-media-title">
              Local issue videos and reels built for voters' feeds.
            </h2>
          </div>

          <div className="media-tabs" role="tablist" aria-label="Campaign media">
            <button
              className={
                campaignMediaTab === "videos"
                  ? "media-tab is-active"
                  : "media-tab"
              }
              type="button"
              role="tab"
              aria-selected={campaignMediaTab === "videos"}
              aria-controls="campaign-media-panel"
              onClick={() => setCampaignMediaTab("videos")}
            >
              <span>Videos</span>
              <small>{campaignVideos.length} widescreen edits</small>
            </button>
            <button
              className={
                campaignMediaTab === "reels"
                  ? "media-tab is-active"
                  : "media-tab"
              }
              type="button"
              role="tab"
              aria-selected={campaignMediaTab === "reels"}
              aria-controls="campaign-media-panel"
              onClick={() => setCampaignMediaTab("reels")}
            >
              <span>Reels</span>
              <small>{campaignReels.length} vertical cuts</small>
            </button>
          </div>

          <div
            className={
              campaignMediaTab === "reels"
                ? "campaign-video-grid is-reels"
                : "campaign-video-grid is-videos"
            }
            id="campaign-media-panel"
            role="tabpanel"
          >
            {activeCampaignMedia.map((item) => (
              <MediaCard key={item.id} item={item} onOpen={openItem} />
            ))}
          </div>

          <div
            className="external-campaign-block"
            aria-labelledby="external-campaign-title"
          >
            <div className="subsection-heading">
              <p className="eyebrow">Archive Samples</p>
              <h3 id="external-campaign-title">
                Selected state and federal pieces from the wider campaign archive.
              </h3>
            </div>

            <div className="external-campaign-grid">
              {externalCampaignEmbeds.map((item) => (
                <ExternalCampaignCard key={item.id} item={item} />
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
  const cardClassName = [
    "media-card",
    compact ? "compact" : "",
    item.orientation ? `is-${item.orientation}` : "",
    item.previewAutoPlay ? "is-autoplay" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const buttonClassName = [
    "media-button",
    item.orientation ? item.orientation : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <button
        className={buttonClassName}
        type="button"
        aria-label={`Open ${item.title}`}
        onClick={() => onOpen(item)}
      >
        {item.type === "image" ? (
          <img src={item.src} alt="" loading="lazy" />
        ) : item.previewAutoPlay ? (
          <>
            <AutoPlayVideo item={item} />
            <span className="play-indicator" aria-hidden="true">
              <Play size={18} fill="currentColor" />
            </span>
          </>
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

function AutoPlayVideo({ item }: { item: MediaItem }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, []);

  return (
    <video
      ref={videoRef}
      src={item.src}
      poster={item.poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      onCanPlay={(event) => {
        event.currentTarget.defaultMuted = true;
        event.currentTarget.muted = true;
        void event.currentTarget.play().catch(() => undefined);
      }}
    />
  );
}

function ExternalCampaignCard({ item }: { item: ExternalCampaignEmbed }) {
  const frameClassName = [
    "external-campaign-frame",
    item.orientation === "portrait" ? "is-portrait" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="external-campaign-card">
      <div className={frameClassName}>
        <iframe
          src={item.src}
          title={item.title}
          loading="lazy"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      </div>

      <div className="external-campaign-meta">
        <div>
          <h3>{item.title}</h3>
          <p>{item.context}</p>
        </div>
        <a
          href={item.src}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${item.title} in OneDrive`}
        >
          <ExternalLink size={18} aria-hidden="true" />
        </a>
      </div>
      <span>{item.category}</span>
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
