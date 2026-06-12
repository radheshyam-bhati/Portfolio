const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MINIMUM_NAME_LENGTH = 2;
const MINIMUM_MESSAGE_LENGTH = 10;
export const MAXIMUM_NAME_LENGTH = 100;
export const MAXIMUM_EMAIL_LENGTH = 254;
export const MAXIMUM_MESSAGE_LENGTH = 2000;

export function getContactFormEndpoint(fallbackRecipientEmail) {
  const configuredEndpoint = import.meta.env.VITE_FORMSUBMIT_ENDPOINT?.trim();

  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  return `https://formsubmit.co/ajax/${encodeURIComponent(fallbackRecipientEmail.trim())}`;
}

export function validateContactForm(formData) {
  const sanitizedValues = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    message: formData.message.trim(),
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

  if (sanitizedValues.name.length > MAXIMUM_NAME_LENGTH) {
    return { errorMessage: `Please enter a name no longer than ${MAXIMUM_NAME_LENGTH} characters.` };
  }

  if (sanitizedValues.email.length > MAXIMUM_EMAIL_LENGTH) {
    return { errorMessage: `Please enter an email address no longer than ${MAXIMUM_EMAIL_LENGTH} characters.` };
  }

  if (sanitizedValues.message.length > MAXIMUM_MESSAGE_LENGTH) {
    return {
      errorMessage: `Please enter a message no longer than ${MAXIMUM_MESSAGE_LENGTH} characters.`,
    };
  }

  return { sanitizedValues };
}

export function buildContactPayload({ name, email, message }) {
  return {
    name,
    email,
    message,
    _subject: `New portfolio contact from ${name}`,
  };
}
