export interface MatchContext {
  patternUrl: URL;
  targetUrl: URL;
  patternOriginal: string;
  targetOriginal: string;
}

export interface MatchResult {
  matched: boolean;
  params?: Record<string, string>;
}

export interface MatchPlugin {
  name: string;
  match(context: MatchContext): MatchResult;
}
