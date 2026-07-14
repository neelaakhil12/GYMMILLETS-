import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_CONFIG_PATH = path.join(__dirname, 'admin_config.json');

// Load or init admin config
function loadAdminConfig() {
  try {
    return JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, 'utf8'));
  } catch {
    return { password: 'GymAdmin@2026' };
  }
}

function saveAdminConfig(config) {
  fs.writeFileSync(ADMIN_CONFIG_PATH, JSON.stringify(config, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TDHCozKmm4gRkG',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '9myLYhYlVDlFLJpD2byi66Cl'
});


// Store OTPs in memory for verification
// key: email, value: { code, expiresAt }
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  otpStore.set(email, { code, expiresAt });

  const mailOptions = {
    from: process.env.SMTP_FROM || `"GymMillets" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your GymMillets Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #4b6b40; text-align: center;">GymMillets Verification</h2>
        <p>Hello,</p>
        <p>Use the following one-time password (OTP) to securely log in to your account on GymMillets:</p>
        <div style="font-size: 28px; font-weight: bold; background: #f4f6f3; color: #4b6b40; padding: 15px; text-align: center; border-radius: 10px; margin: 20px 0; letter-spacing: 5px; font-family: monospace;">
          ${code}
        </div>
        <p>This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p style="border-top: 1px solid #edf2f7; padding-top: 15px; font-size: 11px; color: #718096;">
          Best regards,<br/>GymMillets Team
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Nodemailer error:', error);
    res.status(500).json({ error: 'Failed to send email OTP: ' + error.message });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }

  const stored = otpStore.get(email);
  if (!stored) {
    return res.status(400).json({ error: 'No OTP requested for this email' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP code has expired' });
  }

  if (stored.code !== otp) {
    return res.status(400).json({ error: 'Invalid OTP code' });
  }

  // Success! Clear OTP
  otpStore.delete(email);
  res.json({ success: true });
});

// ─── ADMIN PASSWORD RESET (Email Link) ───────────────────────────────────────
const resetTokenStore = new Map(); // token → { expiresAt }

// Get current admin password
app.get('/api/admin/get-password', (req, res) => {
  const config = loadAdminConfig();
  res.json({ password: config.password });
});

// Send password reset link to aarunika555@gmail.com
app.post('/api/admin/forgot-password', async (req, res) => {
  const { email, siteUrl } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const normalized = email.trim().toLowerCase();
  if (normalized !== 'admin@gymmillets.com' && normalized !== 'aarunika555@gmail.com') {
    return res.status(400).json({ error: 'Invalid admin email address' });
  }

  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  resetTokenStore.set(token, { expiresAt });

  const base = (siteUrl || 'http://localhost:5173').replace(/\/$/, '');
  const resetLink = `${base}/adminlogin?reset_token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || `"GymMillets Admin" <${process.env.SMTP_USER}>`,
    to: 'aarunika555@gmail.com',
    subject: 'GymMillets Admin – Password Reset Link',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 30px; border-radius: 16px; background: #0c0d12; border: 1px solid #1e2330;">
        <h2 style="color: #4caf50; text-align: center; margin-bottom: 8px;">GymMillets Admin</h2>
        <p style="text-align:center; color:#64748b; font-size:11px; margin-bottom:28px; letter-spacing:2px; text-transform:uppercase;">Password Reset Request</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7;">Hello Admin,</p>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.7;">You requested a password reset for the GymMillets Admin Panel. Click the button below to set a new password. This link expires in <strong style="color:#f59e0b;">15 minutes</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="display:inline-block; background: linear-gradient(135deg,#5a8f5c,#4caf50); color: #fff; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 36px; border-radius: 12px; box-shadow: 0 0 24px rgba(76,175,80,0.35);">
            🔑 Reset My Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; line-height: 1.6;">If the button doesn't work, copy and paste this link in your browser:</p>
        <p style="color: #4caf50; font-size: 11px; word-break: break-all;">${resetLink}</p>
        <hr style="border-color: #1e2330; margin: 24px 0;"/>
        <p style="color: #334155; font-size: 10px; text-align: center;">If you did not request this reset, ignore this email. Your password remains unchanged.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Reset email error:', err);
    res.status(500).json({ error: 'Failed to send reset email: ' + err.message });
  }
});

// Validate a reset token (frontend calls this to check token before showing form)
app.get('/api/admin/validate-reset-token', (req, res) => {
  const { token } = req.query;
  const stored = resetTokenStore.get(token);
  if (!stored || Date.now() > stored.expiresAt) {
    return res.status(400).json({ valid: false, error: 'Reset link is invalid or has expired.' });
  }
  res.json({ valid: true });
});

// Save the new password
app.post('/api/admin/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const stored = resetTokenStore.get(token);
  if (!stored || Date.now() > stored.expiresAt) {
    return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
  }

  // Save new password
  const config = loadAdminConfig();
  config.password = newPassword;
  saveAdminConfig(config);
  resetTokenStore.delete(token);

  res.json({ success: true });
});


app.post('/api/create-razorpay-order', async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  const options = {
    amount: Math.round(amount * 100), // in paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create payment order: ' + error.message });
  }
});

app.post('/api/verify-razorpay-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing signature verification parameters' });
  }

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(sign.toString())
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    res.json({ success: true, message: 'Payment signature verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid payment signature validation' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
