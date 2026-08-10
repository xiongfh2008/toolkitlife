'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { PDFDocument } from 'pdf-lib'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

export default function MergePdf() {
  const t = useTranslations('tools.merge-pdf')
  const [files, setFiles] = useState<File[]>([])
  const [step, setStep] = useState<'upload' | 'processing' | 'done'>('upload')
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [error, setError] = useState('')

  const faqs = t.raw('faqs') as FAQ[]
  const relatedTools = t.raw('relatedTools') as RelatedTool[]
  const keywords = t.raw('keywords') as string[]
  const guideSteps = t.raw('guide.steps') as string[]

  const handleUpload = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    const pdfs = Array.from(newFiles).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    setFiles(prev => [...prev, ...pdfs])
    setError('')
    setOutputBlob(null)
  }, [])

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const moveFile = (idx: number, dir: -1 | 1) => {
    setFiles(prev => {
      const next = [...prev]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }

  const merge = async () => {
    if (files.length < 2) return
    setStep('processing')
    setProgress(0)
    setError('')

    try {
      const merged = await PDFDocument.create()
      let total = 0

      for (let i = 0; i < files.length; i++) {
        setStatusMsg(t('status.loading', { current: i + 1, total: files.length }))
        const bytes = await files[i].arrayBuffer()
        const pdf = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => merged.addPage(p))
        total += pages.length
        setProgress(Math.round(((i + 1) / files.length) * 90))
      }

      setStatusMsg(t('status.saving'))
      const bytes = await merged.save({ useObjectStreams: true })
      setOutputBlob(new Blob([bytes as BlobPart], { type: 'application/pdf' }))
      setPageCount(total)
      setProgress(100)
      setStep('done')
    } catch (err) {
      console.error(err)
      setError(t('errors.generic', { message: err instanceof Error ? err.message : String(err) }))
      setStep('upload')
    }
  }

  const download = () => {
    if (!outputBlob) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(outputBlob)
    a.download = 'merged.pdf'
    a.click()
  }

  const btn = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors'

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
      category={t('category')}
      slug="merge-pdf"
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
          <div
            onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('merge-in')?.click()}
            className="border-2 border-dashed border-zinc-600 rounded-xl p-16 text-center cursor-pointer hover:border-zinc-500 transition-colors"
          >
            <div className="text-4xl mb-4">📑</div>
            <p className="text-zinc-300 font-medium">{t('dropzone.title')}</p>
            <p className="text-zinc-500 text-sm mt-1">{t('dropzone.subtitle')}</p>
            <input id="merge-in" type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={`${f.name}-${i}`} className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded-lg p-3">
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{f.name}</p>
                    <p className="text-xs text-zinc-500">{t('file.size', { size: (f.size / 1024).toFixed(1) })}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="px-2 py-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30">↑</button>
                    <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="px-2 py-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30">↓</button>
                    <button onClick={() => removeFile(i)} className="px-2 py-1 text-red-400 hover:text-red-300">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div className="flex justify-end">
              <button onClick={merge} disabled={files.length < 2} className={`${btn} bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50`}>
                {t('buttons.merge')}
              </button>
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

      {step === 'done' && (
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-1">{t('done.title')}</h3>
          <p className="text-zinc-400 text-sm">{t('done.pages', { count: pageCount })}</p>
          <div className="flex justify-center gap-3">
            <button onClick={download} className={`${btn} bg-green-600 hover:bg-green-500 text-white px-6 py-3`}>{t('buttons.download')}</button>
            <button onClick={() => { setStep('upload'); setFiles([]); setOutputBlob(null) }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 py-3`}>{t('buttons.newFiles')}</button>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
