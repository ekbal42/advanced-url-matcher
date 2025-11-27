export function jsonMatch(pattern: any, target: any): boolean {
  if (pattern === target) return true;

  if (typeof pattern === "string" && pattern.includes("*")) {
    const regexPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return typeof target === "string" && regex.test(target);
  }

  if (typeof pattern === "string" && pattern.includes(",")) {
    const allowedValues = pattern.split(",").map((v) => v.trim());

    if (Array.isArray(target)) {
      return target.every((tItem) =>
        allowedValues.some((allowed) => jsonMatch(allowed, tItem))
      );
    }

    return allowedValues.some((allowed) => {
      if (jsonMatch(allowed, target)) return true;

      const allowedNum = parseFloat(allowed);
      const targetNum =
        typeof target === "number" ? target : parseFloat(String(target));
      if (!isNaN(allowedNum) && !isNaN(targetNum) && allowedNum === targetNum) {
        return true;
      }

      return false;
    });
  }

  if (
    typeof pattern === "string" &&
    pattern.includes("..") &&
    typeof target === "number"
  ) {
    const parts = pattern.split("..");
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      if (!isNaN(min) && !isNaN(max)) {
        return target >= min && target <= max;
      }
    }
  }

  if (
    pattern &&
    typeof pattern === "object" &&
    !Array.isArray(pattern) &&
    target &&
    typeof target === "object" &&
    !Array.isArray(target)
  ) {
    const keys = Object.keys(pattern);
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(target, key)) return false;
      if (!jsonMatch(pattern[key], target[key])) return false;
    }
    return true;
  }

  if (Array.isArray(pattern) && Array.isArray(target)) {
    if (pattern.length !== target.length) return false;
    for (let i = 0; i < pattern.length; i++) {
      if (!jsonMatch(pattern[i], target[i])) return false;
    }
    return true;
  }

  return false;
}
