'use client'

import { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

type Mode = 'smooth' | 'sharp' | 'pixel'
type Scale = 2 | 4

const modes: Mode[] = ['smooth', 'sharp', 'pixel']
const scales: Scale[] = [2, 4]
const formats = ['png', 'jpeg'] as const

export default function ImageUpscaler() {
  const t = useTranslations('tools.image-upscaler')
  const labels = t.raw('labels') as Record<string, unknown>
  const modeLabels = labels.modes as Record<Mode, string>

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState('')
  const [mode, setMode] = useState<Mode>('smooth')
  const [scale, setScale] = useState<Scale>(2)
  const [origSize, setOrigSize] = useState({ w: 0, h: 0 })
  const [newSize, setNewSize] = useState({ w: 0, h: 0 })
  const [processing, setProcessing] = useState(false)
  const [format, setFormat] = useState<'png' | 'jpeg'>('png')
  const imgRef = useRef<HTMLImageElement>(null)

  const handleUpload = useCallback((f: File) => {
    if (preview) URL.revokeObjectURL(preview)
    if (result) URL.revokeObjectURL(result)
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult('')
  }, [preview, result])

  const onImgLoad = () => {
    const img = imgRef.current
    if (!img) return
    setOrigSize({ w: img.naturalWidth, h: img.naturalHeight })
    setNewSize({ w: img.naturalWidth * scale, h: img.naturalHeight * scale })
  }

  const updateScale = (s: Scale) => {
    setScale(s)
    if (origSize.w) setNewSize({ w: origSize.w * s, h: origSize.h * s })
    setResult('')
  }

  const upscale = async () => {
    if (!file || !origSize.w) return
    setProcessing(true)

    const img = new Image()
    img.src = preview
    await new Promise(r => { img.onload = r })

    const w = origSize.w * scale
    const h = origSize.h * scale

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!

    if (mode === 'pixel') {
      ctx.imageSmoothingEnabled = false
    } else {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }

    ctx.drawImage(img, 0, 0, w, h)

    if (mode === 'sharp') {
      const imageData = ctx.getImageData(0, 0, w, h)
      const data = imageData.data
      const copy = new Uint8ClampedArray(data)

      const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let sum = 0
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = ((y + ky) * w + (x + kx)) * 4 + c
                sum += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
              }
            }
            data[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, sum))
          }
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob(b => resolve(b!), format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.92)
    )
    setResult(URL.createObjectURL(blob))
    setProcessing(false)
  }

  const btn = "px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  const guideSteps = t.raw('guide.steps') as string[]

  return (
    <ToolLayout
      title={t('metadata.title')}
      description={t('metadata.description')}
      category={t('metadata.category')}
      slug="image-upscaler"
      faqs={t.raw('faqs') as FAQ[]}
      relatedTools={t.raw('relatedTools') as RelatedTool[]}
      keywords={t.raw('metadata.keywords') as string[]}
      guide={
        <div className="space-y-4 text-sm text-zinc-300">
          <h2 className="text-lg font-semibold text-zinc-100">{t('guide.title')}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {guideSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      }
    >
      {!file ? (
        <div
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleUpload(f) }}
          onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById('img-up')?.click()}
          className="border-2 border-dashed border-zinc-600 rounded-xl p-16 text-center cursor-pointer hover:border-zinc-500 transition-colors"
        >
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-zinc-300 font-medium">{t('labels.uploadPrompt')}</p>
          <p className="text-zinc-500 text-sm mt-1">{t('labels.uploadFormats')}</p>
          <input id="img-up" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-zinc-400 mr-2">{t('labels.scale')}:</span>
            {scales.map(s => (
              <button key={s} onClick={() => updateScale(s)} className={`${btn} ${scale === s ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>{s}x</button>
            ))}
            <span className="text-sm text-zinc-400 ml-4 mr-2">{t('labels.mode')}:</span>
            {modes.map(m => (
              <button key={m} onClick={() => { setMode(m); setResult('') }} className={`${btn} ${mode === m ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>{modeLabels[m]}</button>
            ))}
            <span className="text-sm text-zinc-400 ml-4 mr-2">{t('labels.format')}:</span>
            {formats.map(f => (
              <button key={f} onClick={() => { setFormat(f); setResult('') }} className={`${btn} ${format === f ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>{f.toUpperCase()}</button>
            ))}
            <button onClick={upscale} disabled={processing} className={`${btn} ml-auto bg-green-600 hover:bg-green-500 text-white disabled:opacity-50`}>
              {processing ? t('labels.processing') : t('labels.upscale')}
            </button>
            <button onClick={() => { setFile(null); setPreview(''); setResult('') }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700`}>{t('labels.newImage')}</button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-2">{t('labels.original')} — {origSize.w}×{origSize.h}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imgRef} src={preview} alt="" onLoad={onImgLoad} className="w-full rounded-lg border border-zinc-700" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-2">{t('labels.upscaled')} — {newSize.w}×{newSize.h}</p>
              {result ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result} alt="" className="w-full rounded-lg border border-zinc-700" />
                  <a href={result} download={`upscaled-${scale}x.${format === 'jpeg' ? 'jpg' : 'png'}`} className="inline-block mt-3 px-5 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-colors">{t('labels.download')}</a>
                </>
              ) : (
                <div className="w-full aspect-video rounded-lg border border-zinc-700 bg-zinc-800/50 flex items-center justify-center text-zinc-500 text-sm">
                  {t('labels.upscalePrompt')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
