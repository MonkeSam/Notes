/**
 * CodeStyler – Quartz transformer plugin
 * ==========================================
 * Replica le funzionalità del plugin Obsidian "Code Styler":
 *
 *   title:"My File"       → header con nome file
 *   title:utils.ts        → stesso, senza virgolette se non ha spazi
 *   ln                    → numeri di riga
 *   ln:false              → disabilita numeri di riga (se defaultLineNumbers=true)
 *   hl:1,3-5,"testo"      → evidenzia righe per numero, range o testo
 *   fold                  → blocco collassabile (chiuso di default)
 *   fold:"Testo custom"   → collassabile con etichetta personalizzata
 *
 * Esempi di uso nei tuoi appunti Obsidian:
 *
 *   ```ts title:"src/utils.ts" ln hl:2,5-7
 *   ...codice...
 *   ```
 *
 *   ```python fold:"Soluzione esercizio 3"
 *   ...codice...
 *   ```
 *
 * ==========================================
 * INSTALLAZIONE
 *
 * 1. Copia questo file in:
 *      quartz/plugins/transformers/codeStyler.ts
 *
 * 2. Aggiungi l'export in quartz/plugins/transformers/index.ts:
 *      export { CodeStyler } from "./codeStyler"
 *
 * 3. In quartz.config.ts, aggiungi DOPO SyntaxHighlighting:
 *      transformers: [
 *        ...
 *        Plugin.SyntaxHighlighting(),
 *        Plugin.CodeStyler(),          // ← aggiungi qui
 *        ...
 *      ]
 *
 * 4. Opzionalmente personalizza:
 *      Plugin.CodeStyler({
 *        defaultLineNumbers: true,
 *        defaultFoldText: "Mostra codice",
 *        showLanguageTag: true,
 *        showCopyButton: true,
 *      })
 * ==========================================
 */

import { visit } from "unist-util-visit"
import { toString } from "hast-util-to-string"
import type { Element, Root, Text, Node } from "hast"
import type { QuartzTransformerPlugin } from "../types"
import type { Plugin } from "unified"

// ─── Opzioni ──────────────────────────────────────────────────────────────────

export interface CodeStylerOptions {
  /** Abilita i numeri di riga su tutti i blocchi per default */
  defaultLineNumbers: boolean
  /** Testo nell'header quando fold è attivo senza title */
  defaultFoldText: string
  /** Mostra il tag del linguaggio nell'header */
  showLanguageTag: boolean
  /** Mostra il pulsante copia nell'header */
  showCopyButton: boolean
}

const defaultOptions: CodeStylerOptions = {
  defaultLineNumbers: false,
  defaultFoldText: "Collapsed Code",
  showLanguageTag: true,
  showCopyButton: true,
}

interface CodeParams {
  title?: string
  fold: boolean
  foldText: string
  lineNumbers: boolean
  highlightLines: Set<number>
  highlightTexts: string[]
}

// ─── Parser meta-stringa ──────────────────────────────────────────────────────

function parseMetaString(meta: string, opts: CodeStylerOptions): CodeParams {
  const result: CodeParams = {
    fold: false,
    foldText: opts.defaultFoldText,
    lineNumbers: opts.defaultLineNumbers,
    highlightLines: new Set(),
    highlightTexts: [],
  }
  if (!meta) return result

  // title:"valore" o title:valore
  const titleMatch = meta.match(/title[:=]"([^"]+)"|title[:=]([^\s"]+)/)
  if (titleMatch) result.title = titleMatch[1] ?? titleMatch[2]

  // fold, fold:"testo", fold:testo
  const foldMatch = meta.match(/fold[:=]"([^"]*)"|fold[:=]([^\s"]+)|\bfold\b/)
  if (foldMatch) {
    result.fold = true
    if (foldMatch[1] !== undefined) result.foldText = foldMatch[1]
    else if (foldMatch[2] !== undefined) result.foldText = foldMatch[2]
  }

  // ln / ln:false
  if (/\bln[:=]false\b/.test(meta)) result.lineNumbers = false
  else if (/\bln\b|\bln[:=]true\b/.test(meta)) result.lineNumbers = true

  // hl:1,3-5,"testo"
  const hlMatch = meta.match(/\bhl[:=](.+?)(?:\s+\w+[:=]|\s*$)/)
  if (hlMatch) {
    const parts: string[] = []
    let cur = ""
    let inQ = false
    for (const ch of hlMatch[1]) {
      if (ch === '"') { inQ = !inQ; cur += ch }
      else if (ch === ',' && !inQ) { parts.push(cur.trim()); cur = "" }
      else cur += ch
    }
    if (cur.trim()) parts.push(cur.trim())

    for (const p of parts) {
      if (p.startsWith('"') && p.endsWith('"')) {
        result.highlightTexts.push(p.slice(1, -1)); continue
      }
      const r = p.match(/^(\d+)-(\d+)$/)
      if (r) {
        for (let i = parseInt(r[1]); i <= parseInt(r[2]); i++) result.highlightLines.add(i)
        continue
      }
      if (/^\d+$/.test(p)) result.highlightLines.add(parseInt(p))
    }
  }

  return result
}

// ─── Colori per linguaggio ────────────────────────────────────────────────────

const LANG_COLORS: Record<string, string> = {
  js: "#f7df1e", javascript: "#f7df1e",
  ts: "#3178c6", typescript: "#3178c6",
  py: "#3572a5", python: "#3572a5",
  rust: "#dea584", rs: "#dea584",
  go: "#00add8",
  java: "#b07219",
  cpp: "#f34b7d",
  c: "#555555",
  cs: "#178600", csharp: "#178600",
  html: "#e34c26",
  css: "#563d7c",
  scss: "#c6538c", sass: "#c6538c",
  bash: "#89e051", sh: "#89e051", shell: "#89e051", zsh: "#89e051",
  json: "#40a6ff",
  yaml: "#cb171e", yml: "#cb171e",
  toml: "#9c4221",
  md: "#083fa1", markdown: "#083fa1",
  sql: "#e38c00",
  php: "#4f5d95",
  ruby: "#701516", rb: "#701516",
  swift: "#f05138",
  kotlin: "#7f52ff", kt: "#7f52ff",
  r: "#198ce7",
  lua: "#000080",
  graphql: "#e10098",
  dart: "#00b4ab",
  elixir: "#6e4a7e",
  xml: "#f60",
  dockerfile: "#384d54",
}

// ─── Helpers DOM ──────────────────────────────────────────────────────────────

function rawNode(html: string): Node {
  return { type: "raw", value: html } as unknown as Node
}
function txt(value: string): Text {
  return { type: "text", value }
}
function el(tag: string, props: Record<string, unknown>, children: Node[]): Element {
  return { type: "element", tagName: tag, properties: props, children: children as Element[] }
}

// ─── Build blocco ─────────────────────────────────────────────────────────────

function buildCodeBlock(pre: Element, params: CodeParams, lang: string, opts: CodeStylerOptions): Element {
  const color = LANG_COLORS[lang.toLowerCase()] ?? "#6b7280"
  const needsHeader = params.title || params.fold || (opts.showLanguageTag && lang) || opts.showCopyButton

  // Header items
  const hItems: Node[] = []

  if (opts.showLanguageTag && lang) {
    hItems.push(el("span", { className: ["cs-lang-tag"] }, [txt(lang)]))
  }

  const titleText = params.title ?? (params.fold ? params.foldText : undefined)
  if (titleText) {
    hItems.push(el("span", { className: ["cs-title"] }, [txt(titleText)]))
  }

  hItems.push(el("span", { className: ["cs-spacer"] }, []))

  if (opts.showCopyButton) {
    const svgCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
    hItems.push(el("button", {
      className: ["cs-copy-btn"],
      title: "Copia codice",
      "aria-label": "Copia codice",
      onclick: "(function(b){var t=b.closest('.cs-wrapper').querySelector('pre').innerText;navigator.clipboard.writeText(t).then(function(){b.classList.add('copied');b.title='Copiato!';b.querySelector('.cs-copy-label').textContent='Copiato!';setTimeout(function(){b.classList.remove('copied');b.title='Copia codice';b.querySelector('.cs-copy-label').textContent='Copia';},2000)})})(this)",
    }, [
      rawNode(svgCopy),
      el("span", { className: ["cs-copy-label"] }, [txt("Copia")]),
    ]))
  }

  if (params.fold) {
    const svgChev = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
    hItems.push(el("span", { className: ["cs-chevron"], "aria-hidden": "true" }, [rawNode(svgChev)]))
  }

  const header = el("div", {
    className: ["cs-header"],
    style: `border-left: 3px solid ${color};`,
  }, hItems)

  // Pre modificato
  const existingCls = Array.isArray(pre.properties?.className) ? [...(pre.properties.className as string[])] : []
  const styledPre: Element = {
    ...pre,
    properties: {
      ...pre.properties,
      className: existingCls,
      style: `border-left: 3px solid ${color}; ${String(pre.properties?.style ?? "")}`,
    },
  }

  // Evidenziazione righe
  if (params.highlightLines.size > 0 || params.highlightTexts.length > 0) {
    let ln = 0
    visit({ type: "root", children: [styledPre] } as Root, "element", (node: Element) => {
      if (!("data-line" in (node.properties ?? {}))) return
      ln++
      const lineText = toString(node)
      if (params.highlightLines.has(ln) || params.highlightTexts.some((t) => lineText.includes(t))) {
        const cls = Array.isArray(node.properties.className)
          ? [...(node.properties.className as string[]), "cs-hl"]
          : ["cs-hl"]
        node.properties.className = cls
      }
    })
  }

  // Wrapper
  const wrapperCls = [
    "cs-wrapper",
    `cs-lang-${lang || "plain"}`,
    ...(params.fold ? ["cs-foldable", "cs-folded"] : []),
    ...(params.lineNumbers ? ["cs-has-line-numbers"] : []),
  ]

  const wrapperChildren: Node[] = []
  if (needsHeader) wrapperChildren.push(header)
  wrapperChildren.push(styledPre)

  return el("div", {
    className: wrapperCls,
    ...(params.fold ? { onclick: "this.classList.toggle('cs-folded')" } : {}),
  }, wrapperChildren)
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const CodeStyler: QuartzTransformerPlugin<Partial<CodeStylerOptions>> = (userOpts?) => {
  const opts: CodeStylerOptions = { ...defaultOptions, ...userOpts }

  return {
    name: "CodeStyler",

    htmlPlugins(): Plugin[] {
      return [
        () => (tree: Root) => {
          visit(tree, "element", (node: Element, index, parent) => {
            if (node.tagName !== "pre") return
            if (typeof index === "undefined" || !parent) return

            const codeEl = node.children.find(
              (c): c is Element => c.type === "element" && (c as Element).tagName === "code",
            )
            if (!codeEl) return

            const classes = Array.isArray(codeEl.properties?.className)
              ? (codeEl.properties.className as string[])
              : []
            const langClass = classes.find((c) => c.startsWith("language-") || c.startsWith("lang-"))
            const lang = langClass ? langClass.replace(/^language-|^lang-/, "") : ""

            const meta =
              String(node.properties?.["data-meta"] ?? "") ||
              String(codeEl.properties?.["data-meta"] ?? "") ||
              String(node.properties?.["metastring"] ?? "") ||
              String(codeEl.properties?.["metastring"] ?? "")

            const params = parseMetaString(meta, opts)

            const hasWork =
              params.title || params.fold || params.lineNumbers ||
              params.highlightLines.size > 0 || params.highlightTexts.length > 0 ||
              (opts.showCopyButton && lang) || (opts.showLanguageTag && lang)

            if (!hasWork) return

            ;(parent.children as Node[])[index] = buildCodeBlock(node, params, lang, opts)
          })
        },
      ]
    },

    externalResources() {
      return {
        css: [{ content: CSS_CODE_STYLER }],
      }
    },
  }
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS_CODE_STYLER = `
/* ── Code Styler Plugin per Quartz ── */
.cs-wrapper{position:relative;margin:1.25em 0;border-radius:6px;overflow:hidden;font-size:.9em;box-shadow:0 2px 10px rgba(0,0,0,.2)}
.cs-header{display:flex;align-items:center;gap:8px;padding:5px 10px 5px 12px;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.07);font-family:var(--font-monospace,monospace);font-size:.82em;user-select:none;cursor:default;min-height:32px}
.cs-foldable .cs-header{cursor:pointer}
.cs-foldable .cs-header:hover{background:rgba(255,255,255,.09)}
.cs-lang-tag{font-size:.75em;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:rgba(180,190,210,.7)}
.cs-title{font-size:.85em;color:rgba(220,230,250,.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:50%}
.cs-spacer{flex:1}
.cs-copy-btn{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;background:transparent;border:1px solid rgba(255,255,255,.15);border-radius:4px;color:rgba(170,180,200,.8);cursor:pointer;font-size:.78em;font-family:inherit;transition:background .15s,color .15s,border-color .15s;white-space:nowrap}
.cs-copy-btn:hover{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.3)}
.cs-copy-btn.copied{color:#6ee7b7;border-color:#6ee7b7}
.cs-chevron{display:flex;align-items:center;color:rgba(160,170,190,.6);transition:transform .22s ease}
.cs-foldable.cs-folded .cs-chevron{transform:rotate(-90deg)}
.cs-wrapper>pre{margin:0!important;border-radius:0!important;box-shadow:none!important;border-top:none!important;border-right:none!important;border-bottom:none!important}
.cs-foldable.cs-folded>pre{display:none}
.cs-has-line-numbers pre code{counter-reset:cs-ln}
.cs-has-line-numbers pre code [data-line]{counter-increment:cs-ln;padding-left:3.2em!important;position:relative}
.cs-has-line-numbers pre code [data-line]::before{content:counter(cs-ln);position:absolute;left:0;width:2.5em;text-align:right;padding-right:.5em;color:rgba(150,160,180,.35);border-right:1px solid rgba(255,255,255,.07);pointer-events:none;user-select:none;font-size:.82em;line-height:inherit}
.cs-wrapper pre code [data-line].cs-hl{background:rgba(255,214,0,.11);border-left:3px solid #f59e0b;margin-left:-3px}
:root[saved-theme=light] .cs-header,html[data-theme=light] .cs-header{background:rgba(0,0,0,.04);border-bottom-color:rgba(0,0,0,.08)}
:root[saved-theme=light] .cs-lang-tag,html[data-theme=light] .cs-lang-tag{color:rgba(60,80,110,.65)}
:root[saved-theme=light] .cs-title,html[data-theme=light] .cs-title{color:rgba(20,40,80,.85)}
:root[saved-theme=light] .cs-copy-btn,html[data-theme=light] .cs-copy-btn{color:rgba(70,90,130,.8);border-color:rgba(0,0,0,.15)}
:root[saved-theme=light] .cs-copy-btn:hover,html[data-theme=light] .cs-copy-btn:hover{background:rgba(0,0,0,.07);color:#111}
:root[saved-theme=light] .cs-foldable .cs-header:hover,html[data-theme=light] .cs-foldable .cs-header:hover{background:rgba(0,0,0,.06)}
:root[saved-theme=light] .cs-has-line-numbers pre code [data-line]::before,html[data-theme=light] .cs-has-line-numbers pre code [data-line]::before{color:rgba(80,100,130,.35);border-right-color:rgba(0,0,0,.09)}
:root[saved-theme=light] .cs-wrapper pre code [data-line].cs-hl,html[data-theme=light] .cs-wrapper pre code [data-line].cs-hl{background:rgba(255,190,0,.14);border-left-color:#d97706}
@media(max-width:600px){.cs-copy-label{display:none}}
`
