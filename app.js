const wordEditor = document.getElementById("wordEditor");
const htmlEditor = document.getElementById("htmlEditor");
const outputHtml = document.getElementById("outputHtml");
const wordOutput = document.getElementById("wordOutput");
const previewFrame = document.getElementById("previewFrame");
const inputTitle = document.getElementById("inputTitle");
const outputTitle = document.getElementById("outputTitle");
const formatToolbar = document.getElementById("formatToolbar");
const htmlToolbar = document.getElementById("htmlToolbar");
const wordTab = document.getElementById("wordTab");
const htmlTab = document.getElementById("htmlTab");
const removeEmpty = document.getElementById("removeEmpty");
const keepLinks = document.getElementById("keepLinks");
const keepImages = document.getElementById("keepImages");
const keepTables = document.getElementById("keepTables");
const keepLists = document.getElementById("keepLists");
const keepFormatting = document.getElementById("keepFormatting");
const removeComments = document.getElementById("removeComments");
const wrapMode = document.getElementById("wrapMode");
const formatBlock = document.getElementById("formatBlock");
const textColor = document.getElementById("textColor");
const tablePanel = document.getElementById("tablePanel");
const tableSubmenu = document.getElementById("tableSubmenu");
const tableGrid = document.getElementById("tableGrid");
const tableGridSize = document.getElementById("tableGridSize");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const tagCount = document.getElementById("tagCount");
const fileInput = document.getElementById("fileInput");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const aboutBtn = document.getElementById("aboutBtn");
const aboutModal = document.getElementById("aboutModal");
const closeAboutBtn = document.getElementById("closeAboutBtn");

let activeMode = "word";
let suppressReflection = false;
let htmlUndoStack = [];
let savedWordRange = null;

const allowedTags = new Set([
  "A",
  "B",
  "BODY",
  "BR",
  "DD",
  "DL",
  "DT",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HEAD",
  "HTML",
  "I",
  "IMG",
  "LI",
  "OL",
  "P",
  "PRE",
  "TABLE",
  "TBODY",
  "TD",
  "TH",
  "TITLE",
  "TR",
  "U",
  "UL"
]);

const allowedAttributes = {
  A: new Set(["href", "name"]),
  BODY: new Set([]),
  BR: new Set([]),
  H1: new Set(["align"]),
  H2: new Set(["align"]),
  H3: new Set(["align"]),
  H4: new Set(["align"]),
  H5: new Set(["align"]),
  H6: new Set(["align"]),
  HTML: new Set([]),
  IMG: new Set(["src", "alt"]),
  LI: new Set([]),
  OL: new Set([]),
  P: new Set(["align"]),
  PRE: new Set([]),
  TABLE: new Set(["align", "border", "cellpadding", "cellspacing", "width"]),
  TBODY: new Set([]),
  TD: new Set(["align", "valign", "colspan", "rowspan"]),
  TH: new Set(["align", "valign", "colspan", "rowspan"]),
  TITLE: new Set([]),
  TR: new Set(["align", "valign"]),
  UL: new Set([])
};

function setMode(mode) {
  activeMode = mode;
  const isWord = mode === "word";
  wordEditor.classList.toggle("hidden", !isWord);
  htmlEditor.classList.toggle("hidden", isWord);
  wordTab.classList.toggle("active", isWord);
  htmlTab.classList.toggle("active", !isWord);
  wordTab.setAttribute("aria-selected", String(isWord));
  htmlTab.setAttribute("aria-selected", String(!isWord));
  inputTitle.textContent = isWord ? "Word Input" : "HTML Input";
  outputTitle.textContent = isWord ? "HTML 1.0 Output" : "Word Output";
  outputHtml.classList.toggle("hidden", !isWord);
  wordOutput.classList.toggle("hidden", isWord);
  formatToolbar.classList.toggle("hidden", !isWord);
  htmlToolbar.classList.toggle("hidden", isWord);
  document.getElementById("downloadBtn").textContent = isWord ? "Download HTML" : "Download Word";

  if (!isWord) {
    htmlEditor.value = outputHtml.value;
    htmlUndoStack = [htmlEditor.value];
    htmlEditor.focus();
  } else {
    wordEditor.focus();
  }

  updateOutput();
}

function convertToHtml() {
  return cleanHtml(wordEditor.innerHTML);
}

function convertHtmlToWord() {
  return cleanHtml(htmlEditor.value, "fragment");
}

function cleanHtml(source, wrapper = wrapMode.value) {
  const parser = new DOMParser();
  const hasDocumentShell = /<!doctype|<\/?(html|head|body)\b/i.test(source);
  const doc = parser.parseFromString(hasDocumentShell ? source : `<body>${source}</body>`, "text/html");
  if (removeComments.checked) {
    removeCommentNodes(doc.body);
  }
  for (let pass = 0; pass < 3; pass += 1) {
    normalizeNode(doc.body);
  }
  if (keepLinks.checked) {
    linkifyTextNodes(doc.body);
    normalizeNode(doc.body);
  }

  let html = doc.body.innerHTML
    .replace(/<div\b[^>]*>/gi, "<p>")
    .replace(/<\/div>/gi, "</p>")
    .replace(/<span\b[^>]*>/gi, "")
    .replace(/<\/span>/gi, "")
    .replace(/\s+<\/(p|li|h[1-6])>/gi, "</$1>")
    .replace(/<p>\s*<br>\s*<\/p>/gi, "");

  if (removeEmpty.checked) {
    html = html.replace(/<(p|b|i|u)>\s*<\/\1>/gi, "");
  }

  html = prettyPrint(html.trim());

  if (wrapper === "document") {
    return `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 1.0//EN">
<html>
<head>
<title>HTML 1.0 Document</title>
</head>
<body>
${html}
</body>
</html>`;
  }

  return html;
}

function normalizeNode(node) {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      normalizeElement(child);
      normalizeNode(child);
    }
  });
}

function normalizeElement(element) {
  const tag = element.tagName;

  if (!keepFormatting.checked && ["B", "I", "U", "STRONG", "EM"].includes(tag)) {
    unwrap(element);
    return;
  }

  if (tag === "STRONG") {
    replaceTag(element, "b");
    return;
  }

  if (tag === "EM") {
    replaceTag(element, "i");
    return;
  }

  if (tag === "DIV") {
    preserveTextAlign(element);
    replaceTag(element, "p", true);
    return;
  }

  if (!keepLists.checked && (tag === "UL" || tag === "OL")) {
    replaceTag(element, "p");
    return;
  }

  if (!keepImages.checked && tag === "IMG") {
    element.remove();
    return;
  }

  if (!keepTables.checked && ["TABLE", "TBODY", "TR", "TD", "TH"].includes(tag)) {
    unwrap(element);
    return;
  }

  if (tag === "FONT") {
    unwrap(element);
    return;
  }

  if (!allowedTags.has(tag)) {
    unwrap(element);
    return;
  }

  preserveTextAlign(element);

  Array.from(element.attributes).forEach((attribute) => {
    const name = attribute.name.toLowerCase();
    const tagAttributes = allowedAttributes[tag] || new Set([]);
    const keepLinkAttribute = keepLinks.checked && tag === "A" && tagAttributes.has(name);
    const keepSafeAttribute = tag !== "A" && tagAttributes.has(name);

    if (!keepLinkAttribute && !keepSafeAttribute) {
      element.removeAttribute(attribute.name);
    }
  });

  if (tag === "A" && !keepLinks.checked) {
    unwrap(element);
  }
}

function removeCommentNodes(root) {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }
  nodes.forEach((node) => node.remove());
}

function linkifyTextNodes(root) {
  const doc = root.ownerDocument;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest("a,title")) {
        return NodeFilter.FILTER_REJECT;
      }
      return /(https?:\/\/|www\.|@)/i.test(node.nodeValue)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const fragment = doc.createDocumentFragment();
    const text = node.nodeValue;
    const pattern = /(https?:\/\/[^\s<]+|www\.[^\s<]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;
    let position = 0;
    let match;

    while ((match = pattern.exec(text))) {
      const raw = match[0];
      const clean = raw.replace(/[.,;:!?)]*$/g, "");
      const trailing = raw.slice(clean.length);

      fragment.append(text.slice(position, match.index));
      fragment.append(createSmartLink(doc, clean));
      fragment.append(trailing);
      position = match.index + raw.length;
    }

    fragment.append(text.slice(position));
    node.replaceWith(fragment);
  });
}

function createSmartLink(doc, text) {
  const link = doc.createElement("a");
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  link.href = isEmail ? `mailto:${text}` : text.replace(/^www\./i, "https://www.");
  link.textContent = text;
  return link;
}

function preserveTextAlign(element) {
  const style = element.getAttribute("style") || "";
  const match = style.match(/text-align\s*:\s*(left|center|right|justify)/i);
  if (match) {
    element.setAttribute("align", match[1].toLowerCase());
  }
}

function replaceTag(element, tagName, copyAttributes = false) {
  const replacement = document.createElement(tagName);
  if (copyAttributes) {
    Array.from(element.attributes).forEach((attribute) => {
      replacement.setAttribute(attribute.name, attribute.value);
    });
  }
  while (element.firstChild) {
    replacement.appendChild(element.firstChild);
  }
  element.replaceWith(replacement);
  normalizeElement(replacement);
}

function unwrap(element) {
  const parent = element.parentNode;
  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}

function prettyPrint(html) {
  return html
    .replace(/>\s+</g, ">\n<")
    .replace(/\n{3,}/g, "\n\n");
}

function updateOutput() {
  if (activeMode === "word") {
    const html = convertToHtml();
    outputHtml.value = html;
    updatePreview(html);
    updateStats(html);
    return;
  }

  const wordHtml = convertHtmlToWord();
  wordOutput.innerHTML = wordHtml || "<p></p>";
  updatePreview(wordHtml);
  updateStats(wordHtml);
}

function updatePreview(html) {
  const previewDoc = previewFrame.contentDocument;
  previewDoc.open();
  previewDoc.write(`<!doctype html><html><body>${html}</body></html>`);
  previewDoc.close();
  bindPreviewSelection();
}

function updateStats(html) {
  const text = activeMode === "word" ? wordEditor.innerText : wordOutput.innerText;
  const words = text.trim().match(/\S+/g) || [];
  const tags = html.match(/<[^!/][^>]*>/g) || [];
  wordCount.textContent = words.length;
  charCount.textContent = text.trim().length;
  tagCount.textContent = tags.length;
}

function downloadHtml() {
  const isWord = activeMode === "word";
  const content = isWord ? outputHtml.value : buildWordDocument(wordOutput.innerHTML);
  const blob = new Blob([content], { type: isWord ? "text/html" : "application/msword" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = isWord ? "html-1-output.html" : "word-output.doc";
  link.click();
  URL.revokeObjectURL(link.href);
}

function copyHtml() {
  copyOutput();
}

function copyInput() {
  if (activeMode === "word") {
    copyRichElement(wordEditor);
    return;
  }

  copyText(htmlEditor.value, htmlEditor);
}

function copyOutput() {
  if (activeMode === "word") {
    copyText(outputHtml.value, outputHtml);
    return;
  }

  copyRichElement(wordOutput);
}

function copyPreview() {
  const doc = previewFrame.contentDocument;
  if (doc && doc.body) {
    copyRichElement(doc.body);
  }
}

function copyRichElement(element) {
  const html = element.innerHTML;
  const text = element.innerText || element.textContent || "";

  if (navigator.clipboard && window.ClipboardItem) {
    const item = new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([text], { type: "text/plain" })
    });
    navigator.clipboard.write([item]).catch(() => fallbackCopyElement(element));
    return;
  }

  fallbackCopyElement(element);
}

function copyText(text, fallbackElement) {
  navigator.clipboard.writeText(text).catch(() => {
    if (fallbackElement instanceof HTMLTextAreaElement) {
      fallbackElement.select();
    }
    document.execCommand("copy");
  });
}

function fallbackCopyElement(element) {
  const selection = element.ownerDocument.getSelection();
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();
}

function buildWordDocument(bodyHtml) {
  return `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Word Document</title>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function runEditorCommand(command, value = null) {
  restoreWordSelection();
  wordEditor.focus();
  const handled = runCustomEditorCommand(command, value);
  if (!handled) {
    document.execCommand(command, false, value);
  }
  saveWordSelection();
  updateOutput();
}

function runCustomEditorCommand(command, value) {
  if (command === "formatBlock") {
    document.execCommand("formatBlock", false, value.toUpperCase());
    return true;
  }

  if (command === "insertText") {
    document.execCommand("insertHTML", false, escapeHtml(value));
    return true;
  }

  return false;
}

function promptForLink() {
  restoreWordSelection();
  const selected = window.getSelection().toString().trim();
  const initial = /^https?:\/\//i.test(selected) || /^www\./i.test(selected) ? selected : "https://";
  const url = window.prompt("Link URL", initial);
  if (!url) {
    return;
  }

  const href = url.match(/^https?:\/\//i) || url.match(/^mailto:/i) ? url : `https://${url}`;
  restoreWordSelection();
  if (selected) {
    runEditorCommand("createLink", href);
  } else {
    runEditorCommand("insertHTML", `<a href="${escapeHtml(href)}">${escapeHtml(url)}</a>`);
  }
}

function promptForImage() {
  restoreWordSelection();
  const url = window.prompt("Image URL");
  if (!url) {
    return;
  }

  const alt = window.prompt("Image alt text", "Image") || "Image";
  runEditorCommand("insertHTML", `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}">`);
}

function insertTable(rows = 2, columns = 2) {
  const body = Array.from({ length: rows }, (_, rowIndex) => {
    const cells = Array.from({ length: columns }, (_, columnIndex) => {
      return `<td>Cell ${rowIndex + 1}.${columnIndex + 1}</td>`;
    }).join("\n");
    return `<tr>\n${cells}\n</tr>`;
  }).join("\n");
  const table = `<table border="1" cellpadding="4" cellspacing="0" width="80%">
${body}
</table>
<p><br></p>`;
  runEditorCommand("insertHTML", table);
}

function getSelectionElement() {
  restoreWordSelection();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const node = selection.getRangeAt(0).startContainer;
  return node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
}

function getActiveTable() {
  const element = getSelectionElement();
  return element ? element.closest("table") : null;
}

function runTableAction(action, createIfMissing = true) {
  restoreWordSelection();
  let table = getActiveTable();
  if (!table && createIfMissing) {
    insertTable();
    table = wordEditor.querySelector("table:last-of-type");
  }

  if (!table) {
    return;
  }

  action(table);
  saveWordSelection();
  updateOutput();
}

function getActiveCell(table) {
  const element = getSelectionElement();
  const cell = element ? element.closest("td,th") : null;
  return cell && table.contains(cell) ? cell : table.querySelector("td,th");
}

function getCellIndex(table) {
  const cell = getActiveCell(table);
  return cell ? Array.from(cell.parentElement.children).indexOf(cell) : 0;
}

function addTableColumn(table) {
  const index = getCellIndex(table) + 1;
  Array.from(table.rows).forEach((row) => {
    const cell = row.insertCell(Math.min(index, row.cells.length));
    cell.textContent = "Cell";
  });
}

function removeTableColumn(table) {
  const index = getCellIndex(table);
  Array.from(table.rows).forEach((row) => {
    if (row.cells.length > 1) {
      row.deleteCell(Math.min(index, row.cells.length - 1));
    }
  });
}

function addTableRow(table) {
  const activeCell = getActiveCell(table);
  const activeRow = activeCell ? activeCell.parentElement : table.rows[table.rows.length - 1];
  const columnCount = activeRow ? activeRow.cells.length : 2;
  const rowIndex = activeRow ? activeRow.rowIndex + 1 : table.rows.length;
  const row = table.insertRow(Math.min(rowIndex, table.rows.length));

  for (let index = 0; index < columnCount; index += 1) {
    row.insertCell(index).textContent = "Cell";
  }
}

function removeTableRow(table) {
  if (table.rows.length <= 1) {
    return;
  }

  const activeCell = getActiveCell(table);
  const row = activeCell ? activeCell.parentElement : table.rows[table.rows.length - 1];
  table.deleteRow(Array.from(table.rows).indexOf(row));
}

function resizeTable(table, amount) {
  const current = Number((table.getAttribute("width") || "80%").replace("%", "")) || 80;
  const next = Math.max(25, Math.min(100, current + amount));
  table.setAttribute("width", `${next}%`);
}

function moveTable(table, align) {
  table.setAttribute("align", align);
}

function deleteTable(table) {
  table.remove();
}

function editTableProperties(table) {
  const width = window.prompt("Table width percent", (table.getAttribute("width") || "80%").replace("%", ""));
  if (width) {
    table.setAttribute("width", `${Math.max(25, Math.min(100, Number(width) || 80))}%`);
  }

  const align = window.prompt("Table align: left, center, or right", table.getAttribute("align") || "left");
  if (align && ["left", "center", "right"].includes(align.toLowerCase())) {
    table.setAttribute("align", align.toLowerCase());
  }
}

function chooseRowAction(table) {
  const action = window.prompt("Row action: add or remove", "add");
  if (!action) {
    return;
  }

  if (action.toLowerCase().startsWith("r")) {
    removeTableRow(table);
  } else {
    addTableRow(table);
  }
}

function chooseColumnAction(table) {
  const action = window.prompt("Column action: add or remove", "add");
  if (!action) {
    return;
  }

  if (action.toLowerCase().startsWith("r")) {
    removeTableColumn(table);
  } else {
    addTableColumn(table);
  }
}

function editCellProperties(table) {
  const cell = getActiveCell(table);
  if (!cell) {
    return;
  }

  const align = window.prompt("Cell align: left, center, or right", cell.getAttribute("align") || "left");
  if (align && ["left", "center", "right"].includes(align.toLowerCase())) {
    cell.setAttribute("align", align.toLowerCase());
  }
}

function toggleTablePanel() {
  saveWordSelection();
  tablePanel.classList.toggle("hidden");
}

function closeTablePanel() {
  tablePanel.classList.add("hidden");
  tableSubmenu.classList.add("hidden");
}

function showTableSubmenu(type) {
  tableSubmenu.classList.remove("hidden");
  tableSubmenu.querySelectorAll("[data-table-action]").forEach((button) => {
    button.hidden = !button.dataset.tableAction.startsWith(type);
  });
}

function runTableSubmenuAction(action) {
  const actions = {
    "cell-left": (table) => setActiveCellAlign(table, "left"),
    "cell-center": (table) => setActiveCellAlign(table, "center"),
    "cell-right": (table) => setActiveCellAlign(table, "right"),
    "row-add": addTableRow,
    "row-remove": removeTableRow,
    "column-add": addTableColumn,
    "column-remove": removeTableColumn
  };

  if (actions[action]) {
    runTableAction(actions[action]);
  }
}

function setActiveCellAlign(table, align) {
  const cell = getActiveCell(table);
  if (cell) {
    cell.setAttribute("align", align);
  }
}

function renderTableGrid() {
  tableGrid.innerHTML = "";
  for (let row = 1; row <= 10; row += 1) {
    for (let column = 1; column <= 10; column += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.row = String(row);
      button.dataset.column = String(column);
      button.setAttribute("aria-label", `${row} by ${column} table`);
      tableGrid.appendChild(button);
    }
  }
}

function updateTableGrid(rows, columns) {
  tableGridSize.textContent = `${rows} x ${columns}`;
  tableGrid.querySelectorAll("button").forEach((button) => {
    const row = Number(button.dataset.row);
    const column = Number(button.dataset.column);
    button.classList.toggle("active", row <= rows && column <= columns);
  });
}

function beautifySource() {
  htmlEditor.value = prettyPrint(htmlEditor.value.trim());
  pushHtmlUndo();
  updateOutput();
}

function minifySource() {
  htmlEditor.value = htmlEditor.value
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
  pushHtmlUndo();
  updateOutput();
}

function validateSource() {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlEditor.value, "text/html");
  const problems = [];

  doc.body.querySelectorAll("*").forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      problems.push(`Unsupported tag: <${element.tagName.toLowerCase()}>`);
    }

    Array.from(element.attributes).forEach((attribute) => {
      const allowed = allowedAttributes[element.tagName] || new Set([]);
      if (!allowed.has(attribute.name.toLowerCase())) {
        problems.push(`Unsupported attribute: ${element.tagName.toLowerCase()}[${attribute.name}]`);
      }
    });
  });

  window.alert(problems.length ? problems.slice(0, 10).join("\n") : "HTML looks compatible with this converter's HTML 1.0 output rules.");
}

function pushHtmlUndo() {
  const latest = htmlUndoStack[htmlUndoStack.length - 1];
  if (latest !== htmlEditor.value) {
    htmlUndoStack.push(htmlEditor.value);
    if (htmlUndoStack.length > 40) {
      htmlUndoStack.shift();
    }
  }
}

function updateToolbarState() {
  document.querySelectorAll("[data-command]").forEach((button) => {
    const command = button.dataset.command;
    let active = false;
    try {
      active = document.queryCommandState(command);
    } catch (error) {
      active = false;
    }
    button.classList.toggle("active", active);
  });
}

function focusPreview() {
  previewFrame.scrollIntoView({ behavior: "smooth", block: "nearest" });
  previewFrame.focus();
}

function handleMenu(menu) {
  const actions = {
    file: () => fileInput.click(),
    edit: copyInput,
    insert: promptForLink,
    view: focusPreview,
    format: () => runEditorCommand("removeFormat"),
    table: insertTable,
    tools: updateOutput
  };

  actions[menu]?.();
}

function saveWordSelection() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  if (wordEditor.contains(range.commonAncestorContainer)) {
    savedWordRange = range.cloneRange();
  }
}

function restoreWordSelection() {
  if (!savedWordRange) {
    return;
  }

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedWordRange);
}

function getSelectedTextFrom(target) {
  if (target instanceof HTMLTextAreaElement) {
    return target.value.slice(target.selectionStart, target.selectionEnd).trim();
  }

  const selection = target.ownerDocument.getSelection();
  if (!selection || selection.rangeCount === 0 || !target.contains(selection.anchorNode)) {
    return "";
  }

  return selection.toString().trim();
}

function reflectSelectionFrom(target) {
  if (suppressReflection) {
    return;
  }

  const selected = getSelectedTextFrom(target);
  const text = stripTags(selected).trim();
  clearReflections();

  if (text.length < 2) {
    return;
  }

  suppressReflection = true;
  if (activeMode === "word") {
    if (target === wordEditor) {
      selectInTextarea(outputHtml, text);
      highlightInPreview(text);
    } else if (target === outputHtml) {
      highlightTextInElement(wordEditor, text);
      highlightInPreview(text);
    } else {
      highlightTextInElement(wordEditor, text);
      selectInTextarea(outputHtml, text);
    }
  } else if (target === htmlEditor) {
    highlightTextInElement(wordOutput, text);
    highlightInPreview(text);
  } else {
    selectInTextarea(htmlEditor, text);
    highlightTextInElement(wordOutput, text);
  }
  suppressReflection = false;
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ");
}

function selectInTextarea(textarea, text) {
  const value = textarea.value;
  const exactIndex = value.indexOf(text);
  const escapedIndex = value.indexOf(escapeHtml(text));
  const index = exactIndex >= 0 ? exactIndex : escapedIndex;

  if (index >= 0) {
    textarea.setSelectionRange(index, index + text.length);
  }
}

function highlightTextInElement(element, text) {
  const api = element.ownerDocument.defaultView.CSS;
  const HighlightClass = element.ownerDocument.defaultView.Highlight;
  if (!api || !api.highlights || !HighlightClass) {
    return;
  }

  const range = findTextRange(element, text);
  if (range) {
    api.highlights.set("sync-highlight", new HighlightClass(range));
  }
}

function highlightInPreview(text) {
  const doc = previewFrame.contentDocument;
  if (doc && doc.body) {
    highlightTextInElement(doc.body, text);
  }
}

function findTextRange(root, text) {
  const needle = text.toLowerCase();
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = walker.nextNode())) {
    const index = node.nodeValue.toLowerCase().indexOf(needle);
    if (index >= 0) {
      const range = root.ownerDocument.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + text.length);
      return range;
    }
  }

  return null;
}

function clearReflections() {
  clearHighlights(window);
  if (previewFrame.contentWindow) {
    clearHighlights(previewFrame.contentWindow);
  }
}

function clearHighlights(view) {
  if (view.CSS && view.CSS.highlights) {
    view.CSS.highlights.delete("sync-highlight");
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bindSelectionReflection(element) {
  element.addEventListener("mouseup", () => reflectSelectionFrom(element));
  element.addEventListener("keyup", () => reflectSelectionFrom(element));
  element.addEventListener("select", () => reflectSelectionFrom(element));
}

function bindPreviewSelection() {
  const doc = previewFrame.contentDocument;
  if (!doc || doc.body.dataset.selectionBound === "true") {
    return;
  }

  doc.body.dataset.selectionBound = "true";
  doc.addEventListener("mouseup", () => reflectSelectionFrom(doc.body));
  doc.addEventListener("keyup", () => reflectSelectionFrom(doc.body));
}

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    runEditorCommand(button.dataset.command);
  });
});

document.querySelectorAll("[data-menu]").forEach((button) => {
  button.addEventListener("click", () => handleMenu(button.dataset.menu));
});

document.addEventListener("selectionchange", () => {
  if (activeMode === "word") {
    saveWordSelection();
    updateToolbarState();
  }
});

formatToolbar.addEventListener("mousedown", (event) => {
  if (event.target.closest("button")) {
    event.preventDefault();
  }
  saveWordSelection();
});

formatBlock.addEventListener("mousedown", saveWordSelection);
textColor.addEventListener("mousedown", saveWordSelection);

wordEditor.addEventListener("mouseup", saveWordSelection);
wordEditor.addEventListener("keyup", saveWordSelection);
wordEditor.addEventListener("input", () => {
  saveWordSelection();
  updateOutput();
});
htmlEditor.addEventListener("input", () => {
  pushHtmlUndo();
  updateOutput();
});
removeEmpty.addEventListener("change", updateOutput);
keepLinks.addEventListener("change", updateOutput);
keepImages.addEventListener("change", updateOutput);
keepTables.addEventListener("change", updateOutput);
keepLists.addEventListener("change", updateOutput);
keepFormatting.addEventListener("change", updateOutput);
removeComments.addEventListener("change", updateOutput);
wrapMode.addEventListener("change", updateOutput);
formatBlock.addEventListener("change", () => {
  runEditorCommand("formatBlock", formatBlock.value);
  formatBlock.value = "p";
});
textColor.addEventListener("input", () => runEditorCommand("foreColor", textColor.value));
wordTab.addEventListener("click", () => setMode("word"));
htmlTab.addEventListener("click", () => setMode("html"));

document.getElementById("refreshBtn").addEventListener("click", updateOutput);
document.getElementById("downloadBtn").addEventListener("click", downloadHtml);
document.getElementById("copyBtn").addEventListener("click", copyHtml);
document.getElementById("copyInputBtn").addEventListener("click", copyInput);
document.getElementById("copyOutputBtn").addEventListener("click", copyOutput);
document.getElementById("copyWordBtn").addEventListener("click", copyInput);
document.getElementById("copyHtmlInputBtn").addEventListener("click", copyInput);
document.getElementById("sourceBtn").addEventListener("click", () => setMode("html"));
document.getElementById("linkBtn").addEventListener("click", promptForLink);
document.getElementById("imageBtn").addEventListener("click", promptForImage);
document.getElementById("printBtn").addEventListener("click", () => window.print());
document.getElementById("previewBtn").addEventListener("click", focusPreview);
document.getElementById("emojiBtn").addEventListener("click", () => runEditorCommand("insertText", ":)"));
document.getElementById("tableBtn").addEventListener("click", toggleTablePanel);
document.getElementById("insertTableMenuBtn").addEventListener("click", () => updateTableGrid(1, 1));
document.getElementById("tablePropertiesBtn").addEventListener("click", () => runTableAction(editTableProperties, false));
document.getElementById("deleteTableBtn").addEventListener("click", () => runTableAction(deleteTable, false));
document.querySelectorAll("[data-table-submenu]").forEach((button) => {
  button.addEventListener("mouseenter", () => showTableSubmenu(button.dataset.tableSubmenu));
  button.addEventListener("click", () => showTableSubmenu(button.dataset.tableSubmenu));
});
tableSubmenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-table-action]");
  if (button) {
    runTableSubmenuAction(button.dataset.tableAction);
  }
});
tableGrid.addEventListener("mouseover", (event) => {
  const button = event.target.closest("button");
  if (button) {
    updateTableGrid(Number(button.dataset.row), Number(button.dataset.column));
  }
});
tableGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  insertTable(Number(button.dataset.row), Number(button.dataset.column));
  closeTablePanel();
});
document.addEventListener("click", (event) => {
  if (!tablePanel.contains(event.target) && event.target.id !== "tableBtn") {
    closeTablePanel();
  }
});
document.getElementById("htmlUndoBtn").addEventListener("click", () => {
  if (htmlUndoStack.length > 1) {
    htmlUndoStack.pop();
    htmlEditor.value = htmlUndoStack[htmlUndoStack.length - 1];
    updateOutput();
  }
});
document.getElementById("htmlFileBtn").addEventListener("click", () => fileInput.click());
document.getElementById("htmlCleanBtn").addEventListener("click", () => {
  htmlEditor.value = convertHtmlToWord();
  pushHtmlUndo();
  updateOutput();
});
document.getElementById("htmlBeautifyBtn").addEventListener("click", beautifySource);
document.getElementById("htmlMinifyBtn").addEventListener("click", minifySource);
document.getElementById("htmlValidateBtn").addEventListener("click", validateSource);
document.getElementById("clearBtn").addEventListener("click", () => {
  wordEditor.innerHTML = "";
  htmlEditor.value = "";
  htmlUndoStack = [""];
  updateOutput();
});

document.getElementById("openFileBtn").addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (activeMode === "html" || file.name.toLowerCase().endsWith(".html") || file.name.toLowerCase().endsWith(".htm")) {
      setMode("html");
      htmlEditor.value = String(reader.result);
      htmlUndoStack = [htmlEditor.value];
    } else {
      wordEditor.innerText = String(reader.result);
    }
    updateOutput();
  };
  reader.readAsText(file);
});

function applyTheme(mode) {
  document.documentElement.classList.toggle("theme-dark", mode === "dark");
  themeToggleBtn.textContent = mode === "dark" ? "☀️" : "🌙";
  themeToggleBtn.title = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";
  localStorage.setItem("theme", mode);
}

function toggleAboutModal(open) {
  aboutModal.classList.toggle("hidden", !open);
}

themeToggleBtn?.addEventListener("click", () => {
  const nextTheme = document.documentElement.classList.contains("theme-dark") ? "light" : "dark";
  applyTheme(nextTheme);
});

aboutBtn?.addEventListener("click", () => toggleAboutModal(true));
closeAboutBtn?.addEventListener("click", () => toggleAboutModal(false));
aboutModal?.addEventListener("click", (event) => {
  if (event.target === aboutModal) {
    toggleAboutModal(false);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleAboutModal(false);
  }
});

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

toggleAboutModal(true);

window.addEventListener("load", () => {
  const loader = document.getElementById("load");
  document.body.classList.remove("loading");
  if (loader) {
    loader.style.display = "none";
  }
});

bindSelectionReflection(wordEditor);
bindSelectionReflection(htmlEditor);
bindSelectionReflection(outputHtml);
bindSelectionReflection(wordOutput);
renderTableGrid();
updateTableGrid(1, 1);
updateOutput();
