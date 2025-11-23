import { MatchPlugin, MatchContext, MatchResult } from "./types";
export declare class HashPlugin implements MatchPlugin {
    name: string;
    match(context: MatchContext): MatchResult;
}
