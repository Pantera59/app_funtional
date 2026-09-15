// One-off script: downloads the exercise photos into public/exercises so the app
// never requests images from an external host at runtime.
// Usage: node scripts/download-exercise-images.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.resolve(import.meta.dirname, '..', 'public', 'exercises');

// Unsplash photo id -> local slug (referenced from src/lib/domain/exercises.ts).
// The original photos for the overhead press and the mobility stretch return 404,
// so those exercises reuse one of the images below.
const PHOTOS = {
  '1571019613454-1cb2f99b2d8b': 'glute-bridge',
  '1544367567-0f2fcb009e0b': 'prone-raises',
  '1574680096145-d05b474e2155': 'air-squat',
  '1517838277536-f5f99be501cd': 'functional-training',
  '1526506118085-60ce8714f8c5': 'pull-ups',
  '1571019614242-c5c5dee9f50b': 'push-ups',
  '1583454110551-21f2fa2afe61': 'kettlebell-swing',
  '1541534741688-6078c6bfb5c5': 'strength-floor',
  '1518611012118-696072aa579a': 'core',
  '1518310383802-640c2de311b2': 'lunges',
};

await mkdir(OUT_DIR, { recursive: true });

const missing = [];

for (const [id, slug] of Object.entries(PHOTOS)) {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=75&fm=jpg`;
  const res = await fetch(url);
  if (!res.ok) {
    missing.push(slug);
    console.warn(`✗ ${slug}.jpg (HTTP ${res.status})`);
    continue;
  }
  await writeFile(path.join(OUT_DIR, `${slug}.jpg`), Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${slug}.jpg`);
}

if (missing.length > 0) {
  console.warn(`\nMissing: ${missing.join(', ')}. Point those exercises at another local image.`);
}
