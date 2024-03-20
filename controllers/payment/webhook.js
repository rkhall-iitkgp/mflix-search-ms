const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function webhook(req, res) {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];
  // const STRIPE_WEBHOOK_SECRET =
  // "whsec_0225c3824f26f499a271dc5984064117d3142e92524d68edda8e959b8eb1e25e";
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(session);
      const userId = session.metadata.userId;

      // Perform backend actions using userId
      console.log("Payment successful for user:", userId);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
module.exports = webhook;
