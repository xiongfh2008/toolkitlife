'use client'

import { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

type Quality = 'low' | 'medium' | 'high' | 'custom'
type Resolution = 'original' | '1080' | '720' | '480'

export default function VideoCompressor() {
  const t = useTranslations('tools.video-compressor')

  const faqs = t.raw('faqs') as FAQ[]
  const relatedTools = t.raw('relatedTools') as RelatedTool[]
  const keywords = t.raw('keywords') as string[]
  const guideSteps = t.raw('guide.steps') as string[]

  const [file, setFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [quality, setQuality] = useState<Quality>('medium')
  const [customCrf, setCustomCrf] = useState(28)
  const [resolution, setResolution] = useState<Resolution>('original')
  const [step, setStep] = useState<'upload' | 'settings' | 'processing' | 'done'>('upload')
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [resultSize, setResultSize] = useState(0)
  const [videoInfo, setVideoInfo] = useState({ duration: 0, width: 0, height: 0 })
  const [error, setError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  const crfMap: Record<Quality, number> = { high: 22, medium: 28, low: 35, custom: customCrf }

  const handleUpload = useCallback((f: File) => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    const url = URL.createObjectURL(f)
    setFile(f)
    setVideoUrl(url)
    setStep('settings')
    setError('')
    setResultUrl('')
    setResultSize(0)
  }, [videoUrl, resultUrl])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('video/')) handleUpload(f)
  }, [handleUpload])

  const onVideoMeta = () => {
    const v = videoRef.current
    if (v) setVideoInfo({ duration: v.duration, width: v.videoWidth, height: v.videoHeight })
  }

  const compress = async () => {
    if (!file) return
    setStep('processing')
    setProgress(0)
    setError('')

    try {
      setStatusMsg(t('processing.statusLoading'))
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { fetchFile, toBlobURL } = await import('@ffmpeg/util')

      const ffmpeg = new FFmpeg()
      ffmpeg.on('progress', ({ progress: p }) => {
        setProgress(Math.min(95, Math.round(p * 95)))
      })

      await ffmpeg.load({
        coreURL: await toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js', 'text/javascript'),
        wasmURL: await toBlobURL('https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm', 'application/wasm'),
      })

      setStatusMsg(t('processing.statusCompressing'))
      await ffmpeg.writeFile('input', await fetchFile(file))

      const crf = crfMap[quality]
      const args = ['-i', 'input', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', String(crf)]

      if (resolution !== 'original') {
        const h = parseInt(resolution)
        args.push('-vf', `scale=-2:${h}`)
      }

      args.push('-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-y', 'output.mp4')
      await ffmpeg.exec(args)

      setProgress(98)
      setStatusMsg(t('processing.statusFinishing'))
      const data = await ffmpeg.readFile('output.mp4')
      const raw = data as Uint8Array
      const buf = new ArrayBuffer(raw.byteLength)
      new Uint8Array(buf).set(raw)
      const blob = new Blob([buf], { type: 'video/mp4' })

      await ffmpeg.deleteFile('input').catch(() => {})
      await ffmpeg.deleteFile('output.mp4').catch(() => {})

      setResultSize(blob.size)
      setResultUrl(URL.createObjectURL(blob))
      setProgress(100)
      setStep('done')
    } catch (err) {
      console.error(err)
      setError(t('errors.prefix') + (err instanceof Error ? err.message : String(err)))
      setStep('settings')
    }
  }

  const fmtSize = (b: number) => b < 1024 * 1024 ? t('units.kb', { size: (b / 1024).toFixed(1) }) : t('units.mb', { size: (b / (1024 * 1024)).toFixed(1) })
  const fmtDur = (s: number) => { const m = Math.floor(s / 60); return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}` }
  const reduction = file && resultSize ? Math.round((1 - resultSize / file.size) * 100) : 0

  const btn = "px-4 py-2 rounded-lg text-sm font-medium transition-colors"

  return (
    <ToolLayout title={t('title')} description={t('description')} category={t('category')} slug="video-compressor" faqs={faqs} relatedTools={relatedTools} keywords={keywords} guide={
      <div className="space-y-4 text-sm text-zinc-300">
        <h2 className="text-lg font-semibold text-zinc-100">{t('guide.heading')}</h2>
        <ol className="list-decimal list-inside space-y-2">
          {guideSteps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </div>
    }>
      {step === 'upload' && (
        <div onDrop={onDrop} onDragOver={e => e.preventDefault()} onClick={() => document.getElementById('vid-input')?.click()} className="border-2 border-dashed border-zinc-600 rounded-xl p-16 text-center cursor-pointer hover:border-zinc-500 transition-colors">
          <div className="text-4xl mb-4">{t('upload.icon')}</div>
          <p className="text-zinc-300 font-medium">{t('upload.title')}</p>
          <p className="text-zinc-500 text-sm mt-1">{t('upload.subtitle')}</p>
          <input id="vid-input" type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </div>
      )}

      {step === 'settings' && file && (
        <div className="space-y-6">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
            <video ref={videoRef} src={videoUrl} onLoadedMetadata={onVideoMeta} className="w-full max-h-64 rounded-lg mb-3" controls />
            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              <span>{t('videoInfo.size')}: <strong className="text-zinc-200">{fmtSize(file.size)}</strong></span>
              {videoInfo.duration > 0 && <span>{t('videoInfo.duration')}: <strong className="text-zinc-200">{fmtDur(videoInfo.duration)}</strong></span>}
              {videoInfo.width > 0 && <span>{t('videoInfo.resolution')}: <strong className="text-zinc-200">{videoInfo.width}×{videoInfo.height}</strong></span>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">{t('quality.label')}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['high', 'medium', 'low', 'custom'] as Quality[]).map(q => (
                  <button key={q} onClick={() => setQuality(q)} className={`${btn} ${quality === q ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                    {t(`quality.options.${q}`)}
                  </button>
                ))}
              </div>
              {quality === 'custom' && (
                <div className="mt-3">
                  <label className="text-xs text-zinc-400">{t('quality.customLabel', { crf: customCrf })}</label>
                  <input type="range" min={18} max={45} value={customCrf} onChange={e => setCustomCrf(Number(e.target.value))} className="w-full mt-1" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">{t('resolution.label')}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['original', '1080', '720', '480'] as Resolution[]).map(r => (
                  <button key={r} onClick={() => setResolution(r)} className={`${btn} ${resolution === r ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>{t(`resolution.options.${r}`)}</button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">{error}</div>}

          <div className="flex gap-3">
            <button onClick={compress} className="px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors">{t('buttons.compress')}</button>
            <button onClick={() => { setStep('upload'); setFile(null) }} className="px-4 py-3 rounded-lg font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">{t('buttons.newVideo')}</button>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚙️</div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-2">{t('processing.title')}</h3>
          <p className="text-zinc-400 mb-6">{statusMsg}</p>
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-zinc-400 mb-1"><span>{t('processing.label')}</span><span>{progress}%</span></div>
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
          </div>
          <p className="text-zinc-500 text-sm mt-4">{t('processing.keepOpen')}</p>
        </div>
      )}

      {step === 'done' && file && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">{t('done.title')}</h3>
          <div className="flex justify-center gap-8 mb-6">
            <div><p className="text-zinc-500 text-xs">{t('done.original')}</p><p className="text-lg font-mono text-zinc-300">{fmtSize(file.size)}</p></div>
            <div className="text-2xl text-zinc-600">→</div>
            <div><p className="text-zinc-500 text-xs">{t('done.compressed')}</p><p className="text-lg font-mono text-green-400">{fmtSize(resultSize)}</p></div>
            <div><p className="text-zinc-500 text-xs">{t('done.reduction')}</p><p className="text-lg font-mono text-blue-400">{reduction}%</p></div>
          </div>
          <video src={resultUrl} className="max-w-lg mx-auto rounded-lg mb-6" controls />
          <div className="flex justify-center gap-3">
            <a href={resultUrl} download={`compressed-${file.name}`} className="px-6 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-500 text-white transition-colors inline-block">{t('buttons.download')}</a>
            <button onClick={() => { setStep('settings'); setResultUrl('') }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 py-3`}>{t('buttons.adjust')}</button>
            <button onClick={() => { setStep('upload'); setFile(null); setResultUrl('') }} className={`${btn} bg-zinc-800 text-zinc-300 hover:bg-zinc-700 py-3`}>{t('buttons.newVideo')}</button>
          </div>
        </div>
      )}
    </ToolLayout>
  )
}
