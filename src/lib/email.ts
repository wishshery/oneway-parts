import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"ONEWAY Parts LLC" <${process.env.SMTP_USER || 'noreply@onewayparts.com'}>`,
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

export function orderConfirmationEmail(order: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}) {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${item.unitPrice.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return {
    subject: `Order Confirmed - ${order.orderNumber} | ONEWAY Parts`,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#333">
        <div style="background:#1e40af;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">ONEWAY Parts</h1>
        </div>
        <div style="padding:24px">
          <h2 style="color:#1e40af">Order Confirmed!</h2>
          <p>Hi ${order.customerName},</p>
          <p>Thank you for your order. We've received it and will begin processing shortly.</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <thead>
              <tr style="background:#f9fafb">
                <th style="padding:8px;text-align:left">Item</th>
                <th style="padding:8px;text-align:center">Qty</th>
                <th style="padding:8px;text-align:right">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="text-align:right;padding:8px 0">
            <p style="margin:4px 0">Subtotal: <strong>$${order.subtotal.toFixed(2)}</strong></p>
            <p style="margin:4px 0">Shipping: <strong>$${order.shippingCost.toFixed(2)}</strong></p>
            <p style="margin:4px 0">Tax: <strong>$${order.tax.toFixed(2)}</strong></p>
            <p style="margin:4px 0;font-size:18px;color:#1e40af">Total: <strong>$${order.total.toFixed(2)}</strong></p>
          </div>
          <p>We'll send you another email when your order ships. If you have any questions, reply to this email or contact us on WhatsApp.</p>
          <p>Thanks,<br>ONEWAY Parts LLC</p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#999">
          <p>ONEWAY Parts LLC • 16319 West Bellfort St Unit 12, Sugar Land, TX 77498</p>
        </div>
      </div>
    `,
  };
}

export function contactFormEmail(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
  return {
    subject: `New Contact: ${data.subject} - from ${data.name}`,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#333">
        <h2 style="color:#1e40af">New Contact Form Submission</h2>
        <table style="width:100%">
          <tr><td style="padding:4px 8px;font-weight:bold">Name:</td><td>${data.name}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold">Email:</td><td>${data.email}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold">Phone:</td><td>${data.phone || 'N/A'}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold">Subject:</td><td>${data.subject}</td></tr>
        </table>
        <h3>Message:</h3>
        <p style="background:#f9fafb;padding:16px;border-radius:8px">${data.message}</p>
      </div>
    `,
  };
}

export function contactAutoReplyEmail(name: string) {
  return {
    subject: 'We received your message - ONEWAY Parts',
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#333">
        <div style="background:#1e40af;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0">ONEWAY Parts</h1>
        </div>
        <div style="padding:24px">
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! We've received your message and our team will get back to you within 24 hours.</p>
          <p>Need immediate help? Chat with us on <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '17135551234'}" style="color:#1e40af">WhatsApp</a>.</p>
          <p>Best,<br>ONEWAY Parts LLC</p>
        </div>
      </div>
    `,
  };
}

export function lowStockAlertEmail(products: { name: string; sku: string; stock: number }[]) {
  const rows = products
    .map((p) => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${p.name}</td><td style="padding:8px">${p.sku}</td><td style="padding:8px;color:red;font-weight:bold">${p.stock}</td></tr>`)
    .join('');
  return {
    subject: `⚠️ Low Stock Alert - ${products.length} products need attention`,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif">
        <h2 style="color:#d97706">Low Stock Alert</h2>
        <p>The following products are running low:</p>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:#fef3c7"><th style="padding:8px;text-align:left">Product</th><th style="padding:8px">SKU</th><th style="padding:8px">Stock</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:16px"><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/products" style="color:#1e40af">Go to Admin Panel →</a></p>
      </div>
    `,
  };
}
