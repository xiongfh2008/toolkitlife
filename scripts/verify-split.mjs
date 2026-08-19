/**
 * Verify the home-data split: tool chunk must NOT contain homepage-only data
 * (search aliases / scene slug lists), home chunk must contain them.
 * Usage: node scripts/verify-split.mjs
 */
import fs from "fs";

const tool = fs.readFileSync(".next/static/chunks/1b1fdd93e14f34f1.js", "utf8");
const home = fs.readFileSync(".next/static/chunks/91b0fa23f60d35bc.js", "utf8");

console.log("tool chunk (19KB) has alias '体重指数':", tool.includes("体重指数"));
console.log("tool chunk (19KB) has scene list slug '401k-calculator':", tool.includes("401k-calculator"));
console.log("tool chunk (19KB) has SCENE_OF_SLUG entry '1rm-calculator':", tool.includes("1rm-calculator"));
console.log("home chunk (29KB) has alias '体重指数':", home.includes("体重指数"));
console.log("home chunk (29KB) has scene key 'calculator':", home.includes("calculator"));
