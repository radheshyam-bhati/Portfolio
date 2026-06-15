import test from 'node:test';
import assert from 'node:assert';
import { validateContactForm } from './contactForm.js';

test('validateContactForm with valid data', () => {
  const result = validateContactForm({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a valid message that meets length requirements.',
  });

  assert.strictEqual(result.errorMessage, undefined);
  assert.ok(result.sanitizedValues);
});

test('validateContactForm checks minimum length', () => {
  const resultName = validateContactForm({
    name: 'J',
    email: 'john@example.com',
    message: 'This is a valid message.',
  });
  assert.strictEqual(resultName.errorMessage, 'Please enter a valid name.');

  const resultMessage = validateContactForm({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Too short',
  });
  assert.strictEqual(resultMessage.errorMessage, 'Please enter a message of at least 10 characters.');
});

test('validateContactForm checks maximum length', () => {
  const longName = 'A'.repeat(101);
  const resultName = validateContactForm({
    name: longName,
    email: 'john@example.com',
    message: 'This is a valid message.',
  });
  assert.strictEqual(resultName.errorMessage, 'Name cannot exceed 100 characters.');

  const longEmail = 'a'.repeat(245) + '@example.com';
  const resultEmail = validateContactForm({
    name: 'John Doe',
    email: longEmail,
    message: 'This is a valid message.',
  });
  assert.strictEqual(resultEmail.errorMessage, 'Email cannot exceed 254 characters.');

  const longMessage = 'A'.repeat(2001);
  const resultMessage = validateContactForm({
    name: 'John Doe',
    email: 'john@example.com',
    message: longMessage,
  });
  assert.strictEqual(resultMessage.errorMessage, 'Message cannot exceed 2000 characters.');
});
