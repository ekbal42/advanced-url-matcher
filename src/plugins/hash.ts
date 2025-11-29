import { MatchPlugin, MatchContext, MatchResult } from "./types";

export class HashPlugin implements MatchPlugin {
  name = "hash";

  match(context: MatchContext): MatchResult {
    if (context.options.ignoreHash === true) {
      return { matched: true };
    }

    const patternHash = context.patternUrl.hash;
    const targetHash = context.targetUrl.hash;

    if (patternHash !== targetHash) {
      return {
        matched: false,
        error: `Hash mismatch: expected ${patternHash}, got ${targetHash}`,
      };
    }

    return { matched: true };
  }
}
