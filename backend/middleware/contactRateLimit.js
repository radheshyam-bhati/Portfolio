import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const max = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5);

export const contactRateLimit = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Too many messages were sent from this connection. Please wait and try again.',
  },
});
