import { matchUrl } from "./src/index";

const tests = [
  // --- Scheme Matching ---
  {
    name: "Scheme Match (https)",
    result: matchUrl("https://example.com", "https://example.com").matched,
    expected: true,
  },
  {
    name: "Scheme Mismatch (http vs https)",
    result: matchUrl("https://example.com", "http://example.com").matched,
    expected: false,
  },

  // --- Domain Matching ---
  {
    name: "Domain Exact Match",
    result: matchUrl("https://example.com", "https://example.com").matched,
    expected: true,
  },
  {
    name: "Domain Wildcard Match (*.example.com)",
    result: matchUrl("https://*.example.com", "https://sub.example.com")
      .matched,
    expected: true,
  },
  {
    name: "Domain Wildcard Mismatch",
    result: matchUrl("https://*.example.com", "https://example.org").matched,
    expected: false,
  },

  // --- Path Matching ---
  {
    name: "Path Exact Match",
    result: matchUrl("https://example.com/foo", "https://example.com/foo")
      .matched,
    expected: true,
  },
  {
    name: "Path Wildcard Match (/foo/*)",
    result: matchUrl(
      "https://example.com/foo/*",
      "https://example.com/foo/bar/baz"
    ).matched,
    expected: true,
  },
  {
    name: "Path Parameter Match (/users/:id)",
    result: matchUrl(
      "https://example.com/users/:id",
      "https://example.com/users/123"
    ).matched,
    expected: true,
  },
  {
    name: "Path Parameter Extraction",
    result:
      matchUrl("https://example.com/users/:id", "https://example.com/users/123")
        .params?.id === "123",
    expected: true,
  },
  {
    name: "Path Mixed Parameters (/users/:userId/posts/:postId)",
    result: matchUrl(
      "https://example.com/users/:userId/posts/:postId",
      "https://example.com/users/1/posts/99"
    ).matched,
    expected: true,
  },

  // --- Query Matching ---
  {
    name: "Query Exact Match",
    result: matchUrl(
      "https://example.com?foo=bar",
      "https://example.com?foo=bar"
    ).matched,
    expected: true,
  },
  {
    name: "Query Subset Match (Target has extra)",
    result: matchUrl(
      "https://example.com?foo=bar",
      "https://example.com?foo=bar&baz=qux"
    ).matched,
    expected: true,
  },
  {
    name: "Query Order Independence",
    result: matchUrl(
      "https://example.com?a=1&b=2",
      "https://example.com?b=2&a=1"
    ).matched,
    expected: true,
  },
  {
    name: "Query Mismatch",
    result: matchUrl(
      "https://example.com?foo=bar",
      "https://example.com?foo=baz"
    ).matched,
    expected: false,
  },
  {
    name: "Query Wildcard Value (id=*)",
    result: matchUrl(
      "https://example.com?id=*",
      "https://example.com?id=anything"
    ).matched,
    expected: true,
  },
  {
    name: "Query List Match (OR logic: id=1,2,3)",
    result: matchUrl("https://example.com?id=1,2,3", "https://example.com?id=2")
      .matched,
    expected: true,
  },
  {
    name: "Query List Match with Wildcard (type=a,b,*)",
    result: matchUrl(
      "https://example.com?type=a,b,*_custom",
      "https://example.com?type=my_custom"
    ).matched,
    expected: true,
  },
  {
    name: "Query List Mismatch",
    result: matchUrl("https://example.com?id=1,2,3", "https://example.com?id=4")
      .matched,
    expected: false,
  },

  // --- Hybrid (Path + Query) ---
  {
    name: "Hybrid: Path Param + Query List",
    result: matchUrl(
      "https://example.com/products/:category?sort=asc,desc&page=*",
      "https://example.com/products/shoes?sort=desc&page=2"
    ).matched,
    expected: true,
  },

  // --- Regex Matching (Legacy/Advanced) ---
  {
    name: "Regex Match",
    result: matchUrl(
      "regex:^https://example\\.com/\\d+$",
      "https://example.com/123"
    ).matched,
    expected: true,
  },
];

let passed = 0;
let failed = 0;

console.log("Running manual verification...");

tests.forEach((test) => {
  if (test.result === test.expected) {
    console.log(`[PASS] ${test.name}`);
    passed++;
  } else {
    console.error(
      `[FAIL] ${test.name}: Expected ${test.expected}, got ${test.result}`
    );
    failed++;
  }
});

console.log(`\nTotal: ${tests.length}, Passed: ${passed}, Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
}
