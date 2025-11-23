# URL Pattern Matcher

A comprehensive, lightweight TypeScript library for matching URLs against patterns. Ideal for targeting marketing popups, feature flags, or routing.

## Features

- **Exact Matching**: Simple string equality.
- **Wildcard Matching**: Use `*` to match any sequence of characters.
- **Regex Matching**: Use powerful regular expressions with `regex:` prefix.
- **Parameter Matching**: Extract values from URL paths using `:paramName`.
- **Flexible Options**: Ignore query parameters, hashes, or trailing slashes.

## Installation

```bash
npm install url-pattern-matcher
```

## Usage

```typescript
import { matchUrl } from "url-pattern-matcher";

// --- 1. Scheme & Domain ---
matchUrl("https://example.com", "https://example.com"); // true
matchUrl("https://*.example.com", "https://sub.example.com"); // true

// --- 2. Path Matching ---
matchUrl("https://example.com/foo/*", "https://example.com/foo/bar/baz"); // true
matchUrl("https://example.com/users/:id", "https://example.com/users/123"); // true (params: { id: '123' })

// --- 3. Query Matching ---
// Subset match: Target can have extra params
matchUrl("https://example.com?a=1", "https://example.com?a=1&b=2"); // true

// Wildcards in values
matchUrl("https://example.com?id=*", "https://example.com?id=anything"); // true

// List/OR Logic (Comma-separated)
matchUrl("https://example.com?id=1,2,3", "https://example.com?id=2"); // true

// Mixed Wildcards in List
matchUrl(
  "https://example.com?type=a,b,*_custom",
  "https://example.com?type=my_custom"
); // true

// --- 4. Hybrid (Path + Query) ---
matchUrl(
  "https://example.com/products/:category?sort=asc,desc&page=*",
  "https://example.com/products/shoes?sort=desc&page=2"
); // true

// --- 5. Regex (Advanced) ---
matchUrl("regex:^https://example\\.com/\\d+$", "https://example.com/123"); // true
```

## API

### `matchUrl(pattern: string, url: string, options?: MatchOptions): MatchResult`

#### `MatchOptions`

- `exact?: boolean`: Force exact matching (default: false).
- `strictTrailingSlash?: boolean`: If false, treats `/path` and `/path/` as the same (default: true).
- `ignoreQuery?: boolean`: Ignore query parameters during matching (default: false).
- `ignoreHash?: boolean`: Ignore URL hash during matching (default: false).

#### `MatchResult`

- `matched: boolean`: Whether the URL matched the pattern.
- `params?: Record<string, string>`: Extracted path parameters (if any).

## License

ISC
