const Stripe = require("stripe");
import { User, Payment } from '../../models';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function webhook(req, res) {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];
  const STRIPE_WEBHOOK_SECRET = process.env.WEBHOOK_SECRET_KEY
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(session);
      const userId = session.metadata.userId;

      // Find the user based on userId
      const user = await User.findOne({ _id: userId });
      if (user) {
        const updatedPayment = await Payment.findOneAndUpdate(
          { userId: userId },
          {
            $set: {
              stripeCustomerId: session.customer,
              transactionId: session.payment_intent,
              paymentType: session.payment_method_types[0].toUpperCase(),
              //  expiredOn

            }
          },
          { new: true }
        );

        if (updatedPayment) {
          const updatedUser = User.findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                payments: updatedPayment._id
              }
            },
            { new: true }
          )
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
module.exports = webhook;
