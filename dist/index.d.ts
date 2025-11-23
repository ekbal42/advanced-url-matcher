import { MatchResult, MatchOptions } from "./types";
export * from "./types";
export declare class UrlMatcher {
    private plugins;
    private regexMatcher;
    constructor();
    match(pattern: string, url: string, options?: MatchOptions): MatchResult;
}
export declare const matchUrl: (pattern: string, url: string, options?: MatchOptions) => MatchResult;
