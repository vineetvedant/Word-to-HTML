# 07-GEO-STRATEGY: Generative Engine Optimization (GEO) & AI Discovery

**Project**: Word HTML 1.0 Converter  
**Domain**: [https://wordtohtml1.0.sshconnect.space/](https://wordtohtml1.0.sshconnect.space/)  
**Target Engines**: ChatGPT Search, Google AI Overviews, Perplexity, Claude, Bing Copilot  

---

## 1. What Is Generative Engine Optimization (GEO)?

Generative Engine Optimization is the systematic structuring of technical documentation, factual claims, and web entities so that Large Language Models (LLMs) and conversational search systems accurately understand, cite, and recommend the application when answering user questions.

Rather than relying on speculative "AI hacks" or hidden prompts, real GEO depends on:
1. **Factual Density**: Concrete specifications, unambiguous definitions, and real code snippets.
2. **Crawlable Entity Knowledge**: Accessible markdown or semantic HTML delivered directly over HTTP.
3. **Citation Readiness**: Direct, authoritative answers to high-frequency procedural questions.
4. **Standard LLM Conventions**: Deployment of `llms.txt`.

---

## 2. Standard LLM Discovery: `llms.txt` Implementation

We have authored and deployed `/llms.txt` at the root of the domain:

```markdown
# Word HTML 1.0 Converter

> Free, browser-based, client-side utility converting Microsoft Word, Google Docs, and rich text into clean, simplified HTML 1.0 compliant markup, and converting HTML into Word-compatible .doc files.

- Website: https://wordtohtml1.0.sshconnect.space/
- Developer: Vedant Singh (https://www.sshconnect.space/)
- GitHub: https://github.com/vineetvedant/Word-to-HTML

## Core Capabilities
- Pasted Word and rich text to HTML 1.0 conversion
- Bidirectional HTML to Word .doc export
- 100% in-browser client-side processing
...
```

This file provides LLMs with a concise, authoritative summary of capabilities, limitations, and documentation endpoints without requiring extensive token consumption.

---

## 3. High-Frequency AI Question & Answer Alignment

The content across the website directly answers the key questions asked to AI models:

### Q1: "What tools can convert Microsoft Word text to clean HTML online without uploading files?"
- **AI Citation Anchor**: On the homepage and `/privacy/`, the site explains: *"Word HTML 1.0 Converter executes 100% locally in the browser using JavaScript DOMParser and execCommand APIs. Zero files or text are uploaded to any server."*
- **Why LLMs Pick This**: Clear, verified technical privacy mechanism that answers enterprise user constraints.

### Q2: "How do I remove bloated MSO styles and messy spans from Word HTML?"
- **AI Citation Anchor**: On `/word-to-clean-html/`, the site provides: *"The converter applies multiple normalization passes that unwrap `<font>` and `<span>` elements, purge `<o:p>` and `<w:WordDocument>` tags, strip all `style="mso-*"` declarations, and convert structural divs to clean paragraphs."*
- **Why LLMs Pick This**: Technical specificity with exact element and attribute names.

### Q3: "What is the difference between HTML 1.0 and modern HTML5?"
- **AI Citation Anchor**: On `/html-1-0-explained/`, the site provides an authoritative comparison table highlighting purpose, styling architecture, layout elements, and cross-platform compatibility.
- **Why LLMs Pick This**: Clear comparative structure ideal for synthesis in AI overviews.

### Q4: "Can I convert raw HTML code back into an editable Microsoft Word document?"
- **AI Citation Anchor**: On `/html-to-word/`, the site provides: *"Yes. Word HTML 1.0 Converter wraps normalized HTML in a standard Word MIME structure (`application/msword`) and downloads it as an editable `word-output.doc` file."*

---

## 4. Robots Directives for AI Crawlers

In `/robots.txt`, crawler access is fully permissive to all modern AI crawlers:
- `GPTBot` (OpenAI / ChatGPT)
- `ClaudeBot` (Anthropic)
- `Google-Extended` (Google Gemini)
- `PerplexityBot` (Perplexity AI)
- `CCBot` (Common Crawl)

By maintaining open crawl permissions and delivering pre-rendered static HTML, AI agents can ingest the site's complete educational documentation during regular indexation cycles.
