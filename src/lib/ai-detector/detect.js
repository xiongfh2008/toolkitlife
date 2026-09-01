// Provenance detection: JUMBF + structured metadata + byte-level keyword search.
// Returns a list of detection cards plus a merged metadata snapshot.
// Cards carry a `code` that the UI translates via next-intl (5 locales).

import { bytesToString } from './utils.js';
import { parseMetadata, sniffJumbf, getGenerationHints } from './metadata.js';
import { detectWatermarkFFT } from './watermark-detect.js';
import { MARKERS } from './markers.js';
import { verifyC2pa, isAiSourceType } from './c2pa-verify.js';

function findWithContext(str, keywords) {
    const results = [];
    const seen = new Set();
    for (const kw of keywords) {
        const lk = kw.toLowerCase();
        if (seen.has(lk)) continue;
        const idx = str.indexOf(kw);
        if (idx !== -1) {
            seen.add(lk);
            const start = Math.max(0, idx - 30);
            const end = Math.min(str.length, idx + kw.length + 30);
            const context = str.substring(start, end).replace(/[\x00-\x08\x0e-\x1f]/g, '.');
            results.push({ keyword: kw, context });
        }
    }
    return results;
}

function detailOf(found) {
    return found.map(f => `[${f.keyword}] …${f.context}…`).join('\n');
}

function card(code, title, hit, badgeText, desc, detail, confidence, badgeClass) {
    return {
        code, title, hit,
        badgeText,
        badgeClass: badgeClass || (hit ? 'badge-hit' : 'badge-clean'),
        desc,
        detail: detail || null,
        confidence: confidence || null,
        category: 'ai',
        aiEvidence: true,
    };
}

export async function runAllDetections(uint8, { mime = 'image/jpeg' } = {}) {
    const str = bytesToString(uint8);
    const jumbf = sniffJumbf(uint8);
    const [meta, c2pa] = await Promise.all([
        parseMetadata(uint8),
        jumbf.present ? verifyC2pa(uint8, mime) : Promise.resolve({ status: 'absent', present: false }),
    ]);
    const detections = [];

    // --- 1. C2PA (structured: JUMBF box + DigitalSourceType) ---
    {
        const m = MARKERS.find(x => x.id === 'c2pa');
        const found = findWithContext(str, m.keywords);
        const sourceType = c2pa.digitalSourceType || jumbf.digitalSourceType;
        const verifiedAi = c2pa.verified && isAiSourceType(sourceType);
        const hit = c2pa.present || jumbf.present || found.length > 0;
        let code, confidence, badgeClass;
        if (verifiedAi) {
            code = 'c2pa.aiVerified';
            confidence = 'strong';
            badgeClass = 'badge-hit';
        } else if (c2pa.invalid) {
            code = 'c2pa.invalid';
            confidence = 'info';
            badgeClass = 'badge-hit';
        } else if (c2pa.verified) {
            code = 'c2pa.verified';
            confidence = 'info';
            badgeClass = 'badge-clean';
        } else if (jumbf.present) {
            code = 'c2pa.structure';
            confidence = 'weak';
            badgeClass = 'badge-uncertain';
        } else if (found.length > 0) {
            code = 'c2pa.bytes';
            confidence = 'weak';
            badgeClass = 'badge-uncertain';
        } else {
            code = 'c2pa.notfound';
            badgeClass = 'badge-clean';
        }
        const details = [];
        if (jumbf.present) details.push(`JUMBF boxes: ${jumbf.indices.length}  |  labels: ${jumbf.labels.join(', ') || '-'}`);
        if (c2pa.present) {
            details.push([
                `Validation state: ${c2pa.state || c2pa.status}`,
                `DigitalSourceType: ${sourceType || '-'}`,
                `Claim generator: ${c2pa.claimGenerator || '-'}`,
                `Active manifest: ${c2pa.activeLabel || '-'}`,
                `Success: ${(c2pa.success || []).map(s => s.code).join(', ') || '-'}`,
                `Failures: ${(c2pa.failure || []).map(s => s.code).join(', ') || '-'}`,
            ].join('\n'));
        }
        if (found.length) details.push(detailOf(found));
        detections.push({
            ...card(code, m.title, hit, '', '', details.join('\n\n') || null, confidence, badgeClass),
            category: 'provenance',
            aiEvidence: verifiedAi,
        });
    }

    // --- 2. Structured metadata (EXIF/XMP/IPTC/ICC via exifr) ---
    {
        const hints = getGenerationHints(meta);
        const aiStrings = /Gemini|Imagen|SynthID|Midjourney|Stable\s*Diffusion|ComfyUI|DALL|OpenAI|Firefly|Adobe Firefly|trainedAlgorithmicMedia/i;
        const hit = hints.some(h => aiStrings.test(String(h.value)));
        const hasAny = hints.length > 0;
        const metaLine = hints.map(h => `${h.label}: ${h.value}`).join('\n');
        detections.push(card(
            hit ? 'metadata.hit' : hasAny ? 'metadata.present' : 'metadata.empty',
            'EXIF / XMP / IPTC',
            hit,
            '',
            '',
            metaLine || null,
            hit ? 'strong' : null,
        ));
    }

    // --- 3-7. Keyword-based per-vendor markers ---
    for (const m of MARKERS) {
        if (m.id === 'c2pa') continue; // handled above
        const found = findWithContext(str, m.keywords);
        const threshold = m.hitThreshold || 1;
        const hit = found.length >= threshold;
        const isEdit = m.category === 'edit';
        detections.push({
            ...card(
                `marker.${m.id}`,
                m.title, hit,
                '', '',
                found.length ? detailOf(found) : null,
                hit ? (isEdit ? 'info' : 'medium') : null,
            ),
            category: m.category || 'ai',
        });
    }

    // --- 8. Byte-level invisible watermark heuristic ---
    {
        const wm = detectWatermarkFFT(uint8);
        detections.push(card(
            wm.suspicious ? 'watermark.suspicious' : 'watermark.clean',
            'Byte-level watermark',
            wm.suspicious,
            '',
            '',
            `Anomaly score: ${wm.score}%\nHigh-freq ratio: ${wm.highFreqRatio.toFixed(4)}\nMid-freq peaks: ${wm.midFreqPeaks}\nLSB bias: ${wm.lsbBias.toFixed(4)}`,
            wm.suspicious ? 'weak' : null,
        ));
    }

    return {
        detections,
        meta,
        jumbf: {
            ...jumbf,
            digitalSourceType: c2pa.digitalSourceType || jumbf.digitalSourceType,
            verification: c2pa,
        },
    };
}
