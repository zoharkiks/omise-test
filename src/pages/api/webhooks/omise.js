import { Resend } from 'resend';
import { getInvoiceHTML } from '../../../utils/emailTemplates.js';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function POST({ request }) {
  try {
    const rawBody = await request.text();
    const event = JSON.parse(rawBody);

    console.log('✅ Webhook Event Received:', event.id, 'Key:', event.key);

    // Filter events: We only want when a charge is finalized as 'successful'
    if (event.key === 'charge.complete') {
      const charge = event.data;
      
      if (charge.status === 'successful') {
        console.log('💰 Payment successful for charge:', charge.id);
        
        const customerEmail = charge.metadata.shipping_email || charge.email; // Use our form email from metadata

        if (customerEmail && import.meta.env.RESEND_API_KEY) {
            console.log('📧 Sending Invoice to:', customerEmail);
            
            try {
                await resend.emails.send({
                    from: 'MK-Ultra Orders <onboarding@resend.dev>', // Replace with your verified domain in production
                    to: [customerEmail],
                    subject: `Invoice for Order #${charge.id.slice(-6).toUpperCase()}`,
                    html: getInvoiceHTML(charge),
                });
                console.log('✨ Invoice Sent Success!');
            } catch (emailErr) {
                console.error('❌ Resend Error:', emailErr.message);
            }
        } else {
            console.warn('⚠️ No customer email or Resend Key found. Skipping email.');
        }

        // Add additional logic here (e.g., notify yourself via Telegram/LINE)
      } else {
        console.log('⚠️ Payment failed for charge:', charge.id);
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
  } catch (err) {
    console.error('Webhook processing failed:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
