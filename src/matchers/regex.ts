import { Matcher, MatchResult } from "../types";

export class RegexMatcher implements Matcher {
  match(pattern: string, url: string): MatchResult {
    if (!pattern.startsWith("regex:")) {
      return { matched: false };
    }

    try {
      const regexString = pattern.substring(6);
      const regex = new RegExp(regexString);
      return {
        matched: regex.test(url),
      };
    } catch (e) {
      console.error("Invalid regex pattern:", pattern);
      return { matched: false };
    }
  }
}
