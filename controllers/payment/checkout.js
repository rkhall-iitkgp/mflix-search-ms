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
    // Get the current date
    let currentDate = new Date();
    let latestDate = new Date();

    // Add 1 month to the current date
    if (product.renewalType === "MONTHLY") {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (product.renewalType === "QUATERLY") {
      currentDate.setMonth(currentDate.getMonth() + 3);
    } else if (product.renewalType === "ANNUALLY") {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }


    //check if already a stripe customer if not a stripe customer then create

    let payment = await Payment.findOne({ userId: user.userId });
    let customer
    if (payment == null) {
      customer = await stripe.customers.create({
        email: user.email,
      });
      payment = await Payment.create({
        userId: user.userId,
        stripeCustomerId: customer.id, // Use customer.id instead of customer.stripeCustomerId
        tierId: product.tierId,
        renewalType: product.renewalType,
        expiredOn: currentDate
      });
    }
    else {
      if (payment.expiredOn > latestDate) {
        console.log(payment.expiredOn, latestDate)

        return res.json({ error: "you already have a subscription plan" })
      }
      const updatedPayment = await Payment.findOneAndUpdate(
        { userId: user.userId },
        {
          $set: {
            expiredOn: currentDate,
            tierId: product.tierId,
            renewalType: product.renewalType,


          }
        },
        { new: true }
      );

      customer = payment.stripeCustomerId;
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [

        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: product.type,
              //description: product.description,
              // period: product.period,
              //  tier: product.tier

            },
            unit_amount: product.price * 100,
          },
        },
      ],
      customer: customer.id,        //customerid of stripe
      payment_method_types: ["card"],
      mode: "payment",
      success_url: process.env.STRIPE_PAYMENT_SUCCESS_URL, // Redirect to frontend success page
      cancel_url: process.env.STRIPE_PAYMENT_CANCEL_URL, // Redirect to frontend cancel page
      metadata: {
        userId: user.userId, // Include the user ID as metadata
      },
    });
    // console.log("hello", session)
    res.json({ sessionId: session.id, session });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
module.exports = checkout;

// const result = stripe.redirectToCheckout({
//   sessionId: session.session.id,
// });
