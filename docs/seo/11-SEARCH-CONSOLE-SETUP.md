# 11-SEARCH-CONSOLE-SETUP: Search Engine Verification & Analytics Playbook

**Project**: Word HTML 1.0 Converter  
**Production Domain**: [https://wordtohtml1.0.sshconnect.space/](https://wordtohtml1.0.sshconnect.space/)  
**Target Search Engines**: Google Search Console, Bing Webmaster Tools  

---

## 1. Google Search Console (GSC) Verification

To monitor indexing status, organic queries, and Core Web Vitals, configure GSC using either of the following methods:

### Method A: DNS TXT Record (Recommended for Complete Domain Coverage)
1. Open [Google Search Console](https://search.google.com/search-console).
2. Choose **Domain Property**: enter `sshconnect.space` (or URL Prefix `https://wordtohtml1.0.sshconnect.space/`).
3. Copy the Google site verification TXT token (e.g., `google-site-verification=...`).
4. In your Cloudflare / DNS management console, create a `TXT` record:
   - **Name**: `wordtohtml1.0` (or `@`)
   - **Content**: The verification token
5. Click **Verify** in GSC.

### Method B: HTML Meta Tag Verification
If DNS access is delayed, add the verification meta tag to the `<head>` of `index.html`:
```html
<meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_TOKEN">
```

---

## 2. Sitemap Submission Workflow

Once property ownership is confirmed:
1. In the GSC left sidebar, click **Sitemaps** under *Indexing*.
2. In the *Add a new sitemap* input, enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. Confirm status changes to **Success** with **8 discovered pages**.

---

## 3. Bing Webmaster Tools (BWT) Integration

Bing powers search for both Bing and Yahoo, and strongly informs AI answers in Microsoft Copilot.
1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Sign in and choose **Import from Google Search Console**. This instantly imports verified ownership and sitemaps in under 30 seconds.
3. Verify that `https://wordtohtml1.0.sshconnect.space/sitemap.xml` is listed under Sitemaps.

---

## 4. Privacy-Conscious Product Analytics Setup

To understand tool usage without infringing on document confidentiality, adhere strictly to the following event telemetry guidelines:

### Core Rules:
1. **Zero Text Capture**: Never transmit user-pasted text, generated HTML, or filenames to any analytics service.
2. **Event-Only Tracking**: Collect strictly anonymized interaction counts.

### Recommended Client-Side Event Schema
```javascript
// Lightweight event tracker wrapper (e.g. for Plausible, Umami, or Cloudflare Web Analytics)
function trackToolEvent(eventName, eventProps = {}) {
  // Only capture non-sensitive operational metadata
  const safeProps = {
    mode: eventProps.mode || activeMode,
    wrapper: wrapMode.value,
    ...eventProps
  };
  
  if (window.plausible) {
    window.plausible(eventName, { props: safeProps });
  } else if (window.umami) {
    window.umami.track(eventName, safeProps);
  }
}

// Key Event Hooks:
// 1. Converter Opened: Fires on DOMContentLoaded
// 2. Tab Switched: trackToolEvent("mode_switched", { to: mode })
// 3. Output Copied: trackToolEvent("copy_clicked", { format: activeMode })
// 4. Download Triggered: trackToolEvent("download_clicked", { type: activeMode === "word" ? "html" : "doc" })
// 5. Table Inserted: trackToolEvent("table_inserted")
```

---

## 5. Organic Search KPIs to Monitor

| Metric | Target (First 90 Days) | Evaluation Frequency | Action if Off-Target |
| :--- | :--- | :--- | :--- |
| **Total Organic Impressions** | 10,000+ monthly | Weekly | Review title CTRs and publish additional long-tail guides. |
| **Average Organic CTR** | > 4.5% | Bi-weekly | A/B test snippet meta descriptions and title modifiers. |
| **Non-Branded Query Share** | > 85% of total search traffic | Monthly | Expand coverage on "clean html" and "html to word". |
| **Core Web Vitals Pass Rate** | 100% Good URLs | Continuous | Maintain zero-framework vanilla architecture. |
| **Index Coverage Rate** | 100% of sitemap URLs indexed | Weekly | Request manual indexing via URL Inspection tool in GSC. |
