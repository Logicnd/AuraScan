import crypto from 'crypto';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const fromAddress = process.env.EMAIL_FROM || 'AuraScan Support <support@aurascan.lol>';
const replyToAddress = process.env.EMAIL_REPLY_TO || 'support@aurascan.lol';
const resendApiKey = process.env.RESEND_API_KEY;

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  category?: string;
};

function signResetLink(token: string) {
  const url = new URL('/auth/reset', appUrl);
  url.searchParams.set('token', token);
  return url.toString();
}

export function buildResetEmail(token: string) {
  const resetUrl = signResetLink(token);
  const subject = 'Reset your AuraScan password';
  const preview = 'Use this link to choose a new password. Expires in 30 minutes.';

  const html = `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#0b1021; color:#e9ecf5; padding:32px">
      <div style="max-width:520px;margin:auto">
        <p style="text-transform:uppercase; letter-spacing:0.2em; color:#9fb1ff; font-size:12px; margin:0 0 12px 0">AuraScan</p>
        <h1 style="font-size:24px; margin:0 0 12px 0">Reset your password</h1>
        <p style="color:#c7d2ff; margin:0 0 16px 0">${preview}</p>
        <p style="margin:0 0 20px 0">
          <a href="${resetUrl}" style="display:inline-block; background:#7cf5ff; color:#0b1021; padding:12px 18px; border-radius:10px; font-weight:700; text-decoration:none">
            Choose a new password
          </a>
        </p>
        <p style="color:#99a3c7; font-size:13px; margin:0 0 8px 0">This link expires in 30 minutes. If you did not request it, you can ignore this email.</p>
        <p style="color:#99a3c7; font-size:13px; margin:0">Need help? Reply to this email and the team will take a look.</p>
      </div>
    </div>
  `;

  const text = [
    subject,
    '',
    preview,
    resetUrl,
    '',
    'This link expires in 30 minutes. If you did not request it, you can ignore this email.',
  ].join('\n');

  return { subject, html, text };
}

export async function sendEmail(payload: EmailPayload) {
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not set. Add it to your environment to send mail.');
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: replyToAddress,
      category: payload.category ?? 'transactional',
    }),
  });

  if (!res.ok) {
    const details = await res.text().catch(() => '');
    throw new Error(`Failed to send email (${res.status}): ${details}`);
  }

  return res.json();
}

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
