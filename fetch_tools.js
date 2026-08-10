const https = require('https');
const fs = require('fs');

const slugs = [
  'bmi-calculator',
  'calorie-calculator',
  'tdee-calculator',
  'body-fat-calculator',
  'macro-calculator',
  'pregnancy-calculator',
  'bmr-calculator',
  'waist-to-hip-ratio-calculator',
  'water-intake-calculator',
  'calorie-deficit-calculator',
  'protein-calculator',
  'ideal-weight-calculator',
  'sleep-calculator',
  'heart-rate-zone-calculator',
  '1rm-calculator',
  'keto-calculator',
  'ovulation-calculator',
  'weight-loss-calculator',
  'period-calculator',
  'blood-alcohol-calculator',
  'walking-calorie-calculator',
  'calorie-burn-calculator',
  'pace-calculator',
];

function getUrl(slug) {
  if (slug === 'pregnancy-calculator') return '/tools/pregnancy-due-date-calculator';
  return `/tools/${slug}`;
}
function getAltUrl(slug) {
  return `/tools/${slug}-calculator`;
}

function fetchPath(path) {
  return new Promise((resolve, reject) => {
    const url = `https://toolpile.app${path}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function cleanHtml(str) {
  return str
    .replace(/<!--.*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePage(html, slug, finalUrl) {
  // description from meta
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // top intro paragraph
  const introMatch = html.match(/<h1[^>]*>.*?<\/h1>\s*<p[^>]*class="[^"]*text-zinc-400[^"]*"[^>]*>(.*?)<\/p>/is);
  const topIntro = introMatch ? cleanHtml(introMatch[1]) : '';

  // FAQ section
  const faqSectionMatch = html.match(/<h2[^>]*>Frequently Asked Questions<\/h2>\s*<div[^>]*class="space-y-4"[^>]*>([\s\S]*?)<\/div>/i);
  const faqs = [];
  if (faqSectionMatch) {
    const section = faqSectionMatch[1];
    const details = section.match(/<details[^>]*>[\s\S]*?<\/details>/gi) || [];
    for (const d of details) {
      const qm = d.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
      const am = d.match(/<div[^>]*>([\s\S]*?)<\/div>\s*<\/details>/i);
      if (qm && am) {
        faqs.push({ question: cleanHtml(qm[1]).replace(/\+$/, '').trim(), answer: cleanHtml(am[1]) });
      }
    }
  }

  // Related tools
  const relatedMatch = html.match(/<h2[^>]*>Related Tools<\/h2>\s*<div[^>]*class="flex flex-wrap gap-2"[^>]*>([\s\S]*?)<\/div>/i);
  const relatedTools = [];
  if (relatedMatch) {
    const links = relatedMatch[1].matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi);
    for (const m of links) {
      relatedTools.push({ name: cleanHtml(m[2]), href: m[1] });
    }
  }

  // Footer keywords
  const footerMatch = html.match(/<footer class="mt-8 text-xs[^"]*"[^>]*>\s*<p>([\s\S]*?)<\/p>/i);
  let keywords = [];
  if (footerMatch) {
    const text = cleanHtml(footerMatch[1]);
    // text like "BMI Calculator — free online bmi calculator, body mass index calculator, ... . No signup required."
    const kwMatch = text.match(/free online\s+(.+?)\.\s*No signup/i);
    if (kwMatch) {
      keywords = kwMatch[1].split(/,|\band\b/i).map((s) => s.trim()).filter(Boolean);
    }
  }

  return {
    slug,
    finalUrl,
    description,
    topIntro,
    faqs,
    relatedTools,
    keywords,
  };
}

async function main() {
  const results = [];
  const failures = [];
  for (const slug of slugs) {
    try {
      let path = getUrl(slug);
      console.log(`fetching ${slug}: ${path}`);
      let res = await fetchPath(path);
      console.log(`  statusCode=${res.statusCode} len=${res.data.length} notfound=${res.data.includes('This page could not be found')}`);
      let finalUrl = path;
      if (res.statusCode === 404) {
        path = getAltUrl(slug);
        console.log(`  fallback ${path}`);
        res = await fetchPath(path);
        finalUrl = path;
      }
      if (res.statusCode !== 200) {
        failures.push({ slug, statusCode: res.statusCode, finalUrl });
        continue;
      }
      const parsed = parsePage(res.data, slug, finalUrl);
      results.push(parsed);
      console.log(`OK ${slug}: faqs=${parsed.faqs.length} related=${parsed.relatedTools.length} kw=${parsed.keywords.length}`);
    } catch (e) {
      failures.push({ slug, error: e.message });
      console.error(`FAIL ${slug}: ${e.message}`);
    }
  }
  fs.writeFileSync('tool_scrape_results.json', JSON.stringify({ results, failures }, null, 2));
  console.log(`Done. Success=${results.length}, Fail=${failures.length}`);
}

main();
