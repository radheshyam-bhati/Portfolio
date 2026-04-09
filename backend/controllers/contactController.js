import { sendContactEmail } from '../services/mailService.js';
import { createHttpError } from '../utils/httpError.js';
import {
  sanitizeContactPayload,
  validateContactPayload,
} from '../utils/contactValidation.js';

export async function submitContactForm(request, response, next) {
  try {
    const payload = sanitizeContactPayload(request.body);
    const errors = validateContactPayload(payload);

    if (Object.keys(errors).length > 0) {
      throw createHttpError(400, 'Please correct the highlighted fields.', errors);
    }

    await sendContactEmail(payload);

    response.status(200).json({
      ok: true,
      message: 'Thanks for reaching out. Your message has been sent successfully.',
    });
  } catch (error) {
    next(error);
  }
}
