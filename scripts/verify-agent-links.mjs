import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { normalizeBlogSeriesFilter, normalizeReadingFilters, filterReadings } from "../lib/contentFilters.mjs";

assert.equal(normalizeBlogSeriesFilter("ai-agent"), "ai-agent");
assert.equal(normalizeBlogSeriesFilter("missing"), "All");
assert.equal(normalizeBlogSeriesFilter(undefined), "All");

assert.deepEqual(normalizeReadingFilters({ topic: "agent", type: "paper" }), { topic: "agent", type: "paper" });
assert.deepEqual(normalizeReadingFilters({ topic: "unknown", type: "book" }), { topic: "All", type: "book" });
assert.deepEqual(normalizeReadingFilters({}), { topic: "All", type: "All" });

const readings = [
  { title: { zh: "A", en: "A" }, topic: "agent", type: "paper" },
  { title: { zh: "B", en: "B" }, topic: "backend", type: "book" },
  { title: { zh: "C", en: "C" }, topic: "agent", type: "source" }
];

assert.deepEqual(filterReadings(readings, { topic: "agent", type: "All" }).map((item) => item.title.zh), ["A", "C"]);
assert.deepEqual(filterReadings(readings, { topic: "agent", type: "paper" }).map((item) => item.title.zh), ["A"]);

assert.ok(existsSync("content/posts/agent-model-access-layer.mdx"), "model access article should exist");
assert.ok(existsSync("content/posts/agent-rag-system.mdx"), "RAG article should exist");

console.log("agent link filters verified");
