# URL Matching Rules - Simple Guide

## 5 Core Matching Rules

These rules work **everywhere**: URL paths, query parameters, and JSON values.

### 1. Exact Match

Just write the value you want to match.

```
Pattern: /users/active
Matches: /users/active
```

### 2. Wildcard (`*` and `**`)

Matches anything or part of a value.

- `*` matches any characters in a segment (or single segment).
- `**` (or `:*`) matches the rest of the path (multiple segments).

```
Pattern: /files/*
Matches: /files/doc.pdf, /files/image.png

Pattern: /api/**
Matches: /api/v1, /api/v1/users, /api/v1/users/123

Pattern: ?name=J*
Matches: ?name=John, ?name=Jane
```

### 3. List (`,`) - OR Logic

Match any value from a comma-separated list.

```
Pattern: /status/active,pending,closed
Matches: /status/active OR /status/pending OR /status/closed

Pattern: ?filter={"age":"18,25,30"}
Matches: ?filter={"age":18} OR ?filter={"age":25}
```

### 4. Range (`..`)

Match numbers within a range.

```
Pattern: /items/1..100
Matches: /items/1, /items/50, /items/100
```

### 5. Parameter (`:name` and `:name?`)

Capture a value (paths only). Add `?` for optional parameters.

```
Pattern: /users/:id
Matches: /users/123
Captures: { id: "123" }

Pattern: /users/:id?
Matches: /users, /users/123
```

---

## Inline Options

Add options directly in your pattern using `[option1,option2]` at the start.

### Available Options

- `[exact]` - URL must match exactly (no fuzzy matching).
- `[strict]` - Trailing slashes must match exactly.
- `[ignoreQuery]` - Completely ignores the query string.
- `[ignoreHash]` - Ignores the hash fragment.
- `[strictQuery]` - Disallows extra query parameters (default allows extra).

### Example

```typescript
matchUrl("[strict,strictQuery]/api/users", "/api/users?extra=1"); // ❌
```
