import { Matcher, MatchResult } from '../types';
export declare class WildcardMatcher implements Matcher {
    match(pattern: string, url: string): MatchResult;
}
