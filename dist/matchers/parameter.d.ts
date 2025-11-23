import { Matcher, MatchResult } from '../types';
export declare class ParameterMatcher implements Matcher {
    match(pattern: string, url: string): MatchResult;
}
