// Create Checkout Session endpoint
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkout(req, res) {
  const { product, userId } = req.body;
  console.log(product, userId);
  try {
    // check for userId exist or not if not return
    // if (!userId) {
    //   return res.status(401).json({ error: "UnAuthorized" });
    // }
    //check for subscription already if already then return
    // const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    //   {
    //     quantity: 1,
    //     price_data: {
    //       currency: "USD",
    //       product_data: {
    //         name: course.title,
    //         description: course.description!,
    //       },
    //       unit_amount: Math.round(course.price! * 100),
    //     }
    //   }
    // ];
    //check if already a stripe customer if not a stripe customer then create
    // let stripeCustomer = await db.stripeCustomer.findUnique({
    //   where: {
    //     userId: user.id,
    //   },
    //   select: {
    //     stripeCustomerId: true,
    //   },
    // });

    // if (!stripeCustomer) {
    //   const customer = await stripe.customers.create({
    //     email: user.emailAddresses[0].emailAddress,
    //   });

    //   stripeCustomer = await db.stripeCustomer.create({
    //     data: {
    //       userId: user.id,
    //       stripeCustomerId: customer.id,
    //     },
    //   });
    // }

    //create session for checkout payment
    // const session = await stripe.checkout.sessions.create({
    //   customer: stripeCustomer.stripeCustomerId,
    //   line_items,
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
    //   metadata: {
    //     courseId: course.id,
    //     userId: user.id,
    //   }
    // });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "http://localhost:3001/success", // Redirect to frontend success page
      cancel_url: "http://localhost:3001/cancel", // Redirect to frontend cancel page
      // metadata: {
      //   userId: userId, // Include the user ID as metadata
      // },
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
module.exports = checkout;
