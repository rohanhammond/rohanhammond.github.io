import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { spawnSync } from "node:child_process";

const bucket = process.argv[2] || "rohanhammond-media";
const mediaRoot = join(process.cwd(), "public", "media");
const cacheControl = "public, max-age=31536000, immutable";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: npm run media:upload -- [bucket-name]");
  console.log("");
  console.log("Uploads every file in public/media to R2 as media/<path>.");
  console.log("Default bucket: rohanhammond-media");
  process.exit(0);
}

const contentTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml"],
  [".mp4", "video/mp4"],
  [".m4v", "video/x-m4v"],
  [".mov", "video/quicktime"],
]);

function listFiles(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      const stats = statSync(path);

      return stats.isDirectory() ? listFiles(path) : [path];
    })
    .sort();
}

function getContentType(path) {
  const extension = path.slice(path.lastIndexOf(".")).toLowerCase();
  return contentTypes.get(extension) || "application/octet-stream";
}

const files = listFiles(mediaRoot);

console.log(`Uploading ${files.length} media files to R2 bucket "${bucket}"...`);

for (const file of files) {
  const key = ["media", relative(mediaRoot, file).split(sep).join("/")].join("/");
  const destination = `${bucket}/${key}`;
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "wrangler",
      "r2",
      "object",
      "put",
      destination,
      "--remote",
      "--file",
      file,
      "--content-type",
      getContentType(file),
      "--cache-control",
      cacheControl,
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    console.error(`Upload failed for ${key}`);
    process.exit(result.status || 1);
  }
}

console.log("R2 media upload complete.");
