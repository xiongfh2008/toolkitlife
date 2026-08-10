'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

interface Language {
  code: string
  label: string
}

export default function ImageToText() {
  const t = useTranslations('tools.image-to-text')
  const faqs = t.raw('faqs') as FAQ[]
  const relatedTools = t.raw('relatedTools') as RelatedTool[]
  const keywords = t.raw('metadata.keywords') as string[]
  const languages = t.raw('languages') as Language[]
  const guideSteps = t.raw('guide.steps') as string[]

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [text, setText] = useState('')
  const [lang, setLang] = useState('eng')
  const [engine, setEngine] = useState<'paddle' | 'tesseract'>('paddle')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = useCallback((f: File) => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setText('')
    setError('')
  }, [preview])

  const handlePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        const imgType = item.types.find(t => t.startsWith('image/'))
        if (imgType) {
          const blob = await item.getType(imgType)
          const f = new File([blob], 'pasted-image.png', { type: imgType })
          handleUpload(f)
          return
        }
      }
    } catch { /* ignore */ }
  }, [handleUpload])

  const extract = async () => {
    if (!file) return
    setProcessing(true)
    setProgress(0)
    setError('')
    setText('')

    // ---- PaddleOCR (ffocr) engine ----
    const runPaddle = async () => {
      setStatusMsg(t('status.loadingPaddle'))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ffocr: any = await import('ffocr')
      const ocr = ffocr.createDefaultPPOcrV5({
        cacheModels: true,
        ort: {
          wasmPaths: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/',
        },
      })
      setStatusMsg(t('status.recognizing'))
      const result = await ocr.ocr(preview, {
        onProgress: (m: { phase: string; current?: number; total?: number; loaded?: number; totalBytes?: number }) => {
          if (m.loaded != null && m.totalBytes != null) {
            setProgress(Math.min(95, Math.round((m.loaded / m.totalBytes) * 100)))
            setStatusMsg(m.phase)
          } else if (m.phase === 'recognizing') {
            const pct = m.total ? Math.round(((m.current ?? 0) / m.total) * 100) : 100
            setProgress(pct)
            setStatusMsg(t('status.recognizingProgress', { progress: pct }))
          } else {
            setStatusMsg(m.phase)
          }
        },
      })
      setText(result.text)
      setProgress(100)
    }

    // ---- Tesseract.js engine (fallback, multi-language) ----
    const runTesseract = async () => {
      setStatusMsg(t('status.loadingOcr'))
      // Dynamic import of Tesseract.js
      const Tesseract = await import('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js' as string)

      setStatusMsg(t('status.recognizing'))
      const result = await Tesseract.recognize(preview, lang, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
            setStatusMsg(t('status.recognizingProgress', { progress: Math.round(m.progress * 100) }))
          } else {
            setStatusMsg(m.status)
          }
        },
      })

      setText(result.data.text)
      setProgress(100)
    }

    try {
      if (engine === 'paddle') {
        await runPaddle()
      } else {
        await runTesseract()
      }
    } catch (err) {
      if (engine === 'paddle') {
        // PaddleOCR 失败时回退到 Tesseract
        console.error('PaddleOCR failed, falling back to Tesseract', err)
        try {
          await runTesseract()
        } catch (err2) {
          console.error(err, err2)
          setError(t('errors.generic', { message: err2 instanceof Error ? err2.message : String(err2) }))
        }
      } else {
        // Fallback: load via script tag if ESM import fails
        try {
          setStatusMsg(t('status.fallbackLoading'))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (!(window as any).Tesseract) {
            await new Promise<void>((resolve, reject) => {
              const s = document.createElement('script')
              s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'
              s.onload = () => resolve()
              s.onerror = () => reject(new Error(t('errors.loadFailed')))
              document.head.appendChild(s)
            })
          }

          setStatusMsg(t('status.recognizing'))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Tesseract = (window as any).Tesseract
          const result = await Tesseract.recognize(preview, lang, {
            logger: (m: { status: string; progress: number }) => {
              if (m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100))
                setStatusMsg(t('status.recognizingProgress', { progress: Math.round(m.progress * 100) }))
              } else {
                setStatusMsg(m.status)
              }
            },
          })

          setText(result.data.text)
          setProgress(100)
        } catch (err2) {
          console.error(err, err2)
          setError(t('errors.generic', { message: err2 instanceof Error ? err2.message : String(err2) }))
        }
      }
    } finally {
      setProcessing(false)
    }
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'extracted-text.txt'
    a.click()
  }

  const btn = "px-4 py-2 rounded-lg text-sm font-medium transition-colors"

  return (
    <ToolLayout
      title={t('metadata.title')}
      description={t('metadata.description')}
      category={t('metadata.category')}
      slug="image-to-text"
      faqs={faqs}
      relatedTools={relatedTools}
      keywords={keywords}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t('guide.title')}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {guideSteps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      }
    >
      {!file ? (
        <div className="space-y-4">
          <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleUpload(f) }} onDragOver={e => e.preventDefault()} onClick={() => document.getElementById('ocr-in')?.click()} className="border-2 border-dashed border-zinc-600 rounded-xl p-16 text-center cursor-pointer hover:border-zinc-500 transition-colors">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-zinc-300 font-medium">{t('labels.uploadPrompt')}</p>
            <p className="text-zinc-500 text-sm mt-1">{t('labels.uploadFormats')}</p>
            <input id="ocr-in" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </div>
          <button onClick={handlePaste} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 w-full`}>📋 {t('labels.pasteFromClipboard')}</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <select value={engine} onChange={e => setEngine(e.target.value as 'paddle' | 'tesseract')} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100">
              <option value="paddle">{t('engines.paddleocr')}</option>
              <option value="tesseract">{t('engines.tesseract')}</option>
            </select>
            {engine === 'tesseract' && (
              <select value={lang} onChange={e => setLang(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100">
                {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            )}
            <button onClick={extract} disabled={processing} className={`${btn} bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50`}>
              {processing ? t('labels.extracting') : t('labels.extractText')}
            </button>
            <button onClick={() => { setFile(null); setPreview(''); setText('') }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>{t('labels.newImage')}</button>
          </div>

          {processing && (
            <div>
              <p className="text-sm text-zinc-400 mb-1">{statusMsg}</p>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">{error}</div>}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-2">{t('labels.sourceImage')}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Source" className="w-full rounded-lg border border-zinc-700" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-500">{t('labels.extractedText')}</p>
                {text && (
                  <div className="flex gap-2">
                    <button onClick={copyText} className="text-xs text-blue-400 hover:text-blue-300">{copied ? t('labels.copied') : t('labels.copy')}</button>
                    <button onClick={downloadTxt} className="text-xs text-blue-400 hover:text-blue-300">{t('labels.downloadTxt')}</button>
                  </div>
                )}
              </div>
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t('labels.placeholder')} className="w-full h-80 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
