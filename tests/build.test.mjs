import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  cp,
  symlink,
  writeFile,
  readFile,
  rm,
  readdir,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function inlineScriptBytes(html) {
  let bytes = 0;
  for (const [, attributes, source] of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    const type = attributes.match(/\btype\s*=\s*["']([^"']*)["']/i)?.[1] || '';
    if (
      ['', 'module', 'text/javascript', 'application/javascript'].includes(type)
    )
      bytes += Buffer.byteLength(source);
  }
  return bytes;
}

test('JavaScript budget counts inline modules and byte length, excluding JSON-LD', () => {
  assert.equal(
    inlineScriptBytes(
      '<script>"é"</script><script type="module">abc</script><script type="application/ld+json">{"title":"ignored"}</script>',
    ),
    7,
  );
  assert.ok(inlineScriptBytes(`<script>${'x'.repeat(40001)}</script>`) > 40000);
});

test(
  'production build: routes, Markdown, canonicals, RSS, sitemap and drafts agree',
  { timeout: 120000 },
  async () => {
    const dir = await mkdtemp(join(tmpdir(), 'dotcom-test-'));
    const root = resolve(import.meta.dirname, '..');
    try {
      for (const name of [
        'src',
        'writings',
        'public',
        'astro.config.mjs',
        'package.json',
        'tsconfig.json',
      ])
        await cp(join(root, name), join(dir, name), { recursive: true });
      await symlink(
        join(root, 'node_modules'),
        join(dir, 'node_modules'),
        'dir',
      );
      const content = join(dir, 'writings');
      await writeFile(
        join(content, 'published-fixture.md'),
        '---\ntitle: A & B\ndescription: A test of <markup> & escaping.\ndate: 2020-01-02\nupdated: 2020-02-03\ndraft: false\n---\n\n## Heading\n\nA **real** paragraph.\n\n```js\nconst value = 42;\n```\n',
      );
      await writeFile(
        join(content, 'future-fixture.md'),
        '---\ntitle: Future fixture\ndescription: Not public\ndate: 2999-01-01\ndraft: false\n---\nHidden.\n',
      );
      await writeFile(
        join(content, 'default-draft-fixture.md'),
        '---\ntitle: Unfinished\ndescription: Draft by default\ndate: 2020-01-01\n---\nHidden.',
      );
      await writeFile(
        join(content, 'nested-fixture.md'),
        '---\ntitle: Nested fixture\ndescription: Encoded URL\nslug: notes/café & tea\ndate: 2020-01-01\ndraft: false\n---\nNested post.',
      );
      const result = spawnSync(
        process.execPath,
        [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'],
        {
          cwd: dir,
          encoding: 'utf8',
          env: {
            ...process.env,
            ASTRO_TELEMETRY_DISABLED: '1',
          },
        },
      );
      assert.equal(result.status, 0, result.stdout + '\n' + result.stderr);
      const read = (path) => readFile(join(dir, 'dist', path), 'utf8');
      const home = await read('index.html');
      const article = await read('writing/published-fixture/index.html');
      const feed = await read('rss.xml');
      const map = await read('sitemap-0.xml');
      const robots = await read('robots.txt');
      const nested = await read('writing/notes/café & tea/index.html');
      assert.match(nested, /Nested post/);
      for (const output of [home, nested, feed, map])
        assert.ok(
          output.includes('/writing/notes/caf%C3%A9%20%26%20tea/'),
          'Nested URLs match across pages, feed and sitemap: ' +
            JSON.stringify(output.match(/https[^<>" ]+/g)),
        );
      assert.match(
        feed,
        /<dcterms:modified>2020-02-03T00:00:00.000Z<\/dcterms:modified>/,
      );
      assert.match(feed, /<pubDate>Thu, 02 Jan 2020 00:00:00 GMT<\/pubDate>/);
      assert.match(home, /https:\/\/github.com\/joeychilson/);
      assert.match(home, /https:\/\/github.com\/joeychilson\/overwatch/);
      assert.match(home, /mailto:joeychilson@outlook.com/);
      assert.match(home, /https:\/\/x.com\/joeychilson/);
      assert.match(home, /rel="canonical" href="https:\/\/joeychilson.com\/"/);
      assert.match(article, /<strong>real<\/strong>/);
      assert.match(article, /astro-code/);
      assert.match(article, /application\/ld\+json/);
      for (const html of [home, article]) {
        assert.match(
          html,
          /property="og:image" content="https:\/\/joeychilson.com\/social-card.png"/,
        );
        assert.match(html, /name="twitter:card" content="summary_large_image"/);
      }
      assert.match(
        article,
        /https:\/\/joeychilson.com\/writing\/published-fixture\//,
      );
      assert.match(feed, /<title>A &amp; B<\/title>/);
      assert.match(
        feed,
        /https:\/\/joeychilson.com\/writing\/published-fixture\//,
      );
      assert.match(
        map,
        /https:\/\/joeychilson.com\/writing\/published-fixture\//,
      );
      assert.match(
        robots,
        /Sitemap: https:\/\/joeychilson.com\/sitemap-index.xml/,
      );
      for (const output of [home, feed, map]) {
        assert.doesNotMatch(output, /future-fixture|default-draft-fixture/);
        assert.doesNotMatch(output, /localhost/);
      }
      assert.deepEqual(await readdir(join(dir, 'dist/writing')), [
        'notes',
        'published-fixture',
      ]);
      assert.doesNotMatch(map, /404/);
      const missing = await read('404.html');
      assert.match(missing, /noindex, nofollow/);
      assert.doesNotMatch(missing, /rel="canonical"/);
      assert.match(missing, /A little off course/);
      assert.match(missing, /An animated ASCII city skyline/);
      assert.match(missing, /class="homeward" href="\/"/);
      // This should remain a static site, without React hydration payloads.
      assert.doesNotMatch(home, /<astro-island|react-dom/);
      const files = await readdir(join(dir, 'dist'), { recursive: true });
      const scripts = await Promise.all(
        files.filter((file) => file.endsWith('.js')).map(read),
      );
      const externalBytes = scripts.reduce(
        (sum, source) => sum + Buffer.byteLength(source),
        0,
      );
      for (const file of files.filter((file) => file.endsWith('.html'))) {
        const bytes = externalBytes + inlineScriptBytes(await read(file));
        assert.ok(
          bytes < 40000,
          `${file}: ${bytes} bytes; keep client JavaScript under 40 KB uncompressed`,
        );
      }
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  },
);
