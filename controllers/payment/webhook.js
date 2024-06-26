const Stripe = require("stripe");
const { Account, Payment } = require("../../models");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function webhook(req, res) {
    const payload = req.body;
    const sig = req.headers["stripe-signature"];
    const STRIPE_WEBHOOK_SECRET = process.env.WEBHOOK_SECRET_KEY;
    try {
        const event = stripe.webhooks.constructEvent(
            payload,
            sig,
            STRIPE_WEBHOOK_SECRET,
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session.metadata.userId;
            const expiredOn = session.metadata.expiredOn;

            // Find the user based on userId
            const userPayment = await Payment.findOne({ accountId: userId }).exec();
            if (userPayment) {
                const updatedPayment = await Payment.findOneAndUpdate(
                    { accountId: userId },
                    {
                        $set: {
                            //stripeCustomerId: session.customer,
                            transactionId: session.payment_intent,
                            paymentType:
                                session.payment_method_types[0].toUpperCase(),
                            expiredOn,
                        },
                    },
                    { new: true },
                );

                if (updatedPayment) {
                    console.log(updatedPayment)
                    const updatedUser = await Account.findOneAndUpdate(
                        { _id: userId },
                        {
                            $push: {
                                payments: updatedPayment._id,
                            },
                        },
                        { new: true },
                    );

                    await Account.findOneAndUpdate(
                        { _id: userId },
                        {
                            $set: {
                                subscriptionTier: {
                                    tier: updatedPayment.tierId,
                                    bill: updatedPayment._id,
                                },
                            },
                        },
                        { new: true },
                    );
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
