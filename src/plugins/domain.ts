import { MatchPlugin, MatchContext, MatchResult } from "./types";

export class DomainPlugin implements MatchPlugin {
  name = "domain";

  match(context: MatchContext): MatchResult {
    const patternHost = context.patternUrl.hostname;
    const targetHost = context.targetUrl.hostname;

    const regexPattern = patternHost
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");

    const regex = new RegExp(`^${regexPattern}$`);

    if (!regex.test(targetHost)) {
      return { matched: false };
    }

    return { matched: true };
  }
}
