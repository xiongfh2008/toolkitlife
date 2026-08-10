'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { PDFDocument, rgb } from 'pdf-lib'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

export default function CompressPdf() {
  const t = useTranslations('tools.compress-pdf')
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'done'>('upload')
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [quality, setQuality] = useState(0.7)
  const [dpi, setDpi] = useState(150)
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [error, setError] = useState('')

  const faqs = t.raw('faqs') as FAQ[]
  const relatedTools = t.raw('relatedTools') as RelatedTool[]
  const keywords = t.raw('keywords') as string[]
  const guideSteps = t.raw('guide.steps') as string[]

  const handleUpload = useCallback((f: File) => {
    setFile(f)
    setOriginalSize(f.size)
    setError('')
    setOutputBlob(null)
  }, [])

  const compress = async () => {
    if (!file) return
    setStep('processing')
    setProgress(0)
    setError('')

    try {
      setStatusMsg(t('status.loadingEngine'))
      const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs' as string) as unknown as {
        GlobalWorkerOptions: { workerSrc: string }
        getDocument: (opts: { data: ArrayBuffer }) => { promise: Promise<{
          numPages: number
          getPage: (n: number) => Promise<{
            getViewport: (opts: { scale: number }) => { width: number; height: number }
            render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> }
          }>
        }> }
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'

      const arrayBuffer = await file.arrayBuffer()
      const src = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const totalPages = src.numPages

      const newPdf = await PDFDocument.create()

      for (let i = 1; i <= totalPages; i++) {
        setStatusMsg(t('status.rendering', { current: i, total: totalPages }))
        const page = await src.getPage(i)
        const scale = dpi / 72
        const viewport = page.getViewport({ scale })
        const width = Math.max(1, Math.round(viewport.width))
        const height = Math.max(1, Math.round(viewport.height))

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas context unavailable')

        await page.render({ canvasContext: ctx, viewport }).promise

        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        const jpgBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), c => c.charCodeAt(0))
        const jpg = await newPdf.embedJpg(jpgBytes)

        const newPage = newPdf.addPage([jpg.width, jpg.height])
        newPage.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height })
        newPage.drawRectangle({ x: 0, y: 0, width: jpg.width, height: jpg.height, color: rgb(1, 1, 1), opacity: 0 })

        setProgress(Math.round((i / totalPages) * 90))
      }

      setStatusMsg(t('status.saving'))
      const bytes = await newPdf.save({ useObjectStreams: true })
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      setOutputBlob(blob)
      setCompressedSize(blob.size)
      setProgress(100)
      setStep('done')
    } catch (err) {
      console.error(err)
      setError(t('errors.generic', { message: err instanceof Error ? err.message : String(err) }))
      setStep('upload')
    }
  }

  const download = () => {
    if (!outputBlob || !file) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(outputBlob)
    a.download = file.name.replace(/\.pdf$/i, '') + '-compressed.pdf'
    a.click()
  }

  const ratio = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0

  const btn = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors'

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
      category={t('category')}
      slug="compress-pdf"
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
              onClick={() => document.getElementById('compress-in')?.click()}
              className="border-2 border-dashed border-zinc-600 rounded-xl p-16 text-center cursor-pointer hover:border-zinc-500 transition-colors"
            >
              <div className="text-4xl mb-4">🗜️</div>
              <p className="text-zinc-300 font-medium">{t('dropzone.title')}</p>
              <p className="text-zinc-500 text-sm mt-1">{t('dropzone.subtitle')}</p>
              <input id="compress-in" type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                <div>
                  <p className="text-sm text-zinc-200">{file.name}</p>
                  <p className="text-xs text-zinc-500">{t('file.size', { size: (file.size / 1024).toFixed(1) })}</p>
                </div>
                <button onClick={() => { setFile(null); setOutputBlob(null) }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>{t('buttons.change')}</button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">{t('labels.quality')}: {Math.round(quality * 100)}%</label>
                  <input type="range" min="0.3" max="1" step="0.05" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">{t('labels.dpi')}: {dpi}</label>
                  <input type="range" min="72" max="300" step="12" value={dpi} onChange={e => setDpi(parseInt(e.target.value))} className="w-full accent-blue-500" />
                </div>
              </div>

              <p className="text-xs text-amber-400/90 bg-amber-900/20 border border-amber-800/50 rounded-lg p-3">{t('notice.quality')}</p>

              <div className="flex justify-end">
                <button onClick={compress} className={`${btn} bg-blue-600 hover:bg-blue-500 text-white`}>{t('buttons.compress')}</button>
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

      {step === 'done' && outputBlob && (
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-1">{t('done.title')}</h3>
          <p className="text-zinc-400 text-sm">
            {t('done.original')}: {(originalSize / 1024).toFixed(1)} KB{' '}
            {'→'} {t('done.compressed')}: {(compressedSize / 1024).toFixed(1)} KB
            {ratio > 0 && ` (-${ratio}%)`}
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={download} className={`${btn} bg-green-600 hover:bg-green-500 text-white px-6 py-3`}>{t('buttons.download')}</button>
            <button onClick={() => { setStep('upload'); setFile(null); setOutputBlob(null) }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 py-3`}>{t('buttons.newFile')}</button>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
