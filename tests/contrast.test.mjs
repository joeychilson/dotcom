import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test('text and hover colors meet AA contrast in both themes', async () => {
  const css = await readFile(
    new URL('../src/styles/global.css', import.meta.url),
    'utf8',
  );
  for (const selector of [
    ':root',
    ":root[data-theme='dark']",
    ':root:not([data-theme])',
  ]) {
    const block = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
    const colors = Object.fromEntries(
      [...block.matchAll(/--([\w-]+):\s*(#[a-f\d]{6})/gi)].map(
        ([, key, value]) => [key, value],
      ),
    );
    const background = luminance(colors.background);
    for (const token of [
      'foreground',
      'secondary-text',
      'quiet-text',
      'link-hover',
    ]) {
      const foreground = luminance(colors[token]);
      const ratio =
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05);
      assert.ok(ratio >= 4.5, `${selector} ${token}: ${ratio.toFixed(2)}:1`);
    }
  }
});
