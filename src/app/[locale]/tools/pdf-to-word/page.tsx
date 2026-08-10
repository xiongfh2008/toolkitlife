'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

interface PdfItem {
  text: string
  fontName: string
  x: number
  y: number
  w: number
  fontSize: number
  family: string
  bold: boolean
  italic: boolean
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// PostScript 字体名（如 "ABCDEF+Calibri-Bold"）→ 通用字族名（"Calibri"）
function cleanFamily(name: string): string {
  if (!name) return 'sans-serif'
  return (
    name
      .replace(/^[A-Z0-9]{6,7}\+/, '') // 去掉子集前缀
      .replace(
        /-(Bold|Black|Italic|Oblique|Light|Medium|Demi|Semibold|Heavy|Narrow|Condensed|Regular|Extended|UltraLight|Thin|Book)$/i,
        ''
      ) || 'sans-serif'
  )
}

// 按 x 间隙把一行文本拆成单元格（间隙 > 20pt 视为新列）。
// 注意：pdf.js 会把列间空隙记到空格项的宽度上，因此只推进"内容项"的右边缘。
function splitCells(line: PdfItem[]): PdfItem[][] {
  const cells: PdfItem[][] = []
  let cur: PdfItem[] = []
  let rightEdge = -Infinity
  for (const it of line) {
    if (cur.length && it.x - rightEdge > 20) {
      cells.push(cur)
      cur = []
    }
    cur.push(it)
    if (it.text.trim()) rightEdge = it.x + it.w
  }
  if (cur.length) cells.push(cur)
  return cells
}

function renderSpan(it: PdfItem): string {
  const st = [`font-size:${Math.round(it.fontSize * 10) / 10}pt`, `font-family:'${it.family}',sans-serif`]
  if (it.bold) st.push('font-weight:bold')
  if (it.italic) st.push('font-style:italic')
  return `<span style="${st.join(';')}">${esc(it.text)}</span>`
}

function renderParagraph(line: PdfItem[], pageW: number): string {
  const text = line.map((i) => i.text).join('')
  if (!text.trim()) return ''
  const first = line[0]
  const last = [...line].reverse().find((i) => i.text.trim()) || first
  const leftGap = first.x
  const rightGap = pageW - (last.x + last.w)
  const lineW = last.x + last.w - first.x
  let align = 'left'
  if (Math.abs(leftGap - rightGap) < Math.max(10, lineW * 0.2) && leftGap > 20) align = 'center'
  else if (leftGap > pageW * 0.45) align = 'right'
  return `<p style="text-align:${align};">${line.map(renderSpan).join('')}</p>`
}

function renderTable(rows: PdfItem[][]): string {
  const body = rows
    .map((line) => {
      const cells = splitCells(line)
      return `<tr>${cells.map((c) => `<td>${c.map(renderSpan).join('')}</td>`).join('')}</tr>`
    })
    .join('')
  return `<table>${body}</table>`
}

function renderPage(lines: PdfItem[][], pageW: number): string {
  const out: string[] = []
  let tableRows: PdfItem[][] = []
  let tableCols = 0
  const flushTable = () => {
    if (tableRows.length >= 2 && tableCols >= 2) out.push(renderTable(tableRows))
    else for (const r of tableRows) out.push(renderParagraph(r, pageW))
    tableRows = []
    tableCols = 0
  }
  for (const line of lines) {
    const cells = splitCells(line)
    if (cells.length >= 2 && (tableCols === 0 || cells.length === tableCols)) {
      if (tableCols === 0) tableCols = cells.length
      tableRows.push(line)
      continue
    }
    flushTable()
    out.push(renderParagraph(line, pageW))
  }
  flushTable()
  return out.join('\n')
}

export default function PdfToWord() {
  const t = useTranslations('tools.pdf-to-word')
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'done'>('upload')
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [pageCount, setPageCount] = useState(0)
  const [previewText, setPreviewText] = useState('')
  const [docBlob, setDocBlob] = useState<Blob | null>(null)
  const [error, setError] = useState('')

  const faqs = t.raw('faqs') as FAQ[]
  const relatedTools = t.raw('relatedTools') as RelatedTool[]
  const keywords = t.raw('keywords') as string[]

  const handleUpload = useCallback((f: File) => {
    setFile(f)
    setError('')
    setDocBlob(null)
    setPreviewText('')
  }, [])

  const convert = async () => {
    if (!file) return
    setStep('processing')
    setProgress(0)
    setError('')

    try {
      setStatusMsg(t('status.loading'))

      // Load pdf.js from CDN (webpackIgnore keeps Turbopack from rewriting the remote import)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs' as string) as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfjsLib = (mod as any).default ?? mod
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs'

      setStatusMsg(t('status.reading'))
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const totalPages = pdf.numPages
      setPageCount(totalPages)

      const plainPages: string[] = []
      const htmlPages: string[] = []

      for (let i = 1; i <= totalPages; i++) {
        setStatusMsg(t('status.extracting', { current: i, total: totalPages }))
        setProgress(Math.round((i / totalPages) * 90))

        const page = await pdf.getPage(i)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const textContent: any = await page.getTextContent()
        const pageW = page.view[2] - page.view[0] || 612

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: PdfItem[] = []
        for (const it of textContent.items as any[]) {
          if (typeof it.str !== 'string' || !it.str) continue
          const t = it.transform || []
          const fontName = it.fontName || ''
          items.push({
            text: it.str,
            fontName,
            x: t[4] || 0,
            y: t[5] || 0,
            w: it.width || 0,
            fontSize: Math.hypot(t[2] || 0, t[3] || 0) || Math.abs(t[0] || 0) || 11,
            family: '',
            bold: false,
            italic: false,
          })
        }

        // 真实字体信息：getTextContent 只返回内部字体 id，需触发 getOperatorList
        // 让 worker 把 FontFaceObject 下发到 page.commonObjs，再从中读取名称/粗斜体。
        try {
          await page.getOperatorList()
        } catch {
          /* 字体信息加载失败时仅退化为不带粗斜体 */
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fontInfo: Record<string, { bold: boolean; italic: boolean; family: string }> = {}
        for (const name of new Set(items.map((i) => i.fontName))) {
          if (!name) continue
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let f: any = null
          try {
            f = page.commonObjs.get(name)
          } catch {
            f = null
          }
          if (f) fontInfo[name] = { bold: !!f.bold, italic: !!f.italic, family: cleanFamily(f.name) }
        }
        for (const it of items) {
          const fi = fontInfo[it.fontName]
          if (fi) {
            it.bold = fi.bold
            it.italic = fi.italic
            it.family = fi.family
          } else {
            it.family = 'sans-serif'
          }
        }

        // 按 y 分组为行（容差 2.5pt），行内按 x 排序
        items.sort((a, b) => (Math.abs(a.y - b.y) > 2.5 ? b.y - a.y : a.x - b.x))
        const lines: PdfItem[][] = []
        for (const it of items) {
          const last = lines[lines.length - 1]
          if (last && Math.abs(last[0].y - it.y) <= 2.5) last.push(it)
          else lines.push([it])
        }
        for (const l of lines) l.sort((a, b) => a.x - b.x)

        plainPages.push(lines.map((l) => l.map((i) => i.text).join('')).join('\n').trim())
        htmlPages.push(renderPage(lines, pageW))
      }

      setStatusMsg(t('status.generating'))
      setProgress(95)

      setPreviewText(plainPages.join('\n\n'))

      // Generate .doc as HTML (Word opens HTML .doc files natively)
      const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${esc(file.name.replace(/\.pdf$/i, ''))}</title>
<style>
body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #000; margin: 1in; }
p { margin: 0 0 6pt 0; }
.page-break { page-break-after: always; }
table { border-collapse: collapse; margin: 6pt 0; width: 100%; }
td { border: 1px solid #999; padding: 3pt 6pt; vertical-align: top; }
</style></head><body>
${htmlPages.map((p, i) => p + (i < htmlPages.length - 1 ? '\n<div class="page-break"></div>' : '')).join('\n')}
</body></html>`

      const blob = new Blob([htmlContent], { type: 'application/msword' })
      setDocBlob(blob)
      setProgress(100)
      setStep('done')
    } catch (err) {
      console.error(err)
      setError(t('errors.generic', { message: err instanceof Error ? err.message : String(err) }))
      setStep('upload')
    }
  }

  const download = () => {
    if (!docBlob || !file) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(docBlob)
    a.download = file.name.replace(/\.pdf$/i, '') + '.doc'
    a.click()
  }

  const btn = "px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  const steps = t.raw('guide.steps') as string[]

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
      category={t('category')}
      slug="pdf-to-word"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t('guide.heading')}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      }
    >
      {step === 'upload' && (
        <div className="space-y-4">
          <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') handleUpload(f) }} onDragOver={e => e.preventDefault()} onClick={() => document.getElementById('pdf-in')?.click()} className="border-2 border-dashed border-zinc-600 rounded-xl p-16 text-center cursor-pointer hover:border-zinc-500 transition-colors">
            <div className="text-4xl mb-4">📑</div>
            <p className="text-zinc-300 font-medium">{t('dropzone.title')}</p>
            <p className="text-zinc-500 text-sm mt-1">{t('dropzone.subtitle')}</p>
            <input id="pdf-in" type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </div>
          {file && (
            <div className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
              <div>
                <p className="text-sm text-zinc-200">{file.name}</p>
                <p className="text-xs text-zinc-500">{t('file.size', { size: (file.size / 1024).toFixed(1) })}</p>
              </div>
              <button onClick={convert} className={`${btn} bg-blue-600 hover:bg-blue-500 text-white`}>{t('buttons.convert')}</button>
            </div>
          )}
          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">{error}</div>}
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚙️</div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-2">{t('processing.title')}</h3>
          <p className="text-zinc-400 mb-6">{statusMsg}</p>
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-zinc-400 mb-1"><span>{t('processing.progress')}</span><span>{progress}%</span></div>
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>
      )}

      {step === 'done' && file && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-1">{t('done.title')}</h3>
            <p className="text-zinc-400 text-sm">{t('done.pages', { count: pageCount })}</p>
          </div>

          <div className="flex justify-center gap-3">
            <button onClick={download} className={`${btn} bg-green-600 hover:bg-green-500 text-white px-6 py-3`}>{t('buttons.download')}</button>
            <button onClick={() => { setStep('upload'); setFile(null); setDocBlob(null); setPreviewText('') }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 py-3`}>{t('buttons.newPdf')}</button>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">{t('preview.label')}</p>
            <textarea readOnly value={previewText} className="w-full h-64 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 resize-none" />
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
