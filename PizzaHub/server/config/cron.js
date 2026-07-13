const cron = require('node-cron');
const pool = require('./db');
const transporter = require('./mailer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const checkLowStock = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM inventory WHERE stock_quantity < threshold');

    if (rows.length === 0) {
      console.log('Stock levels OK, no alert needed');
      return;
    }

    let tableRows = '';
    rows.forEach(item => {
      tableRows += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.item_type}</td>
          <td style="border: 1px solid #ddd; padding: 8px; color: red;">${item.stock_quantity}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.threshold}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <h2>Low Stock Alert</h2>
      <p>The following items are running low on stock:</p>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Type</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Current Stock</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Threshold</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    const info = await transporter.sendMail({
      from: '"Pizza Delivery System" <no-reply@pizzadelivery.com>',
      to: process.env.ADMIN_EMAIL || 'admin@pizzadelivery.com',
      subject: 'Low Stock Alert',
      html: htmlContent
    });

    console.log('Low stock alert email sent: %s', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('Error in checkLowStock cron job:', error);
  }
};

// Schedule the cron job to run every hour
cron.schedule('0 * * * *', checkLowStock);

module.exports = {
  checkLowStock
};
