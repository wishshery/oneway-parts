import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { sendEmail, contactFormEmail, contactAutoReplyEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // Send to admin
    const adminEmail = contactFormEmail(data);
    await sendEmail({
      to: process.env.CONTACT_EMAIL || 'info@onewayparts.com',
      ...adminEmail,
      replyTo: data.email,
    });

    // Auto-reply to customer
    const autoReply = contactAutoReplyEmail(data.name);
    await sendEmail({ to: data.email, ...autoReply });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.issues) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
