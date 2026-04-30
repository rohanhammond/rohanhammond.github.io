import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
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

type CampaignMediaTab = "videos" | "reels" | "photos";

type ExternalCampaignEmbed = {
  id: string;
  title: string;
  context: string;
  category: string;
  src: string;
  orientation?: "landscape" | "portrait" | "square";
};

type ArchiveMediaItem = ExternalCampaignEmbed & {
  kind?: "embed" | "video";
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

const stateCampaignEmbeds: ExternalCampaignEmbed[] = [
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
    id: "hayley-edwards-photo-one",
    title: "Hayley Edwards Campaign Still",
    context: "State Campaign Photography",
    category: "Hayley Edwards + Libby Mettam",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQSo1lJbuFtXQafaDJQrWKo2AS7yA6_uGLWm5uRuMeOfQhY?width=5629&height=3753",
  },
  {
    id: "hayley-edwards-photo-two",
    title: "Hayley Edwards Field Coverage",
    context: "State Campaign Photography",
    category: "Hayley Edwards + Libby Mettam",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQS3RMv7JNr7SZ6TZO8KKF0HAZzNo5ePRe4PSdoZ3x5fumI?width=5673&height=3782",
  },
  {
    id: "nitin-vashisht-local-club",
    title: "Nitin Vashisht Local Club Piece",
    context: "Candidate Campaign Video",
    category: "Nitin Vashisht",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQSYxP_w-dBQqj4sRDlHHuHAWxK8bGaz_eRiBjDeGx8Dhk?width=3840&height=2160",
  },
  {
    id: "nitin-vashisht-school",
    title: "Nitin Vashisht School Piece",
    context: "Candidate Campaign Video",
    category: "Nitin Vashisht",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSn0xXmh8v4SLZ6J824eUZuAe5oX8t-_6Kpz3rxsmZsvuo?width=3840&height=2160",
  },
  {
    id: "nitin-vashisht-traffic",
    title: "Nitin Vashisht Traffic Piece",
    context: "Candidate Campaign Video",
    category: "Nitin Vashisht",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQTVc_maXyqYQbm9qtEbOcO0AeCQg5h7u4bf4PfDJyBdmO4",
  },
  {
    id: "sandra-brewer-coverage",
    title: "Sandra Brewer Campaign Coverage",
    context: "State Campaign Photography",
    category: "Sandra Brewer",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQTlRO_MKOFtSbLqUpcXPTBZAe7KmqVql53oCXWknrVIh6Q?width=2773&height=4160",
    orientation: "portrait",
  },
  {
    id: "sandra-brewer-photo-one",
    title: "Sandra Brewer Campaign Still",
    context: "State Campaign Photography",
    category: "Sandra Brewer",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQ-VAgTL9YHSqqyDkQQs0gAAYFOA6kpVPR4laS-tMIADEc?width=5739&height=3826",
  },
  {
    id: "sandra-brewer-photo-two",
    title: "Sandra Brewer Field Coverage",
    context: "State Campaign Photography",
    category: "Sandra Brewer",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQhbFLYPXtETqh0B4QHLiAPAWztncKorXPdt1RPH5Z-0fs?width=5560&height=3707",
  },
  {
    id: "andra-piece-to-camera",
    title: "Andra Biondi Piece-to-Camera",
    context: "State Campaign Video",
    category: "Victoria Park",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQTyAwxV3vdfQavj_0iiPOCEAbj4Hr6osW09zh73u-rIxKw?width=3840&height=2160",
  },
  {
    id: "andra-racecourse-libby",
    title: "Andra Biondi with Libby Mettam",
    context: "State Campaign Video",
    category: "Victoria Park",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSIsVqxoUn9TIu61NCf8ADLAZsf6NLewXar8uKrMNzkPbw?width=3840&height=2160",
  },
  {
    id: "aswath-comms-photo",
    title: "Aswath Chavittupara Campaign Field",
    context: "State Campaign Photography",
    category: "Morley",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQS_VVLJPd-SSbYAqrbuAlJtAQZFu3Zt63ibqIFWgRkqil0?width=5740&height=3827",
  },
  {
    id: "aswath-comms-field-photo",
    title: "Aswath Chavittupara Community Coverage",
    context: "State Campaign Photography",
    category: "Morley",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQ5qfwpfliESYi4uYXmV1pnAb3TGbBINFg9CpEhMlhfJMY?width=5021&height=3347",
  },
  {
    id: "lisa-olsson-video",
    title: "Lisa Olsson Campaign Piece",
    context: "State Campaign Video",
    category: "Hillarys",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRuhxv_SpLITI1MGN4AP95LAb1o47S89cS2C9VjObocmb8?width=3840&height=2160",
  },
  {
    id: "lisa-olsson-photo",
    title: "Lisa Olsson Campaign Portrait",
    context: "State Campaign Photography",
    category: "Hillarys",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQdxNVXMH96T7dIdgd5tSaQAZlJfpfz7LyjwORS79omJxw?width=4000&height=6000",
    orientation: "portrait",
  },
  {
    id: "scott-edwardes-road",
    title: "Scott Edwardes Road Clip",
    context: "State Campaign Short Video",
    category: "Kingsley",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQQOl8eZMllSpgtqkvg44ssAQenMtPGHH9lvAGsmRO3ceQ?width=1920&height=1920",
    orientation: "square",
  },
  {
    id: "scott-edwardes-student",
    title: "Scott Edwardes Student Clip",
    context: "State Campaign Short Video",
    category: "Kingsley",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQ6xx6SG4LWTbC4Fy6ghcazAVqFxoNt8cQ1vOkclH7FJiE?width=1920&height=1920",
    orientation: "square",
  },
  {
    id: "scott-edwardes-police",
    title: "Scott Edwardes Police Reel",
    context: "State Campaign Reel",
    category: "Kingsley",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQKudQ1w23NQKxaUkfakpuvAdFNO-3t_20i_PS0FpYmV7M?width=1080&height=1920",
    orientation: "portrait",
  },
  {
    id: "scott-edwardes-health",
    title: "Scott Edwardes Health Reel",
    context: "State Campaign Reel",
    category: "Kingsley",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQFRNcufpm5QqcE9jwv32FgAf_3LBmzaqvp_maHhvxPCKk?width=1080&height=1920",
    orientation: "portrait",
  },
];

const federalCampaignEmbeds: ExternalCampaignEmbed[] = [
  {
    id: "liam-trish-vince-broll",
    title: "Liam, Trish & Vince B-roll",
    context: "Cross-Campaign B-roll",
    category: "Candidate Travel",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRUul58E3usQLbSR6B8gEy1AZm8L9BobVHzsEMbX4Gcjms?width=1920&height=1080",
  },
  {
    id: "liam-trish-vince-vince-broll",
    title: "Vince Connelly B-roll",
    context: "Cross-Campaign B-roll",
    category: "Candidate Travel",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQS2jIJcHfhBSZZIN6cpeIGRAci2LfMqut3b8C4qdSP-UxY?width=3840&height=2160",
  },
  {
    id: "sean-ayres-field-work",
    title: "Sean Ayres Campaign Field Work",
    context: "Federal Campaign Photography",
    category: "Burt",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQTRlGg3NdGxRZGbuZp7qciNAdlEKJgJy0DCtO2I9GVzq6w?width=5933&height=3955",
  },
  {
    id: "sean-ayres-photo-one",
    title: "Sean Ayres Campaign Still",
    context: "Federal Campaign Photography",
    category: "Burt",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQSmGapYlrfrQYny4O1QQb9rATPRAsinXvH7nI2DMyEVbXU?width=5755&height=3837",
  },
  {
    id: "sean-ayres-photo-two",
    title: "Sean Ayres Field Coverage",
    context: "Federal Campaign Photography",
    category: "Burt",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQSzDeSIUv77Rp0P0JrgtndaARF3YPN_TBYoCyxGdGY283Q?width=6000&height=4000",
  },
  {
    id: "tom-white-ptc-5",
    title: "Tom White Piece-to-Camera",
    context: "Federal Campaign Video",
    category: "Curtin",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQdpjVisYVESINfod6QVQZ_AdZHqhN5rbtQiI2W8LAUhCU?width=1920&height=1920",
    orientation: "square",
  },
  {
    id: "tom-white-ptc-2",
    title: "Tom White Social Cut",
    context: "Federal Campaign Video",
    category: "Curtin",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQKS1UCY2ntTLZahyzOG8ttAQJXXxKmiKUYGDaQvuTheqo?width=1920&height=1920",
    orientation: "square",
  },
  {
    id: "vince-connelly-surfing",
    title: "Vince Connelly Surfing Piece",
    context: "Federal Campaign Video",
    category: "Moore",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSkD2kkoP8zRrqSdCZcK_3PAXiS-xuzdc6dniesKzY8ynU?width=2160&height=3840",
    orientation: "portrait",
  },
  {
    id: "vince-connelly-drone",
    title: "Vince Connelly Drone Coverage",
    context: "Federal Campaign B-roll",
    category: "Moore",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRsbUI7bCesRoRnNzZApzSLARE4ZZZtb6tuz0ikubuIUOM?width=5472&height=3078",
  },
  {
    id: "vince-connelly-photo",
    title: "Vince Connelly Campaign Still",
    context: "Federal Campaign Photography",
    category: "Moore",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQSkCZVfisfoS51qJIp5qnHCAe1fattGkOzig4xXZq3eluQ?width=6000&height=4000",
  },
  {
    id: "mic-fels-dutton-photo",
    title: "Mic Fels with Peter Dutton",
    context: "Federal Campaign Photography",
    category: "Swan",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQQpYibKcYRtS4Gn9JLM__FAAUDNl5lOR2B0moiqRPFC2a0?width=5657&height=3771",
  },
  {
    id: "mic-fels-playground-upgrades",
    title: "Mic Fels Playground Upgrades",
    context: "Federal Campaign Video",
    category: "Swan",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRzZQ-zLR-gQq9bMvmQF6PQAWpc2r2gjqiH31uRyIsMNDs",
  },
  {
    id: "mic-fels-foreshore-lighting",
    title: "Mic Fels Foreshore Lighting Reel",
    context: "Federal Campaign Reel",
    category: "Swan",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRLb2mZ6ySnT7vz31-Ieq_tAYMbmLvQquKqWzjzR109_jk?width=1296&height=2304",
    orientation: "portrait",
  },
  {
    id: "matt-moran-dutton-photo",
    title: "Matt Moran Dutton Event",
    context: "Federal Campaign Photography",
    category: "Bullwinkel",
    src: "https://1drv.ms/i/c/9d9f7c4362637c48/IQRT_F3t7LglQKXuWSsXNbTkAe8-krqh372A6dRDo5HwRQQ?width=5760&height=3840",
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
    eyebrow: "2025 WA State Election / Electorate Office",
    summary:
      "Local issue videos, reels, field coverage, community explainers, and continuing electorate media for one of the strongest WA Liberal social audiences.",
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
    seat: "State campaign coverage",
    eyebrow: "2025 WA State Election",
    summary:
      "Press conference and campaign coverage produced around leader-level field activity and local campaign moments.",
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
    eyebrow: "2025 WA State Election",
    summary:
      "Community sport and local club campaign coverage packaged for social distribution and candidate storytelling.",
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
    eyebrow: "2025 WA State Election",
    summary:
      "Candidate photography and event coverage from the campaign archive, built for fast social and campaign collateral use.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "sandra-brewer-coverage",
      "sandra-brewer-photo-one",
      "sandra-brewer-photo-two",
    ]),
  },
  {
    id: "andra-biondi",
    section: "state",
    name: "Andra Biondi",
    seat: "Victoria Park",
    eyebrow: "2025 WA State Election",
    summary:
      "Candidate pieces, local issue filming, and leader-adjacent field coverage from the Victoria Park campaign archive.",
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
    eyebrow: "2025 WA State Election",
    summary:
      "Campaign stills and communications plan photography for social, local campaign material, and candidate-facing assets.",
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "aswath-comms-photo",
      "aswath-comms-field-photo",
    ]),
  },
  {
    id: "lisa-olsson",
    section: "state",
    name: "Lisa Olsson",
    seat: "Hillarys",
    eyebrow: "2025 WA State Election",
    summary:
      "A mixed candidate archive of video, portraiture, and campaign field material for a targeted local race.",
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
    eyebrow: "2025 WA State Election",
    summary:
      "A deeper set of short campaign clips across roads, students, police, and health, built for fast local issue messaging.",
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
    eyebrow: "2025 Federal Election",
    summary:
      "Piece-to-camera and square social cuts for a high-attention metropolitan federal campaign.",
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
    eyebrow: "2025 Federal Election",
    summary:
      "Candidate video, drone coverage, and campaign stills spanning local lifestyle, field footage, and electorate-facing campaign visuals.",
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
    eyebrow: "2025 Federal Election",
    summary:
      "Federal campaign stills from leader-visit activity and field coverage in Bullwinkel.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "matt-moran-dutton-photo",
    ]),
  },
  {
    id: "mic-fels",
    section: "federal",
    name: "Mic Fels",
    seat: "Swan",
    eyebrow: "2025 Federal Election",
    summary:
      "Federal campaign photography and local commitment videos covering candidate activity, Dutton campaign events, and social-first local issues.",
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
    eyebrow: "2025 Federal Election",
    summary:
      "Federal campaign field photography from Burt, focused on showing candidate presence, ground activity, and campaign atmosphere.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "sean-ayres-field-work",
      "sean-ayres-photo-one",
      "sean-ayres-photo-two",
    ]),
  },
  {
    id: "liam-trish-vince",
    section: "federal",
    name: "Liam, Trish & Vince",
    seat: "Cross-candidate campaign b-roll",
    eyebrow: "2025 Federal Campaign",
    summary:
      "Multi-candidate b-roll and field material built to give the federal campaign archive more motion, texture, and reusable visual coverage.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "liam-trish-vince-broll",
      "liam-trish-vince-vince-broll",
    ]),
  },
  {
    id: "leader-visits",
    section: "federal",
    name: "Peter Dutton campaign events",
    seat: "Federal campaign events",
    eyebrow: "2025 Federal Campaign",
    summary:
      "Leader-visit material across multiple candidates, showing event coverage, candidate positioning, and national campaign moments in WA.",
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "mic-fels-dutton-photo",
      "matt-moran-dutton-photo",
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
    "mic-fels-dutton-photo",
    "sean-ayres-field-work",
    "sean-ayres-photo-one",
    "sean-ayres-photo-two",
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
    "aswath-comms-photo",
    "aswath-comms-field-photo",
    "lisa-olsson-photo",
  ]),
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
    orientation: "portrait",
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
    id: "portrait",
    type: "image",
    src: "/media/amalfi-portrait.jpg",
    title: "Portrait Session",
    category: "Portrait",
    year: "2025",
  },
];

const mediaItems = [...campaignVideoItems, ...portfolioMediaItems];

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
    () => portfolioMediaItems.filter((item) => !item.featured),
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
          <a href="#work" onClick={() => setMenuOpen(false)}>
            Work
          </a>
          <a href="#campaigns" onClick={() => setMenuOpen(false)}>
            Campaigns
          </a>
          <a href="#campaign-media" onClick={() => setMenuOpen(false)}>
            Media
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

        <CampaignMediaSection
          id="campaign-media"
          eyebrow="Federal Campaign Media"
          title="Federal videos, reels, and photos."
          summary="Selected work from metropolitan federal campaigns and leader-visit activity, ordered to foreground Tom White, Vince Connelly, and Matt Moran."
          clientHeading="Some federal clients we've worked with"
          clients={federalCandidateArchives}
          items={federalCampaignMedia}
        />

        <CampaignMediaSection
          id="state-media"
          eyebrow="State Campaign Media"
          title="State videos, reels, and photos."
          summary="Selected state campaign work across candidates, local issues, leader events, field coverage, and social-first campaign content."
          clientHeading="Some state clients we've worked with"
          clients={stateCandidateArchives}
          items={stateCampaignMedia}
        />

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
  { id: "videos", label: "Videos" },
  { id: "reels", label: "Reels" },
  { id: "photos", label: "Photos" },
];

function getCampaignMediaTab(item: ArchiveMediaItem): CampaignMediaTab {
  if (isOneDrivePhoto(item.src)) return "photos";
  if (item.orientation === "portrait") return "reels";

  return "videos";
}

function getCampaignMediaCountLabel(tab: CampaignMediaTab, count: number) {
  if (tab === "photos") return `${count} ${count === 1 ? "still" : "stills"}`;
  if (tab === "reels") {
    return `${count} ${count === 1 ? "vertical cut" : "vertical cuts"}`;
  }

  return `${count} ${count === 1 ? "edit" : "edits"}`;
}

type CampaignMediaSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  clientHeading: string;
  clients: ArchiveCandidate[];
  items: ArchiveMediaItem[];
};

function CampaignMediaSection({
  id,
  eyebrow,
  title,
  summary,
  clientHeading,
  clients,
  items,
}: CampaignMediaSectionProps) {
  const [activeTab, setActiveTab] = useState<CampaignMediaTab>("videos");
  const itemsByTab = useMemo(
    () => ({
      videos: items.filter((item) => getCampaignMediaTab(item) === "videos"),
      reels: items.filter((item) => getCampaignMediaTab(item) === "reels"),
      photos: items.filter((item) => getCampaignMediaTab(item) === "photos"),
    }),
    [items],
  );
  const activeItems = itemsByTab[activeTab];
  const headingId = `${id}-title`;
  const panelId = `${id}-panel`;

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

      <div className="campaign-clients" aria-label={clientHeading}>
        <div className="client-column">
          <h4>{clientHeading}</h4>
          <div className="client-list">
            {clients.map((candidate) => (
              <a
                href={`#archive/${candidate.section}/${candidate.id}`}
                key={candidate.id}
              >
                {candidate.name}
              </a>
            ))}
          </div>
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
        className={`campaign-video-grid is-${activeTab}`}
        id={panelId}
        role="tabpanel"
      >
        {activeItems.map((item) => (
          <ArchiveMediaCard item={item} key={item.id} />
        ))}
      </div>
    </section>
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
    candidate.section === "state" ? "State archive" : "Federal archive";

  return (
    <section
      className="candidate-archive-page"
      aria-labelledby="candidate-archive-title"
    >
      <a className="archive-back-link" href="#campaign-media">
        <ChevronLeft size={18} aria-hidden="true" />
        Campaign media
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
          <span>{candidate.media.length} selected samples</span>
        </aside>
      </div>

      <div className="candidate-archive-grid">
        {candidate.media.map((item) => (
          <ArchiveMediaCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}

function ArchiveMediaCard({ item }: { item: ArchiveMediaItem }) {
  const isPhoto = isOneDrivePhoto(item.src);
  const isExternal = item.src.startsWith("http");
  const isEmbeddedVideo = isExternal && !isPhoto && item.kind !== "video";
  const frameStyle = getExternalMediaFrameStyle(item.src);
  const frameClassName = [
    "external-campaign-frame",
    item.kind === "video" ? "is-video" : isPhoto ? "is-photo" : "is-video",
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
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <iframe
            src={isPhoto ? getPhotoPreviewSrc(item.src) : item.src}
            title={item.title}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
        )}
      </div>

      <div className="external-campaign-meta">
        <div>
          <h3>{item.title}</h3>
          <p>{item.context}</p>
        </div>
        {isExternal && (
          <a
            href={item.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${item.title} in OneDrive`}
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
