import { test } from 'node:test';
import assert from 'node:assert';
import { validateContactForm } from './contactForm.js';

test('validateContactForm - valid input', () => {
  const formData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a valid message.',
  };
  const result = validateContactForm(formData);
  assert.deepStrictEqual(result.sanitizedValues, {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a valid message.',
  });
  assert.strictEqual(result.errorMessage, undefined);
});

test('validateContactForm - trims whitespace', () => {
  const formData = {
    name: '  John Doe  ',
    email: '  john@example.com  ',
    message: '  Hello, this is a valid message.  ',
  };
  const result = validateContactForm(formData);
  assert.deepStrictEqual(result.sanitizedValues, {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a valid message.',
  });
});

test('validateContactForm - invalid name (too short)', () => {
  const formData = {
    name: 'J',
    email: 'john@example.com',
    message: 'Hello, this is a valid message.',
  };
  const result = validateContactForm(formData);
  assert.strictEqual(result.errorMessage, 'Please enter a valid name.');
  assert.strictEqual(result.sanitizedValues, undefined);
});

test('validateContactForm - invalid name (whitespace only)', () => {
  const formData = {
    name: '  ',
    email: 'john@example.com',
    message: 'Hello, this is a valid message.',
  };
  const result = validateContactForm(formData);
  assert.strictEqual(result.errorMessage, 'Please enter a valid name.');
});

test('validateContactForm - invalid email format', () => {
  const formData = {
    name: 'John Doe',
    email: 'invalid-email',
    message: 'Hello, this is a valid message.',
  };
  const result = validateContactForm(formData);
  assert.strictEqual(result.errorMessage, 'Please enter a valid email address.');
});

test('validateContactForm - invalid message (too short)', () => {
  const formData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Short',
  };
  const result = validateContactForm(formData);
  assert.strictEqual(result.errorMessage, 'Please enter a message of at least 10 characters.');
});

test('validateContactForm - invalid message (whitespace only)', () => {
  const formData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: '          ',
  };
  const result = validateContactForm(formData);
  assert.strictEqual(result.errorMessage, 'Please enter a message of at least 10 characters.');
});
