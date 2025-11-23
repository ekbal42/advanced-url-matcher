import { MatchPlugin, MatchContext, MatchResult } from "./types";
export declare class QueryPlugin implements MatchPlugin {
    name: string;
    match(context: MatchContext): MatchResult;
}
