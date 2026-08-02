const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/db');

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_verified, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role',
      [name, email, passwordHash, 'user', false, verificationToken]
    );

    // Send verification email
    const transporter = require('../config/mailer');
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    const info = await transporter.sendMail({
      from: '"Pizza Delivery" <no-reply@pizzadelivery.com>',
      to: email,
      subject: 'Verify your email address',
      text: `Please verify your email by clicking this link: ${verifyUrl}`,
      html: `<p>Please click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
    });

    console.log('Verification email sent: %s', nodemailer.getTestMessageUrl(info));

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.', user: newUser.rows[0] });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error: ' + (error.message || 'Unknown error') });
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = userResult.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if verified
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/auth/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
    if (userResult.rows.length === 0) {
      return res.status(403).json({ message: 'Invalid admin credentials or unauthorized' });
    }
    const user = userResult.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({ message: 'Admin login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set expiry (e.g., 1 hour)
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [resetTokenHash, resetTokenExpiry, email]
    );

    // Send email using Ethereal
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    const info = await transporter.sendMail({
      from: '"Pizza Delivery" <no-reply@pizzadelivery.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset. Please click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    console.log('Password reset email sent: %s', nodemailer.getTestMessageUrl(info));

    res.json({ message: 'Password reset email sent (check server logs for URL)' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;
    const { password } = req.body;

    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const userResult = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2',
      [resetTokenHash, new Date()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = userResult.rows[0];

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update user
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const userResult = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or missing verification token' });
    }

    const user = userResult.rows[0];

    await pool.query(
      'UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1',
      [user.id]
    );

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
