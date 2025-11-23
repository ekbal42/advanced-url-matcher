import { MatchPlugin, MatchContext, MatchResult } from "./types";
export declare class SchemePlugin implements MatchPlugin {
    name: string;
    match(context: MatchContext): MatchResult;
}
