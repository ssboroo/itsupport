import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('support app uses typed API state and form events', async () => {
  const source = await read('../components/support-app.tsx');
  assert.doesNotMatch(source, /useState<any>|useState<any\[\]>|submit\(e:any\)/);
});

test('internal route navigation uses the framework Link component', async () => {
  const source = await read('../components/support-app.tsx');
  assert.match(source, /import Link from ['"]next\/link['"]/);
  assert.doesNotMatch(source, /<a className="brand" href="\/">/);
  assert.doesNotMatch(source, /<a href="\/services">/);
});

test('support chat does not mutate refs during render or reset state in an effect', async () => {
  const source = await read('../components/support-chat.tsx');
  assert.doesNotMatch(source, /opened\.current\s*=\s*open/);
  assert.doesNotMatch(source, /useEffect\(\(\)=>\{if\(open\)\{setUnread\(0\)/);
});

test('preferences initialize from persisted values without an effect-driven state update', async () => {
  const source = await read('../components/preferences.tsx');
  assert.doesNotMatch(source, /useEffect\(\(\)=>\{try\{const l=localStorage/);
  assert.match(source, /useState<Language>\(\(\)=>/);
});
