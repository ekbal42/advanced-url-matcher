import { matchUrl } from '../src/index';

describe('UrlMatcher', () => {
    test('Exact Match', () => {
        expect(matchUrl('https://example.com', 'https://example.com').matched).toBe(true);
        expect(matchUrl('https://example.com', 'https://example.org').matched).toBe(false);
    });

    test('Wildcard Match', () => {
        expect(matchUrl('https://example.com/*', 'https://example.com/blog').matched).toBe(true);
        expect(matchUrl('*.example.com', 'sub.example.com').matched).toBe(true);
        expect(matchUrl('https://example.com/blog/*', 'https://example.com/other').matched).toBe(false);
    });

});
