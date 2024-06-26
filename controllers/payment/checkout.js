// Create Checkout Session endpoint
const Stripe = require("stripe");
const { Payment, Tier } = require("../../models");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkout(req, res) {
    try {
        const { product } = req.body;
        const user = req.user;
        // check for userId exist or not if not return

        if (!user) {
            return res.status(401).json({ error: "UnAuthorized" });
        }
        //check for subscription already if already then return
        // Get the current date
        let currentDate = new Date();
        let renewalDate = new Date();

        // Add 1 month to the current date
        if (product.renewalType === "MONTHLY") {
            renewalDate.setMonth(currentDate.getMonth() + 1);
        } else if (product.renewalType === "QUATERLY") {
            renewalDate.setMonth(currentDate.getMonth() + 3);
        } else if (product.renewalType === "ANNUALLY") {
            renewalDate.setFullYear(currentDate.getFullYear() + 1);
        }

        //check if already a stripe customer if not a stripe customer then create

        const existingPayment = await Payment.findOne({ accountId: user.id });
        const tier = await Tier.findById(product.tierId);
        let customer;
        if (!existingPayment) {
            customer = await stripe.customers.create({
                email: user.email,
            });
            await Payment.create({
                accountId: user.id,
                stripeCustomerId: customer.id, // Use customer.id instead of customer.stripeCustomerId
                tierId: product.tierId,
                renewalType: product.renewalType,
            });
        } else {
            if (existingPayment.expiredOn < currentDate) {
                return res.json({
                    error: "you already have a subscription plan",
                });
            }
            const updatedPayment = await Payment.findOneAndUpdate(
                { accountId: user.id },
                {
                    $set: {
                        tierId: product.tierId,
                        renewalType: product.renewalType,
                    },
                },
                { new: true },
            );

            customer = existingPayment.stripeCustomerId;
        }

        const success_url = `${process.env.FRONTEND_URL}/userprofile`;
        const cancel_url = `${process.env.FRONTEND_URL}/pricing?success=false`;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: tier.name,
                            description: tier.description,
                        },
                        unit_amount: tier.price * 100,
                    },
                },
            ],
            customer: customer.id, //customerid of stripe
            payment_method_types: ["card"],
            mode: "payment",
            success_url: success_url, // Redirect to frontend success page
            cancel_url: cancel_url, // Redirect to frontend cancel page
            metadata: {
                userId: user.id,
                expiredOn: renewalDate,
            },
        });
        res.json({ sessionId: session.id, session });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({
            message: "Failed to create checkout session",
            error,
        });
    }
}
module.exports = checkout;

// const result = stripe.redirectToCheckout({
//   sessionId: session.session.id,
// });
