'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import ToolLayout, { FAQ, RelatedTool } from '@/components/ToolLayout'

export default function PhotoWatermarkRemover() {
  const t = useTranslations('tools.photo-watermark-remover')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [brushSize, setBrushSize] = useState(25)
  const [isDrawing, setIsDrawing] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [error, setError] = useState('')
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null)
  // sourceRef: current full-resolution working canvas. Each pass reads from it
  // and writes the MI-GAN result back, so removal can be repeated on the result.
  const sourceRef = useRef<HTMLCanvasElement | null>(null)
  // Snapshots of the working canvas taken before each pass (undo support).
  const undoStackRef = useRef<HTMLCanvasElement[]>([])
  const [undoCount, setUndoCount] = useState(0)
  const [passCount, setPassCount] = useState(0)

  type LogLevel = 'info' | 'warn' | 'error'
  interface LogEntry {
    id: number
    time: string
    level: LogLevel
    msg: string
  }

  const addLog = useCallback((level: LogLevel, msg: string) => {
    const entry: LogEntry = {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      level,
      msg,
    }
    setLogs(prev => [...prev, entry])
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info
    fn(`[photo-watermark-remover]`, entry.time, msg)
  }, [])

  const handleImageUpload = useCallback((file: File) => {
    const img = new Image()
    img.onload = () => {
      setImage(img)
      setProcessed(false)
      setResultCanvas(null)
      setPassCount(0)
      setUndoCount(0)
      undoStackRef.current = []

      // Full-resolution working canvas: all removal passes operate on this.
      const sc = document.createElement('canvas')
      sc.width = img.naturalWidth
      sc.height = img.naturalHeight
      sc.getContext('2d')!.drawImage(img, 0, 0)
      sourceRef.current = sc

      const maxW = Math.min(800, window.innerWidth - 48)
      const s = Math.min(maxW / img.width, 600 / img.height, 1)
      const w = Math.round(img.width * s)
      const h = Math.round(img.height * s)
      setCanvasSize({ width: w, height: h })

      requestAnimationFrame(() => {
        const canvas = canvasRef.current
        const maskCanvas = maskCanvasRef.current
        if (!canvas || !maskCanvas) return

        canvas.width = w
        canvas.height = h
        maskCanvas.width = w
        maskCanvas.height = h

        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)

        const maskCtx = maskCanvas.getContext('2d')!
        maskCtx.clearRect(0, 0, w, h)
      })
    }
    img.src = URL.createObjectURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleImageUpload(file)
  }, [handleImageUpload])

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const drawBrush = (x: number, y: number) => {
    const maskCtx = maskCanvasRef.current?.getContext('2d')
    if (!maskCtx) return
    maskCtx.globalCompositeOperation = 'source-over'
    maskCtx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    maskCtx.beginPath()
    maskCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
    maskCtx.fill()
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (processing) return
    setIsDrawing(true)
    const { x, y } = getPos(e)
    drawBrush(x, y)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || processing) return
    const { x, y } = getPos(e)
    drawBrush(x, y)
  }

  const handleMouseUp = () => setIsDrawing(false)

  const clearMask = () => {
    const maskCtx = maskCanvasRef.current?.getContext('2d')
    if (!maskCtx || !canvasSize.width) return
    maskCtx.clearRect(0, 0, canvasSize.width, canvasSize.height)
    // Redraw the current working result (or original on first pass)
    const src = sourceRef.current
    if (src) {
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) ctx.drawImage(src, 0, 0, canvasSize.width, canvasSize.height)
    }
    setProcessed(false)
  }

  const undo = () => {
    const prev = undoStackRef.current.pop()
    if (!prev) return
    sourceRef.current = prev
    setResultCanvas(prev)
    setUndoCount(undoStackRef.current.length)
    setPassCount(p => Math.max(0, p - 1))
    setProcessed(true)
    requestAnimationFrame(() => {
      const canvas = canvasRef.current
      const maskCanvas = maskCanvasRef.current
      if (!canvas || !maskCanvas) return
      const w = canvasSize.width
      const h = canvasSize.height
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(prev, 0, 0, w, h)
      maskCanvas.width = w
      maskCanvas.height = h
      maskCanvas.getContext('2d')!.clearRect(0, 0, w, h)
    })
  }

  const processImage = async () => {
    const canvas = canvasRef.current
    const maskCanvas = maskCanvasRef.current
    const source = sourceRef.current
    if (!canvas || !maskCanvas || !source) return

    setProcessing(true)
    setProgress(0)
    setStatusMsg('')
    setError('')
    setLogs([])

    await new Promise(r => setTimeout(r, 50))

    // Snapshot the current working canvas before this pass (undo support).
    const snap = document.createElement('canvas')
    snap.width = source.width
    snap.height = source.height
    snap.getContext('2d')!.drawImage(source, 0, 0)
    undoStackRef.current.push(snap)
    if (undoStackRef.current.length > 5) undoStackRef.current.shift()
    setUndoCount(undoStackRef.current.length)

    // Read the current full-resolution source (may be a previous pass result).
    let fullData: ImageData
    try {
      fullData = source.getContext('2d')!.getImageData(0, 0, source.width, source.height)
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e)
      addLog('error', `Failed to read full-resolution image: ${reason}`)
      addLog('error', 'Processing stopped')
      console.error('Failed to read full-resolution image:', e)
      setError(t('ai.failed', { error: reason }))
      setProcessing(false)
      setProgress(0)
      return
    }

    const ctx = canvas.getContext('2d')!
    const maskCtx = maskCanvas.getContext('2d')!
    const w = canvasSize.width
    const h = canvasSize.height

    // Redraw current source on the display canvas (clears previous overlay)
    ctx.drawImage(source, 0, 0, w, h)

    // Display-space mask (what the user painted)
    const dispMaskData = maskCtx.getImageData(0, 0, w, h)

    // Coverage stats for diagnostics
    let maskPixels = 0
    for (let i = 0; i < w * h; i++) maskPixels += dispMaskData.data[i * 4 + 3] > 30 ? 1 : 0
    const coverage = ((maskPixels / (w * h)) * 100).toFixed(2)
    const passNo = passCount + 1
    addLog('info', `Removal pass #${passNo}: display ${w}x${h}, source ${fullData.width}x${fullData.height}, masked ${maskPixels} px (${coverage}% of display)`)
    addLog('info', 'Engine: MI-GAN only (no fallback engine)')
    addLog('info', `Resolution mode: full-original inference (mask upscaled ${(fullData.width / w).toFixed(2)}x)`)

    // Upscale the display mask to original resolution
    const fullMaskCanvas = document.createElement('canvas')
    fullMaskCanvas.width = fullData.width
    fullMaskCanvas.height = fullData.height
    const fctx = fullMaskCanvas.getContext('2d')!
    fctx.imageSmoothingEnabled = true
    fctx.imageSmoothingQuality = 'high'
    fctx.drawImage(maskCanvas, 0, 0, fullMaskCanvas.width, fullMaskCanvas.height)
    const fullMaskData = fctx.getImageData(0, 0, fullData.width, fullData.height)

    setProgress(5)

    // Run AI inpainting (MI-GAN) at full resolution — no fallback engine
    let result: ImageData
    const startMs = performance.now()
    try {
      addLog('info', 'Loading MI-GAN engine (dynamic import of @/lib/migan)…')
      const { inpaintWithMigan } = await import('@/lib/migan')
      addLog('info', `MI-GAN module loaded in ${(performance.now() - startMs).toFixed(0)}ms`)

      let modelStageLogged = false
      let inpaintStageLogged = false
      result = await inpaintWithMigan(fullData, fullMaskData, (stage, pct) => {
        if (stage === 'model') {
          if (!modelStageLogged) {
            addLog('info', 'MI-GAN model: loading (downloading from CDN or reading IndexedDB cache)…')
            modelStageLogged = true
          }
          setStatusMsg(t('ai.downloadingModel', { percent: Math.min(99, Math.round(pct * 100)) }))
          setProgress(Math.round(pct * 60))
        } else {
          if (!inpaintStageLogged) {
            addLog('info', `MI-GAN inference started (crop → 512x512 → ONNX runtime)…`)
            inpaintStageLogged = true
          }
          setStatusMsg(t('ai.inpainting'))
          setProgress(60 + Math.round(pct * 30))
        }
      })
      const elapsed = ((performance.now() - startMs) / 1000).toFixed(2)
      addLog('info', `MI-GAN completed successfully in ${elapsed}s (full ${fullData.width}x${fullData.height} source)`)
      addLog('info', 'Engine selected: MI-GAN (AI inpainting)')
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      addLog('error', `MI-GAN failed: ${reason}`)
      addLog('error', 'Processing stopped — no fallback engine available')
      console.error('MI-GAN failed:', err)
      setError(t('ai.failed', { error: reason }))
      setProcessing(false)
      setProgress(0)
      return
    }

    // Write the result back into the working source so further passes stack on it.
    const rCanvas = document.createElement('canvas')
    rCanvas.width = fullData.width
    rCanvas.height = fullData.height
    rCanvas.getContext('2d')!.putImageData(result, 0, 0)
    sourceRef.current = rCanvas
    setResultCanvas(rCanvas)
    setPassCount(p => p + 1)

    // Preview: scale the full-res result down to the display canvas
    ctx.drawImage(rCanvas, 0, 0, w, h)

    setProgress(95)
    await new Promise(r => setTimeout(r, 50))

    // Clear mask overlay
    maskCtx.clearRect(0, 0, w, h)

    setProgress(100)
    setProcessing(false)
    setProcessed(true)
  }

  const downloadResult = () => {
    const full = resultCanvas
    if (!full) return

    const link = document.createElement('a')
    link.download = 'watermark-removed.png'
    full.toBlob(b => {
      if (!b) return
      link.href = URL.createObjectURL(b)
      link.click()
    }, 'image/png')
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '[') setBrushSize(s => Math.max(5, s - 5))
      if (e.key === ']') setBrushSize(s => Math.min(100, s + 5))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <ToolLayout
      title={t('title')}
      description={t('description')}
      category={t('category')}
      slug="photo-watermark-remover"
      faqs={t.raw('faqs') as FAQ[]}
      relatedTools={t.raw('relatedTools') as RelatedTool[]}
      keywords={t.raw('keywords') as string[]}
      guide={
        <>
          <h2>{t('guide.whatIs.title')}</h2>
          {(t.raw('guide.whatIs.body') as string[]).map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}

          <h3>{t('guide.howTo.title')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('guide.howTo.intro') }} />
          <ul>
            {(t.raw('guide.howTo.items') as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t('guide.algorithm.title')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('guide.algorithm.body') }} />

          <h3>{t('guide.tips.title')}</h3>
          <ul>
            {(t.raw('guide.tips.items') as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3>{t('guide.useCases.title')}</h3>
          <ul>
            {(t.raw('guide.useCases.items') as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!image && (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('photo-upload')?.click()}
            className="border-2 border-dashed border-zinc-700 rounded-xl p-16 text-center cursor-pointer hover:border-blue-500 hover:bg-zinc-900/50 transition-all"
          >
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-lg text-zinc-300 mb-2">{t('upload.title')}</p>
            <p className="text-sm text-zinc-500">{t('upload.formats')}</p>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
            />
          </div>
        )}

        {/* Editor */}
        {image && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-zinc-400">{t('labels.brush')}</label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={brushSize}
                  onChange={e => setBrushSize(Number(e.target.value))}
                  className="w-32 accent-blue-500"
                />
                <span className="text-sm text-zinc-300 w-10">{brushSize}{t('suffix')}</span>
              </div>

              <div className="flex gap-2 ml-auto">
                {undoCount > 0 && (
                  <button
                    onClick={undo}
                    disabled={processing}
                    className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 rounded-lg px-4 py-2 text-sm transition-colors"
                  >
                    {t('buttons.undo')}
                  </button>
                )}
                <button
                  onClick={clearMask}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2 text-sm transition-colors"
                >
                  {t('buttons.clearMask')}
                </button>
                <button
                  onClick={() => { setImage(null); setProcessed(false); setResultCanvas(null); sourceRef.current = null; undoStackRef.current = []; setUndoCount(0); setPassCount(0) }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2 text-sm transition-colors"
                >
                  {t('buttons.newImage')}
                </button>
                {processed && (
                  <button
                    onClick={downloadResult}
                    className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors"
                  >
                    {t('buttons.downloadResult')}
                  </button>
                )}
                <button
                  onClick={processImage}
                  disabled={processing}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors"
                >
                  {processing ? t('buttons.processing', { progress }) : t('buttons.removeWatermark')}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {processing && (
              <div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {statusMsg && (
                  <p className="text-xs text-zinc-400 mt-2">{statusMsg}</p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-xl p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Multi-pass hint */}
            {processed && passCount > 0 && (
              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-3 text-sm text-blue-200">
                {t('multiPass.done', { count: passCount })}
              </div>
            )}

            {/* Canvas Area */}
            <div className="flex justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-auto">
              <div className="relative" style={{ width: canvasSize.width, height: canvasSize.height }}>
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 rounded"
                />
                <canvas
                  ref={maskCanvasRef}
                  className="absolute top-0 left-0 rounded"
                  style={{ cursor: processed ? 'default' : `crosshair` }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
            </div>

            {/* Run Log */}
            {logs.length > 0 && (
              <details
                open={logs.some(l => l.level === 'error') && !processing}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
              >
                <summary className="text-sm font-medium text-zinc-300 cursor-pointer select-none">
                  {t('logs.title')} ({logs.length})
                </summary>
                <div className="mt-2 max-h-56 overflow-y-auto font-mono text-xs space-y-1">
                  {logs.map(l => (
                    <div
                      key={l.id}
                      className={l.level === 'error' ? 'text-red-400' : l.level === 'warn' ? 'text-yellow-400' : 'text-zinc-400'}
                    >
                      <span className="text-zinc-600">[{l.time}]</span>{' '}
                      <span className="font-semibold">{l.level.toUpperCase()}</span> {l.msg}
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Instructions */}
            {!processed && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <h3 className="text-sm font-medium text-zinc-300 mb-2">{t('instructions.title')}</h3>
                <ol className="text-sm text-zinc-400 space-y-1 list-decimal list-inside">
                  {(t.raw('instructions.steps') as string[]).map((step, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
