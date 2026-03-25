export async function POST({ request }) {
  try {
    const rawBody = await request.text();
    const event = JSON.parse(rawBody);

    console.log('✅ Webhook Event Received:', event.id);

    // Filter events (Omise sends various types)
    if (event.key === 'charge.complete') {
      const charge = event.data;
      if (charge.status === 'successful') {
        console.log('💰 Payment successful for charge:', charge.id);
        // Integrate order completion logic here (e.g. database update, email)
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
