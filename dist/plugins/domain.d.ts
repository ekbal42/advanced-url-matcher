import { MatchPlugin, MatchContext, MatchResult } from "./types";
export declare class DomainPlugin implements MatchPlugin {
    name: string;
    match(context: MatchContext): MatchResult;
}
