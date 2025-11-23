import { Matcher, MatchResult } from "../types";
export declare class RegexMatcher implements Matcher {
    match(pattern: string, url: string): MatchResult;
}
