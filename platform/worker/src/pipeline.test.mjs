import assert from "node:assert/strict";
import test from "node:test";
import { assertSelfContainedEveBundle } from "./pipeline.mjs";

test("accepts a bundle with world-convex compiled into it", () => {
  assert.doesNotThrow(() =>
    assertSelfContainedEveBundle(`
      // packages/world-convex/dist/index.js
      const packageName = "world-convex";
    `),
  );
});

test("accepts inert import-shaped text in comments and strings", () => {
  assert.doesNotThrow(() =>
    assertSelfContainedEveBundle(`
      // import "world-convex";
      const diagnostic = 'import * as world from "world-convex"';
    `),
  );
});

test("rejects a static bare world-convex import", () => {
  assert.throws(
    () =>
      assertSelfContainedEveBundle(
        'import * as workflowWorldModule from "world-convex";',
      ),
    /must be self-contained/,
  );
});

test("rejects a world-convex re-export", () => {
  assert.throws(
    () => assertSelfContainedEveBundle('export * from "world-convex";'),
    /must be self-contained/,
  );
});

test("rejects a dynamic bare world-convex import", () => {
  assert.throws(
    () => assertSelfContainedEveBundle("await import('world-convex/client')"),
    /must be self-contained/,
  );
});

test("rejects a side-effect bare world-convex import", () => {
  assert.throws(
    () => assertSelfContainedEveBundle('import "world-convex";'),
    /must be self-contained/,
  );
});
