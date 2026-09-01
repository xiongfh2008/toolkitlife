// Provenance marker signatures. Split from detect.js so the rules are
// reviewable without wading through scoring logic.
// Titles are brand proper nouns (no translation needed); the UI translates
// the hit/miss descriptions via next-intl using `marker.{id}` keys.

export const MARKERS = [
    {
        id: 'c2pa',
        title: 'C2PA / Content Credentials',
        keywords: ['C2PA', 'JUMBF', 'caBX', 'c2pa.manifest', 'contentcredentials',
                   'urn:uuid:', 'jumbf', 'activeManifest', 'claim.v2', 'c2pa_rs', 'c2pa.hash'],
    },
    {
        id: 'openai',
        title: 'OpenAI / DALL·E / GPT',
        keywords: ['OpenAI', 'openai', 'DALL-E', 'dall-e', 'DALLE', 'dalle',
                   'gpt-image', 'GPT-image', 'chatgpt', 'ChatGPT', 'openai.com'],
    },
    {
        id: 'google',
        title: 'Google / SynthID / Gemini',
        keywords: ['Google', 'SynthID', 'Gemini', 'Imagen', 'Nano Banana',
                   'nanobanana', 'DeepMind', 'google.com', 'gemini'],
    },
    {
        id: 'midjourney',
        title: 'Midjourney',
        keywords: ['Midjourney', 'midjourney', 'MIDJOURNEY', 'mj-api', 'midj'],
    },
    {
        id: 'sd',
        title: 'Stable Diffusion / ComfyUI / Flux',
        keywords: ['StableDiffusion', 'stable-diffusion', 'ComfyUI', 'comfyui',
                   'Flux', 'FLUX', 'Automatic1111', 'A1111', 'InvokeAI', 'Fooocus',
                   'stable_diffusion', 'diffusion_model'],
    },
    {
        id: 'adobe',
        title: 'Adobe Firefly (AI)',
        // Only match Firefly-specific markers. Bare "Adobe"/"Photoshop" strings
        // appear in normal edits and even ICC profiles — not AI evidence.
        keywords: ['Firefly', 'adobe_firefly', 'AdobeFirefly', 'adobefirefly'],
    },
    {
        id: 'photoshop',
        title: 'Photoshop / Editing Tools',
        category: 'edit',  // 'edit' category does not count as AI evidence
        // Metadata written by Photoshop itself. Avoid bare "Adobe" (it's in ICC).
        keywords: ['Adobe Photoshop', 'photoshop:', 'Photoshop CC', 'Photoshop CS',
                   'Adobe ImageReady', 'Lightroom Classic', 'Adobe Lightroom'],
        hitThreshold: 1,
    },
    {
        id: 'pngtext',
        title: 'PNG Text Chunks / Generation Parameters',
        keywords: ['tEXt', 'iTXt', 'zTXt', 'parameters', 'prompt', 'negative_prompt',
                   'Steps:', 'Sampler:', 'CFG scale', 'Seed:', 'workflow'],
        hitThreshold: 2,
    },
];
