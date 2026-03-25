import Omise from 'omise';

const publicKey = import.meta.env.PUBLIC_OMISE_PUBLIC_KEY;
const secretKey = import.meta.env.OMISE_SECRET_KEY;

const omise = Omise({
  publicKey: publicKey,
  secretKey: secretKey,
});

export async function GET({ url }) {
  try {
    const chargeId = url.searchParams.get('id');

    if (!chargeId) {
      return new Response(JSON.stringify({ error: 'Charge ID is required' }), { status: 400 });
    }

    if (!secretKey) {
      console.error('Status check failed: OMISE_SECRET_KEY is missing');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // Retrieve the charge directly from Omise
    const charge = await omise.charges.retrieve(chargeId);
    
    // LOG IT so user can check terminals
    console.log(`Checking status for ${chargeId}: [${charge.status}] Paid: ${charge.paid}`);

    // If card payment was successful, it might already be 'successful' when retrieved.
    // The frontend needs to know if it's safe to show success.
    return new Response(JSON.stringify({ 
      id: charge.id, 
      status: charge.status, 
      paid: charge.paid,
      isSuccess: (charge.status === 'successful' || charge.paid === true)
    }), {
        status: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache' // Ensure browser doesn't cache the 'pending' status
        },
    });
  } catch (error) {
    console.error('Omise Status Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
