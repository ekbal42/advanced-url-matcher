export class UrlParser {
  static parse(url: string): URL | null {
    try {
      return new URL(url);
    } catch {
      return null;
    }
  }
}
