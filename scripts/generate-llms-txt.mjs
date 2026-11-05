// Deprecated entry point kept for compatibility.
// The canonical llms.txt + llms-full.txt generator is geo-gen-llmsfull.mjs
// (locale-prefixed URLs, redirected slugs excluded, honest privacy summary).
// Running this file simply delegates to it so both entry points always
// produce identical output.
await import("./geo-gen-llmsfull.mjs");
