import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublished, newestFirst, postPath } from '../src/posts.ts';

const now = new Date('2026-09-07T12:00:00Z');
const post = (id, date, draft = false) => ({
  id,
  data: { date: new Date(date), draft },
});
test('draft and scheduled posts stay out of every public listing', () => {
  assert.equal(isPublished(post('draft', '2020-01-01', true), now), false);
  assert.equal(isPublished(post('future', '2026-09-08'), now), false);
  assert.equal(isPublished(post('today', '2026-09-07T12:00:00Z'), now), true);
});
test('posts sort newest first with deterministic ties without mutating input', () => {
  const posts = [
    post('older', '2025-01-01'),
    post('b', '2026-01-01'),
    post('a', '2026-01-01'),
  ];
  assert.deepEqual(
    newestFirst(posts).map((p) => p.id),
    ['a', 'b', 'older'],
  );
  assert.equal(posts[0].id, 'older');
});
test('nested post URLs encode path segments and have consistent trailing slashes', () => {
  assert.equal(postPath('notes/hello world'), '/writing/notes/hello%20world/');
});
