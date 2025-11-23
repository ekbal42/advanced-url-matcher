import { MatchPlugin, MatchContext, MatchResult } from "./types";

export class PathPlugin implements MatchPlugin {
  name = "path";

  match(context: MatchContext): MatchResult {
    const patternPath = context.patternUrl.pathname;
    const targetPath = context.targetUrl.pathname;

    let regexPattern = patternPath
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");

    regexPattern = regexPattern.replace(/:([a-zA-Z0-9_]+)/g, "([^/]+)");

    const regex = new RegExp(`^${regexPattern}$`);
    const match = targetPath.match(regex);

    if (!match) {
      return { matched: false };
    }

    const params: Record<string, string> = {};
    const paramNames: string[] = [];

    const extractionRegexStr = patternPath
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
        paramNames.push(name);
        return "([^/]+)";
      });

    const extractionRegex = new RegExp(`^${extractionRegexStr}$`);
    const extractionMatch = targetPath.match(extractionRegex);

    if (extractionMatch) {
      paramNames.forEach((name, index) => {
        params[name] = extractionMatch[index + 1];
      });
    }

    return { matched: true, params };
  }
}
