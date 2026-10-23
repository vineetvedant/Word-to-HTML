import { cpSync, mkdirSync, rmSync } from "node:fs";

const outputDirectory = "dist";
const files = [
  "index.html",
  "app.js",
  "styles.css",
  "sitemap.xml",
  "robots.txt",
  "llms.txt",
  "_headers",
  "_redirects"
];
const directories = [
  "assets",
  "vedant",
  "how-to-use",
  "word-to-html",
  "html-to-word",
  "word-to-clean-html",
  "html-1-0-explained",
  "privacy",
  "about"
];

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

for (const file of files) {
  cpSync(file, `${outputDirectory}/${file}`);
}

for (const directory of directories) {
  cpSync(directory, `${outputDirectory}/${directory}`, { recursive: true });
}

console.log(`Cloudflare Pages & production output created in ${outputDirectory}/`);
