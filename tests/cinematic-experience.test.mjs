import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../app/cinematic.css', import.meta.url), 'utf8');
const app = await readFile(new URL('../components/support-app.tsx', import.meta.url), 'utf8');

test('cinematic scroll progress is present without replacing the existing header', () => {
  assert.match(css, /\.cinematic-scroll-progress/);
  assert.match(app, /className="cinematic-scroll-progress"/);
  assert.match(app, /<header>/);
});

test('existing customer journeys remain in the homepage experience', () => {
  for (const selector of ['id="services"', 'id="how"', 'id="prepare"', 'className="contactbanner']) {
    assert.ok(app.includes(selector), `Missing existing customer journey: ${selector}`);
  }
  assert.match(app, /openBooking\(/);
  assert.match(app, /fetch\('\/api\/orders'/);
  assert.match(app, /channel\('Messenger'\)/);
});

test('scroll reveals are responsive and respect reduced-motion preferences', () => {
  assert.match(css, /\.cinematic-reveal/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*800px\)/);
});


test('homepage receives a distinct premium visual system and service proof points', async () => {
  const styles = await readFile(new URL('../app/cinematic.css', import.meta.url), 'utf8');
  assert.match(styles, /\.hero\.cinematic-reveal::before/);
  assert.match(styles, /\.hero-proof/);
  assert.match(styles, /\.card:hover/);
  assert.match(styles, /\.contactbanner\.cinematic-reveal/);
  assert.match(app, /className="hero-proof"/);
  assert.match(app, /className="trust-strip"/);
  assert.match(app, /className="faq-section"/);
  assert.match(css, /\.trust-strip/);
  assert.match(css, /\.faq-section/);
  assert.match(app, /Алсын зайны IT тусламж/);
});
