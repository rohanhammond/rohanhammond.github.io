import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
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

type CampaignMediaTab = "all" | "videos" | "reels" | "photos";

type ExternalCampaignEmbed = {
  id: string;
  title: string;
  context: string;
  category: string;
  src: string;
  orientation?: "landscape" | "portrait" | "square";
};

type ArchiveMediaItem = ExternalCampaignEmbed & {
  kind?: "embed" | "video" | "photo";
  poster?: string;
};

type ArchiveCandidate = {
  id: string;
  section: "state" | "federal";
  name: string;
  seat: string;
  eyebrow: string;
  summary: string;
  media: ArchiveMediaItem[];
};

type CampaignMediaCollection = {
  candidate: ArchiveCandidate;
  items: ArchiveMediaItem[];
  preview: ArchiveMediaItem;
};

type ArchiveRoute = {
  section: "state" | "federal";
  candidateId: string;
} | null;

type ExternalMediaFrameStyle = CSSProperties & {
  "--media-aspect"?: string;
};

const PHOTO_PREVIEW_MAX_SIZE = 1800;

const profile = {
  name: "Rohan Hammond",
  brand: "Digital Campaign Media",
  tagline: "Rohan Hammond.",
  intro:
    "I advise, film, and photograph Liberal candidates and elected members so their digital presence feels clear, current, and real.",
  location: "Perth / Liberal Digital Media",
  contactLabel: "rohan@amalfi.media",
  contactHref: "mailto:rohan@amalfi.media",
};

const contactDetails = {
  email: "rohan@amalfi.media",
  address: "2 Park Road, Crawley",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=2%20Park%20Road%20Crawley%20WA",
};

const services = [
  "Digital advice",
  "Filming",
  "Photography",
  "Editing",
];

const oneDriveClientExportUrl = (folder: string, file: string) => {
  const parent = `/personal/9d9f7c4362637c48/Documents/Client Exports/${folder}`;
  const params = new URLSearchParams({
    id: `${parent}/${file}`,
    parent,
  });

  return `https://onedrive.live.com/?${params.toString()}`;
};

const campaignStats: CampaignStat[] = [
  {
    value: "25",
    label: "state campaigns",
    detail: "Video and photo support across local campaigns.",
  },
  {
    value: "4",
    label: "federal campaigns",
    detail: "Candidate videos, field days, and leader visits.",
  },
  {
    value: "Office",
    label: "elected-member media",
    detail: "Reels, photos, local updates, and day-to-day presence.",
  },
  {
    value: "Perth",
    label: "home base",
    detail: "Working with Liberal candidates and elected members.",
  },
];

const campaignRoles: CampaignRole[] = [
  {
    role: "Elected Member Digital Media",
    context: "Jonathan Huston",
    period: "Sep 2025 - Present",
    points: [
      "Advice, filming, photography, editing, and regular local content.",
    ],
  },
  {
    role: "State Campaign Media",
    context: "2025 WA State Election",
    period: "Jan 2025 - Mar 2025",
    points: [
      "Field coverage, short videos, and campaign-day content.",
    ],
  },
  {
    role: "Digital Marketing Support",
    context: "Amalfi Media",
    period: "Nov 2024 - Present",
    points: [
      "Small, practical media support for candidates, members, and public-facing people.",
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
    title: "IGA Door Knocking",
    category: "Field work",
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

const stateCampaignEmbeds: ArchiveMediaItem[] = [
  {
    id: "jonathan-huston-door-knocking",
    title: "Jonathan Huston Door Knocking",
    context: "Video",
    category: "Jonathan Huston",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSiaTAmA04yR5iYTG0ZkaQkAZQv5V7RTDSoiG8PPGHjABk?width=3840&height=2160",
  },
  {
    id: "hayley-edwards-presser",
    title: "Hayley Edwards Presser",
    context: "Video",
    category: "Hayley Edwards + Libby Mettam",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQQ926QY6NjQYdaPgW-YG5jAT4wxJVaIwO3xIZQTXhEJYQ?width=1920&height=1080",
  },
  {
    id: "hayley-edwards-photo-one",
    title: "Hayley Edwards Still",
    context: "Photo",
    category: "Hayley Edwards + Libby Mettam",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQSo1lJbuFtXQafaDJQrWKo2AS7yA6_uGLWm5uRuMeOfQhY?width=5629&height=3753",
  },
  {
    id: "hayley-edwards-photo-two",
    title: "Hayley Edwards Field Coverage",
    context: "Photo",
    category: "Hayley Edwards + Libby Mettam",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQS3RMv7JNr7SZ6TZO8KKF0HAZzNo5ePRe4PSdoZ3x5fumI?width=5673&height=3782",
  },
  {
    id: "nitin-vashisht-local-club",
    title: "Nitin Vashisht Local Club Piece",
    context: "Video",
    category: "Nitin Vashisht",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQSYxP_w-dBQqj4sRDlHHuHAWxK8bGaz_eRiBjDeGx8Dhk?width=3840&height=2160",
  },
  {
    id: "nitin-vashisht-school",
    title: "Nitin Vashisht School Piece",
    context: "Video",
    category: "Nitin Vashisht",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSn0xXmh8v4SLZ6J824eUZuAe5oX8t-_6Kpz3rxsmZsvuo?width=3840&height=2160",
  },
  {
    id: "nitin-vashisht-traffic",
    title: "Nitin Vashisht Traffic Piece",
    context: "Video",
    category: "Nitin Vashisht",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQTVc_maXyqYQbm9qtEbOcO0AeCQg5h7u4bf4PfDJyBdmO4",
  },
  {
    id: "sandra-brewer-coverage",
    title: "Sandra Brewer Coverage",
    context: "Photo",
    category: "Sandra Brewer",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQTlRO_MKOFtSbLqUpcXPTBZAe7KmqVql53oCXWknrVIh6Q?width=2773&height=4160",
    orientation: "portrait",
  },
  {
    id: "sandra-brewer-photo-one",
    title: "Sandra Brewer Still",
    context: "Photo",
    category: "Sandra Brewer",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQ-VAgTL9YHSqqyDkQQs0gAAYFOA6kpVPR4laS-tMIADEc?width=5739&height=3826",
  },
  {
    id: "sandra-brewer-photo-two",
    title: "Sandra Brewer Field Coverage",
    context: "Photo",
    category: "Sandra Brewer",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQhbFLYPXtETqh0B4QHLiAPAWztncKorXPdt1RPH5Z-0fs?width=5560&height=3707",
  },
  {
    id: "sandra-brewer-parliament-one",
    title: "Sandra Brewer Parliament Still",
    context: "Photo",
    category: "Sandra Brewer",
    kind: "photo",
    src: oneDriveClientExportUrl("Sandra Brewer", "_DSC0028-Enhanced-NR.jpg"),
  },
  {
    id: "sandra-brewer-parliament-two",
    title: "Sandra Brewer Chamber Still",
    context: "Photo",
    category: "Sandra Brewer",
    kind: "photo",
    src: oneDriveClientExportUrl("Sandra Brewer", "_DSC0121-Enhanced-NR.jpg"),
  },
  {
    id: "sandra-brewer-parliament-three",
    title: "Sandra Brewer Field Still",
    context: "Photo",
    category: "Sandra Brewer",
    kind: "photo",
    src: oneDriveClientExportUrl("Sandra Brewer", "_DSC0168-Enhanced-NR.jpg"),
  },
  {
    id: "sandra-brewer-parliament-four",
    title: "Sandra Brewer Event Still",
    context: "Photo",
    category: "Sandra Brewer",
    kind: "photo",
    src: oneDriveClientExportUrl("Sandra Brewer", "_DSC0251-Enhanced-NR.jpg"),
  },
  {
    id: "chris-dowson-swimming-club",
    title: "Chris Dowson Swimming Club",
    context: "Video",
    category: "Chris Dowson",
    src: oneDriveClientExportUrl("Chris Dowson", "1. Swimming Club.mov"),
  },
  {
    id: "chris-dowson-local-parks",
    title: "Chris Dowson Local Parks",
    context: "Video",
    category: "Chris Dowson",
    src: oneDriveClientExportUrl("Chris Dowson", "2. Local Parks.mov"),
  },
  {
    id: "chris-dowson-small-business",
    title: "Chris Dowson Small Business",
    context: "Video",
    category: "Chris Dowson",
    src: oneDriveClientExportUrl("Chris Dowson", "3. Small Businesses-.mov"),
  },
  {
    id: "chris-dowson-photo-one",
    title: "Chris Dowson Still",
    context: "Photo",
    category: "Chris Dowson",
    kind: "photo",
    src: oneDriveClientExportUrl("Chris Dowson", "_DSC0654.jpg"),
  },
  {
    id: "chris-dowson-photo-two",
    title: "Chris Dowson Field Still",
    context: "Photo",
    category: "Chris Dowson",
    kind: "photo",
    src: oneDriveClientExportUrl("Chris Dowson", "_DSC0661.jpg"),
  },
  {
    id: "chris-dowson-photo-three",
    title: "Chris Dowson Community Still",
    context: "Photo",
    category: "Chris Dowson",
    kind: "photo",
    src: oneDriveClientExportUrl("Chris Dowson", "_DSC0663.jpg"),
  },
  {
    id: "chris-dowson-photo-four",
    title: "Chris Dowson Event Still",
    context: "Photo",
    category: "Chris Dowson",
    kind: "photo",
    src: oneDriveClientExportUrl("Chris Dowson", "_DSC0668.jpg"),
  },
  {
    id: "andra-piece-to-camera",
    title: "Andra Biondi Piece-to-Camera",
    context: "Video",
    category: "Victoria Park",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQTyAwxV3vdfQavj_0iiPOCEAbj4Hr6osW09zh73u-rIxKw?width=3840&height=2160",
  },
  {
    id: "andra-racecourse-libby",
    title: "Andra Biondi with Libby Mettam",
    context: "Video",
    category: "Victoria Park",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSIsVqxoUn9TIu61NCf8ADLAZsf6NLewXar8uKrMNzkPbw?width=3840&height=2160",
  },
  {
    id: "aswath-comms-photo",
    title: "Aswath Chavittupara Field",
    context: "Photo",
    category: "Morley",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQS_VVLJPd-SSbYAqrbuAlJtAQZFu3Zt63ibqIFWgRkqil0?width=5740&height=3827",
  },
  {
    id: "aswath-comms-field-photo",
    title: "Aswath Chavittupara Community Coverage",
    context: "Photo",
    category: "Morley",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQ5qfwpfliESYi4uYXmV1pnAb3TGbBINFg9CpEhMlhfJMY?width=5021&height=3347",
  },
  {
    id: "michelle-hoffman-video-one",
    kind: "video",
    title: "Michelle Hoffman Video 1",
    context: "Video",
    category: "Michelle Hoffman",
    src: "/media/michelle-hoffman/michelle-video-1.mp4",
    poster: "/media/michelle-hoffman/michelle-video-1-poster.jpg",
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-video-two",
    kind: "video",
    title: "Michelle Hoffman Video 2",
    context: "Video",
    category: "Michelle Hoffman",
    src: "/media/michelle-hoffman/michelle-video-2.mp4",
    poster: "/media/michelle-hoffman/michelle-video-2-poster.jpg",
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-video-three",
    kind: "video",
    title: "Michelle Hoffman Video 3",
    context: "Video",
    category: "Michelle Hoffman",
    src: "/media/michelle-hoffman/michelle-video-3.mp4",
    poster: "/media/michelle-hoffman/michelle-video-3-poster.jpg",
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-video-four",
    kind: "video",
    title: "Michelle Hoffman Video 4",
    context: "Video",
    category: "Michelle Hoffman",
    src: "/media/michelle-hoffman/michelle-video-4.mp4",
    poster: "/media/michelle-hoffman/michelle-video-4-poster.jpg",
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-photo-one",
    kind: "photo",
    title: "Michelle Hoffman Portrait",
    context: "Photo",
    category: "Michelle Hoffman",
    src: "/media/michelle-hoffman/michelle-photo-1.jpg",
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-photo-two",
    kind: "photo",
    title: "Michelle Hoffman Parliament Still",
    context: "Photo",
    category: "Michelle Hoffman",
    src: "/media/michelle-hoffman/michelle-photo-2.jpg",
  },
  {
    id: "michelle-hoffman-photo-three",
    kind: "photo",
    title: "Michelle Hoffman Interview Still",
    context: "Photo",
    category: "Michelle Hoffman",
    src: "/media/michelle-hoffman/michelle-photo-3.jpg",
  },
  {
    id: "michelle-hoffman-photo-four",
    kind: "photo",
    title: "Michelle Hoffman Field Still",
    context: "Photo",
    category: "Michelle Hoffman",
    src: "/media/michelle-hoffman/michelle-photo-4.jpg",
  },
  {
    id: "lisa-olsson-video",
    title: "Lisa Olsson Piece",
    context: "Video",
    category: "Hillarys",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRuhxv_SpLITI1MGN4AP95LAb1o47S89cS2C9VjObocmb8?width=3840&height=2160",
  },
  {
    id: "lisa-olsson-photo",
    title: "Lisa Olsson Portrait",
    context: "Photo",
    category: "Hillarys",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQdxNVXMH96T7dIdgd5tSaQAZlJfpfz7LyjwORS79omJxw?width=4000&height=6000",
    orientation: "portrait",
  },
  {
    id: "scott-edwardes-road",
    title: "Scott Edwardes Road Clip",
    context: "Short video",
    category: "Kingsley",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQQOl8eZMllSpgtqkvg44ssAQenMtPGHH9lvAGsmRO3ceQ?width=1920&height=1920",
    orientation: "square",
  },
  {
    id: "scott-edwardes-student",
    title: "Scott Edwardes Student Clip",
    context: "Short video",
    category: "Kingsley",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQ6xx6SG4LWTbC4Fy6ghcazAVqFxoNt8cQ1vOkclH7FJiE?width=1920&height=1920",
    orientation: "square",
  },
  {
    id: "scott-edwardes-police",
    title: "Scott Edwardes Police Reel",
    context: "Reel",
    category: "Kingsley",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQKudQ1w23NQKxaUkfakpuvAdFNO-3t_20i_PS0FpYmV7M?width=1080&height=1920",
    orientation: "portrait",
  },
  {
    id: "scott-edwardes-health",
    title: "Scott Edwardes Health Reel",
    context: "Reel",
    category: "Kingsley",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQFRNcufpm5QqcE9jwv32FgAf_3LBmzaqvp_maHhvxPCKk?width=1080&height=1920",
    orientation: "portrait",
  },
];

const federalCampaignEmbeds: ArchiveMediaItem[] = [
  {
    id: "liam-trish-vince-broll",
    title: "Liam, Trish & Vince B-roll",
    context: "B-roll",
    category: "Candidate Travel",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRUul58E3usQLbSR6B8gEy1AZm8L9BobVHzsEMbX4Gcjms?width=1920&height=1080",
  },
  {
    id: "liam-trish-vince-vince-broll",
    title: "Vince Connelly B-roll",
    context: "B-roll",
    category: "Candidate Travel",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQS2jIJcHfhBSZZIN6cpeIGRAci2LfMqut3b8C4qdSP-UxY?width=3840&height=2160",
  },
  {
    id: "sean-ayres-field-work",
    title: "Sean Ayres Field Work",
    context: "Photo",
    category: "Burt",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQTRlGg3NdGxRZGbuZp7qciNAdlEKJgJy0DCtO2I9GVzq6w?width=5933&height=3955",
  },
  {
    id: "sean-ayres-photo-one",
    title: "Sean Ayres Still",
    context: "Photo",
    category: "Burt",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQSmGapYlrfrQYny4O1QQb9rATPRAsinXvH7nI2DMyEVbXU?width=5755&height=3837",
  },
  {
    id: "sean-ayres-photo-two",
    title: "Sean Ayres Field Coverage",
    context: "Photo",
    category: "Burt",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQSzDeSIUv77Rp0P0JrgtndaARF3YPN_TBYoCyxGdGY283Q?width=6000&height=4000",
  },
  {
    id: "sean-ayres-photo-three",
    title: "Sean Ayres Still",
    context: "Photo",
    category: "Burt",
    kind: "photo",
    src: oneDriveClientExportUrl("Sean Ayres for Burt", "_DSC4617.jpg"),
  },
  {
    id: "sean-ayres-photo-four",
    title: "Sean Ayres Field Still",
    context: "Photo",
    category: "Burt",
    kind: "photo",
    src: oneDriveClientExportUrl("Sean Ayres for Burt", "_DSC4626.jpg"),
  },
  {
    id: "sean-ayres-photo-five",
    title: "Sean Ayres Community Still",
    context: "Photo",
    category: "Burt",
    kind: "photo",
    src: oneDriveClientExportUrl("Sean Ayres for Burt", "_DSC4637.jpg"),
  },
  {
    id: "sean-ayres-photo-six",
    title: "Sean Ayres Campaign Still",
    context: "Photo",
    category: "Burt",
    kind: "photo",
    src: oneDriveClientExportUrl("Sean Ayres for Burt", "_DSC4646.jpg"),
  },
  {
    id: "sean-ayres-photo-seven",
    title: "Sean Ayres Doorstop Still",
    context: "Photo",
    category: "Burt",
    kind: "photo",
    src: oneDriveClientExportUrl("Sean Ayres for Burt", "_DSC4674.jpg"),
  },
  {
    id: "sean-ayres-photo-eight",
    title: "Sean Ayres Event Still",
    context: "Photo",
    category: "Burt",
    kind: "photo",
    src: oneDriveClientExportUrl("Sean Ayres for Burt", "_DSC4729.jpg"),
  },
  {
    id: "sean-ayres-photo-nine",
    title: "Sean Ayres Street Still",
    context: "Photo",
    category: "Burt",
    kind: "photo",
    src: oneDriveClientExportUrl("Sean Ayres for Burt", "_DSC4760.jpg"),
  },
  {
    id: "sean-ayres-photo-ten",
    title: "Sean Ayres Campaign Photo",
    context: "Photo",
    category: "Burt",
    kind: "photo",
    src: oneDriveClientExportUrl("Sean Ayres for Burt", "_DSC4802.jpg"),
  },
  {
    id: "tom-white-ptc-5",
    title: "Tom White Piece-to-Camera",
    context: "Video",
    category: "Curtin",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQdpjVisYVESINfod6QVQZ_AdZHqhN5rbtQiI2W8LAUhCU?width=1920&height=1920",
    orientation: "square",
  },
  {
    id: "tom-white-ptc-2",
    title: "Tom White Social Cut",
    context: "Video",
    category: "Curtin",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQKS1UCY2ntTLZahyzOG8ttAQJXXxKmiKUYGDaQvuTheqo?width=1920&height=1920",
    orientation: "square",
  },
  {
    id: "vince-connelly-surfing",
    title: "Vince Connelly Surfing Piece",
    context: "Video",
    category: "Moore",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSkD2kkoP8zRrqSdCZcK_3PAXiS-xuzdc6dniesKzY8ynU?width=2160&height=3840",
    orientation: "portrait",
  },
  {
    id: "vince-connelly-drone",
    title: "Vince Connelly Drone Coverage",
    context: "B-roll",
    category: "Moore",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRsbUI7bCesRoRnNzZApzSLARE4ZZZtb6tuz0ikubuIUOM?width=5472&height=3078",
  },
  {
    id: "vince-connelly-photo",
    title: "Vince Connelly Still",
    context: "Photo",
    category: "Moore",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQSkCZVfisfoS51qJIp5qnHCAe1fattGkOzig4xXZq3eluQ?width=6000&height=4000",
  },
  {
    id: "mic-fels-dutton-photo",
    title: "Mic Fels with Peter Dutton",
    context: "Photo",
    category: "Swan",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQpYibKcYRtS4Gn9JLM__FAAUDNl5lOR2B0moiqRPFC2a0?width=5657&height=3771",
  },
  {
    id: "mic-fels-playground-upgrades",
    title: "Mic Fels Playground Upgrades",
    context: "Video",
    category: "Swan",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRzZQ-zLR-gQq9bMvmQF6PQAWpc2r2gjqiH31uRyIsMNDs",
  },
  {
    id: "mic-fels-foreshore-lighting",
    title: "Mic Fels Foreshore Lighting Reel",
    context: "Reel",
    category: "Swan",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRLb2mZ6ySnT7vz31-Ieq_tAYMbmLvQquKqWzjzR109_jk?width=1296&height=2304",
    orientation: "portrait",
  },
  {
    id: "matt-moran-dutton-photo",
    title: "Matt Moran Dutton Event",
    context: "Photo",
    category: "Bullwinkel",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQRT_F3t7LglQKXuWSsXNbTkAe8-krqh372A6dRDo5HwRQQ?width=5760&height=3840",
  },
  {
    id: "matt-moran-dutton-photo-two",
    title: "Matt Moran Dutton Still",
    context: "Photo",
    category: "Bullwinkel",
    kind: "photo",
    src: oneDriveClientExportUrl(
      "Matt Moran Media/Dutton Photos",
      "_DSC2496-Enhanced-NR-2.jpg",
    ),
  },
  {
    id: "matt-moran-dutton-photo-three",
    title: "Matt Moran Event Still",
    context: "Photo",
    category: "Bullwinkel",
    kind: "photo",
    src: oneDriveClientExportUrl(
      "Matt Moran Media/Dutton Photos",
      "_DSC2511-Enhanced-NR-2.jpg",
    ),
  },
  {
    id: "matt-moran-dutton-photo-four",
    title: "Matt Moran Field Still",
    context: "Photo",
    category: "Bullwinkel",
    kind: "photo",
    src: oneDriveClientExportUrl(
      "Matt Moran Media/Dutton Photos",
      "_DSC2514-Enhanced-NR-2.jpg",
    ),
  },
  {
    id: "matt-moran-dutton-photo-five",
    title: "Matt Moran Campaign Still",
    context: "Photo",
    category: "Bullwinkel",
    kind: "photo",
    src: oneDriveClientExportUrl(
      "Matt Moran Media/Dutton Photos",
      "_DSC2522-Enhanced-NR-2.jpg",
    ),
  },
];

const isDefined = <T,>(item: T | undefined): item is T => Boolean(item);

const getCampaignEmbeds = (
  items: ExternalCampaignEmbed[],
  ids: string[],
): ArchiveMediaItem[] =>
  ids.map((id) => items.find((item) => item.id === id)).filter(isDefined);

const getLocalCampaignVideos = (): ArchiveMediaItem[] =>
  campaignVideoItems.map((item) => ({
    id: item.id,
    kind: "video",
    title: item.title,
    context: item.category,
    category: item.year ? `${item.year} / Jonathan Huston` : "Jonathan Huston",
    src: item.src,
    poster: item.poster,
    orientation: item.orientation,
  }));

const stateCandidateArchives: ArchiveCandidate[] = [
  {
    id: "jonathan-huston",
    section: "state",
    name: "Jonathan Huston",
    seat: "Nedlands",
    eyebrow: "Elected member media",
    summary: "Local updates, issue videos, reels, and photos.",
    media: [
      ...getLocalCampaignVideos(),
      ...getCampaignEmbeds(stateCampaignEmbeds, [
        "jonathan-huston-door-knocking",
      ]),
    ],
  },
  {
    id: "hayley-edwards",
    section: "state",
    name: "Hayley Edwards",
    seat: "Field coverage",
    eyebrow: "2025",
    summary: "Press clips, field photos, and campaign coverage.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "hayley-edwards-presser",
      "hayley-edwards-photo-one",
      "hayley-edwards-photo-two",
    ]),
  },
  {
    id: "nitin-vashisht",
    section: "state",
    name: "Nitin Vashisht",
    seat: "Riverton",
    eyebrow: "2025",
    summary: "Local issue videos and community coverage.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "nitin-vashisht-local-club",
      "nitin-vashisht-school",
      "nitin-vashisht-traffic",
    ]),
  },
  {
    id: "sandra-brewer",
    section: "state",
    name: "Sandra Brewer",
    seat: "Cottesloe",
    eyebrow: "2025",
    summary: "Photos and campaign event coverage.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "sandra-brewer-coverage",
      "sandra-brewer-photo-one",
      "sandra-brewer-photo-two",
      "sandra-brewer-parliament-one",
      "sandra-brewer-parliament-two",
      "sandra-brewer-parliament-three",
      "sandra-brewer-parliament-four",
    ]),
  },
  {
    id: "chris-dowson",
    section: "state",
    name: "Chris Dowson",
    seat: "State work",
    eyebrow: "2025",
    summary: "Local issue videos, stills, and field coverage.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "chris-dowson-swimming-club",
      "chris-dowson-local-parks",
      "chris-dowson-small-business",
      "chris-dowson-photo-one",
      "chris-dowson-photo-two",
      "chris-dowson-photo-three",
      "chris-dowson-photo-four",
    ]),
  },
  {
    id: "andra-biondi",
    section: "state",
    name: "Andra Biondi",
    seat: "Victoria Park",
    eyebrow: "2025",
    summary: "Candidate videos and local issue coverage.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "andra-piece-to-camera",
      "andra-racecourse-libby",
    ]),
  },
  {
    id: "aswath-chavittupara",
    section: "state",
    name: "Aswath Chavittupara",
    seat: "Morley",
    eyebrow: "2025",
    summary: "Field photography and local campaign stills.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "aswath-comms-photo",
      "aswath-comms-field-photo",
    ]),
  },
  {
    id: "michelle-hoffman",
    section: "state",
    name: "Michelle Hoffman",
    seat: "State work",
    eyebrow: "2025",
    summary: "Short videos, portraits, and campaign stills.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "michelle-hoffman-video-one",
      "michelle-hoffman-video-two",
      "michelle-hoffman-video-three",
      "michelle-hoffman-video-four",
      "michelle-hoffman-photo-one",
      "michelle-hoffman-photo-two",
      "michelle-hoffman-photo-three",
      "michelle-hoffman-photo-four",
    ]),
  },
  {
    id: "lisa-olsson",
    section: "state",
    name: "Lisa Olsson",
    seat: "Hillarys",
    eyebrow: "2025",
    summary: "Video, portraits, and field coverage.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "lisa-olsson-video",
      "lisa-olsson-photo",
    ]),
  },
  {
    id: "scott-edwardes",
    section: "state",
    name: "Scott Edwardes",
    seat: "Kingsley",
    eyebrow: "2025",
    summary: "Short videos for local issues and community updates.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "scott-edwardes-road",
      "scott-edwardes-student",
      "scott-edwardes-police",
      "scott-edwardes-health",
    ]),
  },
];

const federalCandidateArchives: ArchiveCandidate[] = [
  {
    id: "tom-white",
    section: "federal",
    name: "Tom White",
    seat: "Curtin",
    eyebrow: "2025",
    summary: "Piece-to-camera videos and social cuts.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "tom-white-ptc-5",
      "tom-white-ptc-2",
    ]),
  },
  {
    id: "vince-connelly",
    section: "federal",
    name: "Vince Connelly",
    seat: "Moore",
    eyebrow: "2025",
    summary: "Video, drone coverage, and stills.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "vince-connelly-surfing",
      "vince-connelly-drone",
      "vince-connelly-photo",
    ]),
  },
  {
    id: "matt-moran",
    section: "federal",
    name: "Matt Moran",
    seat: "Bullwinkel",
    eyebrow: "2025",
    summary: "Leader-visit stills and event coverage.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "matt-moran-dutton-photo",
      "matt-moran-dutton-photo-two",
      "matt-moran-dutton-photo-three",
      "matt-moran-dutton-photo-four",
      "matt-moran-dutton-photo-five",
    ]),
  },
  {
    id: "mic-fels",
    section: "federal",
    name: "Mic Fels",
    seat: "Swan",
    eyebrow: "2025",
    summary: "Photos, local videos, and event coverage.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "mic-fels-dutton-photo",
      "mic-fels-playground-upgrades",
      "mic-fels-foreshore-lighting",
    ]),
  },
  {
    id: "sean-ayres",
    section: "federal",
    name: "Sean Ayres",
    seat: "Burt",
    eyebrow: "2025",
    summary: "Field photography and campaign stills.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "sean-ayres-field-work",
      "sean-ayres-photo-one",
      "sean-ayres-photo-two",
      "sean-ayres-photo-three",
      "sean-ayres-photo-four",
      "sean-ayres-photo-five",
      "sean-ayres-photo-six",
      "sean-ayres-photo-seven",
      "sean-ayres-photo-eight",
      "sean-ayres-photo-nine",
      "sean-ayres-photo-ten",
    ]),
  },
  {
    id: "liam-trish-vince",
    section: "federal",
    name: "Liam, Trish & Vince",
    seat: "B-roll",
    eyebrow: "2025",
    summary: "B-roll and field material across candidates.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "liam-trish-vince-broll",
      "liam-trish-vince-vince-broll",
    ]),
  },
  {
    id: "leader-visits",
    section: "federal",
    name: "Peter Dutton events",
    seat: "Leader visits",
    eyebrow: "2025",
    summary: "Leader-visit coverage across Perth stops.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "mic-fels-dutton-photo",
      "matt-moran-dutton-photo",
      "matt-moran-dutton-photo-two",
      "matt-moran-dutton-photo-three",
      "liam-trish-vince-broll",
      "liam-trish-vince-vince-broll",
    ]),
  },
];

const candidateArchives = [
  ...stateCandidateArchives,
  ...federalCandidateArchives,
];

const federalCampaignMedia: ArchiveMediaItem[] = getCampaignEmbeds(
  federalCampaignEmbeds,
  [
    "tom-white-ptc-5",
    "tom-white-ptc-2",
    "vince-connelly-drone",
    "liam-trish-vince-vince-broll",
    "liam-trish-vince-broll",
    "mic-fels-playground-upgrades",
    "vince-connelly-surfing",
    "mic-fels-foreshore-lighting",
    "vince-connelly-photo",
    "matt-moran-dutton-photo",
    "matt-moran-dutton-photo-two",
    "matt-moran-dutton-photo-three",
    "matt-moran-dutton-photo-four",
    "matt-moran-dutton-photo-five",
    "mic-fels-dutton-photo",
    "sean-ayres-field-work",
    "sean-ayres-photo-one",
    "sean-ayres-photo-two",
    "sean-ayres-photo-three",
    "sean-ayres-photo-four",
    "sean-ayres-photo-five",
    "sean-ayres-photo-six",
    "sean-ayres-photo-seven",
    "sean-ayres-photo-eight",
    "sean-ayres-photo-nine",
    "sean-ayres-photo-ten",
  ],
);

const stateCampaignMedia: ArchiveMediaItem[] = [
  ...getLocalCampaignVideos(),
  ...getCampaignEmbeds(stateCampaignEmbeds, [
    "jonathan-huston-door-knocking",
    "hayley-edwards-presser",
    "nitin-vashisht-local-club",
    "nitin-vashisht-school",
    "nitin-vashisht-traffic",
    "andra-piece-to-camera",
    "andra-racecourse-libby",
    "lisa-olsson-video",
    "scott-edwardes-road",
    "scott-edwardes-student",
    "scott-edwardes-police",
    "scott-edwardes-health",
    "hayley-edwards-photo-one",
    "hayley-edwards-photo-two",
    "sandra-brewer-coverage",
    "sandra-brewer-photo-one",
    "sandra-brewer-photo-two",
    "sandra-brewer-parliament-one",
    "sandra-brewer-parliament-two",
    "sandra-brewer-parliament-three",
    "sandra-brewer-parliament-four",
    "chris-dowson-swimming-club",
    "chris-dowson-local-parks",
    "chris-dowson-small-business",
    "chris-dowson-photo-one",
    "chris-dowson-photo-two",
    "chris-dowson-photo-three",
    "chris-dowson-photo-four",
    "aswath-comms-photo",
    "aswath-comms-field-photo",
    "michelle-hoffman-video-one",
    "michelle-hoffman-video-two",
    "michelle-hoffman-video-three",
    "michelle-hoffman-video-four",
    "michelle-hoffman-photo-one",
    "michelle-hoffman-photo-two",
    "michelle-hoffman-photo-three",
    "michelle-hoffman-photo-four",
    "lisa-olsson-photo",
  ]),
];

const portfolioMediaItems: MediaItem[] = [
  {
    id: "campaign-video",
    type: "video",
    src: "/media/amalfi-media-strategy.mp4",
    poster: "/media/amalfi-media-strategy-poster.jpg",
    title: "Media Reel",
    category: "Video",
    year: "2025",
    featured: true,
    orientation: "portrait",
  },
  {
    id: "interview",
    type: "image",
    src: "/media/amalfi-interview.jpg",
    title: "Interview work",
    category: "Photo",
    year: "2025",
  },
  {
    id: "community",
    type: "image",
    src: "/media/amalfi-community.jpg",
    title: "Community photos",
    category: "Photography",
    year: "2025",
  },
  {
    id: "portrait",
    type: "image",
    src: "/media/amalfi-portrait.jpg",
    title: "Portraits",
    category: "Portrait",
    year: "2025",
  },
];

const mediaItems = [...campaignVideoItems, ...portfolioMediaItems];

const aboutPhoto = {
  src: "/media/rohan-contact/rohan-headshot-01.jpg",
  alt: "Rohan Hammond portrait",
};

function getArchiveRoute(): ArchiveRoute {
  if (typeof window === "undefined") return null;

  const match = window.location.hash.match(
    /^#archive\/(state|federal)\/([^?]+)/,
  );

  if (!match) return null;

  return {
    section: match[1] as "state" | "federal",
    candidateId: decodeURIComponent(match[2]),
  };
}

function isOneDrivePhoto(src: string) {
  return src.includes("/i/");
}

function getExternalMediaDimensions(src: string) {
  try {
    const url = new URL(src);
    const width = Number(url.searchParams.get("width"));
    const height = Number(url.searchParams.get("height"));

    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
    if (width <= 0 || height <= 0) return null;

    return { width, height };
  } catch {
    return null;
  }
}

function getExternalMediaFrameStyle(
  src: string,
): ExternalMediaFrameStyle | undefined {
  const dimensions = getExternalMediaDimensions(src);

  if (!dimensions) return undefined;

  return {
    "--media-aspect": `${dimensions.width} / ${dimensions.height}`,
  };
}

function getPhotoPreviewSrc(src: string) {
  const dimensions = getExternalMediaDimensions(src);

  if (!dimensions) return src;

  try {
    const url = new URL(src);
    const longestSide = Math.max(dimensions.width, dimensions.height);
    const scale = Math.min(PHOTO_PREVIEW_MAX_SIZE / longestSide, 1);
    const width = Math.round(dimensions.width * scale);
    const height = Math.round(dimensions.height * scale);

    url.searchParams.set("width", String(width));
    url.searchParams.set("height", String(height));

    return url.toString();
  } catch {
    return src;
  }
}

function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [archiveRoute, setArchiveRoute] = useState<ArchiveRoute>(
    getArchiveRoute,
  );

  const featuredItems = useMemo(
    () => portfolioMediaItems.filter((item) => item.featured),
    [],
  );
  const archiveItems = useMemo(
    () =>
      portfolioMediaItems.filter(
        (item) => !item.featured && item.id !== "portrait",
      ),
    [],
  );
  const activeArchive = useMemo(
    () =>
      archiveRoute
        ? candidateArchives.find(
            (candidate) =>
              candidate.section === archiveRoute.section &&
              candidate.id === archiveRoute.candidateId,
          )
        : null,
    [archiveRoute],
  );

  const activeItem = activeIndex === null ? null : mediaItems[activeIndex];

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = getArchiveRoute();
      setArchiveRoute(nextRoute);

      if (nextRoute) {
        window.scrollTo({ top: 0 });
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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
          <a href="#campaigns" onClick={() => setMenuOpen(false)}>
            Experience
          </a>
          <a href="#campaign-media" onClick={() => setMenuOpen(false)}>
            Media
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
        </nav>
      </header>

      <main id="top">
        {activeArchive ? (
          <CandidateArchivePage candidate={activeArchive} />
        ) : (
          <>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{profile.location}</p>
            <h1 id="hero-title">{profile.tagline}</h1>
            <p>{profile.intro}</p>

            <div className="hero-actions">
              <a className="hero-link" href="#campaigns">
                Experience
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href="#campaign-media">
                Media
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="hero-visual" aria-label="About image">
            <img src="/media/amalfi-founder.jpg" alt="" />
            <div className="hero-note">
              <span>Liberal digital media</span>
              <strong>Advice. Film. Photos.</strong>
            </div>
          </aside>
        </section>

        <section className="proof-strip" aria-labelledby="proof-title">
          <p className="eyebrow" id="proof-title">
            Background
          </p>
          <div className="proof-grid">
            {campaignStats.map((stat) => (
              <article className="proof-item" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
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
            <p className="eyebrow">Experience</p>
            <h2 id="campaigns-title">
              Digital media for Liberal candidates and elected members.
            </h2>
          </div>

          <div className="campaign-layout">
            <div className="campaign-summary">
              <p>
                I help Liberal candidates and elected members show up online
                with clearer, more regular content.
              </p>
              <p>
                Advice first. Then filming, photography, editing, and posting
                support.
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

        <CampaignMediaSection
          id="campaign-media"
          eyebrow="Federal work"
          title="Federal candidates."
          summary="Videos, reels, photos, and event coverage."
          clients={federalCandidateArchives}
          items={federalCampaignMedia}
        />

        <CampaignMediaSection
          id="state-media"
          eyebrow="State work"
          title="State candidates."
          summary="Campaign videos, local issues, field days, and stills."
          clients={stateCandidateArchives}
          items={stateCampaignMedia}
        />

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="section-heading about-heading">
            <p className="eyebrow">About</p>
            <div>
              <h2 id="about-title">Rohan Hammond.</h2>
              <p className="section-summary">
                Perth-based digital media for Liberal candidates and elected
                members.
              </p>
            </div>
          </div>

          <div className="about-layout">
            <div className="about-copy-panel">
              <div className="about-copy">
                <p>
                  I advise, film, and photograph Liberal candidates and elected
                  members who need a stronger digital presence.
                </p>
                <p>
                  It started with volunteering on state campaigns and being asked
                  to take photos.
                </p>
              </div>

              <div className="contact-details">
                <div className="contact-detail">
                  <span>Email</span>
                  <a href={profile.contactHref}>{contactDetails.email}</a>
                </div>
              </div>
            </div>

            <div className="about-media-panel">
              <figure className="about-portrait-card">
                <img src={aboutPhoto.src} alt={aboutPhoto.alt} loading="lazy" />
              </figure>
            </div>
          </div>

        </section>
          </>
        )}
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

const campaignMediaTabs: { id: CampaignMediaTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "videos", label: "Videos" },
  { id: "reels", label: "Reels" },
  { id: "photos", label: "Photos" },
];

function isArchivePhoto(item: ArchiveMediaItem) {
  return item.kind === "photo" || isOneDrivePhoto(item.src);
}

function getCampaignMediaTab(item: ArchiveMediaItem): CampaignMediaTab {
  if (isArchivePhoto(item)) return "photos";
  if (item.orientation === "portrait") return "reels";

  return "videos";
}

function getCampaignMediaCountLabel(tab: CampaignMediaTab, count: number) {
  if (tab === "all") return `${count} ${count === 1 ? "piece" : "pieces"}`;
  if (tab === "photos") return `${count} ${count === 1 ? "photo" : "photos"}`;
  if (tab === "reels") return `${count} ${count === 1 ? "reel" : "reels"}`;

  return `${count} ${count === 1 ? "video" : "videos"}`;
}

function getCampaignMediaSetLabel(tab: CampaignMediaTab) {
  if (tab === "all") return "Media set";
  if (tab === "photos") return "Photo set";
  if (tab === "reels") return "Reel set";

  return "Video set";
}

function getCampaignMediaPreviewItem(items: ArchiveMediaItem[]) {
  return (
    items.find((item) => Boolean(item.poster)) ??
    items.find((item) => Boolean(getCollectionPreviewImageSrc(item))) ??
    items.find((item) => isEmbeddableOneDriveShare(item.src)) ??
    items[0]
  );
}

function isEmbeddableOneDriveShare(src: string) {
  return src.startsWith("https://1drv.ms/");
}

function getCollectionPreviewImageSrc(item: ArchiveMediaItem) {
  if (item.poster) return item.poster;
  if (isOneDrivePhoto(item.src)) return getPhotoPreviewSrc(item.src);
  if (isArchivePhoto(item) && !item.src.startsWith("http")) return item.src;

  return null;
}

function getCampaignMediaCollections(
  clients: ArchiveCandidate[],
  tab: CampaignMediaTab,
): CampaignMediaCollection[] {
  return clients
    .map((candidate) => {
      const mediaItems =
        tab === "all"
          ? candidate.media
          : candidate.media.filter((item) => getCampaignMediaTab(item) === tab);
      const preview = getCampaignMediaPreviewItem(mediaItems);

      if (!preview) return undefined;

      return {
        candidate,
        items: mediaItems,
        preview,
      };
    })
    .filter(isDefined);
}

type CampaignMediaSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  clients: ArchiveCandidate[];
  items: ArchiveMediaItem[];
};

function CampaignMediaSection({
  id,
  eyebrow,
  title,
  summary,
  clients,
  items,
}: CampaignMediaSectionProps) {
  const [activeTab, setActiveTab] = useState<CampaignMediaTab>("all");
  const [expandedCollectionId, setExpandedCollectionId] = useState<
    string | null
  >(null);
  const itemsByTab = useMemo(
    () => ({
      all: items,
      videos: items.filter((item) => getCampaignMediaTab(item) === "videos"),
      reels: items.filter((item) => getCampaignMediaTab(item) === "reels"),
      photos: items.filter((item) => getCampaignMediaTab(item) === "photos"),
    }),
    [items],
  );
  const collectionsByTab = useMemo(
    () => ({
      all: getCampaignMediaCollections(clients, "all"),
      videos: getCampaignMediaCollections(clients, "videos"),
      reels: getCampaignMediaCollections(clients, "reels"),
      photos: getCampaignMediaCollections(clients, "photos"),
    }),
    [clients],
  );
  const activeCollections = collectionsByTab[activeTab];
  const expandedCollection =
    activeCollections.find(
      (collection) => collection.candidate.id === expandedCollectionId,
    ) ?? null;
  const headingId = `${id}-title`;
  const panelId = `${id}-panel`;

  useEffect(() => {
    setExpandedCollectionId(null);
  }, [activeTab]);

  return (
    <section
      className="campaign-video-section campaign-media-suite"
      id={id}
      aria-labelledby={headingId}
    >
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <div>
          <h2 id={headingId}>{title}</h2>
          <p className="section-summary">{summary}</p>
        </div>
      </div>

      <div className="media-tabs" role="tablist" aria-label={`${eyebrow} filters`}>
        {campaignMediaTabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "media-tab is-active" : "media-tab"}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={panelId}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            <small>
              {getCampaignMediaCountLabel(tab.id, itemsByTab[tab.id].length)}
            </small>
          </button>
        ))}
      </div>

      <div
        className={`campaign-collection-grid is-${activeTab}`}
        id={panelId}
        role="tabpanel"
      >
        {activeCollections.map((collection) => {
          const collectionPanelId = `${panelId}-${collection.candidate.id}`;

          return (
            <CampaignCollectionCard
              collection={collection}
              controlsId={collectionPanelId}
              isExpanded={
                expandedCollection?.candidate.id === collection.candidate.id
              }
              key={collection.candidate.id}
              tab={activeTab}
              onToggle={() =>
                setExpandedCollectionId((current) =>
                  current === collection.candidate.id
                    ? null
                    : collection.candidate.id,
                )
              }
            />
          );
        })}
      </div>

      {expandedCollection && (
        <div
          className="campaign-expanded-gallery"
          id={`${panelId}-${expandedCollection.candidate.id}`}
        >
          <div className="campaign-expanded-header">
            <div>
              <p className="eyebrow">{expandedCollection.candidate.seat}</p>
              <h3>{expandedCollection.candidate.name}</h3>
              <p>
                {getCampaignMediaCountLabel(
                  activeTab,
                  expandedCollection.items.length,
                )}
              </p>
            </div>

            <div className="campaign-expanded-actions">
              <a
                className="collection-archive-link"
                href={`#archive/${expandedCollection.candidate.section}/${expandedCollection.candidate.id}`}
              >
                Archive
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <button
                className="icon-button"
                type="button"
                aria-label={`Close ${expandedCollection.candidate.name} gallery`}
                onClick={() => setExpandedCollectionId(null)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className={`campaign-video-grid is-${activeTab}`}>
            {expandedCollection.items.map((item) => (
              <ArchiveMediaCard
                item={item}
                key={item.id}
                ownerName={expandedCollection.candidate.name}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

type CampaignCollectionCardProps = {
  collection: CampaignMediaCollection;
  controlsId: string;
  isExpanded: boolean;
  tab: CampaignMediaTab;
  onToggle: () => void;
};

function CampaignCollectionCard({
  collection,
  controlsId,
  isExpanded,
  tab,
  onToggle,
}: CampaignCollectionCardProps) {
  const { candidate, items, preview } = collection;
  const isPhoto = getCampaignMediaTab(preview) === "photos";
  const buttonClassName = [
    "collection-preview-button",
    `is-tab-${tab}`,
    isPhoto ? "has-photo" : "has-video",
    tab === "reels" && preview.orientation === "portrait"
      ? "is-portrait"
      : tab === "reels" && preview.orientation === "square"
        ? "is-square"
        : "",
    isExpanded ? "is-expanded" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={isExpanded ? "collection-card is-expanded" : "collection-card"}
    >
      <button
        className={buttonClassName}
        type="button"
        aria-controls={controlsId}
        aria-expanded={isExpanded}
        aria-label={`Open ${candidate.name} ${tab}`}
        onClick={onToggle}
      >
        <CampaignCollectionPreviewVisual item={preview} />
        <span className="collection-preview-title" aria-hidden="true">
          <span>{getCampaignMediaSetLabel(tab)}</span>
          <strong>{candidate.name}</strong>
        </span>
        <span className="collection-media-icon" aria-hidden="true">
          {isPhoto ? (
            <Images size={18} />
          ) : (
            <Play size={18} fill="currentColor" />
          )}
        </span>
      </button>

      <div className="collection-meta">
        <div>
          <h3>{candidate.name}</h3>
          <p>{candidate.seat}</p>
        </div>
        <span>{getCampaignMediaCountLabel(tab, items.length)}</span>
      </div>
    </article>
  );
}

type CampaignCollectionPreviewVisualProps = {
  item: ArchiveMediaItem;
};

function CampaignCollectionPreviewVisual({
  item,
}: CampaignCollectionPreviewVisualProps) {
  const previewImageSrc = getCollectionPreviewImageSrc(item);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  if (previewImageSrc && failedImageSrc !== previewImageSrc) {
    return (
      <img
        src={previewImageSrc}
        alt=""
        loading="lazy"
        onError={() => setFailedImageSrc(previewImageSrc)}
      />
    );
  }

  if (isEmbeddableOneDriveShare(item.src)) {
    return (
      <span className="collection-preview-embed-wrap">
        <iframe
          className="collection-preview-embed"
          src={item.src}
          title={`${item.title} preview`}
          loading="lazy"
          allow="autoplay; fullscreen; encrypted-media"
          tabIndex={-1}
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <span className="collection-preview-placeholder" aria-hidden="true" />
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

function CandidateArchivePage({ candidate }: { candidate: ArchiveCandidate }) {
  const sectionLabel =
    candidate.section === "state" ? "State work" : "Federal work";
  const backHref =
    candidate.section === "state" ? "#state-media" : "#campaign-media";

  return (
    <section
      className="candidate-archive-page"
      aria-labelledby="candidate-archive-title"
    >
      <a className="archive-back-link" href={backHref}>
        <ChevronLeft size={18} aria-hidden="true" />
        Back to media
      </a>

      <div className="candidate-archive-hero">
        <div>
          <p className="eyebrow">{candidate.eyebrow}</p>
          <h1 id="candidate-archive-title">{candidate.name}</h1>
          <p>{candidate.summary}</p>
        </div>

        <aside className="candidate-archive-stats">
          <span>{sectionLabel}</span>
          <strong>{candidate.seat}</strong>
          <span>{candidate.media.length} pieces</span>
        </aside>
      </div>

      <div className="candidate-archive-grid">
        {candidate.media.map((item) => (
          <ArchiveMediaCard
            item={item}
            key={item.id}
            ownerName={candidate.name}
          />
        ))}
      </div>
    </section>
  );
}

function ArchiveMediaCard({
  item,
  ownerName,
}: {
  item: ArchiveMediaItem;
  ownerName?: string;
}) {
  const isPhoto = isArchivePhoto(item);
  const isLocalPhoto = item.kind === "photo" && !item.src.startsWith("http");
  const isExternal = item.src.startsWith("http");
  const isEmbeddedVideo = isExternal && !isPhoto && item.kind !== "video";
  const openHref = isExternal || item.kind === "video" || isLocalPhoto ? item.src : null;
  const openLabel = isExternal
    ? `Open ${item.title} in OneDrive`
    : isLocalPhoto
      ? `Open ${item.title} photo`
      : `Open ${item.title} video`;
  const hoverName = ownerName ?? item.category;
  const frameStyle = getExternalMediaFrameStyle(item.src);
  const frameClassName = [
    "external-campaign-frame",
    item.kind === "video" ? "is-video" : isPhoto ? "is-photo" : "is-video",
    item.kind === "video" ? "is-local-video" : "",
    isEmbeddedVideo ? "is-embed-video" : "",
    item.orientation ? `is-${item.orientation}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const cardClassName = [
    "external-campaign-card",
    "archive-media-card",
    item.kind === "video" ? "is-video" : isPhoto ? "is-photo" : "is-video",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className={frameClassName} style={frameStyle}>
        {item.kind === "video" ? (
          <video
            src={item.src}
            poster={item.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
          />
        ) : isLocalPhoto ? (
          <img src={item.src} alt="" loading="lazy" />
        ) : (
          <iframe
            src={isPhoto ? getPhotoPreviewSrc(item.src) : item.src}
            title={item.title}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
        )}
        <span className="media-hover-name" aria-hidden="true">
          {hoverName}
        </span>
      </div>

      <div className="external-campaign-meta">
        <div>
          <h3>{item.title}</h3>
          <p>{item.context}</p>
        </div>
        {openHref && (
          <a
            href={openHref}
            target="_blank"
            rel="noreferrer"
            aria-label={openLabel}
          >
            <ExternalLink size={18} aria-hidden="true" />
          </a>
        )}
      </div>
      <span>{item.category}</span>
    </article>
  );
}

function ExternalCampaignCard({ item }: { item: ExternalCampaignEmbed }) {
  const isPhoto = isOneDrivePhoto(item.src);
  const isEmbeddedVideo = !isPhoto;
  const frameStyle = getExternalMediaFrameStyle(item.src);
  const frameClassName = [
    "external-campaign-frame",
    isPhoto ? "is-photo" : "is-video",
    isEmbeddedVideo ? "is-embed-video" : "",
    item.orientation ? `is-${item.orientation}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const cardClassName = [
    "external-campaign-card",
    isPhoto ? "is-photo" : "is-video",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className={frameClassName} style={frameStyle}>
        <iframe
          src={isPhoto ? getPhotoPreviewSrc(item.src) : item.src}
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
