import { MatchPlugin, MatchContext, MatchResult } from "./types";
export declare class PathPlugin implements MatchPlugin {
    name: string;
    match(context: MatchContext): MatchResult;
}
