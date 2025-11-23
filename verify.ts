import { matchUrl } from "./src/index";

const tests = [
  // ==========================================
  // 1. Scheme & Domain Matching
  // ==========================================
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

  // ==========================================
  // 2. Path Matching
  // ==========================================
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

  // ==========================================
  // 3. Query Matching
  // ==========================================
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

  // ==========================================
  // 4. Hash Matching
  // ==========================================
  {
    name: "Hash Exact Match",
    result: matchUrl(
      "https://example.com#section1",
      "https://example.com#section1"
    ).matched,
    expected: true,
  },
  {
    name: "Hash Mismatch",
    result: matchUrl(
      "https://example.com#section1",
      "https://example.com#section2"
    ).matched,
    expected: false,
  },
  {
    name: "Hash Missing in Target",
    result: matchUrl("https://example.com#section1", "https://example.com")
      .matched,
    expected: false,
  },
  {
    name: "Hash Present in Target but not Pattern",
    result: matchUrl("https://example.com", "https://example.com#section1")
      .matched,
    expected: false,
  },

  // ==========================================
  // 5. Hybrid Matching (Path + Query)
  // ==========================================
  {
    name: "Hybrid: Path Param + Query List",
    result: matchUrl(
      "https://example.com/products/:category?sort=asc,desc&page=*",
      "https://example.com/products/shoes?sort=desc&page=2"
    ).matched,
    expected: true,
  },

  // ==========================================
  // 6. Regex Matching (Advanced)
  // ==========================================
  {
    name: "Regex Match",
    result: matchUrl(
      "regex:^https://example\\.com/\\d+$",
      "https://example.com/123"
    ).matched,
    expected: true,
  },

  // ==========================================
  // 7. Configuration Options
  // ==========================================

  // --- ignoreExtraQueryparams ---
  {
    name: "Option: ignoreExtraQueryparams = false (Should Fail)",
    result: matchUrl("https://example.com?a=1", "https://example.com?a=1&b=2", {
      ignoreExtraQueryparams: false,
    }).matched,
    expected: false,
  },
  {
    name: "Option: ignoreExtraQueryparams = true (Should Pass)",
    result: matchUrl("https://example.com?a=1", "https://example.com?a=1&b=2", {
      ignoreExtraQueryparams: true,
    }).matched,
    expected: true,
  },

  // --- strictTrailingSlash ---
  {
    name: "Option: strictTrailingSlash = false (Should Pass)",
    result: matchUrl("https://example.com/foo", "https://example.com/foo/", {
      strictTrailingSlash: false,
    }).matched,
    expected: true,
  },
  {
    name: "Option: strictTrailingSlash = true (Should Fail)",
    result: matchUrl("https://example.com/foo", "https://example.com/foo/", {
      strictTrailingSlash: true,
    }).matched,
    expected: false,
  },
  {
    name: "Option: strictTrailingSlash = true with root path (Should Fail)",
    result: matchUrl("http://localhost:5173", "http://localhost:5173/", {
      strictTrailingSlash: true,
    }).matched,
    expected: false,
  },
  {
    name: "Option: strictTrailingSlash = false with root path (Should Pass)",
    result: matchUrl("http://localhost:5173", "http://localhost:5173/", {
      strictTrailingSlash: false,
    }).matched,
    expected: true,
  },
  {
    name: "Default behavior with root path (Should Pass - ignores trailing slash)",
    result: matchUrl("http://localhost:5173", "http://localhost:5173/").matched,
    expected: true,
  },

  // --- exact ---
  {
    name: "Option: exact = true (Should Pass)",
    result: matchUrl("https://example.com/foo", "https://example.com/foo", {
      exact: true,
    }).matched,
    expected: true,
  },
  {
    name: "Option: exact = true (Should Fail - Mismatch)",
    result: matchUrl("https://example.com/foo", "https://example.com/foo/", {
      exact: true,
    }).matched,
    expected: false,
  },

  // --- ignoreQuery ---
  {
    name: "Option: ignoreQuery = true (Should Pass)",
    result: matchUrl("https://example.com?a=1", "https://example.com?b=2", {
      ignoreQuery: true,
    }).matched,
    expected: true,
  },
  {
    name: "Option: ignoreQuery = false (Should Fail)",
    result: matchUrl("https://example.com?a=1", "https://example.com?b=2", {
      ignoreQuery: false,
    }).matched,
    expected: false,
  },

  // --- ignoreHash ---
  {
    name: "Option: ignoreHash = true (Should Pass)",
    result: matchUrl("https://example.com#foo", "https://example.com#bar", {
      ignoreHash: true,
    }).matched,
    expected: true,
  },
  {
    name: "Option: ignoreHash = false (Should Fail)",
    result: matchUrl("https://example.com#foo", "https://example.com#bar", {
      ignoreHash: false,
    }).matched,
    expected: false,
  },
  {
    name: "Option: ignoreHash = false (Should Pass)",
    result: matchUrl("https://example.com#foo", "https://example.com#foo", {
      ignoreHash: false,
    }).matched,
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
