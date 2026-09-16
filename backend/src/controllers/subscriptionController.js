const {
  createSubscription,
  getUserSubscription,
  cancelSubscription,
  PLAN_CONFIG
} = require("../services/subscriptionService");


// =========================================
// CREATE SUBSCRIPTION
// POST /api/subscriptions
// =========================================

async function subscribe(req, res) {
  try {

    const { plan } = req.body;


    if (!plan) {

      return res.status(400).json({
        success: false,
        message: "Subscription plan is required"
      });

    }


    if (!PLAN_CONFIG[plan]) {

      return res.status(400).json({
        success: false,
        message: "Plan must be monthly or yearly"
      });

    }


    const subscription =
      await createSubscription(
        req.user.id,
        plan
      );


    return res.status(201).json({
      success: true,
      message: "Subscription activated successfully",
      subscription
    });

  } catch (error) {

    console.error(
      "Subscribe error:",
      error
    );


    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
}


// =========================================
// GET SUBSCRIPTION
// GET /api/subscriptions
// =========================================

async function getSubscription(req, res) {

  try {

    const subscription =
      await getUserSubscription(
        req.user.id
      );


    return res.json({
      success: true,
      subscription
    });

  } catch (error) {

    console.error(
      "Get subscription error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
}


// =========================================
// CANCEL SUBSCRIPTION
// POST /api/subscriptions/cancel
// =========================================

async function cancel(req, res) {

  try {

    const subscription =
      await cancelSubscription(
        req.user.id
      );


    return res.json({
      success: true,
      message: "Subscription cancelled successfully",
      subscription
    });

  } catch (error) {

    console.error(
      "Cancel subscription error:",
      error
    );


    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
}


// =========================================
// EXPORTS
// =========================================

module.exports = {
  subscribe,
  getSubscription,
  cancel
};