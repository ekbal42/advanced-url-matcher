export interface MatchResult {
    matched: boolean;
    params?: Record<string, string>;
}
export interface Matcher {
    match(pattern: string, url: string): MatchResult;
}
export interface MatchOptions {
    exact?: boolean;
    strictTrailingSlash?: boolean;
    ignoreQuery?: boolean;
    ignoreHash?: boolean;
    strictQuery?: boolean;
}
