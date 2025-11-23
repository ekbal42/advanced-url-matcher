import { MatchPlugin, MatchContext, MatchResult } from "./types";

export class SchemePlugin implements MatchPlugin {
  name = "scheme";

  match(context: MatchContext): MatchResult {
    if (context.patternUrl.protocol !== context.targetUrl.protocol) {
      return { matched: false };
    }
    return { matched: true };
  }
}
