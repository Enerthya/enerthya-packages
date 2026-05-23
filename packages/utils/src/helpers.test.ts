/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { randomInt, isHex, hasLink, hasInvite, chunk, escapeMarkdown, formatTime } from './helpers.js';

describe('@enerthya/utils', () => {
  it('randomInt', () => {
    const n = randomInt(1, 10);
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(10);
  });

  it('isHex', () => {
    expect(isHex('#fff')).toBe(true);
    expect(isHex('#aabbcc')).toBe(true);
    expect(isHex('invalid')).toBe(false);
  });

  it('hasLink', () => {
    expect(hasLink('visit https://example.com')).toBe(true);
    expect(hasLink('no link')).toBe(false);
  });

  it('hasInvite', () => {
    expect(hasInvite('discord.gg/abc')).toBe(true);
    expect(hasInvite('discordapp.com/invite/abc')).toBe(true);
    expect(hasInvite('no invite')).toBe(false);
  });

  it('chunk', () => {
    const result = chunk('hello world', 5);
    expect(result.length).toBeGreaterThan(1);
  });

  it('escapeMarkdown', () => {
    expect(escapeMarkdown('*bold*')).toBe('\\*bold\\*');
  });

  it('formatTime', () => {
    const result = formatTime(3661);
    expect(result).toContain('1h');
    expect(result).toContain('1m');
    expect(result).toContain('1s');
  });
});
