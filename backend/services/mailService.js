import nodemailer from 'nodemailer';
import { createHttpError } from '../utils/httpError.js';
import { escapeHtml } from '../utils/strings.js';

let transporter;

function getMailConfig() {
  const config = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    toEmail: process.env.CONTACT_TO_EMAIL,
    fromEmail: process.env.CONTACT_FROM_EMAIL,
  };

  const missing = Object.entries(config)
    .filter(([, value]) => value === undefined || value === '')
    .map(([key]) => key);

  if (missing.length > 0) {
    throw createHttpError(
      500,
      `Missing mail configuration: ${missing.join(', ')}.`,
    );
  }

  return config;
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const config = getMailConfig();

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return transporter;
}

function createMessageHtml({ name, email, message }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 16px;">New portfolio contact submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <div style="padding: 16px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;
}

function createMessageText({ name, email, message }) {
  return [
    'New portfolio contact submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n');
}

export async function sendContactEmail(payload) {
  const config = getMailConfig();
  const mailTransport = getTransporter();

  try {
    await mailTransport.sendMail({
      from: config.fromEmail,
      to: config.toEmail,
      replyTo: payload.email,
      subject: `Portfolio inquiry from ${payload.name}`,
      text: createMessageText(payload),
      html: createMessageHtml(payload),
    });
  } catch (error) {
    console.error('Failed to send contact email', error);
    throw createHttpError(
      502,
      'The message could not be delivered right now. Please try again later.',
    );
  }
}
