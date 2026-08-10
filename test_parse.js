const fs = require('fs');
const html = fs.readFileSync('bmi.html', 'utf8');

function cleanHtml(str) {
  return str
    .replace(/<!--.*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const faqSectionMatch = html.match(/<h2[^>]*>Frequently Asked Questions<\/h2>\s*<div[^>]*class="space-y-4"[^>]*>([\s\S]*?)<\/div>/i);
console.log('section match', !!faqSectionMatch);
if (faqSectionMatch) {
  const section = faqSectionMatch[1];
  const details = section.match(/<details[^>]*>[\s\S]*?<\/details>/gi) || [];
  console.log('details count', details.length);
  for (const d of details) {
    const qm = d.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
    const am = d.match(/<div[^>]*>([\s\S]*?)<\/div>\s*<\/details>/i);
    console.log('q', !!qm, 'a', !!am);
    if (qm && am) {
      console.log('Q:', cleanHtml(qm[1]).replace(/\