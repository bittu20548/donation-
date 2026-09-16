const {
  getUserSubscription
} = require("../services/subscriptionService");


// =========================================
// REQUIRE ACTIVE SUBSCRIPTION
// =========================================

async function requireActiveSubscription(
  req,
  res,
  next
) {
  try {
    // User must already be authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Get the latest subscription
    const subscription =
      await getUserSubscription(
        req.user.id
      );

    // No subscription
    if (!subscription) {
      return res.status(403).json({
        success: false,
        message:
          "An active subscription is required"
      });
    }

    // Subscription is not active
    if (subscription.status !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "Your subscription is not active"
      });
    }

    // Attach subscription to request
    req.subscription = subscription;

    next();

  } catch (error) {
    console.error(
      "Subscription middleware error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify subscription status"
    });
  }
}


module.exports = {
  requireActiveSubscription
};