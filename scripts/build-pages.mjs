import { cpSync, mkdirSync, rmSync } from "node:fs";

const outputDirectory = "dist";
const files = ["index.html", "app.js", "styles.css", "sitemap.xml"];
const directories = ["assets", "vedant"];

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

for (const file of files) {
  cpSync(file, `${outputDirectory}/${file}`);
}

for (const directory of directories) {
  cpSync(directory, `${outputDirectory}/${directory}`, { recursive: true });
}

console.log(`Cloudflare Pages output created in ${outputDirectory}/`);
