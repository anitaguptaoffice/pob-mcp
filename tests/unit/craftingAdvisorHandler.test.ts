import { describe, it, expect } from '@jest/globals';
import { buildCraftingResponse } from '../../src/handlers/craftingAdvisorHandler';

describe('buildCraftingResponse', () => {
  it('includes base name in output', () => {
    const result = buildCraftingResponse({
      base: 'Hubris Circlet',
      slot: 'helmet',
      desiredMods: ['maximum life', 'cold resistance'],
      modData: '=== poedb data ===\nsome mod info',
      currencyRates: { chaos: 1, divine: 200 },
      buildContext: null,
    });
    expect(result).toContain('Hubris Circlet');
  });

  it('includes desired mods in output', () => {
    const result = buildCraftingResponse({
      base: 'Hubris Circlet',
      slot: 'helmet',
      desiredMods: ['maximum life', 'cold resistance'],
      modData: '',
      currencyRates: { chaos: 1, divine: 200 },
      buildContext: null,
    });
    expect(result).toContain('maximum life');
    expect(result).toContain('cold resistance');
  });

  it('includes build context when provided', () => {
    const result = buildCraftingResponse({
      base: 'Hubris Circlet',
      slot: 'helmet',
      desiredMods: [],
      modData: '',
      currencyRates: { chaos: 1, divine: 200 },
      buildContext: { life: 3000, fireRes: 45, coldRes: 10 },
    });
    expect(result).toContain('Build context');
  });

  it('includes currency rates', () => {
    const result = buildCraftingResponse({
      base: 'Hubris Circlet',
      slot: 'helmet',
      desiredMods: [],
      modData: '',
      currencyRates: { chaos: 1, divine: 200 },
      buildContext: null,
    });
    expect(result).toContain('200');
  });
});
