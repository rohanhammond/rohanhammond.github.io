import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  preview?: string;
};

type ArchiveCandidate = {
  id: string;
  section: "state" | "federal";
  name: string;
  seat: string;
  eyebrow: string;
  summary: string;
  media: ArchiveMediaItem[];
  previews?: Partial<Record<CampaignMediaTab, string>>;
  previewPosition?: Partial<Record<CampaignMediaTab, string>>;
};

type CampaignMediaCollection = {
  candidate: ArchiveCandidate;
  items: ArchiveMediaItem[];
  preview: ArchiveMediaItem;
  previewImageSrc: string | null;
  previewPosition: string | null;
};

type ArchiveMediaCarouselTab = "photography" | "videography";

type ArchiveRoute = {
  section: "state" | "federal";
  candidateId: string;
} | null;

type ExternalMediaFrameStyle = CSSProperties & {
  "--media-aspect"?: string;
};

const PHOTO_PREVIEW_MAX_SIZE = 1800;
const PUBLIC_MEDIA_BASE_URL = "https://pub-44f737fca8834fddaf1698ca1ceca309.r2.dev";
const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL ?? "").replace(
  /\/$/,
  "",
);
const RESOLVED_MEDIA_BASE_URL = MEDIA_BASE_URL || PUBLIC_MEDIA_BASE_URL;
const ARCHIVE_PIECE_PREVIEW_VERSION = "20260504";

const mediaUrl = (path: string) =>
  path.startsWith("/") ? `${RESOLVED_MEDIA_BASE_URL}${path}` : path;

const archivePreviewUrl = (name: string) =>
  mediaUrl(`/media/archive-previews/${name}.jpg`);

const archivePiecePreviewUrl = (id: string) =>
  mediaUrl(
    `/media/archive-piece-previews/${id}.jpg?v=${ARCHIVE_PIECE_PREVIEW_VERSION}`,
  );
const michellePosterUrl = (index: number) =>
  mediaUrl(
    `/media/michelle-hoffman/michelle-video-${index}-poster.jpg?v=20260503`,
  );

const archivePiecePreviewIds = new Set([
  "andra-piece-to-camera",
  "andra-racecourse-libby",
  "aswath-comms-field-photo",
  "aswath-comms-photo",
  "hayley-edwards-presser",
  "hayley-edwards-photo-one",
  "hayley-edwards-photo-two",
  "jonathan-huston-door-knocking",
  "liam-trish-vince-broll",
  "liam-trish-vince-vince-broll",
  "lisa-olsson-photo",
  "lisa-olsson-video",
  "mic-fels-dutton-photo",
  "mic-fels-foreshore-lighting",
  "mic-fels-playground-upgrades",
  "nitin-vashisht-local-club",
  "nitin-vashisht-school",
  "nitin-vashisht-traffic",
  "sandra-brewer-coverage",
  "sandra-brewer-photo-one",
  "sandra-brewer-photo-two",
  "scott-edwardes-health",
  "scott-edwardes-police",
  "scott-edwardes-road",
  "scott-edwardes-student",
  "tom-white-ptc-2",
  "tom-white-ptc-5",
  "vince-connelly-drone",
  "vince-connelly-photo",
  "vince-connelly-surfing",
]);

const getArchivePiecePreviewUrl = (id: string) =>
  archivePiecePreviewIds.has(id) ? archivePiecePreviewUrl(id) : undefined;

const shouldUseArchivePreviewStill = (item: ArchiveMediaItem) =>
  item.id.startsWith("mic-fels-") &&
  item.src.startsWith("http") &&
  !isHostedMediaSrc(item.src) &&
  Boolean(getArchiveMediaPreviewImageSrc(item));

const cloudMediaUrl = (path: string) => mediaUrl(path);

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
};

const oneDriveClientExportUrl = (folder: string, file: string) => {
  const parent = `/personal/9d9f7c4362637c48/Documents/Client Exports/${folder}`;
  const params = new URLSearchParams({
    id: `${parent}/${file}`,
    parent,
  });

  return `https://onedrive.live.com/?${params.toString()}`;
};

const getGeneratedMediaId = (prefix: string, index: number) =>
  `${prefix}-${String(index + 1).padStart(2, "0")}`;

const getGeneratedMediaIds = (prefix: string, files: readonly string[]) =>
  files.map((_, index) => getGeneratedMediaId(prefix, index));

type OneDriveMediaConfig = {
  prefix: string;
  title: string;
  category: string;
  folder: string;
  files: readonly string[];
  orientation?: ArchiveMediaItem["orientation"];
};

const createOneDrivePhotoItems = ({
  prefix,
  title,
  category,
  folder,
  files,
  orientation,
}: OneDriveMediaConfig): ArchiveMediaItem[] =>
  files.flatMap((file, index) =>
    file.startsWith("/media/")
      ? [
          {
            id: getGeneratedMediaId(prefix, index),
            title: `${title} ${index + 1}`,
            context: "Photo",
            category,
            kind: "photo" as const,
            src: mediaUrl(file),
            orientation,
          },
        ]
      : [],
  );

const createOneDriveVideoItems = ({
  prefix,
  title,
  category,
  folder,
  files,
  orientation,
}: OneDriveMediaConfig): ArchiveMediaItem[] =>
  [];

type LocalMediaConfig = Omit<OneDriveMediaConfig, "folder"> & {
  titleStartIndex?: number;
  orientations?: Partial<Record<string, ArchiveMediaItem["orientation"]>>;
};

type LocalVideoMediaConfig = LocalMediaConfig & {
  posters?: readonly string[];
};

const createLocalPhotoItems = ({
  prefix,
  title,
  category,
  files,
  orientation,
  orientations,
  titleStartIndex = 1,
}: LocalMediaConfig): ArchiveMediaItem[] =>
  files.map((file, index) => ({
    id: getGeneratedMediaId(prefix, index),
    title: `${title} ${index + titleStartIndex}`,
    context: "Photo",
    category,
    kind: "photo",
    src: mediaUrl(file),
    orientation: orientations?.[file] ?? orientation,
  }));

const createLocalVideoItems = ({
  prefix,
  title,
  category,
  files,
  orientation,
  orientations,
  posters,
  titleStartIndex = 1,
}: LocalVideoMediaConfig): ArchiveMediaItem[] =>
  files.map((file, index) => ({
    id: getGeneratedMediaId(prefix, index),
    title: `${title} ${index + titleStartIndex}`,
    context: "Video",
    category,
    kind: "video",
    src: mediaUrl(file),
    poster: posters?.[index] ? mediaUrl(posters[index]) : undefined,
    orientation: orientations?.[file] ?? orientation,
  }));

const libbyMettamCover = "/media/libby-mettam/cover.jpg";
const libbyMettamPhotoFiles = [
  "/media/libby-mettam/1.jpg",
  "/media/libby-mettam/2.jpg",
  "/media/libby-mettam/3.jpg",
  "/media/libby-mettam/4.jpg",
  "/media/libby-mettam/5.jpg",
  "/media/libby-mettam/6.jpg",
  "/media/libby-mettam/7.jpg",
  "/media/libby-mettam/8.jpg",
  "/media/libby-mettam/9.jpg",
  "/media/libby-mettam/10.jpg",
  "/media/libby-mettam/11.jpg",
];
const jonathanHustonMlaThumbnail = mediaUrl(
  "/media/jonathan-huston/jonathan-huston-mla-thumbnail.jpg",
);

const jonathanHustonPhotoFiles = [
  "_DSC0448-Enhanced-NR.jpg",
  "_DSC0448-Enhanced-NR-2.jpg",
  "_DSC0458-Enhanced-NR.jpg",
  "_DSC0476-Enhanced-NR.jpg",
  "_DSC0482-Enhanced-NR.jpg",
  "_DSC0487-Enhanced-NR.jpg",
  "_DSC5263-Enhanced-NR.jpg",
  "_DSC5388-Enhanced-NR.jpg",
  "_DSC5408-Enhanced-NR.jpg",
  "_DSC5505-Enhanced-NR.jpg",
  "_DSC5536-Enhanced-NR.jpg",
  "_DSC5540-Enhanced-NR.jpg",
  "_DSC6786.jpg",
  "_DSC6806.jpg",
  "_DSC8063.jpg",
  "_DSC8064.jpg",
  "_DSC8065.jpg",
  "_DSC8066.jpg",
  "_DSC8101-Edit.jpg",
  "_DSC8127-Enhanced-NR.jpg",
];

const hayleyEdwardsPhotoFiles = [
  "_DSC1582.jpg",
  "_DSC1752.jpg",
  "_DSC1891.jpg",
  "_DSC1912.jpg",
  "_DSC1924.jpg",
  "_DSC1941.jpg",
  "_DSC1989.jpg",
  "_DSC6261.jpg",
  "_DSC6274.jpg",
  "_DSC6329.jpg",
  "_DSC6340.jpg",
  "_DSC6344.jpg",
  "_DSC6387.jpg",
  "_DSC6585.jpg",
  "_DSC6732.jpg",
  "_DSC6743.jpg",
  "_DSC6783.jpg",
  "_DSC6807.jpg",
];

const claireMoodyPhotoFiles = [
  "/media/claire-moody/_DSC1582.jpg",
  "/media/claire-moody/_DSC1752.jpg",
  "/media/claire-moody/_DSC1891.jpg",
  "/media/claire-moody/_DSC1912.jpg",
  "/media/claire-moody/_DSC1924.jpg",
  "/media/claire-moody/_DSC1941.jpg",
  "/media/claire-moody/_DSC1989.jpg",
];

const nitinVashishtPhotoFiles = [
  "_DSC1375.jpg",
  "_DSC1443.jpg",
  "_DSC1473.jpg",
  "_DSC1496.jpg",
  "_DSC1507.jpg",
  "_DSC1511.jpg",
  "_DSC1528.jpg",
  "_DSC1559.jpg",
  "_DSC1594.jpg",
  "_DSC1601.jpg",
  "_DSC1611.jpg",
  "_DSC1616.jpg",
  "_DSC1621.jpg",
  "_DSC1666.jpg",
  "_DSC1687.jpg",
  "_DSC1707.jpg",
  "_DSC1720.jpg",
  "_DSC1737.jpg",
  "_DSC1754.jpg",
  "_DSC1767.jpg",
];
const nitinVashishtThumbnail = mediaUrl(
  "/media/nitin-vashisht/nitin-vashisht-thumbnail.jpg",
);

const sandraBrewerPhotoFiles = [
  "/media/sandra-brewer/_DSC0028-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0298-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0302-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0317-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0322-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0330-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0431-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0434-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0438-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0439-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0440-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0442-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0446-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0448-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0458-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0460-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0466-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0476-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0482-Enhanced-NR.jpg",
  "/media/sandra-brewer/_DSC0487-Enhanced-NR.jpg",
];

const andraBiondiPhotoFiles = [
  "/media/andra-biondi/photos/_DSC0036-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC0047-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7446.jpg",
  "/media/andra-biondi/photos/_DSC7459.jpg",
  "/media/andra-biondi/photos/_DSC7463.jpg",
  "/media/andra-biondi/photos/_DSC7491-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7504-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7506.jpg",
  "/media/andra-biondi/photos/_DSC7574-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7594-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7651-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7669-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7680-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7709-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7712-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7717-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC7722-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC9742-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC9840-Enhanced-NR.jpg",
  "/media/andra-biondi/photos/_DSC9975-Enhanced-NR.jpg",
];

const andraBiondiVideoFiles = [
  "/media/andra-biondi/videos/1-andra-speech.mp4",
  "/media/andra-biondi/videos/1-follow-my-page-4k.mp4",
  "/media/andra-biondi/videos/2-health-up-to-4k.mp4",
  "/media/andra-biondi/videos/2-michael-speech.mp4",
  "/media/andra-biondi/videos/3-chris-speech.mp4",
  "/media/andra-biondi/videos/3-cost-of-living-up-to-4k.mp4",
  "/media/andra-biondi/videos/4-crime-forum-up-to-4k.mp4",
  "/media/andra-biondi/videos/5-crime-2-up-to-4k.mp4",
  "/media/andra-biondi/videos/6-health2-up-to-4k.mp4",
  "/media/andra-biondi/videos/7-cost-of-living-2-up-to-4k.mp4",
  "/media/andra-biondi/videos/8-crime-1-up-to-4k.mp4",
  "/media/andra-biondi/videos/andra-crime-doco-full.mp4",
  "/media/andra-biondi/videos/andra-piece-to-camera.mp4",
  "/media/andra-biondi/videos/bruce-crime-doco-full.mp4",
];

const andraBiondiPosterFiles = [
  "/media/andra-biondi/posters/1-andra-speech.jpg",
  "/media/andra-biondi/posters/1-follow-my-page-4k.jpg",
  "/media/andra-biondi/posters/2-health-up-to-4k.jpg",
  "/media/andra-biondi/posters/2-michael-speech.jpg",
  "/media/andra-biondi/posters/3-chris-speech.jpg",
  "/media/andra-biondi/posters/3-cost-of-living-up-to-4k.jpg",
  "/media/andra-biondi/posters/4-crime-forum-up-to-4k.jpg",
  "/media/andra-biondi/posters/5-crime-2-up-to-4k.jpg",
  "/media/andra-biondi/posters/6-health2-up-to-4k.jpg",
  "/media/andra-biondi/posters/7-cost-of-living-2-up-to-4k.jpg",
  "/media/andra-biondi/posters/8-crime-1-up-to-4k.jpg",
  "/media/andra-biondi/posters/andra-crime-doco-full.jpg",
  "/media/andra-biondi/posters/andra-piece-to-camera.jpg",
  "/media/andra-biondi/posters/bruce-crime-doco-full.jpg",
];
const andraBiondiThumbnail = mediaUrl(
  "/media/andra-biondi/andra-biondi-thumbnail.jpg",
);

const aswathChavittuparaPhotoFiles = [
  "_DSC3421.jpg",
  "_DSC3436.jpg",
  "_DSC3447.jpg",
  "_DSC3452.jpg",
  "_DSC3465.jpg",
  "_DSC3491.jpg",
  "_DSC3498.jpg",
  "_DSC3555.jpg",
  "_DSC3611.jpg",
  "_DSC3619.jpg",
  "_DSC3633.jpg",
  "_DSC3642.jpg",
  "_DSC3646.jpg",
  "_DSC3655.jpg",
  "_DSC3663.jpg",
  "_DSC3671.jpg",
  "_DSC3682.jpg",
  "_DSC3688.jpg",
  "_DSC3701.jpg",
  "_DSC3712.jpg",
];

const aswathChavittuparaPhotoPaths = aswathChavittuparaPhotoFiles.map(
  (file) => `/media/aswath-chavittupara/${file}`,
);
const aswathChavittuparaThumbnail = mediaUrl(
  "/media/aswath-chavittupara/aswath-chavittupara-thumbnail.jpg",
);

const michelleHoffmanPhotoFiles = [
  "/media/michelle-hoffman/album/michelle-photo-05.jpg",
  "/media/michelle-hoffman/album/michelle-photo-06.jpg",
  "/media/michelle-hoffman/album/michelle-photo-07.jpg",
  "/media/michelle-hoffman/album/michelle-photo-08.jpg",
  "/media/michelle-hoffman/album/michelle-photo-09.jpg",
  "/media/michelle-hoffman/album/michelle-photo-10.jpg",
  "/media/michelle-hoffman/album/michelle-photo-11.jpg",
  "/media/michelle-hoffman/album/michelle-photo-12.jpg",
  "/media/michelle-hoffman/album/michelle-photo-13.jpg",
  "/media/michelle-hoffman/album/michelle-photo-14.jpg",
  "/media/michelle-hoffman/album/michelle-photo-15.jpg",
  "/media/michelle-hoffman/album/michelle-photo-16.jpg",
  "/media/michelle-hoffman/album/michelle-photo-17.jpg",
  "/media/michelle-hoffman/album/michelle-photo-18.jpg",
  "/media/michelle-hoffman/album/michelle-photo-19.jpg",
  "/media/michelle-hoffman/album/michelle-photo-20.jpg",
];

const michelleHoffmanPhotoOrientations = Object.fromEntries(
  [
    "/media/michelle-hoffman/album/michelle-photo-07.jpg",
    "/media/michelle-hoffman/album/michelle-photo-08.jpg",
    "/media/michelle-hoffman/album/michelle-photo-09.jpg",
    "/media/michelle-hoffman/album/michelle-photo-16.jpg",
    "/media/michelle-hoffman/album/michelle-photo-19.jpg",
    "/media/michelle-hoffman/album/michelle-photo-20.jpg",
  ].map((file) => [file, "portrait" as const]),
);

const lisaOlssonPhotoFiles = [
  "/media/lisa-olsson/photos/_DSC0541.jpg",
  "/media/lisa-olsson/photos/_DSC0543.jpg",
  "/media/lisa-olsson/photos/_DSC0546.jpg",
  "/media/lisa-olsson/photos/_DSC0548.jpg",
  "/media/lisa-olsson/photos/_DSC0556.jpg",
  "/media/lisa-olsson/photos/_DSC0559.jpg",
];

const lisaOlssonPhotoOrientations = Object.fromEntries(
  [
    "/media/lisa-olsson/photos/_DSC0543.jpg",
    "/media/lisa-olsson/photos/_DSC0548.jpg",
    "/media/lisa-olsson/photos/_DSC0559.jpg",
  ].map((file) => [file, "portrait" as const]),
);

const lisaOlssonVideoFiles = [
  "/media/lisa-olsson/videos/lisa-olsson-up-to-4k.mp4",
];

const lisaOlssonPosterFiles = [
  "/media/lisa-olsson/posters/lisa-olsson-up-to-4k.jpg",
];

const scottEdwardesPhotoFiles = [
  "_DSC1024.jpg",
  "_DSC1031.jpg",
  "_DSC1036.jpg",
  "_DSC1038.jpg",
  "_DSC1041.jpg",
  "_DSC1069.jpg",
  "_DSC1105.jpg",
  "_DSC1111.jpg",
  "_DSC1118.jpg",
  "_DSC1132.jpg",
  "_DSC1144.jpg",
  "_DSC1171.jpg",
  "_DSC1177.jpg",
  "_DSC1195.jpg",
  "_DSC1213.jpg",
  "_DSC1260.jpg",
  "_DSC1277.jpg",
  "_DSC1284.jpg",
  "_DSC1297.jpg",
  "_DSC1298.jpg",
];
const scottEdwardesThumbnail = mediaUrl(
  "/media/scott-edwardes/scott-edwardes-thumbnail.jpg",
);

const seanAyresPhotoFiles = [
  "/media/sean-ayres/_DSC4617.jpg",
  "/media/sean-ayres/_DSC4626.jpg",
  "/media/sean-ayres/_DSC4646.jpg",
  "/media/sean-ayres/_DSC4674.jpg",
  "/media/sean-ayres/_DSC4723.jpg",
  "/media/sean-ayres/_DSC4741.jpg",
  "/media/sean-ayres/_DSC4769.jpg",
  "/media/sean-ayres/_DSC4802.jpg",
  "/media/sean-ayres/_DSC4813.jpg",
  "/media/sean-ayres/_DSC4827.jpg",
  "/media/sean-ayres/_DSC4835.jpg",
  "/media/sean-ayres/_DSC4841.jpg",
  "/media/sean-ayres/_DSC4911.jpg",
  "/media/sean-ayres/_DSC4947.jpg",
  "/media/sean-ayres/_DSC4992.jpg",
  "/media/sean-ayres/_DSC5047.jpg",
  "/media/sean-ayres/_DSC5055.jpg",
  "/media/sean-ayres/_DSC5084.jpg",
  "/media/sean-ayres/_DSC5094.jpg",
  "/media/sean-ayres/_DSC5126.jpg",
];
const seanAyresThumbnail = mediaUrl(
  "/media/sean-ayres/sean-ayres-thumbnail.jpg",
);

const vinceConnellyPhotoFiles = [
  "/media/vince-connelly/photos/_DSC2693.jpg",
  "/media/vince-connelly/photos/_DSC2697.jpg",
  "/media/vince-connelly/photos/_DSC2706.jpg",
  "/media/vince-connelly/photos/_DSC2709.jpg",
  "/media/vince-connelly/photos/_DSC2713-Enhanced-NR.jpg",
  "/media/vince-connelly/photos/_DSC2717.jpg",
  "/media/vince-connelly/photos/_DSC2719.jpg",
  "/media/vince-connelly/photos/_DSC2722.jpg",
  "/media/vince-connelly/photos/_DSC2723.jpg",
  "/media/vince-connelly/photos/_DSC3697.jpg",
  "/media/vince-connelly/photos/_DSC3735.jpg",
  "/media/vince-connelly/photos/_DSC3742.jpg",
  "/media/vince-connelly/photos/_DSC3743.jpg",
  "/media/vince-connelly/photos/_DSC3749.jpg",
  "/media/vince-connelly/photos/_DSC3750.jpg",
  "/media/vince-connelly/photos/_DSC3757.jpg",
  "/media/vince-connelly/photos/_DSC3759.jpg",
  "/media/vince-connelly/photos/_DSC3771.jpg",
  "/media/vince-connelly/photos/_DSC3772.jpg",
  "/media/vince-connelly/photos/_DSC3773.jpg",
  "/media/vince-connelly/photos/_DSC3774.jpg",
  "/media/vince-connelly/photos/_DSC3838.jpg",
  "/media/vince-connelly/photos/_DSC3844.jpg",
  "/media/vince-connelly/photos/_DSC3878.jpg",
  "/media/vince-connelly/photos/_DSC3906.jpg",
  "/media/vince-connelly/photos/_DSC3914.jpg",
  "/media/vince-connelly/photos/_DSC3963.jpg",
  "/media/vince-connelly/photos/_DSC3973.jpg",
  "/media/vince-connelly/photos/_DSC3976.jpg",
];

const mattMoranDuttonPhotoFiles = [
  "/media/matt-moran/dutton-photos/_DSC2496-Enhanced-NR-2.jpg",
  "/media/matt-moran/dutton-photos/_DSC2547-Enhanced-NR-2.jpg",
  "/media/matt-moran/dutton-photos/_DSC2575-Enhanced-NR-2.jpg",
  "/media/matt-moran/dutton-photos/_DSC2629-Enhanced-NR-2.jpg",
  "/media/matt-moran/dutton-photos/_DSC2635-Enhanced-NR-2.jpg",
  "/media/matt-moran/dutton-photos/_DSC2645-Enhanced-NR-2.jpg",
  "/media/matt-moran/dutton-photos/_DSC2782-Enhanced-NR-2.jpg",
  "/media/matt-moran/dutton-photos/_DSC2786-Enhanced-NR-2.jpg",
  "/media/matt-moran/dutton-photos/568A0515.jpg",
  "/media/matt-moran/dutton-photos/568A0673.jpg",
  "/media/matt-moran/dutton-photos/568A0681.jpg",
  "/media/matt-moran/dutton-photos/568A0797.jpg",
  "/media/matt-moran/dutton-photos/568A0942.jpg",
  "/media/matt-moran/dutton-photos/568A1129.jpg",
  "/media/matt-moran/dutton-photos/568A1190.jpg",
  "/media/matt-moran/dutton-photos/568A1256.jpg",
  "/media/matt-moran/dutton-photos/568A1307.jpg",
  "/media/matt-moran/dutton-photos/568A1399.jpg",
  "/media/matt-moran/dutton-photos/568A2149.jpg",
  "/media/matt-moran/dutton-photos/568A2160.jpg",
];
const mattMoranThumbnail = mediaUrl(
  "/media/matt-moran/matt-moran-thumbnail.jpg",
);

const micFelsPhotoFiles = [
  "/media/mic-fels/photos/mic-fels-photo-01.jpg",
  "/media/mic-fels/photos/mic-fels-photo-02.jpg",
  "/media/mic-fels/photos/mic-fels-photo-03.jpg",
  "/media/mic-fels/photos/mic-fels-photo-04.jpg",
  "/media/mic-fels/photos/mic-fels-photo-05.jpg",
];

const campaignStats: CampaignStat[] = [
  {
    value: "25",
    label: "state campaigns",
    detail: "Video and photo support across local campaigns.",
  },
  {
    value: "8",
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
    src: mediaUrl("/media/campaign-videos/jono-door-knocking-recap.mp4"),
    poster: mediaUrl("/media/campaign-videos/jono-door-knocking-recap-poster.jpg"),
    title: "Door Knocking Recap",
    category: "Jonathan Huston",
    year: "2025",
    orientation: "landscape",
  },
  {
    id: "jono-bowling-club",
    type: "video",
    src: mediaUrl("/media/campaign-videos/jono-bowling-club.mp4"),
    poster: mediaUrl("/media/campaign-videos/jono-bowling-club-poster.jpg"),
    title: "Dalkeith Nedlands Bowling Club",
    category: "Community Issue",
    year: "2025",
    orientation: "landscape",
  },
  {
    id: "jono-traffic",
    type: "video",
    src: mediaUrl("/media/campaign-videos/jono-traffic.mp4"),
    poster: mediaUrl("/media/campaign-videos/jono-traffic-poster.jpg"),
    title: "Thomas Street Traffic",
    category: "Local Issue",
    year: "2025",
    orientation: "landscape",
  },
  {
    id: "jono-high-rise",
    type: "video",
    src: mediaUrl("/media/campaign-videos/jono-high-rise.mp4"),
    poster: mediaUrl("/media/campaign-videos/jono-high-rise-poster.jpg"),
    title: "High-Rise Planning",
    category: "Planning Issue",
    year: "2025",
    orientation: "portrait",
  },
  {
    id: "jono-iga-door-knocking",
    type: "video",
    src: mediaUrl("/media/campaign-videos/jono-iga-door-knocking.mp4"),
    poster: mediaUrl("/media/campaign-videos/jono-iga-door-knocking-poster.jpg"),
    title: "IGA Door Knocking",
    category: "Field work",
    year: "2024",
    orientation: "landscape",
  },
  {
    id: "jono-hospital-services",
    type: "video",
    src: mediaUrl("/media/campaign-videos/jono-hospital-services.mp4"),
    poster: mediaUrl("/media/campaign-videos/jono-hospital-services-poster.jpg"),
    title: "Hospital Services",
    category: "Health Services",
    year: "2024",
    orientation: "portrait",
  },
];

const jonathanHustonExampleReelItems: ArchiveMediaItem[] = [
  {
    id: "jonathan-huston-matilda-bay-ptc",
    kind: "video",
    title: "Matilda Bay PTC",
    context: "Example reel",
    category: "Jonathan Huston",
    src: cloudMediaUrl("/media/jonathan-huston/reels/jono-matilda-bay-ptc.m4v"),
    poster: mediaUrl("/media/jonathan-huston/reels/jono-matilda-bay-ptc-poster.jpg"),
    orientation: "portrait",
  },
  {
    id: "jonathan-huston-public-sector-discipline",
    kind: "video",
    title: "Public Sector Discipline",
    context: "Example reel",
    category: "Jonathan Huston",
    src: cloudMediaUrl("/media/jonathan-huston/reels/public-sector-discipline.m4v"),
    poster: mediaUrl("/media/jonathan-huston/reels/public-sector-discipline-poster.jpg"),
    orientation: "portrait",
  },
  {
    id: "jonathan-huston-public-sector-reform",
    kind: "video",
    title: "Public Sector Reform",
    context: "Example reel",
    category: "Jonathan Huston",
    src: cloudMediaUrl("/media/jonathan-huston/reels/public-sector-reform.m4v"),
    poster: mediaUrl("/media/jonathan-huston/reels/public-sector-reform-poster.jpg"),
    orientation: "portrait",
  },
  {
    id: "jonathan-huston-cemeteries",
    kind: "video",
    title: "Cemeteries",
    context: "Example reel",
    category: "Jonathan Huston",
    src: cloudMediaUrl("/media/jonathan-huston/reels/cemeteries.m4v"),
    poster: mediaUrl("/media/jonathan-huston/reels/cemeteries-poster.jpg"),
    orientation: "portrait",
  },
  {
    id: "jonathan-huston-road-rail-water",
    kind: "video",
    title: "Road, Rail & Water",
    context: "Example reel",
    category: "Jonathan Huston",
    src: cloudMediaUrl("/media/jonathan-huston/reels/road-rail-water.m4v"),
    poster: mediaUrl("/media/jonathan-huston/reels/road-rail-water-poster.jpg"),
    orientation: "portrait",
  },
];

const jonathanHustonExampleReelIds = jonathanHustonExampleReelItems.map(
  (item) => item.id,
);

const libbyMettamPhotoItems: ArchiveMediaItem[] = libbyMettamPhotoFiles.map(
  (file, index) => ({
    id: getGeneratedMediaId("libby-mettam-photo", index),
    title: `Libby Mettam Photo ${index + 1}`,
    context: "Photo",
    category: "Libby Mettam",
    kind: "photo",
    src: file,
  }),
);

const stateCampaignEmbeds: ArchiveMediaItem[] = [
  ...libbyMettamPhotoItems,
  {
    id: "jonathan-huston-door-knocking",
    title: "Jonathan Huston Door Knocking",
    context: "Video",
    category: "Jonathan Huston",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQSiaTAmA04yR5iYTG0ZkaQkAZQv5V7RTDSoiG8PPGHjABk?width=3840&height=2160",
  },
  ...jonathanHustonExampleReelItems,
  ...createOneDrivePhotoItems({
    prefix: "jonathan-huston-photo",
    title: "Jonathan Huston Photo",
    category: "Nedlands",
    folder: "Jonathan Huston/Photos",
    files: jonathanHustonPhotoFiles,
  }),
  {
    id: "hayley-edwards-presser",
    title: "Hayley Edwards Presser",
    context: "Video",
    category: "Hayley Edwards + Libby Mettam",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQQQ926QY6NjQYdaPgW-YG5jAT4wxJVaIwO3xIZQTXhEJYQ?width=1920&height=1080",
  },
  {
    id: "hayley-edwards-photo-one",
    kind: "photo",
    title: "Hayley Edwards Still",
    context: "Photo",
    category: "Hayley Edwards + Libby Mettam",
    src: cloudMediaUrl("/media/archive-originals/hayley-edwards-photo-one.jpg"),
  },
  {
    id: "hayley-edwards-photo-two",
    kind: "photo",
    title: "Hayley Edwards Field Coverage",
    context: "Photo",
    category: "Hayley Edwards + Libby Mettam",
    src: cloudMediaUrl("/media/archive-originals/hayley-edwards-photo-two.jpg"),
  },
  ...createOneDrivePhotoItems({
    prefix: "hayley-edwards-photo-extra",
    title: "Hayley Edwards Photo",
    category: "Field coverage",
    folder: "Hayley Edwards + Libby Mettam Presser",
    files: hayleyEdwardsPhotoFiles,
  }),
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
  ...createOneDriveVideoItems({
    prefix: "nitin-vashisht-video-extra",
    title: "Nitin Vashisht Video",
    category: "Riverton",
    folder: "Nitin Vashisht",
    files: ["1. The Esplanade.mp4"],
  }),
  ...createOneDrivePhotoItems({
    prefix: "nitin-vashisht-photo",
    title: "Nitin Vashisht Photo",
    category: "Riverton",
    folder: "Nitin Vashisht/Photos",
    files: nitinVashishtPhotoFiles,
  }),
  {
    id: "sandra-brewer-coverage",
    kind: "photo",
    title: "Sandra Brewer Coverage",
    context: "Photo",
    category: "Sandra Brewer",
    src: cloudMediaUrl("/media/archive-originals/sandra-brewer-coverage.jpg"),
    orientation: "portrait",
  },
  {
    id: "sandra-brewer-photo-one",
    kind: "photo",
    title: "Sandra Brewer Still",
    context: "Photo",
    category: "Sandra Brewer",
    src: cloudMediaUrl("/media/archive-originals/sandra-brewer-photo-one.jpg"),
  },
  {
    id: "sandra-brewer-photo-two",
    kind: "photo",
    title: "Sandra Brewer Field Coverage",
    context: "Photo",
    category: "Sandra Brewer",
    src: cloudMediaUrl("/media/archive-originals/sandra-brewer-photo-two.jpg"),
  },
  {
    id: "sandra-brewer-parliament-one",
    title: "Sandra Brewer Parliament Still",
    context: "Photo",
    category: "Sandra Brewer",
    kind: "photo",
    src: cloudMediaUrl("/media/sandra-brewer/_DSC0028-Enhanced-NR.jpg"),
  },
  {
    id: "sandra-brewer-parliament-two",
    title: "Sandra Brewer Chamber Still",
    context: "Photo",
    category: "Sandra Brewer",
    kind: "photo",
    src: cloudMediaUrl("/media/sandra-brewer/_DSC0298-Enhanced-NR.jpg"),
  },
  {
    id: "sandra-brewer-parliament-three",
    title: "Sandra Brewer Field Still",
    context: "Photo",
    category: "Sandra Brewer",
    kind: "photo",
    src: cloudMediaUrl("/media/sandra-brewer/_DSC0302-Enhanced-NR.jpg"),
  },
  {
    id: "sandra-brewer-parliament-four",
    title: "Sandra Brewer Event Still",
    context: "Photo",
    category: "Sandra Brewer",
    kind: "photo",
    src: cloudMediaUrl("/media/sandra-brewer/_DSC0317-Enhanced-NR.jpg"),
  },
  ...createLocalPhotoItems({
    prefix: "sandra-brewer-photo-extra",
    title: "Sandra Brewer Photo",
    category: "Cottesloe",
    files: sandraBrewerPhotoFiles,
  }),
  {
    id: "chris-dowson-swimming-club",
    title: "Chris Dowson Swimming Club",
    context: "Video",
    category: "Chris Dowson",
    kind: "video",
    poster: cloudMediaUrl("/media/chris-dowson/posters/swimming-club.jpg"),
    src: cloudMediaUrl("/media/chris-dowson/videos/swimming-club.mp4"),
  },
  {
    id: "chris-dowson-local-parks",
    title: "Chris Dowson Local Parks",
    context: "Video",
    category: "Chris Dowson",
    kind: "video",
    poster: cloudMediaUrl("/media/chris-dowson/posters/local-parks.jpg"),
    src: cloudMediaUrl("/media/chris-dowson/videos/local-parks.mp4"),
  },
  {
    id: "chris-dowson-small-business",
    title: "Chris Dowson Small Business",
    context: "Video",
    category: "Chris Dowson",
    kind: "video",
    poster: cloudMediaUrl("/media/chris-dowson/posters/small-businesses.jpg"),
    src: cloudMediaUrl("/media/chris-dowson/videos/small-businesses.mp4"),
  },
  {
    id: getGeneratedMediaId("chris-dowson-video-extra", 0),
    title: "Chris Dowson Field Clip",
    context: "Video",
    category: "State work",
    kind: "video",
    poster: cloudMediaUrl("/media/chris-dowson/posters/color-graded-clip-1.jpg"),
    src: cloudMediaUrl("/media/chris-dowson/videos/color-graded-clip-1.mp4"),
  },
  {
    id: "chris-dowson-photo-one",
    title: "Chris Dowson Still",
    context: "Photo",
    category: "Chris Dowson",
    kind: "photo",
    src: cloudMediaUrl("/media/chris-dowson/photos/dsc0654.jpg"),
  },
  {
    id: "chris-dowson-photo-two",
    title: "Chris Dowson Field Still",
    context: "Photo",
    category: "Chris Dowson",
    kind: "photo",
    src: cloudMediaUrl("/media/chris-dowson/photos/dsc0661.jpg"),
  },
  {
    id: "chris-dowson-photo-three",
    title: "Chris Dowson Community Still",
    context: "Photo",
    category: "Chris Dowson",
    kind: "photo",
    src: cloudMediaUrl("/media/chris-dowson/photos/dsc0663.jpg"),
  },
  {
    id: "chris-dowson-photo-four",
    title: "Chris Dowson Event Still",
    context: "Photo",
    category: "Chris Dowson",
    kind: "photo",
    src: cloudMediaUrl("/media/chris-dowson/photos/dsc0668.jpg"),
  },
  ...createLocalVideoItems({
    prefix: "andra-biondi-video",
    title: "Andra Biondi Video",
    category: "Victoria Park",
    files: andraBiondiVideoFiles,
    posters: andraBiondiPosterFiles,
  }),
  ...createLocalPhotoItems({
    prefix: "andra-biondi-photo",
    title: "Andra Biondi Photo",
    category: "Victoria Park",
    files: andraBiondiPhotoFiles,
  }),
  {
    id: "aswath-comms-photo",
    kind: "photo",
    title: "Aswath Chavittupara Field",
    context: "Photo",
    category: "Morley",
    src: mediaUrl("/media/aswath-chavittupara/aswath-comms-photo.jpg"),
  },
  {
    id: "aswath-comms-field-photo",
    kind: "photo",
    title: "Aswath Chavittupara Community Coverage",
    context: "Photo",
    category: "Morley",
    src: mediaUrl("/media/aswath-chavittupara/aswath-comms-field-photo.jpg"),
  },
  ...createLocalPhotoItems({
    prefix: "aswath-chavittupara-photo",
    title: "Aswath Chavittupara Photo",
    category: "Morley",
    files: aswathChavittuparaPhotoPaths,
  }),
  {
    id: "michelle-hoffman-video-one",
    kind: "video",
    title: "Michelle Hoffman Video 1",
    context: "Video",
    category: "Michelle Hoffman",
    src: mediaUrl("/media/michelle-hoffman/michelle-video-1.mp4"),
    poster: michellePosterUrl(1),
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-video-two",
    kind: "video",
    title: "Michelle Hoffman Video 2",
    context: "Video",
    category: "Michelle Hoffman",
    src: mediaUrl("/media/michelle-hoffman/michelle-video-2.mp4"),
    poster: michellePosterUrl(2),
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-video-three",
    kind: "video",
    title: "Michelle Hoffman Video 3",
    context: "Video",
    category: "Michelle Hoffman",
    src: mediaUrl("/media/michelle-hoffman/michelle-video-3.mp4"),
    poster: michellePosterUrl(3),
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-video-four",
    kind: "video",
    title: "Michelle Hoffman Video 4",
    context: "Video",
    category: "Michelle Hoffman",
    src: mediaUrl("/media/michelle-hoffman/michelle-video-4.mp4"),
    poster: michellePosterUrl(4),
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-photo-one",
    kind: "photo",
    title: "Michelle Hoffman Portrait",
    context: "Photo",
    category: "Michelle Hoffman",
    src: mediaUrl("/media/michelle-hoffman/michelle-photo-1.jpg"),
    orientation: "portrait",
  },
  {
    id: "michelle-hoffman-photo-two",
    kind: "photo",
    title: "Michelle Hoffman Parliament Still",
    context: "Photo",
    category: "Michelle Hoffman",
    src: mediaUrl("/media/michelle-hoffman/michelle-photo-2.jpg"),
  },
  {
    id: "michelle-hoffman-photo-three",
    kind: "photo",
    title: "Michelle Hoffman Interview Still",
    context: "Photo",
    category: "Michelle Hoffman",
    src: mediaUrl("/media/michelle-hoffman/michelle-photo-3.jpg"),
  },
  {
    id: "michelle-hoffman-photo-four",
    kind: "photo",
    title: "Michelle Hoffman Field Still",
    context: "Photo",
    category: "Michelle Hoffman",
    src: mediaUrl("/media/michelle-hoffman/michelle-photo-4.jpg"),
  },
  ...createLocalPhotoItems({
    prefix: "michelle-hoffman-photo-extra",
    title: "Michelle Hoffman Photo",
    category: "Michelle Hoffman",
    files: michelleHoffmanPhotoFiles,
    orientations: michelleHoffmanPhotoOrientations,
    titleStartIndex: 5,
  }),
  ...createLocalVideoItems({
    prefix: "lisa-olsson-video",
    title: "Lisa Olsson Video",
    category: "Hillarys",
    files: lisaOlssonVideoFiles,
    posters: lisaOlssonPosterFiles,
  }),
  ...createLocalPhotoItems({
    prefix: "lisa-olsson-photo",
    title: "Lisa Olsson Photo",
    category: "Hillarys",
    files: lisaOlssonPhotoFiles,
    orientations: lisaOlssonPhotoOrientations,
  }),
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
  ...createOneDrivePhotoItems({
    prefix: "scott-edwardes-photo",
    title: "Scott Edwardes Photo",
    category: "Kingsley",
    folder: "Scott Edwardes/Photos",
    files: scottEdwardesPhotoFiles,
  }),
];

const federalCampaignEmbeds: ArchiveMediaItem[] = [
  ...claireMoodyPhotoFiles.map((file, index) => ({
    id: getGeneratedMediaId("claire-moody-photo", index),
    title: `Claire Moody Photo ${index + 1}`,
    context: "Photo",
    category: "Brand",
    kind: "photo" as const,
    src: mediaUrl(file),
  })),
  ...createLocalPhotoItems({
    prefix: "sean-ayres-photo",
    title: "Sean Ayres Photo",
    category: "Burt",
    files: seanAyresPhotoFiles,
  }),
  {
    id: "liam-trish-vince-broll",
    title: "Trish Botha B-roll",
    context: "B-roll",
    category: "Candidate Travel",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQRUul58E3usQLbSR6B8gEy1AZm8L9BobVHzsEMbX4Gcjms?width=1920&height=1080",
  },
  {
    id: "liam-trish-vince-vince-broll",
    title: "Trish Botha Campaign B-roll",
    context: "B-roll",
    category: "Candidate Travel",
    src: "https://1drv.ms/v/c/9d9f7c4362637c48/IQS2jIJcHfhBSZZIN6cpeIGRAci2LfMqut3b8C4qdSP-UxY?width=3840&height=2160",
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
  ...createOneDriveVideoItems({
    prefix: "tom-white-video-extra",
    title: "Tom White Video",
    category: "Curtin",
    folder: "Tom White",
    files: ["Piece to Camera Clip 3.m4v", "Piece to Camera Clip 4.m4v"],
    orientation: "square",
  }),
  {
    id: "vince-connelly-surfing",
    title: "Vince Connelly Surfing Piece",
    context: "Video",
    category: "Moore",
    kind: "video",
    src: cloudMediaUrl("/media/vince-connelly/videos/vince-connelly-surfing.mp4"),
    orientation: "portrait",
  },
  {
    id: "vince-connelly-drone",
    title: "Vince Connelly Drone Coverage",
    context: "B-roll",
    category: "Moore",
    kind: "video",
    src: cloudMediaUrl("/media/vince-connelly/videos/vince-connelly-drone.mp4"),
  },
  {
    id: "vince-connelly-photo",
    title: "Vince Connelly Still",
    context: "Photo",
    category: "Moore",
    kind: "photo",
    src: cloudMediaUrl("/media/vince-connelly/photos/vince-connelly-campaign-sign.jpg"),
  },
  {
    id: "vince-connelly-sign-waving",
    title: "Vince Connelly Sign Waving",
    context: "Photo",
    category: "Moore",
    kind: "photo",
    src: cloudMediaUrl("/media/vince-connelly/photos/vince-connelly-sign-waving.jpg"),
  },
  {
    id: "vince-connelly-supporters",
    title: "Vince Connelly Supporters",
    context: "Photo",
    category: "Moore",
    kind: "photo",
    src: cloudMediaUrl("/media/vince-connelly/photos/vince-connelly-supporters.jpg"),
  },
  ...createOneDrivePhotoItems({
    prefix: "vince-connelly-photo-extra",
    title: "Vince Connelly Photo",
    category: "Moore",
    folder: "Vince Connelly/Photos",
    files: vinceConnellyPhotoFiles,
  }),
  {
    id: "mic-fels-dutton-photo",
    kind: "photo",
    title: "Mic Fels with Peter Dutton",
    context: "Photo",
    category: "Swan",
    src: cloudMediaUrl("/media/archive-originals/mic-fels-dutton-photo.jpg"),
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
  ...createOneDriveVideoItems({
    prefix: "mic-fels-video-extra",
    title: "Mic Fels Video",
    category: "Swan",
    folder: "Mic Fels x Peter Dutton/Videos",
    files: ["Mic Fels Speech Landscape.m4v", "Peter Dutton Speech.m4v"],
  }),
  ...createOneDrivePhotoItems({
    prefix: "mic-fels-photo-extra",
    title: "Mic Fels Photo",
    category: "Swan",
    folder: "Mic Fels x Peter Dutton/Photos",
    files: micFelsPhotoFiles,
  }),
  ...createOneDrivePhotoItems({
    prefix: "matt-moran-dutton-photo",
    title: "Matt Moran Dutton Photo",
    category: "Bullwinkel",
    folder: "Matt Moran Media/Dutton Photos",
    files: mattMoranDuttonPhotoFiles,
  }),
  ...createOneDriveVideoItems({
    prefix: "matt-moran-video-extra",
    title: "Matt Moran Video",
    category: "Bullwinkel",
    folder: "Matt Moran Media/Peter Dutton Video",
    files: ["Peter Dutton Speeches.m4v"],
  }),
  ...createOneDriveVideoItems({
    prefix: "matt-moran-howard-video",
    title: "Matt Moran Howard Video",
    category: "Bullwinkel",
    folder: "Matt Moran Media/John Howard Videos",
    files: ["John Howard Highlight Reel.m4v", "John Howard Speeches.m4v"],
  }),
];

const isDefined = <T,>(item: T | undefined): item is T => Boolean(item);

const getCampaignEmbeds = (
  items: ArchiveMediaItem[],
  ids: string[],
): ArchiveMediaItem[] =>
  ids
    .map((id) => items.find((item) => item.id === id))
    .filter(isDefined)
    .map((item) => ({
      ...item,
      preview: item.preview ?? getArchivePiecePreviewUrl(item.id),
    }));

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
    id: "libby-mettam",
    section: "state",
    name: "Libby Mettam",
    seat: "State campaign",
    eyebrow: "2025",
    summary: "Campaign photo coverage and social-ready stills.",
    previews: {
      all: libbyMettamCover,
      photos: libbyMettamCover,
    },
    media: getCampaignEmbeds(
      stateCampaignEmbeds,
      getGeneratedMediaIds("libby-mettam-photo", libbyMettamPhotoFiles),
    ),
  },
  {
    id: "jonathan-huston",
    section: "state",
    name: "Jonathan Huston",
    seat: "Nedlands",
    eyebrow: "Elected member media",
    summary: "Local updates, issue videos, reels, and photos.",
    previews: {
      all: jonathanHustonMlaThumbnail,
      videos: mediaUrl("/media/campaign-videos/jono-bowling-club-poster.jpg"),
      reels: mediaUrl("/media/campaign-videos/jono-hospital-services-poster.jpg"),
      photos: jonathanHustonMlaThumbnail,
    },
    media: [
      ...getLocalCampaignVideos(),
      ...getCampaignEmbeds(stateCampaignEmbeds, [
        "jonathan-huston-door-knocking",
        ...jonathanHustonExampleReelIds,
        ...getGeneratedMediaIds(
          "jonathan-huston-photo",
          jonathanHustonPhotoFiles,
        ),
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
    previews: {
      all: archivePreviewUrl("hayley-edwards"),
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "hayley-edwards-presser",
      "hayley-edwards-photo-one",
      "hayley-edwards-photo-two",
      ...getGeneratedMediaIds(
        "hayley-edwards-photo-extra",
        hayleyEdwardsPhotoFiles,
      ),
    ]),
  },
  {
    id: "nitin-vashisht",
    section: "state",
    name: "Nitin Vashisht",
    seat: "Riverton",
    eyebrow: "2025",
    summary: "Local issue videos and community coverage.",
    previews: {
      all: nitinVashishtThumbnail,
      photos: nitinVashishtThumbnail,
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "nitin-vashisht-local-club",
      "nitin-vashisht-school",
      "nitin-vashisht-traffic",
      ...getGeneratedMediaIds(
        "nitin-vashisht-video-extra",
        ["1. The Esplanade.mp4"],
      ),
      ...getGeneratedMediaIds("nitin-vashisht-photo", nitinVashishtPhotoFiles),
    ]),
  },
  {
    id: "sandra-brewer",
    section: "state",
    name: "Sandra Brewer",
    seat: "Cottesloe",
    eyebrow: "2025",
    summary: "Photos and campaign event coverage.",
    previews: {
      all: mediaUrl("/media/sandra-brewer/_DSC0322-Enhanced-NR.jpg"),
      photos: mediaUrl("/media/sandra-brewer/_DSC0322-Enhanced-NR.jpg"),
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      ...getGeneratedMediaIds(
        "sandra-brewer-photo-extra",
        sandraBrewerPhotoFiles,
      ),
    ]),
  },
  {
    id: "chris-dowson",
    section: "state",
    name: "Chris Dowson",
    seat: "State work",
    eyebrow: "2025",
    summary: "Local issue videos, stills, and field coverage.",
    previews: {
      all: cloudMediaUrl("/media/chris-dowson/photos/dsc0663.jpg"),
      videos: cloudMediaUrl("/media/chris-dowson/posters/swimming-club.jpg"),
      photos: cloudMediaUrl("/media/chris-dowson/photos/dsc0663.jpg"),
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "chris-dowson-swimming-club",
      "chris-dowson-local-parks",
      "chris-dowson-small-business",
      ...getGeneratedMediaIds("chris-dowson-video-extra", [
        "4. Color Graded Clips Clip 1.m4v",
      ]),
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
    previews: {
      all: andraBiondiThumbnail,
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      ...getGeneratedMediaIds("andra-biondi-video", andraBiondiVideoFiles),
      ...getGeneratedMediaIds("andra-biondi-photo", andraBiondiPhotoFiles),
    ]),
  },
  {
    id: "aswath-chavittupara",
    section: "state",
    name: "Aswath Chavittupara",
    seat: "Morley",
    eyebrow: "2025",
    summary: "Field photography and local campaign stills.",
    previews: {
      all: aswathChavittuparaThumbnail,
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "aswath-comms-photo",
      "aswath-comms-field-photo",
      ...getGeneratedMediaIds(
        "aswath-chavittupara-photo",
        aswathChavittuparaPhotoFiles,
      ),
    ]),
  },
  {
    id: "michelle-hoffman",
    section: "state",
    name: "Michelle Hoffman",
    seat: "State work",
    eyebrow: "2025",
    summary: "Short videos, portraits, and campaign stills.",
    previews: {
      all: mediaUrl("/media/michelle-hoffman/michelle-photo-4.jpg"),
      videos: michellePosterUrl(1),
      reels: michellePosterUrl(1),
      photos: mediaUrl("/media/michelle-hoffman/michelle-photo-4.jpg"),
    },
    previewPosition: {
      all: "center 8%",
      videos: "center 8%",
      reels: "center 8%",
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "michelle-hoffman-video-one",
      "michelle-hoffman-video-two",
      "michelle-hoffman-video-three",
      "michelle-hoffman-video-four",
      "michelle-hoffman-photo-one",
      "michelle-hoffman-photo-two",
      "michelle-hoffman-photo-three",
      "michelle-hoffman-photo-four",
      ...getGeneratedMediaIds(
        "michelle-hoffman-photo-extra",
        michelleHoffmanPhotoFiles,
      ),
    ]),
  },
  {
    id: "lisa-olsson",
    section: "state",
    name: "Lisa Olsson",
    seat: "Hillarys",
    eyebrow: "2025",
    summary: "Video, portraits, and field coverage.",
    previews: {
      all: mediaUrl("/media/lisa-olsson/photos/_DSC0541.jpg"),
      photos: mediaUrl("/media/lisa-olsson/photos/_DSC0541.jpg"),
    },
    previewPosition: {
      all: "center 14%",
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      ...getGeneratedMediaIds("lisa-olsson-video", lisaOlssonVideoFiles),
      ...getGeneratedMediaIds("lisa-olsson-photo", lisaOlssonPhotoFiles),
    ]),
  },
  {
    id: "scott-edwardes",
    section: "state",
    name: "Scott Edwardes",
    seat: "Kingsley",
    eyebrow: "2025",
    summary: "Short videos for local issues and community updates.",
    previews: {
      all: scottEdwardesThumbnail,
      photos: scottEdwardesThumbnail,
    },
    media: getCampaignEmbeds(stateCampaignEmbeds, [
      "scott-edwardes-road",
      "scott-edwardes-student",
      "scott-edwardes-police",
      "scott-edwardes-health",
      ...getGeneratedMediaIds("scott-edwardes-photo", scottEdwardesPhotoFiles),
    ]),
  },
];

const federalCandidateArchives: ArchiveCandidate[] = [
  {
    id: "claire-moody",
    section: "federal",
    name: "Claire Moody",
    seat: "Brand",
    eyebrow: "2025",
    summary: "Field photography and local campaign coverage.",
    previews: {
      all: mediaUrl("/media/claire-moody/claire-moody-thumbnail.jpg"),
    },
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      ...getGeneratedMediaIds("claire-moody-photo", claireMoodyPhotoFiles),
    ]),
  },
  {
    id: "tom-white",
    section: "federal",
    name: "Tom White",
    seat: "Curtin",
    eyebrow: "2025",
    summary: "Piece-to-camera videos and social cuts.",
    previews: {
      all: archivePreviewUrl("tom-white"),
    },
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "tom-white-ptc-5",
      "tom-white-ptc-2",
      ...getGeneratedMediaIds("tom-white-video-extra", [
        "Piece to Camera Clip 3.m4v",
        "Piece to Camera Clip 4.m4v",
      ]),
    ]),
  },
  {
    id: "vince-connelly",
    section: "federal",
    name: "Vince Connelly",
    seat: "Moore",
    eyebrow: "2025",
    summary: "Video, drone coverage, and stills.",
    previews: {
      all: mediaUrl("/media/vince-connelly/vince-connelly-thumbnail.jpg"),
    },
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "vince-connelly-surfing",
      "vince-connelly-drone",
      ...getGeneratedMediaIds(
        "vince-connelly-photo-extra",
        vinceConnellyPhotoFiles,
      ),
    ]),
  },
  {
    id: "matt-moran",
    section: "federal",
    name: "Matt Moran",
    seat: "Bullwinkel",
    eyebrow: "2025",
    summary: "Leader-visit stills and event coverage.",
    previews: {
      all: archivePreviewUrl("matt-moran"),
    },
    previewPosition: {
      all: "center 30%",
    },
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      ...getGeneratedMediaIds(
        "matt-moran-dutton-photo",
        mattMoranDuttonPhotoFiles,
      ),
      ...getGeneratedMediaIds("matt-moran-video-extra", [
        "Peter Dutton Speeches.m4v",
      ]),
      ...getGeneratedMediaIds("matt-moran-howard-video", [
        "John Howard Highlight Reel.m4v",
        "John Howard Speeches.m4v",
      ]),
    ]),
  },
  {
    id: "mic-fels",
    section: "federal",
    name: "Mic Fels",
    seat: "Swan",
    eyebrow: "2025",
    summary: "Photos, local videos, and event coverage.",
    previews: {
      all: mediaUrl("/media/mic-fels/mic-fels-thumbnail.jpg"),
    },
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      "mic-fels-dutton-photo",
      "mic-fels-playground-upgrades",
      "mic-fels-foreshore-lighting",
      ...getGeneratedMediaIds("mic-fels-photo-extra", micFelsPhotoFiles),
    ]),
  },
  {
    id: "sean-ayres",
    section: "federal",
    name: "Sean Ayres",
    seat: "Burt",
    eyebrow: "2025",
    summary: "Field photography and campaign stills.",
    previews: {
      all: seanAyresThumbnail,
    },
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      ...getGeneratedMediaIds("sean-ayres-photo", seanAyresPhotoFiles),
    ]),
  },
  {
    id: "trish-botha",
    section: "federal",
    name: "Trish Botha",
    seat: "B-roll",
    eyebrow: "2025",
    summary: "B-roll and field material across candidates.",
    previews: {
      all: archivePreviewUrl("trish-botha"),
    },
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
    previews: {
      all: mattMoranThumbnail,
    },
    media: getCampaignEmbeds(federalCampaignEmbeds, [
      ...getGeneratedMediaIds(
        "matt-moran-dutton-photo",
        mattMoranDuttonPhotoFiles,
      ),
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
    ...getGeneratedMediaIds("claire-moody-photo", claireMoodyPhotoFiles),
    "tom-white-ptc-5",
    "tom-white-ptc-2",
    ...getGeneratedMediaIds("tom-white-video-extra", [
      "Piece to Camera Clip 3.m4v",
      "Piece to Camera Clip 4.m4v",
    ]),
    "vince-connelly-drone",
    "liam-trish-vince-vince-broll",
    "liam-trish-vince-broll",
    "mic-fels-playground-upgrades",
    "vince-connelly-surfing",
    "mic-fels-foreshore-lighting",
    ...getGeneratedMediaIds(
      "vince-connelly-photo-extra",
      vinceConnellyPhotoFiles,
    ),
    ...getGeneratedMediaIds(
      "matt-moran-dutton-photo",
      mattMoranDuttonPhotoFiles,
    ),
    ...getGeneratedMediaIds("matt-moran-video-extra", [
      "Peter Dutton Speeches.m4v",
    ]),
    ...getGeneratedMediaIds("matt-moran-howard-video", [
      "John Howard Highlight Reel.m4v",
      "John Howard Speeches.m4v",
    ]),
    "mic-fels-dutton-photo",
    ...getGeneratedMediaIds("mic-fels-photo-extra", micFelsPhotoFiles),
    ...getGeneratedMediaIds("sean-ayres-photo", seanAyresPhotoFiles),
  ],
);

const stateCampaignMedia: ArchiveMediaItem[] = [
  ...getLocalCampaignVideos(),
  ...getCampaignEmbeds(stateCampaignEmbeds, [
    ...getGeneratedMediaIds("libby-mettam-photo", libbyMettamPhotoFiles),
    "jonathan-huston-door-knocking",
    ...jonathanHustonExampleReelIds,
    ...getGeneratedMediaIds("jonathan-huston-photo", jonathanHustonPhotoFiles),
    "hayley-edwards-presser",
    ...getGeneratedMediaIds(
      "hayley-edwards-photo-extra",
      hayleyEdwardsPhotoFiles,
    ),
    "nitin-vashisht-local-club",
    "nitin-vashisht-school",
    "nitin-vashisht-traffic",
    ...getGeneratedMediaIds("nitin-vashisht-video-extra", [
      "1. The Esplanade.mp4",
    ]),
    ...getGeneratedMediaIds("nitin-vashisht-photo", nitinVashishtPhotoFiles),
    ...getGeneratedMediaIds("andra-biondi-video", andraBiondiVideoFiles),
    ...getGeneratedMediaIds("andra-biondi-photo", andraBiondiPhotoFiles),
    ...getGeneratedMediaIds("lisa-olsson-video", lisaOlssonVideoFiles),
    "scott-edwardes-road",
    "scott-edwardes-student",
    "scott-edwardes-police",
    "scott-edwardes-health",
    ...getGeneratedMediaIds("scott-edwardes-photo", scottEdwardesPhotoFiles),
    "hayley-edwards-photo-one",
    "hayley-edwards-photo-two",
    ...getGeneratedMediaIds(
      "sandra-brewer-photo-extra",
      sandraBrewerPhotoFiles,
    ),
    "chris-dowson-swimming-club",
    "chris-dowson-local-parks",
    "chris-dowson-small-business",
    ...getGeneratedMediaIds("chris-dowson-video-extra", [
      "4. Color Graded Clips Clip 1.m4v",
    ]),
    "chris-dowson-photo-one",
    "chris-dowson-photo-two",
    "chris-dowson-photo-three",
    "chris-dowson-photo-four",
    "aswath-comms-photo",
    "aswath-comms-field-photo",
    ...getGeneratedMediaIds(
      "aswath-chavittupara-photo",
      aswathChavittuparaPhotoFiles,
    ),
    "michelle-hoffman-video-one",
    "michelle-hoffman-video-two",
    "michelle-hoffman-video-three",
    "michelle-hoffman-video-four",
    "michelle-hoffman-photo-one",
    "michelle-hoffman-photo-two",
    "michelle-hoffman-photo-three",
    "michelle-hoffman-photo-four",
    ...getGeneratedMediaIds(
      "michelle-hoffman-photo-extra",
      michelleHoffmanPhotoFiles,
    ),
    ...getGeneratedMediaIds("lisa-olsson-photo", lisaOlssonPhotoFiles),
  ]),
];

const portfolioMediaItems: MediaItem[] = [
  {
    id: "campaign-video",
    type: "video",
    src: mediaUrl("/media/amalfi-media-strategy.mp4"),
    poster: mediaUrl("/media/amalfi-media-strategy-poster.jpg"),
    title: "Media Reel",
    category: "Video",
    year: "2025",
    featured: true,
    orientation: "portrait",
  },
  {
    id: "interview",
    type: "image",
    src: mediaUrl("/media/amalfi-interview.jpg"),
    title: "Interview work",
    category: "Photo",
    year: "2025",
  },
  {
    id: "community",
    type: "image",
    src: mediaUrl("/media/amalfi-community.jpg"),
    title: "Community photos",
    category: "Photography",
    year: "2025",
  },
  {
    id: "portrait",
    type: "image",
    src: mediaUrl("/media/amalfi-portrait.jpg"),
    title: "Portraits",
    category: "Portrait",
    year: "2025",
  },
];

const mediaItems = [...campaignVideoItems, ...portfolioMediaItems];

const aboutPhoto = {
  src: mediaUrl("/media/rohan-contact/rohan-headshot-01.jpg"),
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

function isHostedMediaSrc(src: string) {
  return (
    src.startsWith("/media/") ||
    src.startsWith(`${PUBLIC_MEDIA_BASE_URL}/media/`) ||
    Boolean(MEDIA_BASE_URL && src.startsWith(`${MEDIA_BASE_URL}/media/`))
  );
}

function getArchiveMediaPreviewImageSrc(item: ArchiveMediaItem) {
  if (item.preview) return item.preview;
  if (item.poster) return item.poster;
  if (isOneDrivePhoto(item.src)) return getPhotoPreviewSrc(item.src);
  if (isArchivePhoto(item) && isHostedMediaSrc(item.src)) return item.src;

  return null;
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

function canRenderArchivePhotoDirectly(item: ArchiveMediaItem) {
  return (
    isArchivePhoto(item) &&
    (!item.src.startsWith("http") ||
      isHostedMediaSrc(item.src) ||
      isOneDrivePhoto(item.src))
  );
}

function useArchiveLightbox(items: ArchiveMediaItem[]) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const activeIndex =
    activeItemId === null
      ? -1
      : items.findIndex((item) => item.id === activeItemId);
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null;

  const openItem = (item: ArchiveMediaItem) => {
    setActiveItemId(item.id);
  };

  const closeItem = () => {
    setActiveItemId(null);
  };

  const goToPrevious = () => {
    setActiveItemId((current) => {
      if (!current || items.length === 0) return current;

      const currentIndex = items.findIndex((item) => item.id === current);
      const previousIndex =
        currentIndex <= 0 ? items.length - 1 : currentIndex - 1;

      return items[previousIndex]?.id ?? current;
    });
  };

  const goToNext = () => {
    setActiveItemId((current) => {
      if (!current || items.length === 0) return current;

      const currentIndex = items.findIndex((item) => item.id === current);
      const nextIndex =
        currentIndex < 0 || currentIndex >= items.length - 1
          ? 0
          : currentIndex + 1;

      return items[nextIndex]?.id ?? current;
    });
  };

  return {
    activeItem,
    closeItem,
    goToNext,
    goToPrevious,
    openItem,
  };
}

function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [archiveRoute, setArchiveRoute] = useState<ArchiveRoute>(
    getArchiveRoute,
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
            <img src={mediaUrl("/media/amalfi-founder.jpg")} alt="" />
            <div className="hero-note">
              <span>Liberal digital media</span>
              <strong>Advice. Film. Photos.</strong>
            </div>
          </aside>
        </section>

        <section
          className="experience-split-section"
          id="campaigns"
          aria-labelledby="campaigns-title"
        >
          <aside className="experience-background-panel" aria-labelledby="proof-title">
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
          </aside>

          <div className="experience-panel">
            <div className="experience-heading">
              <p className="eyebrow">Experience</p>
              <h2 id="campaigns-title">Experience.</h2>
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

function isArchivePhoto(item: ArchiveMediaItem) {
  return item.kind === "photo" || isOneDrivePhoto(item.src);
}

function getCampaignMediaTab(item: ArchiveMediaItem): CampaignMediaTab {
  if (isArchivePhoto(item)) return "photos";
  if (item.orientation === "portrait") return "reels";

  return "videos";
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
  return getArchiveMediaPreviewImageSrc(item);
}

function getCandidatePreviewImageSrc(
  candidate: ArchiveCandidate,
  tab: CampaignMediaTab,
  preview: ArchiveMediaItem,
) {
  return (
    candidate.previews?.[tab] ??
    candidate.previews?.all ??
    getCollectionPreviewImageSrc(preview)
  );
}

function getCandidatePreviewPosition(
  candidate: ArchiveCandidate,
  tab: CampaignMediaTab,
) {
  return (
    candidate.previewPosition?.[tab] ??
    candidate.previewPosition?.all ??
    null
  );
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
        previewImageSrc: getCandidatePreviewImageSrc(candidate, tab, preview),
        previewPosition: getCandidatePreviewPosition(candidate, tab),
      };
    })
    .filter(isDefined);
}

function getExpandedCampaignMediaItems(
  items: ArchiveMediaItem[],
  tab: CampaignMediaTab,
) {
  if (tab !== "all") return items;
  if (items.some((item) => item.id === "mic-fels-dutton-photo")) return items;
  if (items.some((item) => item.id === "michelle-hoffman-photo-one")) {
    return items;
  }
  if (items.some((item) => item.id.startsWith("vince-connelly-photo-extra-"))) {
    return items;
  }
  if (items.some((item) => item.id.startsWith("andra-biondi-photo-"))) {
    return items;
  }
  if (items.some((item) => item.id.startsWith("lisa-olsson-photo-"))) {
    return items;
  }

  const motionItems = items.filter(
    (item) => getCampaignMediaTab(item) !== "photos",
  );

  return motionItems.length > 0 ? motionItems : items;
}

function getArchiveMediaCarouselItems(
  items: ArchiveMediaItem[],
  tab: ArchiveMediaCarouselTab,
) {
  return items.filter((item) =>
    tab === "photography" ? isArchivePhoto(item) : !isArchivePhoto(item),
  );
}

function getDefaultArchiveMediaCarouselTab(items: ArchiveMediaItem[]) {
  return getArchiveMediaCarouselItems(items, "photography").length > 0
    ? "photography"
    : "videography";
}

type ArchiveMediaCarouselProps = {
  items: ArchiveMediaItem[];
  ownerName?: string;
  fallbackPreviewImageSrc?: string | null;
  onClose?: () => void;
  closeLabel?: string;
};

function ArchiveMediaCarousel({
  items,
  ownerName,
  fallbackPreviewImageSrc,
  onClose,
  closeLabel = "Close media gallery",
}: ArchiveMediaCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<ArchiveMediaCarouselTab>(() =>
    getDefaultArchiveMediaCarouselTab(items),
  );

  const photographyItems = useMemo(
    () => getArchiveMediaCarouselItems(items, "photography"),
    [items],
  );
  const videographyItems = useMemo(
    () => getArchiveMediaCarouselItems(items, "videography"),
    [items],
  );
  const activeItems = useMemo(
    () =>
      activeTab === "photography" ? photographyItems : videographyItems,
    [activeTab, photographyItems, videographyItems],
  );
  const archiveLightbox = useArchiveLightbox(activeItems);
  const hasPhotography = photographyItems.length > 0;
  const hasVideography = videographyItems.length > 0;
  const showTabs = hasPhotography && hasVideography;

  useEffect(() => {
    if (activeTab === "photography" && photographyItems.length > 0) return;
    if (activeTab === "videography" && videographyItems.length > 0) return;

    setActiveTab(getDefaultArchiveMediaCarouselTab(items));
  }, [activeTab, items, photographyItems.length, videographyItems.length]);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeTab]);

  const scrollCarousel = (direction: "previous" | "next") => {
    const track = trackRef.current;

    if (!track) return;

    const amount = track.clientWidth * 0.85;
    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="archive-media-carousel">
        <div className="archive-media-carousel-toolbar">
          {showTabs ? (
            <div
              className="archive-media-carousel-tabs"
              role="tablist"
              aria-label="Media type"
            >
              <button
                className={
                  activeTab === "photography"
                    ? "archive-media-tab is-active"
                    : "archive-media-tab"
                }
                type="button"
                role="tab"
                aria-selected={activeTab === "photography"}
                aria-label={`Photography (${photographyItems.length})`}
                disabled={!hasPhotography}
                onClick={() => setActiveTab("photography")}
              >
                Photography
              </button>
              <button
                className={
                  activeTab === "videography"
                    ? "archive-media-tab is-active"
                    : "archive-media-tab"
                }
                type="button"
                role="tab"
                aria-selected={activeTab === "videography"}
                aria-label={`Videography (${videographyItems.length})`}
                disabled={!hasVideography}
                onClick={() => setActiveTab("videography")}
              >
                Videography
              </button>
            </div>
          ) : (
            <div aria-hidden="true" />
          )}

          <div className="archive-media-carousel-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Scroll previous media"
              onClick={() => scrollCarousel("previous")}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Scroll next media"
              onClick={() => scrollCarousel("next")}
            >
              <ChevronRight size={18} />
            </button>
            {onClose && (
              <button
                className="icon-button"
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {activeItems.length > 0 ? (
          <div className="archive-media-carousel-track" ref={trackRef}>
            {activeItems.map((item) => (
              <div className="archive-media-carousel-slide" key={item.id}>
                <ArchiveMediaCard
                  item={item}
                  minimal
                  ownerName={ownerName}
                  fallbackPreviewImageSrc={fallbackPreviewImageSrc}
                  onOpen={archiveLightbox.openItem}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="archive-media-carousel-empty">
            No media available in this tab.
          </p>
        )}
      </div>

      {archiveLightbox.activeItem && (
        <ArchiveLightbox
          item={archiveLightbox.activeItem}
          onClose={archiveLightbox.closeItem}
          onNext={archiveLightbox.goToNext}
          onPrevious={archiveLightbox.goToPrevious}
        />
      )}
    </>
  );
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
  const activeTab: CampaignMediaTab = "all";
  const [expandedCollectionId, setExpandedCollectionId] = useState<
    string | null
  >(null);
  const expandedGalleryRef = useRef<HTMLDivElement | null>(null);
  const activeCollections = useMemo(
    () => getCampaignMediaCollections(clients, activeTab),
    [clients],
  );
  const expandedCollection =
    activeCollections.find(
      (collection) => collection.candidate.id === expandedCollectionId,
    ) ?? null;
  const headingId = `${id}-title`;
  const panelId = `${id}-panel`;

  useEffect(() => {
    if (!expandedCollectionId) return;

    const frame = window.requestAnimationFrame(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      expandedGalleryRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [expandedCollectionId]);

  return (
    <section
      className="campaign-video-section campaign-media-suite"
      id={id}
      aria-labelledby={headingId}
    >
      <div className="section-heading campaign-media-heading">
        <p className="eyebrow">{eyebrow}</p>
        <div>
          <h2 id={headingId}>{title}</h2>
          <p className="section-summary">{summary}</p>
        </div>
      </div>

      <div
        className={`campaign-collection-grid is-${activeTab}`}
        id={panelId}
      >
        {activeCollections.map((collection) => {
          const collectionPanelId = `${panelId}-${collection.candidate.id}`;
          const isCollectionExpanded =
            expandedCollection?.candidate.id === collection.candidate.id;

          return (
            <Fragment key={collection.candidate.id}>
              <CampaignCollectionCard
                collection={collection}
                controlsId={collectionPanelId}
                isExpanded={isCollectionExpanded}
                tab={activeTab}
                onToggle={() =>
                  setExpandedCollectionId((current) =>
                    current === collection.candidate.id
                      ? null
                      : collection.candidate.id,
                  )
                }
              />

              {isCollectionExpanded && (
                <div
                  className="campaign-expanded-gallery"
                  id={collectionPanelId}
                  ref={expandedGalleryRef}
                >
                  <ArchiveMediaCarousel
                    items={getExpandedCampaignMediaItems(
                      collection.items,
                      activeTab,
                    )}
                    ownerName={collection.candidate.name}
                    fallbackPreviewImageSrc={collection.previewImageSrc}
                    closeLabel={`Close ${collection.candidate.name} gallery`}
                    onClose={() => setExpandedCollectionId(null)}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
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
  const { candidate, preview } = collection;
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
        <CampaignCollectionPreviewVisual
          item={preview}
          imageSrc={collection.previewImageSrc}
          imagePosition={collection.previewPosition}
        />
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
      </div>
    </article>
  );
}

type CampaignCollectionPreviewVisualProps = {
  item: ArchiveMediaItem;
  imageSrc: string | null;
  imagePosition: string | null;
};

function CampaignCollectionPreviewVisual({
  item,
  imageSrc,
  imagePosition,
}: CampaignCollectionPreviewVisualProps) {
  const previewImageSrc = imageSrc ?? getCollectionPreviewImageSrc(item);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  if (previewImageSrc && failedImageSrc !== previewImageSrc) {
    return (
      <img
        src={previewImageSrc}
        alt=""
        loading="lazy"
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
        onError={() => setFailedImageSrc(previewImageSrc)}
      />
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
  const fallbackPreviewImageSrc = candidate.media[0]
    ? getCandidatePreviewImageSrc(candidate, "all", candidate.media[0])
    : null;
  const archiveLightbox = useArchiveLightbox(candidate.media);

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
        </aside>
      </div>

      <div className="candidate-archive-grid">
        {candidate.media.map((item) => (
          <ArchiveMediaCard
            item={item}
            key={item.id}
            minimal
            ownerName={candidate.name}
            fallbackPreviewImageSrc={fallbackPreviewImageSrc}
            onOpen={archiveLightbox.openItem}
          />
        ))}
      </div>
      {archiveLightbox.activeItem && (
        <ArchiveLightbox
          item={archiveLightbox.activeItem}
          onClose={archiveLightbox.closeItem}
          onNext={archiveLightbox.goToNext}
          onPrevious={archiveLightbox.goToPrevious}
        />
      )}
    </section>
  );
}

function ArchiveMediaCard({
  item,
  minimal = false,
  ownerName,
  fallbackPreviewImageSrc,
  onOpen,
}: {
  item: ArchiveMediaItem;
  minimal?: boolean;
  ownerName?: string;
  fallbackPreviewImageSrc?: string | null;
  onOpen: (item: ArchiveMediaItem) => void;
}) {
  const isPhoto = isArchivePhoto(item);
  const isHostedMedia = isHostedMediaSrc(item.src);
  const isHttpSource = item.src.startsWith("http");
  const isExternal = isHttpSource && !isHostedMedia;
  const isInlinePhoto =
    item.kind === "photo" && (isHostedMedia || !isHttpSource);
  const isEmbeddedVideo = isExternal && !isPhoto && item.kind !== "video";
  const previewImageSrc =
    getArchiveMediaPreviewImageSrc(item) ?? fallbackPreviewImageSrc ?? null;
  const previewStillSrc =
    shouldUseArchivePreviewStill(item) && previewImageSrc
      ? previewImageSrc
      : null;
  const videoPreviewSrc =
    item.kind === "video" && previewImageSrc ? previewImageSrc : null;
  const openHref =
    isHttpSource || item.kind === "video" || isInlinePhoto ? item.src : null;
  const previewLabel = isExternal
    ? `Preview ${item.title}`
    : isInlinePhoto
      ? `Open ${item.title} photo`
      : `Open ${item.title} video`;
  const sourceLabel = isExternal
    ? `Open ${item.title} source`
    : previewLabel;
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
    minimal ? "is-minimal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (minimal) {
    return (
      <article className={cardClassName}>
        <button
          className="archive-play-tile"
          type="button"
          aria-label={previewLabel}
          onClick={() => onOpen(item)}
        >
          <div className={frameClassName} style={frameStyle}>
            {previewImageSrc ? (
              <img src={previewImageSrc} alt="" loading="eager" />
            ) : (
              <span className="external-campaign-placeholder" aria-hidden="true" />
            )}
            <span className="play-indicator" aria-hidden="true">
              {isPhoto ? (
                <Images size={18} />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
            </span>
            <span className="media-hover-name" aria-hidden="true">
              {hoverName}
            </span>
          </div>
        </button>
      </article>
    );
  }

  return (
    <article className={cardClassName}>
      <div className={frameClassName} style={frameStyle}>
        {videoPreviewSrc ? (
          <img src={videoPreviewSrc} alt="" loading="lazy" />
        ) : item.kind === "video" ? (
          <video
            src={item.src}
            poster={item.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
          />
        ) : previewStillSrc ? (
          <img src={previewStillSrc} alt="" loading="lazy" />
        ) : isInlinePhoto ? (
          <img src={item.src} alt="" loading="lazy" />
        ) : isEmbeddedVideo ? (
          previewImageSrc ? (
            <img src={previewImageSrc} alt="" loading="lazy" />
          ) : (
            <span className="external-campaign-placeholder" aria-hidden="true" />
          )
        ) : (
          <iframe
            src={isPhoto ? getPhotoPreviewSrc(item.src) : item.src}
            title={item.title}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
        )}
        {(item.kind === "video" || isEmbeddedVideo) && (
          <span className="play-indicator" aria-hidden="true">
            <Play size={18} fill="currentColor" />
          </span>
        )}
        <span className="media-hover-name" aria-hidden="true">
          {hoverName}
        </span>
        <button
          className="archive-frame-open-button"
          type="button"
          aria-label={previewLabel}
          onClick={() => onOpen(item)}
        />
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
            aria-label={sourceLabel}
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

type ArchiveLightboxProps = {
  item: ArchiveMediaItem;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function ArchiveLightbox({
  item,
  onClose,
  onPrevious,
  onNext,
}: ArchiveLightboxProps) {
  const isPhoto = isArchivePhoto(item);
  const isDirectVideo = item.kind === "video";
  const renderDirectPhoto = canRenderArchivePhotoDirectly(item);
  const previewStillSrc = shouldUseArchivePreviewStill(item)
    ? getArchiveMediaPreviewImageSrc(item)
    : null;
  const mediaStyle = getExternalMediaFrameStyle(item.src);
  const mediaClassName = [
    "lightbox-media",
    "archive-lightbox-media",
    isPhoto ? "is-photo" : "is-video",
    item.orientation ? `is-${item.orientation}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }

      if (event.key === "ArrowLeft") {
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("is-locked");

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("is-locked");
    };
  }, [onClose, onNext, onPrevious]);

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

      <figure className="lightbox-panel archive-lightbox-panel">
        <div className={mediaClassName} style={mediaStyle}>
          {isDirectVideo ? (
            <video
              key={item.id}
              src={item.src}
              poster={
                item.poster ?? getArchiveMediaPreviewImageSrc(item) ?? undefined
              }
              controls
              playsInline
              autoPlay
            />
          ) : previewStillSrc ? (
            <img src={previewStillSrc} alt={item.title} />
          ) : renderDirectPhoto ? (
            <img src={getPhotoPreviewSrc(item.src)} alt={item.title} />
          ) : (
            <iframe
              key={item.id}
              src={isPhoto ? getPhotoPreviewSrc(item.src) : item.src}
              title={item.title}
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
            />
          )}
        </div>
        <figcaption>
          <span>{item.category}</span>
          <strong>{item.title}</strong>
          <span>{item.context}</span>
        </figcaption>
      </figure>
    </div>
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
