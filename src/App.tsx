import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Mail,
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

const profile = {
  name: "Studio Portfolio",
  tagline: "Photo, video, and visual direction for refined digital stories.",
  intro:
    "A flexible one-page portfolio built for polished stills, moving image, and concise project notes. Swap in your own photos and reels when you are ready.",
  location: "Perth / Available remotely",
  email: "hello@example.com",
};

const mediaItems: MediaItem[] = [
  {
    id: "quiet-room",
    type: "image",
    src: "/media/editorial-01.jpg",
    title: "Quiet Room Study",
    category: "Photography",
    year: "2026",
    featured: true,
  },
  {
    id: "studio-motion",
    type: "video",
    src: "/media/motion-01.mp4",
    poster: "/media/video-poster-01.jpg",
    title: "Studio Motion Reel",
    category: "Video",
    year: "2026",
    featured: true,
  },
  {
    id: "sunlit-form",
    type: "image",
    src: "/media/editorial-02.jpg",
    title: "Sunlit Form",
    category: "Creative Direction",
    year: "2025",
    featured: true,
  },
  {
    id: "soft-architecture",
    type: "image",
    src: "/media/editorial-03.jpg",
    title: "Soft Architecture",
    category: "Photography",
    year: "2025",
    featured: true,
  },
  {
    id: "frame-sequence",
    type: "video",
    src: "/media/motion-02.mp4",
    poster: "/media/video-poster-02.jpg",
    title: "Frame Sequence",
    category: "Video",
    year: "2024",
  },
  {
    id: "paper-light",
    type: "image",
    src: "/media/editorial-04.jpg",
    title: "Paper & Light",
    category: "Set Design",
    year: "2024",
  },
  {
    id: "archive-note",
    type: "image",
    src: "/media/editorial-05.jpg",
    title: "Archive Note",
    category: "Photography",
    year: "2023",
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
          {profile.name}
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
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href={`mailto:${profile.email}`} onClick={() => setMenuOpen(false)}>
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
          </div>

          <a className="hero-link" href="#work">
            View selected work
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </section>

        <section className="featured-band" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p className="eyebrow">Selected Work</p>
            <h2 id="work-title">Editorial grid for stills and motion.</h2>
          </div>

          <div className="featured-grid">
            {featuredItems.map((item) => (
              <MediaCard key={item.id} item={item} onOpen={openItem} />
            ))}
          </div>
        </section>

        <section className="archive-section" aria-labelledby="archive-title">
          <div className="section-heading compact">
            <p className="eyebrow">Archive</p>
            <h2 id="archive-title">Smaller studies and recent experiments.</h2>
          </div>

          <div className="archive-grid">
            {archiveItems.map((item) => (
              <MediaCard key={item.id} item={item} onOpen={openItem} compact />
            ))}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">About</p>
            <h2 id="about-title">Built to feel calm, polished, and easy to edit.</h2>
          </div>

          <div className="about-copy">
            <p>
              This first pass is designed as a clean portfolio shell: strong
              type, quiet borders, square media, and a lightbox that works for
              both photos and videos.
            </p>
            <p>
              Replace the placeholder files in <code>public/media</code>, then
              update the media list in <code>src/App.tsx</code> with your real
              titles, categories, years, and video posters.
            </p>
            <a className="contact-link" href={`mailto:${profile.email}`}>
              <Mail size={18} aria-hidden="true" />
              {profile.email}
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>{profile.name}</span>
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
