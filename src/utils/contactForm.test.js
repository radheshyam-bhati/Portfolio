import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContactForm } from './contactForm.js';

test('validateContactForm', async (t) => {
  await t.test('returns sanitized values for valid input', () => {
    const input = {
      name: '  John Doe  ',
      email: '  test@example.com  ',
      message: '  This is a long enough message.  '
    };
    const result = validateContactForm(input);
    assert.deepEqual(result, {
      sanitizedValues: {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'This is a long enough message.'
      }
    });
  });

  await t.test('returns error for short name', () => {
    const input = {
      name: 'J',
      email: 'test@example.com',
      message: 'This is a long enough message.'
    };
    const result = validateContactForm(input);
    assert.deepEqual(result, {
      errorMessage: 'Please enter a valid name.'
    });
  });

  await t.test('returns error for short name after trimming', () => {
    const input = {
      name: ' J ',
      email: 'test@example.com',
      message: 'This is a long enough message.'
    };
    const result = validateContactForm(input);
    assert.deepEqual(result, {
      errorMessage: 'Please enter a valid name.'
    });
  });

  await t.test('returns error for invalid email', () => {
    const input = {
      name: 'John',
      email: 'invalid-email',
      message: 'This is a long enough message.'
    };
    const result = validateContactForm(input);
    assert.deepEqual(result, {
      errorMessage: 'Please enter a valid email address.'
    });
  });

  await t.test('returns error for short message', () => {
    const input = {
      name: 'John',
      email: 'test@example.com',
      message: 'short'
    };
    const result = validateContactForm(input);
    assert.deepEqual(result, {
      errorMessage: 'Please enter a message of at least 10 characters.'
    });
  });

  await t.test('returns error for short message after trimming', () => {
    const input = {
      name: 'John',
      email: 'test@example.com',
      message: ' short '
    };
    const result = validateContactForm(input);
    assert.deepEqual(result, {
      errorMessage: 'Please enter a message of at least 10 characters.'
    });
  });
});
