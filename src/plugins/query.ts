import { MatchPlugin, MatchContext, MatchResult } from "./types";
import { jsonMatch } from "../utils/json-matcher";

export class QueryPlugin implements MatchPlugin {
  name = "query";

  match(context: MatchContext): MatchResult {
    if (context.options.ignoreQuery === true) {
      return { matched: true };
    }

    const patternParams = context.patternUrl.searchParams;
    const targetParams = context.targetUrl.searchParams;

    for (const [key, value] of patternParams.entries()) {
      const targetValue = targetParams.get(key);

      if (!targetValue) {
        return { matched: false };
      }

      const allowedValues = value.split(",");
      let paramMatched = false;

      try {
        const patternJson = JSON.parse(value);
        const targetJson = JSON.parse(targetValue);
        if (jsonMatch(patternJson, targetJson)) {
          paramMatched = true;
        }
      } catch (e) {}

      if (!paramMatched) {
        for (const allowedValue of allowedValues) {
          if (allowedValue.includes("*")) {
            const regexPattern = allowedValue
              .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
              .replace(/\*/g, ".*");
            const regex = new RegExp(`^${regexPattern}$`);
            if (regex.test(targetValue)) {
              paramMatched = true;
              break;
            }
          } else {
            if (targetValue === allowedValue) {
              paramMatched = true;
              break;
            }
          }
        }
      }

      if (!paramMatched) {
        return { matched: false };
      }
    }

    if (context.options.strictQuery === true) {
      for (const key of targetParams.keys()) {
        if (!patternParams.has(key)) {
          return { matched: false };
        }
      }
    }

    return { matched: true };
  }
}
