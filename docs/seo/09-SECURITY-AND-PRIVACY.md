# 09-SECURITY-AND-PRIVACY: Threat Modeling, Client-Side Sanitization & Privacy Architecture

**Project**: Word HTML 1.0 Converter  
**Domain**: [https://wordtohtml1.0.sshconnect.space/](https://wordtohtml1.0.sshconnect.space/)  
**Standard**: OWASP Top 10 Web Application Security Risks, Client-Side Security Best Practices  

---

## 1. Threat Modeling for Web Document Converters

Web-based document utilities encounter severe security and privacy challenges because they process arbitrary, untrusted user-supplied markup. The primary threat vectors include:

1. **Cross-Site Scripting (Stored & DOM-Based XSS)**: An attacker crafts a document containing `<script>` tags, inline event handlers (`onload`, `onerror`), or pseudo-protocols (`javascript:`) that execute in the context of the conversion website or preview frame.
2. **Confidentiality Breaches / Data Leakage**: Uploading documents containing proprietary financial, legal, or personal data to remote servers where it could be logged, intercepted, or leaked.
3. **Malicious Protocol Schemes**: Links or media sources triggering unintended browser actions or phishing attacks.
4. **Preview Context Escape**: An injected script in the preview pane attempting to access or manipulate the parent application window or local storage.

---

## 2. Multi-Layered Defense-in-Depth Sanitization Pipeline

To eliminate these vulnerabilities, Word HTML 1.0 Converter implements a multi-pass sanitization pipeline:

```
[ User Input (Pasted Rich Text or Raw HTML) ]
                      │
                      ▼
[ Phase 1: In-Memory DOMParser Quarantine ]
  - Parse input as detached DOM tree
  - Instant purge of dangerous elements:
    <script>, <style>, <iframe>, <object>, <embed>, <noscript>, <frame>, <frameset>, <svg>, <link>
                      │
                      ▼
[ Phase 2: Tag Whitelist Enforcement ]
  - Verify every element against allowedTags whitelist:
    A, B, BODY, BR, DD, DL, DT, H1-H6, HEAD, HTML, I, IMG, LI, OL, P, PRE, TABLE, TBODY, TD, TH, TITLE, TR, U, UL
  - Dangerous/Unrecognized tags are safely unwrapped or removed
                      │
                      ▼
[ Phase 3: Attribute Whitelisting & Protocol Sanitization ]
  - Strict allowlist per tag (allowedAttributes)
  - Remove all inline style attributes, class names, and event handlers
  - Enforce safe URI schemes:
    * <a> href: Strip javascript:, vbscript:, and non-image data:
    * <img> src: Strip javascript: and vbscript:
                      │
                      ▼
[ Phase 4: Output Rendering & Sandboxed Isolation ]
  - Pure text string placed in read-only textarea
  - Preview rendered inside <iframe sandbox="allow-same-origin">
    (allow-scripts is NOT granted -> zero scripts can execute)
```

---

## 3. Concrete Code Implementations

### Dangerous Tag & Protocol Purging in `app.js`
```javascript
// Immediate dangerous tag purging in cleanHtml()
doc.querySelectorAll("script, style, iframe, object, embed, noscript, frame, frameset, svg, link").forEach((el) => el.remove());

// In normalizeElement():
if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "APPLET", "NOSCRIPT", "FRAME", "FRAMESET", "SVG"].includes(tag)) {
  element.remove();
  return;
}

// Protocol scheme validation:
if (tag === "A" && name === "href") {
  const val = attribute.value.trim().toLowerCase();
  if (val.startsWith("javascript:") || val.startsWith("vbscript:") || val.startsWith("data:")) {
    element.removeAttribute("href");
  }
}

if (tag === "IMG" && name === "src") {
  const val = attribute.value.trim().toLowerCase();
  if (val.startsWith("javascript:") || val.startsWith("vbscript:")) {
    element.removeAttribute("src");
  }
}
```

### Preview Iframe Isolation in `index.html`
```html
<iframe id="previewFrame" title="HTML preview" sandbox="allow-same-origin"></iframe>
```
- **Security Guarantee**: Because `allow-scripts` is omitted, the browser engine disables all JavaScript execution, form submissions, and popups inside the iframe frame.
- **Selection Highlighting**: `allow-same-origin` permits the parent document's CSS Highlight synchronization API to read text nodes for visual matching without granting script execution rights to the preview content.

---

## 4. Privacy & Zero-Retention Architecture

- **Zero Server Telemetry on Documents**: The application contains no tracking endpoints, no server-side document upload handlers, and no logging of pasted text.
- **Client-Side Export**: The "Download HTML" and "Download Word" functions use local browser Blobs (`URL.createObjectURL(new Blob(...))`).
- **Offline Reliability**: The entire conversion engine functions when disconnected from the internet, confirming zero dependency on external network services.
