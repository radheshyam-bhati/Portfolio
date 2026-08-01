const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MINIMUM_NAME_LENGTH = 2;
const MINIMUM_MESSAGE_LENGTH = 10;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const SUBMIT_COOLDOWN_MS = 30000;

// Strip C0/C1 control characters (except tab/newline which are harmless in a
// message) plus a few dangerous unicode separators bots like to smuggle in.
// eslint-disable-next-line no-control-regex -- intentionally matching control chars
const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u0085\u2028\u2029]/g;

export function getContactFormEndpoint(fallbackRecipientEmail) {
  const configuredEndpoint = import.meta.env.VITE_FORMSUBMIT_ENDPOINT?.trim();

  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  return `https://formsubmit.co/ajax/${encodeURIComponent(fallbackRecipientEmail.trim())}`;
}

/**
 * Strips control characters and NUL bytes from a raw input string.
 * Bots and script-kiddies often paste payloads containing these.
 */
function stripControlCharacters(value) {
  return value.replace(CONTROL_CHAR_PATTERN, '');
}

/**
 * Validates and sanitizes contact form input.
 *
 * Returns either:
 *   { errorMessage }        — validation failed, nothing to send
 *   { isSpam: true }        — honeypot field filled by a bot (caller should
 *                              silently pretend success, never submit)
 *   { sanitizedValues }     — clean values safe to send to the endpoint
 *
 * Hardening applied:
 *  - Honeypot check: a hidden "website" field real humans never fill.
 *  - Control-character stripping on every field.
 *  - Hard length caps (name/email/message) to block oversized payloads.
 *  - Trim on every field.
 */
export function validateContactForm(formData) {
  // Honeypot: if a bot filled the invisible field, reject silently.
  // The field name (company_site) is deliberately NOT a browser autofill
  // token (like "website"), so real users' saved profiles never trip it.
  if (typeof formData.company_site === 'string' && formData.company_site.trim().length > 0) {
    return { isSpam: true };
  }

  const sanitizedValues = {
    name: stripControlCharacters(formData.name.trim()).slice(0, MAX_NAME_LENGTH),
    email: stripControlCharacters(formData.email.trim()).slice(0, MAX_EMAIL_LENGTH),
    message: stripControlCharacters(formData.message.trim()).slice(0, MAX_MESSAGE_LENGTH),
  };

  if (sanitizedValues.name.length < MINIMUM_NAME_LENGTH) {
    return { errorMessage: 'Please enter a valid name.' };
  }

  if (!EMAIL_PATTERN.test(sanitizedValues.email)) {
    return { errorMessage: 'Please enter a valid email address.' };
  }

  if (sanitizedValues.message.length < MINIMUM_MESSAGE_LENGTH) {
    return {
      errorMessage: `Please enter a message of at least ${MINIMUM_MESSAGE_LENGTH} characters.`,
    };
  }

  return { sanitizedValues };
}

/**
 * Simple client-side rate limiter: blocks repeated submits within
 * SUBMIT_COOLDOWN_MS of the previous one.
 *
 * @param {number|null} lastSubmittedAt  epoch ms of the previous submit (or null)
 * @param {number}      [now]            epoch ms override for tests
 * @returns {boolean} true when the submit should be blocked
 */
export function isSubmitCoolingDown(lastSubmittedAt, now = Date.now()) {
  if (!lastSubmittedAt) return false;
  return now - lastSubmittedAt < SUBMIT_COOLDOWN_MS;
}

export function buildContactPayload({ name, email, message }) {
  return {
    name,
    email,
    message,
    _subject: `New portfolio contact from ${name}`,
  };
}
