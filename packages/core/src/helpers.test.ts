/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';

// placeholder test
describe('@enerthya/core', () => {
  it('should import without error', async () => {
    const mod = await import('./index.js');
    expect(mod.EnerthyaClient).toBeDefined();
    expect(mod.Registry).toBeDefined();
    expect(mod.CommandContext).toBeDefined();
  });
});
