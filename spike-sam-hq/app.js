/**
 * spike-sam-hq / app.js —— 界面与测量逻辑
 * 流程：上传图 → 加载模型 → 编码（记录耗时/内存）→ 点选（记录每次 decoder 耗时）
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const logEl = $("log");
  const statsEl = $("stats");
  const stageEl = $("stage");
  const imgCanvas = $("imgCanvas");
  const overlay = $("overlay");
  const ictx = imgCanvas.getContext("2d");
  const octx = overlay.getContext("2d");

  const state = {
    img: null, // HTMLImageElement
    W: 0, H: 0, // canvas 尺寸（= 图片按最长边 1024 缩放后的显示尺寸）
    enc: null, // 编码结果 {embedding, ort, ms}
    points: [], // {x, y, label}
    ep: "wasm",
    busy: false,
    decodeRuns: [],
  };

  // ── 日志 ──
  function log(msg) {
    const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logEl.textContent = (logEl.textContent + "\n" + line).trim();
    logEl.scrollTop = logEl.scrollHeight;
  }
  function setStatus(text, kind) {
    const el = $("status");
    el.textContent = text;
    el.className = kind ? " " + kind : "";
  }
  const fmt = (n) => (n ?? "-").toLocaleString();

  // ── 统计面板 ──
  function renderStats() {
    const last = state.decodeRuns[state.decodeRuns.length - 1];
    const avgDecode = state.decodeRuns.length
      ? Math.round(state.decodeRuns.reduce((s, r) => s + r.ms1 + r.ms2, 0) / state.decodeRuns.length)
      : null;
    const minDecode = state.decodeRuns.length
      ? Math.min(...state.decodeRuns.map((r) => r.ms1 + r.ms2))
      : null;
    const mem = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null;
    const rows = [
      ["编码耗时 (encoder)", state.enc ? state.enc.ms + " ms" : "—"],
      ["末次解码 (decoder)", last ? `${last.ms1}ms${last.ms2 ? " + " + last.ms2 + "ms(refine)" : ""}` : "—"],
      ["解码平均 / 最小", state.decodeRuns.length ? `${avgDecode} / ${minDecode} ms` : "—"],
      ["累计交互次数", state.decodeRuns.length + " 次"],
      ["JS 堆内存", mem ? mem + " MB" : "（仅 Chromium 可见）"],
      ["多线程可用", crossOriginIsolated ? "是" : "否（降为单线程）"],
      ["点选数", state.points.length + "（前景 " + state.points.filter((p) => p.label === 1).length + "）"],
    ];
    statsEl.innerHTML = rows
      .map(([k, v]) => `<div><span class="muted">${k}</span><b>${v}</b></div>`)
      .join("");
  }

  // ── 图像加载 ──
  function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight));
        state.W = Math.max(1, Math.round(img.naturalWidth * scale));
        state.H = Math.max(1, Math.round(img.naturalHeight * scale));
        imgCanvas.width = overlay.width = state.W;
        imgCanvas.height = overlay.height = state.H;
        ictx.drawImage(img, 0, 0, state.W, state.H);
        clearPointsAndMask();
        state.enc = null;
        $("encode").disabled = false;
        stageEl.style.display = "block";
        log(`已载入图像 ${file.name} → ${state.W}×${state.H}（最长边≤1024）`);
        renderStats();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function clearPointsAndMask() {
    state.points = [];
    octx.clearRect(0, 0, overlay.width, overlay.height);
  }

  // ── 模型加载 ──
  $("loadModels").onclick = async () => {
    if (state.busy) return;
    state.busy = true;
    setStatus("下载/构建模型中…（首次约 117MB）");
    try {
      const ep = $("ep").value;
      const t0 = performance.now();
      // ensureSessions 内会打印每段 session 构建耗时
      await SamSpike.ensureSessions(ep, (kind, done, total, label) => {
        if (total > 0) {
          const pct = Math.min(100, Math.round((done / total) * 100));
          setStatus(`下载中 ${kind} ${pct}%（${(done / 1048576).toFixed(1)}/${(total / 1048576).toFixed(1)}MB）`);
          log(`${kind}: ${label} ${pct}%`);
        }
      });
      const totalMs = Math.round(performance.now() - t0);
      state.ep = ep;
      setStatus("模型就绪 ✔", "ok");
      log(`模型加载完成，共 ${totalMs}ms（含下载，缓存命中时极快）`);
      renderStats();
    } catch (e) {
      console.error(e);
      setStatus("加载失败", "err");
      log("✗ " + (e && e.message ? e.message : e));
    } finally {
      state.busy = false;
    }
  };

  // ── 编码（一次性） ──
  $("encode").onclick = async () => {
    if (!state.img && !imgCanvas.width) {
      log("请先上传图片");
      return;
    }
    state.busy = true;
    setStatus("编码中…（首次最慢，之后点选仅走 decoder）");
    try {
      const ep = $("ep").value;
      const res = await SamSpike.encodeImage(imgCanvas, ep);
      state.enc = res;
      state.decodeRuns = [];
      clearPointsAndMask();
      log(`✔ encoder 推理 ${res.ms}ms，embedding ${res.embedding.dims.join("×")}`);
      setStatus("编码完成，可在图上点选 ✔", "ok");
      renderStats();
    } catch (e) {
      console.error(e);
      setStatus("编码失败", "err");
      log("✗ 编码失败：" + (e && e.message ? e.message : e));
    } finally {
      state.busy = false;
    }
  };

  $("clear").onclick = () => {
    clearPointsAndMask();
    log("已清空点选与 mask");
  };

  // ── 画布交互（点选 → 解码） ──
  overlay.addEventListener("click", async (e) => {
    if (state.busy) return;
    if (!state.enc) {
      setStatus("请先编码图像", "err");
      log("先点「编码图像」，再在图上点选");
      return;
    }
    state.busy = true;
    try {
      const rect = overlay.getBoundingClientRect();
      const x = Math.min(state.W - 1, Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * state.W)));
      const y = Math.min(state.H - 1, Math.max(0, Math.round(((e.clientY - rect.top) / rect.height) * state.H)));
      const label = e.shiftKey ? 0 : 1;
      state.points.push({ x, y, label });
      drawPoints();
      setStatus("decoder 运行中…");

      const refine = $("refine").checked;
      const res = await SamSpike.decodeMask(
        state.enc.embedding,
        state.points,
        state.W,
        state.H,
        refine
      );
      state.decodeRuns.push(res);
      drawMask(res);
      log(
        `解码 #${state.decodeRuns.length}：${res.ms1}ms` +
          (res.ms2 ? ` + ${res.ms2}ms(refine)` : "") +
          ` ｜ iou=${res.iou.toFixed(3)} ｜ 点(${state.points.map((p) => (p.label ? "+" : "-")).join("")})`
      );
      setStatus("就绪 ✔", "ok");
    } catch (e) {
      console.error(e);
      setStatus("解码失败", "err");
      log("✗ 解码失败：" + (e && e.message ? e.message : e));
    } finally {
      state.busy = false;
      renderStats();
    }
  });

  // 重绘提示点（前/背景）
  function drawPoints() {
    // 保留已有 mask 底图，在其上重画点
    for (const p of state.points) {
      octx.beginPath();
      octx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      octx.fillStyle = p.label ? "#22c55e" : "#ef4444";
      octx.fill();
      octx.lineWidth = 2;
      octx.strokeStyle = "#fff";
      octx.stroke();
    }
  }

  // 把概率 mask 画成半透明覆盖层
  function drawMask(res) {
    octx.clearRect(0, 0, overlay.width, overlay.height);
    // 输出可能是 logits（含负值），统一过一遍 sigmoid 变成 0~1 概率
    const raw = res.mask;
    let needsSigmoid = false;
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] < 0) { needsSigmoid = true; break; }
    }
    const toAlpha = (v) => {
      const p = needsSigmoid ? 1 / (1 + Math.exp(-v)) : v;
      const th = Number($("thresh").value) / 100;
      // 阈值以下透明，边缘 0.4~0.6 半透明过渡便于观察
      return p < th - 0.1 ? 0 : Math.min(0.55, Math.max(0, ((p - (th - 0.1)) / 0.2) * 0.55));
    };

    if (res.mW !== state.W || res.mH !== state.H) {
      // 模型输出分辨率与 canvas 不同：先生成同尺寸着色图，再最近邻缩放
      const src = document.createElement("canvas");
      src.width = res.mW;
      src.height = res.mH;
      const sctx = src.getContext("2d");
      const simg = sctx.createImageData(res.mW, res.mH);
      for (let i = 0; i < res.mW * res.mH; i++) {
        simg.data[i * 4] = 255; simg.data[i * 4 + 1] = 0; simg.data[i * 4 + 2] = 255;
        simg.data[i * 4 + 3] = Math.round(toAlpha(raw[i]) * 255);
      }
      sctx.putImageData(simg, 0, 0);
      octx.imageSmoothingEnabled = false;
      octx.drawImage(src, 0, 0, state.W, state.H);
    } else {
      const img = octx.createImageData(state.W, state.H);
      const sp = img.data;
      for (let i = 0; i < state.W * state.H; i++) {
        sp[i * 4] = 255; sp[i * 4 + 1] = 0; sp[i * 4 + 2] = 255;
        sp[i * 4 + 3] = Math.round(toAlpha(raw[i]) * 255);
      }
      octx.putImageData(img, 0, 0);
    }
    drawPoints();
  }

  // 阈值滑条联动
  $("thresh").oninput = () => {
    $("threshVal").textContent = (Number($("thresh").value) / 100).toFixed(2);
    if (state.decodeRuns.length) drawMask(state.decodeRuns[state.decodeRuns.length - 1]);
  };

  $("file").onchange = (e) => e.target.files[0] && loadImageFile(e.target.files[0]);

  log("就绪：上传图片 → 加载模型 → 编码 → 单击点选（Shift=背景点）");
  renderStats();
})();
