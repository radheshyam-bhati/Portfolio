import { describe, it, expect } from 'vitest';
import { mergeExtraLanguages } from './githubMapper';

const detected = [
  { name: 'TypeScript', bytes: 797490, percentage: 97, color: '#3178c6' },
  { name: 'PLpgSQL', bytes: 10821, percentage: 1, color: '#ef4444' },
  { name: 'Python', bytes: 6893, percentage: 1, color: '#3572a5' },
];

describe('mergeExtraLanguages', () => {
  it('returns the detected stats unchanged when no extras are given', () => {
    expect(mergeExtraLanguages(detected)).toEqual(detected);
    expect(mergeExtraLanguages(detected, [])).toEqual(detected);
  });

  it('returns an empty array for a null/undefined stats input', () => {
    expect(mergeExtraLanguages(null, ['Python'])).toEqual([]);
    expect(mergeExtraLanguages(undefined, ['Python'])).toEqual([]);
  });

  it('appends curated extras without removing existing detected languages', () => {
    const result = mergeExtraLanguages(detected, [
      'MySQL',
      'Figma',
      'UI/UX',
      'Java',
    ]);

    expect(result.map((lang) => lang.name)).toEqual([
      'TypeScript',
      'PLpgSQL',
      'Python',
      'MySQL',
      'Figma',
      'UI/UX',
      'Java',
    ]);

    // Existing entries keep their original byte/percentage data.
    expect(result[0]).toEqual(detected[0]);
    expect(result[2]).toEqual(detected[2]);

    // Extras carry a color but no percentage (rendered as plain chips).
    expect(result[3]).toMatchObject({ name: 'MySQL', percentage: null });
    expect(typeof result[3].color).toBe('string');
  });

  it('does not duplicate a language already detected', () => {
    const result = mergeExtraLanguages(detected, ['Python', 'CSS', 'MySQL']);
    expect(result.map((lang) => lang.name)).toEqual([
      'TypeScript',
      'PLpgSQL',
      'Python',
      'CSS',
      'MySQL',
    ]);
  });

  it('is case-insensitive when deduplicating', () => {
    const result = mergeExtraLanguages(detected, ['python', 'typescript']);
    expect(result.map((lang) => lang.name)).toEqual([
      'TypeScript',
      'PLpgSQL',
      'Python',
    ]);
  });

  it('ignores blank or non-string extra names', () => {
    const result = mergeExtraLanguages(detected, ['', '  ', null, undefined, 42, true, 'Java']);
    expect(result.map((lang) => lang.name)).toEqual([
      'TypeScript',
      'PLpgSQL',
      'Python',
      'Java',
    ]);
  });
});
