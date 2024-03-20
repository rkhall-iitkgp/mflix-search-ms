// Create Checkout Session endpoint
const Stripe = require("stripe");
const { Payment, User } = require('../../models')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkout(req, res) {
  const { product, user } = req.body;

  // console.log(product, user.userId);
  try {
    // check for userId exist or not if not return
    if (!user) {
      return res.status(401).json({ error: "UnAuthorized" });
    }
    //check for subscription already if already then return


    //check if already a stripe customer if not a stripe customer then create

    let payment = await Payment.findOne({ userId: user.userId });

    if (payment == null) {
      const customer = await stripe.customers.create({
        email: user.email,
      });
      payment = await Payment.insertOne({
        userId: user.id,
        stripeCustomerId: customer.id,
        tierId: product.tierId,
      },
      );
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              type: product.type,
              description: product.description,
              period: product.period,
              tier: product.tier

            },
            unit_amount: product.price * 100,
          },
        },
      ],
      customer: stripeCustomer.stripeCustomerId,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: process.env.STRIPE_PAYMENT_SUCCESS_URL, // Redirect to frontend success page
      cancel_url: process.env.STRIPE_PAYMENT_CANCEL_URL, // Redirect to frontend cancel page
      metadata: {
        userId: user.userId, // Include the user ID as metadata
      },
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
module.exports = checkout;
