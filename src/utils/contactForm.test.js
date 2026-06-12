import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactForm,
  MAXIMUM_NAME_LENGTH,
  MAXIMUM_EMAIL_LENGTH,
  MAXIMUM_MESSAGE_LENGTH
} from './contactForm.js';

test('validateContactForm enforces maximum name length', () => {
  const formData = {
    name: 'a'.repeat(MAXIMUM_NAME_LENGTH + 1),
    email: 'test@example.com',
    message: 'This is a valid message.',
  };
  const result = validateContactForm(formData);
  assert.equal(result.errorMessage, `Please enter a name no longer than ${MAXIMUM_NAME_LENGTH} characters.`);
});

test('validateContactForm enforces maximum email length', () => {
  const formData = {
    name: 'John Doe',
    email: 'a'.repeat(MAXIMUM_EMAIL_LENGTH - 10) + '@example.com',
    message: 'This is a valid message.',
  };
  const result = validateContactForm(formData);
  assert.equal(result.errorMessage, `Please enter an email address no longer than ${MAXIMUM_EMAIL_LENGTH} characters.`);
});

test('validateContactForm enforces maximum message length', () => {
  const formData = {
    name: 'John Doe',
    email: 'test@example.com',
    message: 'a'.repeat(MAXIMUM_MESSAGE_LENGTH + 1),
  };
  const result = validateContactForm(formData);
  assert.equal(result.errorMessage, `Please enter a message no longer than ${MAXIMUM_MESSAGE_LENGTH} characters.`);
});

test('validateContactForm accepts valid lengths', () => {
  const formData = {
    name: 'a'.repeat(MAXIMUM_NAME_LENGTH),
    email: 'test@example.com',
    message: 'a'.repeat(MAXIMUM_MESSAGE_LENGTH),
  };
  const result = validateContactForm(formData);
  assert.ok(result.sanitizedValues);
  assert.equal(result.errorMessage, undefined);
});
