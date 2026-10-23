import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

console.log("=== RUNNING ADVANCED TECHNICAL SEO, GEO & AGENTIC INTEGRITY TESTS ===\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

const distDir = "dist";

// 1. Verify required files exist
console.log("1. Checking core files existence in dist/:");
const requiredFiles = [
  "index.html",
  "index.md",
  "app.js",
  "styles.css",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "llms-full.txt",
  "ai-catalog.json",
  "_headers",
  "_redirects",
  "how-to-use/index.html",
  "how-to-use/index.md",
  "word-to-html/index.html",
  "word-to-html/index.md",
  "html-to-word/index.html",
  "html-to-word/index.md",
  "word-to-clean-html/index.html",
  "word-to-clean-html/index.md",
  "html-1-0-explained/index.html",
  "html-1-0-explained/index.md",
  "privacy/index.html",
  "privacy/index.md",
  "about/index.html",
  "about/index.md"
];

for (const file of requiredFiles) {
  assert(existsSync(join(distDir, file)), `File exists: ${file}`);
}

// 2. Verify robots.txt
console.log("\n2. Validating robots.txt:");
const robots = readFileSync(join(distDir, "robots.txt"), "utf-8");
assert(robots.includes("User-agent: *"), "robots.txt contains User-agent: *");
assert(robots.includes("Allow: /"), "robots.txt allows root");
assert(robots.includes("GPTBot"), "robots.txt explicitly configures GPTBot");
assert(robots.includes("ClaudeBot"), "robots.txt explicitly configures ClaudeBot");
assert(robots.includes("Google-Extended"), "robots.txt explicitly configures Google-Extended");
assert(robots.includes("PerplexityBot"), "robots.txt explicitly configures PerplexityBot");
assert(robots.includes("Content-Signal: search=yes, ai-train=no"), "robots.txt has Content-Signal directive");
assert(robots.includes("Agentmap: https://wordtohtml1.0.sshconnect.space/ai-catalog.json"), "robots.txt declares Agentmap");
assert(robots.includes("Sitemap: https://wordtohtml1.0.sshconnect.space/sitemap.xml"), "robots.txt points to correct production sitemap");

// 3. Verify sitemap.xml
console.log("\n3. Validating sitemap.xml:");
const sitemap = readFileSync(join(distDir, "sitemap.xml"), "utf-8");
assert(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), "sitemap.xml has XML declaration");
assert(sitemap.includes("<urlset"), "sitemap.xml has urlset element");
assert(!sitemap.includes("vineetvedant.com"), "sitemap.xml does NOT contain legacy/wrong domain");
assert(sitemap.includes("<loc>https://wordtohtml1.0.sshconnect.space/</loc>"), "sitemap.xml has homepage URL");
assert(sitemap.includes("<loc>https://wordtohtml1.0.sshconnect.space/how-to-use/</loc>"), "sitemap.xml has how-to-use URL");
assert(sitemap.includes("<loc>https://wordtohtml1.0.sshconnect.space/word-to-html/</loc>"), "sitemap.xml has word-to-html URL");
assert(sitemap.includes("<loc>https://wordtohtml1.0.sshconnect.space/html-to-word/</loc>"), "sitemap.xml has html-to-word URL");
assert(sitemap.includes("<loc>https://wordtohtml1.0.sshconnect.space/word-to-clean-html/</loc>"), "sitemap.xml has word-to-clean-html URL");
assert(sitemap.includes("<loc>https://wordtohtml1.0.sshconnect.space/html-1-0-explained/</loc>"), "sitemap.xml has html-1-0-explained URL");
assert(sitemap.includes("<loc>https://wordtohtml1.0.sshconnect.space/privacy/</loc>"), "sitemap.xml has privacy URL");
assert(sitemap.includes("<loc>https://wordtohtml1.0.sshconnect.space/about/</loc>"), "sitemap.xml has about URL");

// 4. Verify llms.txt & llms-full.txt
console.log("\n4. Validating llms.txt & llms-full.txt (GEO):");
const llms = readFileSync(join(distDir, "llms.txt"), "utf-8");
assert(llms.includes("# Word HTML 1.0 Converter"), "llms.txt has title");
assert(llms.includes("https://wordtohtml1.0.sshconnect.space/"), "llms.txt has production website URL");
assert(llms.includes("Vedant Singh"), "llms.txt attributes developer Vedant Singh");

const llmsFull = readFileSync(join(distDir, "llms-full.txt"), "utf-8");
assert(llmsFull.includes("# Word to HTML Converter - Full LLM Context"), "llms-full.txt has header");
assert(llmsFull.includes("Procedural FAQ & AI Citation Reference"), "llms-full.txt provides procedural citation data");

// 5. Verify ai-catalog.json (Agentic Resource Discovery)
console.log("\n5. Validating ai-catalog.json:");
const aiCatalog = JSON.parse(readFileSync(join(distDir, "ai-catalog.json"), "utf-8"));
assert(aiCatalog.capabilities.length >= 2, "ai-catalog.json specifies capabilities");
assert(aiCatalog.resources.length >= 7, "ai-catalog.json specifies resources");

// 6. Verify HTML pages metadata and JSON-LD
console.log("\n6. Validating HTML metadata, Speculation Rules, and Schema across all pages:");
const pagesToTest = [
  { path: "index.html", expectedCanonical: "https://wordtohtml1.0.sshconnect.space/" },
  { path: "how-to-use/index.html", expectedCanonical: "https://wordtohtml1.0.sshconnect.space/how-to-use/" },
  { path: "word-to-html/index.html", expectedCanonical: "https://wordtohtml1.0.sshconnect.space/word-to-html/" },
  { path: "html-to-word/index.html", expectedCanonical: "https://wordtohtml1.0.sshconnect.space/html-to-word/" },
  { path: "word-to-clean-html/index.html", expectedCanonical: "https://wordtohtml1.0.sshconnect.space/word-to-clean-html/" },
  { path: "html-1-0-explained/index.html", expectedCanonical: "https://wordtohtml1.0.sshconnect.space/html-1-0-explained/" },
  { path: "privacy/index.html", expectedCanonical: "https://wordtohtml1.0.sshconnect.space/privacy/" },
  { path: "about/index.html", expectedCanonical: "https://wordtohtml1.0.sshconnect.space/about/" }
];

for (const { path: pagePath, expectedCanonical } of pagesToTest) {
  const content = readFileSync(join(distDir, pagePath), "utf-8");
  assert(content.includes('<html lang="en">'), `${pagePath} has lang="en"`);
  assert(content.includes("<title>"), `${pagePath} has <title> tag`);
  assert(content.includes('<meta name="description"'), `${pagePath} has meta description`);
  assert(content.includes(`<link rel="canonical" href="${expectedCanonical}">`), `${pagePath} has correct canonical URL (${expectedCanonical})`);
  assert(content.includes('rel="alternate" type="text/markdown"'), `${pagePath} has markdown alternate link`);
  assert(content.includes('type="speculationrules"'), `${pagePath} has Chrome Speculation Rules`);
  assert(content.includes('property="og:title"'), `${pagePath} has og:title`);
  assert(content.includes('property="og:url"'), `${pagePath} has og:url`);
  
  // JSON-LD validation
  const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(jsonLdMatch !== null, `${pagePath} has JSON-LD script block`);
  if (jsonLdMatch) {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      assert(parsed["@context"] === "https://schema.org", `${pagePath} JSON-LD has schema.org context`);
    } catch (e) {
      assert(false, `${pagePath} JSON-LD is valid JSON: ${e.message}`);
    }
  }
}

// 7. Security & Performance checks in index.html
console.log("\n7. Checking security & performance in index.html:");
const indexHtml = readFileSync(join(distDir, "index.html"), "utf-8");
assert(!indexHtml.includes('<body class="loading">'), "index.html does not have blocking body.loading class");
assert(!indexHtml.includes('<div id="load">'), "index.html does not have blocking loader overlay");
assert(indexHtml.includes('sandbox="allow-same-origin"'), "previewFrame has sandbox attribute");
assert(!indexHtml.includes('"@type": "HowTo"'), "index.html correctly excludes deprecated Google HowTo schema");
assert(indexHtml.includes('"potentialAction"'), "index.html includes WebApplication potentialAction ConvertActions");

// 8. Check app.js security & bug fixes
console.log("\n8. Checking app.js security fixes:");
const appJs = readFileSync(join(distDir, "app.js"), "utf-8");
assert(!appJs.includes("toggleAboutModal(true);"), "app.js does not auto-open about modal on page load");
assert(appJs.includes('javascript:') && appJs.includes('removeAttribute("href")'), "app.js strips javascript: href schemes");
assert(appJs.includes('SCRIPT') && appJs.includes('element.remove()'), "app.js removes SCRIPT and dangerous tags");

// 9. Check Cloudflare Pages _headers & _redirects
console.log("\n9. Checking Cloudflare Pages configuration in dist/:");
const headers = readFileSync(join(distDir, "_headers"), "utf-8");
assert(headers.includes("X-Content-Type-Options: nosniff"), "_headers sets nosniff");
assert(headers.includes("X-Frame-Options: SAMEORIGIN"), "_headers sets SAMEORIGIN");
assert(headers.includes("Vary: Accept"), "_headers sets Vary: Accept for markdown negotiation");
assert(headers.includes("Cache-Control: public, max-age=31536000, immutable"), "_headers sets immutable cache on static assets");

const redirects = readFileSync(join(distDir, "_redirects"), "utf-8");
assert(redirects.includes("/index.html"), "_redirects handles /index.html canonical redirect");

// 10. Check interactive engagement features for Rank #1
console.log("\n10. Checking high-engagement features for Google Rank #1:");
assert(indexHtml.includes('id="loadSampleBtn"'), "index.html includes 1-click sample document button");
assert(indexHtml.includes('id="presetCleanBtn"'), "index.html includes cleaning presets");
assert(indexHtml.includes("Why Word HTML 1.0 Converter Is the #1 Alternative"), "index.html includes competitor comparison matrix");

console.log(`\n========================================`);
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
