'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

type Mode = 'delogo' | 'blur'
type Engine = 'migan' | 'ffmpeg'

export default function VideoWatermarkRemover() {
  const t = useTranslations('tools.video-watermark-remover')

  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [step, setStep] = useState<'upload' | 'select' | 'processing' | 'done'>('upload')
  const [rect, setRect] = useState<Rect | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawOrigin, setDrawOrigin] = useState<{ x: number; y: number } | null>(null)
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [nativeSize, setNativeSize] = useState({ width: 0, height: 0 })
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [processedUrl, setProcessedUrl] = useState('')
  const [mode, setMode] = useState<Mode>('delogo')
  const [engine, setEngine] = useState<Engine>('ffmpeg')
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const modeDescriptions: Record<Mode, { label: string; desc: string }> = {
    delogo: { label: t('modes.delogo.label'), desc: t('modes.delogo.desc') },
    blur: { label: t('modes.blur.label'), desc: t('modes.blur.desc') },
  }

  // ── Upload ──
  const handleUpload = useCallback((file: File) => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    if (processedUrl) URL.revokeObjectURL(processedUrl)
    const url = URL.createObjectURL(file)
    setVideoFile(file)
    setVideoUrl(url)
    setRect(null)
    setError('')
    setProcessedUrl('')
    setStep('select')
  }, [videoUrl, processedUrl])

  // ── Calculate display size from native video dimensions ──
  const calcDisplaySize = useCallback((nw: number, nh: number) => {
    const maxW = Math.min(1000, window.innerWidth - 80)
    const maxH = Math.min(620, window.innerHeight * 0.6)
    const scale = Math.min(maxW / nw, maxH / nh, 1)
    return { width: Math.round(nw * scale), height: Math.round(nh * scale) }
  }, [])

  // ── When video metadata loads ──
  const onVideoMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const nw = video.videoWidth
    const nh = video.videoHeight
    if (!nw || !nh) return

    setNativeSize({ width: nw, height: nh })
    setDuration(video.duration)
    // Videos up to 30s use the AI inpainting engine, longer ones use FFmpeg
    setEngine(video.duration <= 30 ? 'migan' : 'ffmpeg')
    const ds = calcDisplaySize(nw, nh)
    setDisplaySize(ds)
    video.currentTime = Math.min(0.1, video.duration)
  }, [calcDisplaySize])

  // ── Keep overlay canvas sized ──
  useEffect(() => {
    if (!displaySize.width) return
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.width = displaySize.width
    overlay.height = displaySize.height
  }, [displaySize])

  // ── Timeline scrub ──
  const seekTo = (time: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = time
    setCurrentTime(time)
  }

  // ── Rectangle drawing ──
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const el = overlayRef.current
    if (!el) return { x: 0, y: 0 }
    const bounds = el.getBoundingClientRect()
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX - bounds.left, y: e.touches[0].clientY - bounds.top }
    }
    const me = e as React.MouseEvent
    return { x: me.clientX - bounds.left, y: me.clientY - bounds.top }
  }

  const drawRectOverlay = useCallback((r: Rect) => {
    const ctx = overlayRef.current?.getContext('2d')
    if (!ctx || !displaySize.width) return
    const w = displaySize.width
    const h = displaySize.height
    ctx.clearRect(0, 0, w, h)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.fillRect(0, 0, w, h)
    ctx.clearRect(r.x, r.y, r.w, r.h)

    ctx.strokeStyle = '#C45D3E'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.strokeRect(r.x, r.y, r.w, r.h)
    ctx.setLineDash([])

    ctx.fillStyle = '#C45D3E'
    ctx.font = 'bold 11px sans-serif'
    const label = `${Math.round(r.w)}×${Math.round(r.h)}`
    ctx.fillText(label, r.x + 4, r.y > 18 ? r.y - 6 : r.y + r.h + 14)
  }, [displaySize])

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) e.preventDefault()
    const pos = getPos(e)
    setIsDrawing(true)
    setDrawOrigin(pos)
    setRect(null)
    const ctx = overlayRef.current?.getContext('2d')
    if (ctx && displaySize.width) ctx.clearRect(0, 0, displaySize.width, displaySize.height)
  }

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !drawOrigin) return
    if ('touches' in e) e.preventDefault()
    const pos = getPos(e)
    const x = Math.min(drawOrigin.x, pos.x)
    const y = Math.min(drawOrigin.y, pos.y)
    const w = Math.abs(pos.x - drawOrigin.x)
    const h = Math.abs(pos.y - drawOrigin.y)
    if (w > 4 && h > 4) {
      const newRect = { x, y, w, h }
      setRect(newRect)
      drawRectOverlay(newRect)
    }
  }

  const handlePointerUp = () => {
    setIsDrawing(false)
    setDrawOrigin(null)
  }

  // ── Shared FFmpeg engine loader ──
  const loadFFmpeg = useCallback(async (onProgress: (p: number) => void): Promise<FFmpeg> => {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { toBlobURL } = await import('@ffmpeg/util')

    const ffmpeg = new FFmpeg()
    ffmpeg.on('progress', ({ progress: p }) => onProgress(Math.min(p, 0.999)))
    ffmpeg.on('log', ({ message }) => {
      const m = message.match(/frame=\s*(\d+)/)
      if (m) setStatusMsg(t('status.processingFrame', { frame: m[1] }))
    })

    setStatusMsg(t('status.downloadingEngine'))
    await ffmpeg.load({
      coreURL: await toBlobURL('/ffmpeg/ffmpeg-core.js', 'text/javascript'),
      wasmURL: await toBlobURL('/ffmpeg/ffmpeg-core.wasm', 'application/wasm'),
    })
    return ffmpeg
  }, [t])

  // ── FFmpeg processing (Smart Remove & Blur, for videos > 30s) ──
  const processFFmpeg = async (ffmpegMode: 'delogo' | 'blur'): Promise<Blob> => {
    if (!videoFile || !rect || !displaySize.width) throw new Error('Missing video or selection')

    const { fetchFile } = await import('@ffmpeg/util')

    const ffmpeg = await loadFFmpeg(p => setProgress(Math.min(Math.round(p * 100), 99)))

    setStatusMsg(t('status.readingFile'))
    const ext = videoFile.name.match(/\.[^.]+$/)?.[0] || '.mp4'
    const inputName = `input${ext}`
    await ffmpeg.writeFile(inputName, await fetchFile(videoFile))

    const sx = nativeSize.width / displaySize.width
    const sy = nativeSize.height / displaySize.height
    const pad = 4
    const vx = Math.max(0, Math.round(rect.x * sx) - pad)
    const vy = Math.max(0, Math.round(rect.y * sy) - pad)
    const vw = Math.min(Math.round(rect.w * sx) + pad * 2, nativeSize.width - vx)
    const vh = Math.min(Math.round(rect.h * sy) + pad * 2, nativeSize.height - vy)

    setStatusMsg(t('status.removingWatermark'))
    let filter: string
    if (ffmpegMode === 'delogo') {
      filter = `delogo=x=${vx}:y=${vy}:w=${vw}:h=${vh}`
    } else {
      const bx = Math.max(0, vx - 15)
      const by = Math.max(0, vy - 15)
      const bw = Math.min(vw + 30, nativeSize.width - bx)
      const bh = Math.min(vh + 30, nativeSize.height - by)
      filter = `split[a][b];[b]crop=${bw}:${bh}:${bx}:${by},gblur=sigma=40[blur];[a][blur]overlay=${bx}:${by}`
    }

    await ffmpeg.exec(['-i', inputName, '-vf', filter, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-y', 'output.mp4'])

    return await readOutputBlob(ffmpeg, inputName)
  }

  // ── AI processing (MI-GAN, for videos ≤ 30s) ──
  const processMigan = async (): Promise<Blob> => {
    const video = videoRef.current
    if (!video || !rect || !videoFile) throw new Error('Missing video or selection')

    // Seek to the frame the user is viewing and wait for it to decode
    setStatusMsg(t('status.aiCapturingFrame'))
    const targetTime = Math.max(video.currentTime, 0.01)
    await new Promise<void>(resolve => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked)
        resolve()
      }
      video.addEventListener('seeked', onSeeked)
      video.currentTime = targetTime
      setTimeout(resolve, 2000) // safety timeout
    })
    video.pause()

    // Working canvas — cap the longest side at 1920 (keeps 1080p sources
    // full-res; larger sources downscale so WASM encode stays feasible)
    const nw = nativeSize.width
    const nh = nativeSize.height
    const scale = Math.min(1, 1920 / Math.max(nw, nh))
    const cw = Math.round(nw * scale)
    const ch = Math.round(nh * scale)
    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0, cw, ch)
    const frame = ctx.getImageData(0, 0, cw, ch)

    // Build the mask from the drawn rectangle (scaled to the working canvas),
    // grown by a few px so it covers the watermark's anti-aliased boundary
    // pixels just outside the selection (they would otherwise leave a halo)
    const grow = Math.max(2, Math.round(Math.max(cw, ch) / 300))
    const sx = cw / displaySize.width
    const sy = ch / displaySize.height
    const mx = Math.max(0, Math.round(rect.x * sx) - grow)
    const my = Math.max(0, Math.round(rect.y * sy) - grow)
    const mw = Math.min(Math.round(rect.w * sx) + grow * 2, cw - mx)
    const mh = Math.min(Math.round(rect.h * sy) + grow * 2, ch - my)
    const mask = new ImageData(cw, ch)
    for (let j = my; j < Math.min(my + mh, ch); j++) {
      for (let i = mx; i < Math.min(mx + mw, cw); i++) {
        mask.data[(j * cw + i) * 4 + 3] = 255
      }
    }

    // Run MI-GAN once to produce the inpainted patch (feather scaled to the
    // patch size so edges blend smoothly after compression)
    const { makeMiganPatch } = await import('@/lib/migan')
    setStatusMsg(t('status.aiLoadingModel'))
    const patch = await makeMiganPatch(frame, mask, (stage, pct) => {
      if (stage === 'model') {
        setStatusMsg(t('status.aiLoadingModel'))
        setProgress(Math.round(pct * 35))
      } else {
        setStatusMsg(t('status.aiInpainting'))
        setProgress(35 + Math.round(pct * 10))
      }
    }, { featherRadius: Math.max(6, Math.min(24, Math.round(mw / 20))) })

    // Overlay the static patch across every frame with FFmpeg (audio preserved)
    const { fetchFile } = await import('@ffmpeg/util')
    const ffmpeg = await loadFFmpeg(p => setProgress(50 + Math.round(p * 49)))

    setStatusMsg(t('status.readingFile'))
    const ext = videoFile.name.match(/\.[^.]+$/)?.[0] || '.mp4'
    const inputName = `input${ext}`
    await ffmpeg.writeFile(inputName, await fetchFile(videoFile))
    const patchBuf = new Uint8Array(await patch.blob.arrayBuffer())
    await ffmpeg.writeFile('patch.png', patchBuf)

    const filter = `[1:v]scale=${patch.w}:${patch.h}[p];[0:v][p]overlay=${patch.x}:${patch.y}[out]`
    await ffmpeg.exec([
      '-i', inputName,
      '-i', 'patch.png',
      '-filter_complex', filter,
      '-map', '[out]',
      '-map', '0:a?',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '18',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'copy',
      '-y', 'output.mp4',
    ])

    return await readOutputBlob(ffmpeg, inputName)
  }

  const readOutputBlob = async (ffmpeg: FFmpeg, inputName: string): Promise<Blob> => {
    setStatusMsg(t('status.preparingDownload'))
    const data = await ffmpeg.readFile('output.mp4')
    const raw = data as Uint8Array
    const copy = new ArrayBuffer(raw.byteLength)
    new Uint8Array(copy).set(raw)
    const blob = new Blob([copy], { type: 'video/mp4' })

    if (blob.size < 1000) throw new Error(t('errors.outputEmpty'))

    await ffmpeg.deleteFile(inputName).catch(() => {})
    await ffmpeg.deleteFile('patch.png').catch(() => {})
    await ffmpeg.deleteFile('output.mp4').catch(() => {})

    return blob
  }

  // ── Main process dispatcher ──
  const processVideo = async () => {
    if (!videoFile || !rect || !displaySize.width) return

    setStep('processing')
    setProgress(0)
    setError('')

    try {
      setStatusMsg(t('status.loadingEngine'))
      let blob: Blob | null = null
      if (engine === 'migan') {
        try {
          blob = await processMigan()
        } catch (aiErr) {
          // AI engine unavailable (e.g. ONNX backend limitation) — retry with FFmpeg
          console.error('MI-GAN failed, falling back to FFmpeg:', aiErr)
          setStatusMsg(t('status.aiFallback'))
          blob = await processFFmpeg('delogo')
        }
      } else {
        blob = await processFFmpeg(mode)
      }

      if (blob) {
        setProcessedUrl(URL.createObjectURL(blob))
        setProgress(100)
        setStep('done')
      }
    } catch (err) {
      console.error('Processing error:', err)
      const msg = err instanceof Error ? err.message : String(err)
      setError(t('errors.processingFailed', { message: msg }))
      setStep('select')
    }
  }

  const downloadResult = () => {
    if (!processedUrl) return
    const a = document.createElement('a')
    a.href = processedUrl
    a.download = `clean-${videoFile?.name?.replace(/\.[^.]+$/, '') || 'video'}.mp4`
    a.click()
  }

  const reset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    if (processedUrl) URL.revokeObjectURL(processedUrl)
    setVideoFile(null)
    setVideoUrl('')
    setProcessedUrl('')
    setRect(null)
    setStep('upload')
    setProgress(0)
    setStatusMsg('')
    setError('')
    setDisplaySize({ width: 0, height: 0 })
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
      category={t('category')}
      slug="video-watermark-remover"
      faqs={t.raw('faqs') as FAQ[]}
      relatedTools={t.raw('relatedTools') as RelatedTool[]}
      keywords={t.raw('keywords') as string[]}
      guide={
        <>
          <h2>{t('guide.whatIs.title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('guide.whatIs.body') }} />

          <h3>{t('guide.modes.title')}</h3>
          <ul>
            {(t.raw('guide.modes.items') as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t('guide.howTo.title')}</h3>
          <ol>
            {(t.raw('guide.howTo.items') as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>

          <h3>{t('guide.tips.title')}</h3>
          <ul>
            {(t.raw('guide.tips.items') as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* ── Upload ── */}
        {step === 'upload' && (
          <div
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('video/')) handleUpload(f) }}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('video-upload')?.click()}
            className="border-2 border-dashed border-zinc-700 rounded-xl p-16 text-center cursor-pointer hover:border-blue-500 hover:bg-zinc-900/50 transition-all"
          >
            <div className="text-5xl mb-4">🎬</div>
            <p className="text-lg text-zinc-300 mb-2">{t('upload.title')}</p>
            <p className="text-sm text-zinc-500">{t('upload.formats')}</p>
            <p className="text-xs text-zinc-600 mt-3">
              {t('upload.note')}
            </p>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
            />
          </div>
        )}

        {/* ── Select watermark area ── */}
        {step === 'select' && (
          <>
            {/* Engine + mode selector */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    engine === 'migan'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-600/40'
                      : 'bg-blue-600/20 text-blue-300 border border-blue-600/40'
                  }`}
                >
                  {engine === 'migan' ? t('engine.ai') : t('engine.ffmpeg')}
                </span>
                {engine === 'ffmpeg' && (
                  <>
                    <span className="text-sm text-zinc-400 mr-1">{t('modeLabel')}</span>
                    {(['delogo', 'blur'] as Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          mode === m
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        {modeDescriptions[m].label}
                      </button>
                    ))}
                  </>
                )}
                <div className="flex gap-2 ml-auto">
                  <button onClick={reset} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2 text-sm transition-colors">
                    {t('buttons.newVideo')}
                  </button>
                  <button
                    onClick={processVideo}
                    disabled={!rect}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors"
                  >
                    {t('buttons.removeWatermark')}
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-500">
                {engine === 'migan' ? t('engine.aiNote') : modeDescriptions[mode].desc}
              </p>
            </div>

            {/* Timeline scrubber */}
            {duration > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-12">{formatTime(currentTime)}</span>
                  <input
                    type="range" min={0} max={duration} step={0.1}
                    value={currentTime}
                    onChange={e => seekTo(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs text-zinc-500 w-12">{formatTime(duration)}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  {t('timeline.hint')}
                </p>
              </div>
            )}

            {/* Video + overlay canvas */}
            <div className="flex justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div
                ref={containerRef}
                className="relative"
                style={displaySize.width ? { width: displaySize.width, height: displaySize.height } : undefined}
              >
                <video
                  ref={videoRef}
                  src={videoUrl}
                  muted
                  playsInline
                  preload="auto"
                  onLoadedMetadata={onVideoMetadata}
                  style={{ width: displaySize.width || '100%', height: displaySize.height || 'auto' }}
                  className="rounded block"
                />
                {displaySize.width > 0 && (
                  <canvas
                    ref={overlayRef}
                    className="absolute top-0 left-0 rounded"
                    style={{ width: displaySize.width, height: displaySize.height, cursor: 'crosshair', touchAction: 'none' }}
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                  />
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-medium text-zinc-300 mb-2">{t('instructions.title')}</h3>
              <ol className="text-sm text-zinc-400 space-y-1 list-decimal list-inside">
                {(t.raw('instructions.steps') as string[]).map((step, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
                ))}
              </ol>
            </div>
          </>
        )}

        {/* ── Processing ── */}
        {step === 'processing' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="text-5xl mb-6">⚙️</div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">{t('processing.title')}</h2>
            <p className="text-sm text-zinc-400 mb-6">{statusMsg}</p>
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between text-sm text-zinc-400 mb-1">
                <span>{progress > 0 ? t('processing.phaseEncoding') : t('processing.phaseLoading')}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300 bg-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              {t('processing.keepOpen')}
            </p>
          </div>
        )}

        {/* ── Done ── */}
        {step === 'done' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">{t('done.title')}</h2>
              <p className="text-sm text-zinc-400 mb-6">{t('done.previewNote')}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={downloadResult} className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-8 py-3 text-sm font-medium transition-colors">
                  {t('buttons.downloadVideo')}
                </button>
                <button onClick={() => { setStep('select'); setProcessedUrl(''); setError(''); }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-6 py-3 text-sm transition-colors">
                  {t('buttons.adjustRetry')}
                </button>
                <button onClick={reset} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-6 py-3 text-sm transition-colors">
                  {t('buttons.newVideo')}
                </button>
              </div>
            </div>
            {processedUrl && (
              <div className="flex justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <video src={processedUrl} controls className="rounded max-w-full" style={{ maxHeight: 500 }} />
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
