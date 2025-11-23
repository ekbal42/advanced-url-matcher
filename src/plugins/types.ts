import { MatchOptions } from "../types";

export interface MatchContext {
  patternUrl: URL;
  targetUrl: URL;
  patternOriginal: string;
  targetOriginal: string;
  options: MatchOptions;
}

export interface MatchResult {
  matched: boolean;
  params?: Record<string, string>;
}

export interface MatchPlugin {
  name: string;
  match(context: MatchContext): MatchResult;
}
