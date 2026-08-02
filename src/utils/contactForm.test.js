import { describe, it, expect } from 'vitest';
import {
  buildContactPayload,
  isSubmitCoolingDown,
  validateContactForm,
} from './contactForm';

describe('validateContactForm — security hardening', () => {
  it('accepts clean input and trims whitespace', () => {
    const result = validateContactForm({
      name: '  Radheshyam  ',
      email: '  me@example.com  ',
      message: '  Hello! This is a valid message.  ',
      company_site: '',
    });

    expect(result.errorMessage).toBeUndefined();
    expect(result.isSpam).toBeUndefined();
    expect(result.sanitizedValues).toEqual({
      name: 'Radheshyam',
      email: 'me@example.com',
      message: 'Hello! This is a valid message.',
    });
  });

  it('silently flags spam when the honeypot field is filled', () => {
    const result = validateContactForm({
      name: 'Bot',
      email: 'bot@example.com',
      message: 'A very long automated message that would otherwise pass.',
      company_site: 'http://spam.example.com',
    });

    expect(result.isSpam).toBe(true);
    expect(result.sanitizedValues).toBeUndefined();
    expect(result.errorMessage).toBeUndefined();
  });

  it('strips control characters from every field', () => {
    const result = validateContactForm({
      name: 'Rad\u0000heshyam',
      email: 'me\u0007@example.com',
      message: 'Clean\u001F message here.',
      company_site: '',
    });

    expect(result.sanitizedValues.name).toBe('Radheshyam');
    expect(result.sanitizedValues.email).toBe('me@example.com');
    expect(result.sanitizedValues.message).toBe('Clean message here.');
  });

  it('caps over-length fields to prevent oversized payloads', () => {
    const result = validateContactForm({
      name: 'A'.repeat(500),
      email: 'me@example.com',
      message: 'M'.repeat(10000),
      company_site: '',
    });

    expect(result.sanitizedValues.name.length).toBe(100);
    expect(result.sanitizedValues.message.length).toBe(5000);
    expect(result.errorMessage).toBeUndefined();
  });

  it('rejects a too-short name', () => {
    const result = validateContactForm({
      name: 'X',
      email: 'me@example.com',
      message: 'A valid message here.',
      company_site: '',
    });

    expect(result.errorMessage).toMatch(/valid name/i);
  });

  it('rejects an invalid email address', () => {
    const result = validateContactForm({
      name: 'Radheshyam',
      email: 'not-an-email',
      message: 'A valid message here.',
      company_site: '',
    });

    expect(result.errorMessage).toMatch(/valid email/i);
  });

  it('rejects a message that is too short', () => {
    const result = validateContactForm({
      name: 'Radheshyam',
      email: 'me@example.com',
      message: 'Short',
      company_site: '',
    });

    expect(result.errorMessage).toMatch(/at least 10 characters/i);
  });
});

describe('isSubmitCoolingDown — client-side rate limit', () => {
  it('returns false when there has never been a submit', () => {
    expect(isSubmitCoolingDown(null)).toBe(false);
  });

  it('blocks a resubmit within the cooldown window', () => {
    const now = 1_000_000;
    expect(isSubmitCoolingDown(now - 1000, now)).toBe(true);
  });

  it('allows a resubmit after the cooldown window passes', () => {
    const now = 1_000_000;
    expect(isSubmitCoolingDown(now - 60_000, now)).toBe(false);
  });
});

describe('buildContactPayload', () => {
  it('builds the payload with a subject derived from the name', () => {
    const payload = buildContactPayload({
      name: 'Radheshyam',
      email: 'me@example.com',
      message: 'Hello there',
    });

    expect(payload).toEqual({
      name: 'Radheshyam',
      email: 'me@example.com',
      message: 'Hello there',
      _subject: 'New portfolio contact from Radheshyam',
    });
  });
});
