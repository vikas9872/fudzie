import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { cartItems } = req.body;

            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const lineItems = cartItems.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.displayName,
                        images: ['https://via.placeholder.com/150'], // Common image for all products
                    },
                    unit_amount: Math.round(item.price * 100), // Convert price to cents
                },
                quantity: item.quantity,
            }));

            // Create a Stripe Checkout session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${req.headers.origin}/success`, // Redirect on success
                cancel_url: `${req.headers.origin}/cancel`, // Redirect on cancel
            });

            res.status(200).json({ id: session.id });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Handle unsupported HTTP methods
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}