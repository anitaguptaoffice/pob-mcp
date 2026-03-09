import { describe, it, expect } from '@jest/globals';
import { formatBaseSlug, parsePoedbText } from '../../src/services/craftingDataService';

describe('formatBaseSlug', () => {
  it('replaces spaces with underscores', () => {
    expect(formatBaseSlug('Hubris Circlet')).toBe('Hubris_Circlet');
  });

  it('handles single word bases', () => {
    expect(formatBaseSlug('Helmet')).toBe('Helmet');
  });

  it('handles apostrophes', () => {
    expect(formatBaseSlug("Soldier's Helmet")).toBe("Soldier's_Helmet");
  });
});

describe('parsePoedbText', () => {
  it('extracts fossil section when present', () => {
    const html = '<h2>Fossil</h2><p>Aberrant Fossil - removes lightning mods</p>';
    const result = parsePoedbText(html, 'Hubris Circlet');
    expect(result).toContain('Aberrant');
  });

  it('returns base name in output', () => {
    const result = parsePoedbText('<html>some content</html>', 'Hubris Circlet');
    expect(result).toContain('Hubris Circlet');
  });
});
