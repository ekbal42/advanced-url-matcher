import { Matcher, MatchResult } from "../types";

export class RegexMatcher implements Matcher {
  match(pattern: string, url: string): MatchResult {
    if (!pattern.startsWith("regex:")) {
      return { matched: false };
    }

    try {
      const regexString = pattern.substring(6);
      const regex = new RegExp(regexString);
      const matched = regex.test(url);
      return {
        matched,
        error: matched ? undefined : "Regex match failed",
      };
    } catch (e) {
      return { matched: false, error: "Invalid regex pattern" };
    }
  }
}
