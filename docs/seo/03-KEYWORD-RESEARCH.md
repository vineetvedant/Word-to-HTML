# 03-KEYWORD-RESEARCH: Search Intent & Keyword Architecture

**Project**: Word HTML 1.0 Converter  
**Domain**: [https://wordtohtml1.0.sshconnect.space/](https://wordtohtml1.0.sshconnect.space/)  
**Target Audience**: Software Engineers, Content Writers, Web Publishers, Email Marketers, Digital Teams  

---

## 1. Search Intent & Strategic Classification

Organic search queries for document conversion split into two distinct intent classes:
1. **Utility / Tool Intent**: Users want an immediate, zero-friction online tool to paste content, click copy/download, and leave without paying or downloading desktop software.
2. **Informational / Troubleshooting Intent**: Users seeking tutorials on how to clean messy Word code, understand HTML 1.0 standards, convert tables, or fix broken email templates.

We categorize all candidate queries into three strict buckets:
- **Target Now**: Functionality exists and delivers real, verified value.
- **Target After Feature Enhancement**: Query requires native `.docx` binary parsing or advanced server features not yet implemented.
- **Reject**: Misleading, spammy, or fundamentally incompatible queries.

---

## 2. Keyword Classification Matrix

### Category A: Primary Utility Keywords (High Conversion Value)

| Keyword | Search Intent | Product Relevance | Target Status | Dedicated Landing URL |
| :--- | :--- | :--- | :--- | :--- |
| **word to html converter** | Tool / Utility | Exact | **Target Now** | `/` (Homepage) |
| **convert word to html online** | Tool / Utility | Exact | **Target Now** | `/` (Homepage) |
| **html to word converter** | Tool / Utility | Exact (via `.doc` export) | **Target Now** | `/html-to-word/` & Tab 2 |
| **word to html online** | Tool / Utility | Exact | **Target Now** | `/` (Homepage) |
| **rich text to html converter** | Tool / Utility | Exact | **Target Now** | `/` & `/word-to-html/` |
| **convert rich text to html** | Tool / Utility | Exact | **Target Now** | `/word-to-html/` |
| **word html converter** | Tool / Utility | Exact | **Target Now** | `/` (Homepage) |

### Category B: Secondary & Workflow Keywords

| Keyword | Search Intent | Product Relevance | Target Status | Dedicated Landing URL |
| :--- | :--- | :--- | :--- | :--- |
| **paste word to html** | Tool / Utility | Exact (core feature) | **Target Now** | `/word-to-html/` |
| **word to clean html** | Cleanup / Tool | Exact | **Target Now** | `/word-to-clean-html/` |
| **clean html converter** | Cleanup / Tool | Exact | **Target Now** | `/word-to-clean-html/` |
| **html code from word** | Informational / Tool | High | **Target Now** | `/word-to-html/` |
| **html to formatted text** | Utility | Exact | **Target Now** | `/html-to-word/` |
| **microsoft word to html** | Tool / Utility | High | **Target Now** | `/word-to-html/` |
| **convert docx to html** | File Conversion | Partial (paste required) | **Target After Enhancement** | Clarified in FAQ |
| **docx to html online** | File Conversion | Partial (paste required) | **Target After Enhancement** | Clarified in FAQ |

### Category C: Developer & Technical Keywords

| Keyword | Search Intent | Product Relevance | Target Status | Dedicated Landing URL |
| :--- | :--- | :--- | :--- | :--- |
| **html cleanup tool** | Developer Tool | Exact | **Target Now** | `/word-to-clean-html/` |
| **remove unnecessary html tags** | Educational / Utility | Exact | **Target Now** | `/word-to-clean-html/` |
| **simplify html markup** | Educational / Utility | Exact | **Target Now** | `/word-to-clean-html/` |
| **strip mso tags online** | Developer Tool | Exact | **Target Now** | `/word-to-clean-html/` |
| **word formatting to html** | Technical Utility | Exact | **Target Now** | `/word-to-html/` |
| **html table converter** | Utility | Exact | **Target Now** | `/how-to-use/` |
| **html list converter** | Utility | Exact | **Target Now** | `/how-to-use/` |

### Category D: Historical & Niche Keywords (Zero-Competition Anchor)

| Keyword | Search Intent | Product Relevance | Target Status | Dedicated Landing URL |
| :--- | :--- | :--- | :--- | :--- |
| **html 1.0 converter** | Niche Tool | Exact | **Target Now** | `/` & `/html-1-0-explained/` |
| **word to html 1.0** | Niche Tool | Exact | **Target Now** | `/` (Homepage) |
| **classic html converter** | Niche Tool | Exact | **Target Now** | `/html-1-0-explained/` |
| **what is html 1.0** | Informational | Exact | **Target Now** | `/html-1-0-explained/` |
| **html 1.0 vs html5** | Technical Comparison | Exact | **Target Now** | `/html-1-0-explained/` |
| **rfc 1866 converter** | Highly Specific | Exact | **Target Now** | `/html-1-0-explained/` |

### Category E: Rejected Keywords (Unsuitable or Misleading)

| Keyword | Reason for Rejection |
| :--- | :--- |
| *pdf to word converter* | Completely outside product capabilities. |
| *free docx OCR reader* | Requires optical character recognition; misleading. |
| *best converter in the world* | Hyperbolic, low search trust, violates quality guidelines. |
| *100% cloud conversion* | Direct falsehood (the app is 100% client-side, zero cloud). |
| *guaranteed identical layout* | Inaccurate; HTML 1.0 intentionally strips proprietary layout CSS. |

---

## 3. Long-Tail Search Intent Architecture

We have constructed targeted informational guides to capture long-tail conversational and problem-solving queries:

1. **"How to convert Word text to HTML without mess"** &rarr; Answered on `/word-to-html/`
2. **"How to clean HTML generated from Microsoft Word"** &rarr; Answered on `/word-to-clean-html/`
3. **"How to turn HTML into a downloadable Word file"** &rarr; Answered on `/html-to-word/`
4. **"Why does Word HTML have so many spans and mso classes"** &rarr; Answered on `/word-to-clean-html/`
5. **"Is there a private Word converter that doesn't upload files"** &rarr; Answered on `/privacy/`
6. **"What elements are supported in HTML 1.0"** &rarr; Answered on `/html-1-0-explained/`
