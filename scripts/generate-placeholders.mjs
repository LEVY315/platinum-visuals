// Generates placeholder SVGs for every service category:
//   public/images/services/<slug>/{thumb,full}/<nn>.svg
// Run with: node scripts/generate-placeholders.mjs
// The sizes here must match the width/height in src/app/data/services.data.ts.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'services');

const categories = [
  ['weddings', 'Weddings'],
  ['matric-dances', 'Matric Dances'],
  ['corporate-events', 'Corporate Events'],
  ['studio-portraits', 'Studio Portraits'],
  ['professional-portraits', 'Professional Portraits'],
  ['maternity-shoots', 'Maternity Shoots'],
  ['milestone-shoots', 'One-Year-Old & Milestone Shoots'],
  ['birthday-shoots', 'Birthday Shoots'],
  ['birthday-parties', 'Birthday Parties'],
  ['sports-events', 'Sports Events'],
  ['outdoor-shoots', 'Outdoor Shoots'],
];

// Full-size dimensions per shape; thumbs are one third of the full size.
const shapes = {
  landscape: [1800, 1200],
  portrait: [1200, 1800],
  square: [1500, 1500],
};

// Six images per category; every category gets landscape, portrait and square.
const layout = ['landscape', 'portrait', 'square', 'landscape', 'portrait', 'landscape'];

const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svg(width, height, hue, lightness, label) {
  const unit = Math.min(width, height);
  const icon = unit * 0.22;
  const cx = width / 2;
  const cy = height / 2 - unit * 0.04;
  const x = cx - icon / 2;
  const y = cy - icon * 0.38;
  const stroke = Math.max(2, unit * 0.012);
  const fontSize = Math.max(12, unit * 0.045);
  const ink = `hsl(${hue} 14% 38%)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}">
  <rect width="${width}" height="${height}" fill="hsl(${hue} 16% ${lightness}%)"/>
  <g fill="none" stroke="${ink}" stroke-width="${stroke}" stroke-linejoin="round">
    <rect x="${x}" y="${y}" width="${icon}" height="${icon * 0.72}" rx="${icon * 0.08}"/>
    <path d="M${x + icon * 0.3} ${y}l${icon * 0.08} ${-icon * 0.12}h${icon * 0.24}l${icon * 0.08} ${icon * 0.12}"/>
    <circle cx="${cx}" cy="${y + icon * 0.38}" r="${icon * 0.2}"/>
  </g>
  <text x="${cx}" y="${y + icon * 0.72 + fontSize * 2}" text-anchor="middle" font-family="Figtree, system-ui, sans-serif" font-size="${fontSize}" fill="${ink}">${escapeXml(label)}</text>
</svg>
`;
}

let count = 0;
categories.forEach(([slug, title], categoryIndex) => {
  const baseHue = 200 + ((categoryIndex * 7) % 40);
  layout.forEach((shape, i) => {
    const name = String(i + 1).padStart(2, '0');
    const [fullW, fullH] = shapes[shape];
    const hue = baseHue + i * 4;
    const lightness = 84 + (i % 3) * 3;
    const label = `${title} · ${name}`;
    const files = {
      full: svg(fullW, fullH, hue, lightness, label),
      thumb: svg(fullW / 3, fullH / 3, hue, lightness, label),
    };
    for (const [size, content] of Object.entries(files)) {
      const file = join(root, slug, size, `${name}.svg`);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, content);
      count++;
    }
  });
});

console.log(`Wrote ${count} placeholder files to ${root}`);
