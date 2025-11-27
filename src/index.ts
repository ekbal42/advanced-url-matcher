import { MatchResult, MatchOptions } from "./types";
import { UrlParser } from "./utils/url-parser";
import { MatchPlugin, MatchContext } from "./plugins/types";
import { SchemePlugin } from "./plugins/scheme";
import { DomainPlugin } from "./plugins/domain";
import { PathPlugin } from "./plugins/path";
import { QueryPlugin } from "./plugins/query";
import { HashPlugin } from "./plugins/hash";
import { RegexMatcher } from "./matchers/regex";

export * from "./types";

export class UrlMatcher {
  private plugins: MatchPlugin[];
  private regexMatcher: RegexMatcher;

  constructor() {
    this.plugins = [
      new SchemePlugin(),
      new DomainPlugin(),
      new PathPlugin(),
      new QueryPlugin(),
      new HashPlugin(),
    ];
    this.regexMatcher = new RegexMatcher();
  }

  match(pattern: string, url: string, options: MatchOptions = {}): MatchResult {
    const optionMatch = pattern.match(/^\[([^\]]+)\]/);
    if (optionMatch) {
      const optionStr = optionMatch[1];
      pattern = pattern.slice(optionMatch[0].length);

      const flags = optionStr.split(",").map((f) => f.trim());
      for (const flag of flags) {
        switch (flag) {
          case "exact":
            options.exact = true;
            break;
          case "strict":
            options.strictTrailingSlash = true;
            break;
          case "ignoreQuery":
            options.ignoreQuery = true;
            break;
          case "ignoreHash":
            options.ignoreHash = true;
            break;
          case "strictQuery":
            options.strictQuery = true;
            break;
        }
      }
    }

    if (options.exact === true) {
      return { matched: pattern === url };
    }

    if (pattern.startsWith("regex:")) {
      return this.regexMatcher.match(pattern, url);
    }

    const patternUrl = UrlParser.parse(pattern);
    const targetUrl = UrlParser.parse(url);

    if (!patternUrl || !targetUrl) {
      return { matched: false };
    }

    const context: MatchContext = {
      patternUrl,
      targetUrl,
      patternOriginal: pattern,
      targetOriginal: url,
      options,
    };

    const combinedParams: Record<string, string> = {};

    for (const plugin of this.plugins) {
      const result = plugin.match(context);
      if (!result.matched) {
        return { matched: false };
      }
      if (result.params) {
        Object.assign(combinedParams, result.params);
      }
    }

    return {
      matched: true,
      params:
        Object.keys(combinedParams).length > 0 ? combinedParams : undefined,
    };
  }
}

export const matchUrl = (
  pattern: string,
  url: string,
  options?: MatchOptions
): MatchResult => {
  const matcher = new UrlMatcher();
  return matcher.match(pattern, url, options);
};
