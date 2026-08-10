'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

function parseRanges(input: string, max: number): number[] {
  const pages = new Set<number>()
  const parts = input.split(/[,，]/)
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(s => parseInt(s.trim(), 10))
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(max, end); i++) pages.add(i)
      }
    } else {
      const n = parseInt(trimmed, 10)
      if (!isNaN(n) && n >= 1 && n <= max) pages.add(n)
    }
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export default function SplitPdf() {
  const t = useTranslations('tools.split-pdf')
  const [file, setFile] = useState<File | null>(null)
  const [rangeInput, setRangeInput] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [step, setStep] = useState<'upload' | 'processing' | 'done'>('upload')
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [outputMode, setOutputMode] = useState<'single' | 'zip'>('single')
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null)
  const [zipBlob, setZipBlob] = useState<Blob | null>(null)
  const [selectedCount, setSelectedCount] = useState(0)
  const [error, setError] = useState('')

  const faqs = t.raw('faqs') as FAQ[]
  const relatedTools = t.raw('relatedTools') as RelatedTool[]
  const keywords = t.raw('keywords') as string[]
  const guideSteps = t.raw('guide.steps') as string[]

  const handleUpload = useCallback(async (f: File) => {
    setFile(f)
    setError('')
    setOutputBlob(null)
    setZipBlob(null)
    setRangeInput('')
    try {
      const bytes = await f.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      setTotalPages(pdf.getPageCount())
    } catch (err) {
      setError(t('errors.read', { message: err instanceof Error ? err.message : String(err) }))
    }
  }, [t])

  const split = async () => {
    if (!file || totalPages === 0) return
    const pages = parseRanges(rangeInput, totalPages)
    if (pages.length === 0) {
      setError(t('errors.noPages'))
      return
    }
    setSelectedCount(pages.length)
    setStep('processing')
    setProgress(0)
    setError('')
    setOutputBlob(null)
    setZipBlob(null)

    try {
      setStatusMsg(t('status.loading'))
      const bytes = await file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const indices = pages.map(p => p - 1)

      if (outputMode === 'single') {
        const newPdf = await PDFDocument.create()
        for (let i = 0; i < indices.length; i++) {
          setStatusMsg(t('status.extracting', { current: i + 1, total: indices.length }))
          const [copied] = await newPdf.copyPages(src, [indices[i]])
          newPdf.addPage(copied)
          setProgress(Math.round(((i + 1) / indices.length) * 90))
        }
        setStatusMsg(t('status.saving'))
        const out = await newPdf.save({ useObjectStreams: true })
        setOutputBlob(new Blob([out as BlobPart], { type: 'application/pdf' }))
      } else {
        const zip = new JSZip()
        const baseName = file.name.replace(/\.pdf$/i, '')
        for (let i = 0; i < indices.length; i++) {
          setStatusMsg(t('status.extracting', { current: i + 1, total: indices.length }))
          const pagePdf = await PDFDocument.create()
          const [copied] = await pagePdf.copyPages(src, [indices[i]])
          pagePdf.addPage(copied)
          const out = await pagePdf.save({ useObjectStreams: true })
          zip.file(`${baseName}-page-${pages[i]}.pdf`, out)
          setProgress(Math.round(((i + 1) / indices.length) * 90))
        }
        setStatusMsg(t('status.generatingZip'))
        const zipOut = await zip.generateAsync({ type: 'blob' })
        setZipBlob(zipOut)
      }

      setProgress(100)
      setStep('done')
    } catch (err) {
      console.error(err)
      setError(t('errors.generic', { message: err instanceof Error ? err.message : String(err) }))
      setStep('upload')
    }
  }

  const download = () => {
    if (!file) return
    const a = document.createElement('a')
    if (outputMode === 'single' && outputBlob) {
      a.href = URL.createObjectURL(outputBlob)
      a.download = file.name.replace(/\.pdf$/i, '') + '-split.pdf'
    } else if (outputMode === 'zip' && zipBlob) {
      a.href = URL.createObjectURL(zipBlob)
      a.download = file.name.replace(/\.pdf$/i, '') + '-split.zip'
    } else {
      return
    }
    a.click()
  }

  const previewPages = rangeInput ? parseRanges(rangeInput, totalPages) : []
  const btn = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors'

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
      category={t('category')}
      slug="split-pdf"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t('guide.heading')}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {guideSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      }
    >
      {step === 'upload' && (
        <div className="space-y-4">
          {!file ? (
            <div
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') handleUpload(f) }}
              onDragOver={e => e.preventDefault()}
              onClick={() => document.getElementById('split-in')?.click()}
              className="border-2 border-dashed border-zinc-600 rounded-xl p-16 text-center cursor-pointer hover:border-zinc-500 transition-colors"
            >
              <div className="text-4xl mb-4">✂️</div>
              <p className="text-zinc-300 font-medium">{t('dropzone.title')}</p>
              <p className="text-zinc-500 text-sm mt-1">{t('dropzone.subtitle')}</p>
              <input id="split-in" type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <div>
                  <p className="text-sm text-zinc-200">{file.name}</p>
                  <p className="text-xs text-zinc-500">{t('file.pages', { count: totalPages })}</p>
                </div>
                <button onClick={() => { setFile(null); setTotalPages(0); setRangeInput(''); setOutputBlob(null); setZipBlob(null) }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>{t('buttons.change')}</button>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-300">{t('labels.range')}</label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={e => setRangeInput(e.target.value)}
                  placeholder={t('placeholders.range')}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-blue-500"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {previewPages.length > 0 ? t('labels.selected', { count: previewPages.length }) : t('labels.total', { count: totalPages })}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">{t('labels.outputMode')}</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input type="radio" name="split-mode" value="single" checked={outputMode === 'single'} onChange={() => setOutputMode('single')} className="accent-blue-500" />
                    {t('options.single')}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input type="radio" name="split-mode" value="zip" checked={outputMode === 'zip'} onChange={() => setOutputMode('zip')} className="accent-blue-500" />
                    {t('options.zip')}
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={split} disabled={!rangeInput.trim()} className={`${btn} bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50`}>{t('buttons.split')}</button>
              </div>
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

      {step === 'done' && (outputBlob || zipBlob) && (
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-1">{t('done.title')}</h3>
          <p className="text-zinc-400 text-sm">{t('done.pages', { count: selectedCount })}</p>
          <div className="flex justify-center gap-3">
            <button onClick={download} className={`${btn} bg-green-600 hover:bg-green-500 text-white px-6 py-3`}>
              {outputMode === 'zip' ? t('buttons.downloadZip') : t('buttons.download')}
            </button>
            <button onClick={() => { setStep('upload'); setFile(null); setTotalPages(0); setRangeInput(''); setOutputBlob(null); setZipBlob(null) }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 py-3`}>{t('buttons.newFile')}</button>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
