function stripControlCharacters(value, { preserveNewLines = false } = {}) {
  return [...String(value || '')]
    .filter((character) => {
      const code = character.codePointAt(0) || 0;

      if (code === 127 || code === 0) {
        return false;
      }

      if (code < 32) {
        return preserveNewLines && character === '\n';
      }

      return true;
    })
    .join('');
}

function cleanSingleLine(value) {
  return stripControlCharacters(value)
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanMultiline(value) {
  return stripControlCharacters(String(value || ''), { preserveNewLines: true })
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

export function sanitizeContactPayload(body) {
  return {
    name: cleanSingleLine(body?.name),
    email: cleanSingleLine(body?.email).toLowerCase(),
    message: cleanMultiline(body?.message),
  };
}

export function validateContactPayload({ name, email, message }) {
  const errors = {};

  if (!name || name.length < 2 || name.length > 80) {
    errors.name = 'Please enter a valid name between 2 and 80 characters.';
  }

  if (!email || email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!message || message.length < 10 || message.length > 2500) {
    errors.message = 'Please enter a message between 10 and 2500 characters.';
  }

  return errors;
}
