import { Matcher, MatchResult } from '../types';
export declare class ExactMatcher implements Matcher {
    match(pattern: string, url: string): MatchResult;
}
