"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSegment = matchSegment;
function matchSegment(pattern, target) {
    if (pattern.startsWith(":") && !pattern.includes("*")) {
        return true;
    }
    if (pattern.startsWith("(") && pattern.endsWith(")")) {
        const regexStr = pattern.slice(1, -1);
        try {
            const regex = new RegExp(`^${regexStr}$`);
            return regex.test(target);
        }
        catch (e) {
            return false;
        }
    }
    if (pattern.includes("*")) {
        const regexPattern = pattern
            .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\*/g, ".*");
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(target);
    }
    if (pattern.includes(",")) {
        const allowedValues = pattern.split(",");
        return allowedValues.includes(target);
    }
    if (pattern.includes("..")) {
        const parts = pattern.split("..");
        if (parts.length === 2) {
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            const targetNum = parseFloat(target);
            if (!isNaN(min) && !isNaN(max) && !isNaN(targetNum)) {
                return targetNum >= min && targetNum <= max;
            }
        }
    }
    return pattern === target;
}
