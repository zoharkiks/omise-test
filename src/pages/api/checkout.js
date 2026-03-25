import Omise from 'omise';

const publicKey = import.meta.env.PUBLIC_OMISE_PUBLIC_KEY;
const secretKey = import.meta.env.OMISE_SECRET_KEY;

const omise = Omise({
  publicKey: publicKey,
  secretKey: secretKey,
});

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { token, source, amount, email, metadata } = body;

    console.log('Processing payment with metadata:', metadata);

    if (!token && !source) {
      return new Response(JSON.stringify({ error: 'Payment method is required' }), { status: 400 });
    }

    if (!secretKey) {
       return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // Prepare charge object
    const chargeData = {
      amount: amount,
      currency: 'thb',
      description: `Order for Keyboard from ${email}`,
      metadata: metadata, // Pass shipping info to Omise
    };

    if (token) {
        chargeData.card = token;
        chargeData.capture = true;
    } else {
        chargeData.source = source;
    }

    const charge = await omise.charges.create(chargeData);

    return new Response(JSON.stringify(charge), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Omise Charge Error:', error.message);
    return new Response(JSON.stringify({ error: error.message || 'Payment failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
