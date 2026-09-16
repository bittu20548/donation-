const supabase = require("../config/supabase");

const PLAN_CONFIG = {
  monthly: {
    amount: 499,
    durationMonths: 1
  },

  yearly: {
    amount: 4999,
    durationMonths: 12
  }
};


// =========================================
// CREATE SUBSCRIPTION
// =========================================

async function createSubscription(userId, plan) {
  const config = PLAN_CONFIG[plan];

  if (!config) {
    throw new Error("Invalid subscription plan");
  }

  // Check whether user already has an active subscription
  const { data: existingSubscription, error: existingError } =
    await supabase
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", userId)
      .in("status", ["active", "past_due"])
      .maybeSingle();

  if (existingError) {
    console.error("Existing subscription check error:", existingError);
    throw new Error("Unable to check existing subscription");
  }

  if (existingSubscription) {
    throw new Error(
      "User already has an active subscription"
    );
  }

  // Subscription start time
  const startedAt = new Date();

  // Calculate renewal date
  const renewalDate = new Date(startedAt);

  renewalDate.setMonth(
    renewalDate.getMonth() + config.durationMonths
  );

  // Create subscription
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      plan: plan,
      status: "active",
      amount: config.amount,
      started_at: startedAt.toISOString(),
      renewal_date: renewalDate.toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Create subscription error:", error);
    throw new Error("Unable to create subscription");
  }

  return subscription;
}


// =========================================
// GET USER SUBSCRIPTION
// =========================================

async function getUserSubscription(userId) {
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Get subscription error:", error);
    throw new Error("Unable to fetch subscription");
  }

  // User has never subscribed
  if (!subscription) {
    return null;
  }

  // Check whether active subscription has expired
  if (
    subscription.status === "active" &&
    subscription.renewal_date &&
    new Date(subscription.renewal_date) <= new Date()
  ) {
    const { data: expiredSubscription, error: updateError } =
      await supabase
        .from("subscriptions")
        .update({
          status: "expired",
          updated_at: new Date().toISOString()
        })
        .eq("id", subscription.id)
        .select()
        .single();

    if (updateError) {
      console.error(
        "Subscription expiration update error:",
        updateError
      );

      throw new Error(
        "Unable to update subscription status"
      );
    }

    return expiredSubscription;
  }

  return subscription;
}


// =========================================
// CHECK ACTIVE SUBSCRIPTION
// =========================================

async function hasActiveSubscription(userId) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return false;
  }

  return subscription.status === "active";
}


// =========================================
// CANCEL SUBSCRIPTION
// =========================================

async function cancelSubscription(userId) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    throw new Error("No subscription found");
  }

  if (subscription.status !== "active") {
    throw new Error(
      "Only an active subscription can be cancelled"
    );
  }

  const { data: cancelledSubscription, error } =
    await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", subscription.id)
      .select()
      .single();

  if (error) {
    console.error("Cancel subscription error:", error);
    throw new Error("Unable to cancel subscription");
  }

  return cancelledSubscription;
}


// =========================================
// EXPORTS
// =========================================

module.exports = {
  PLAN_CONFIG,
  createSubscription,
  getUserSubscription,
  hasActiveSubscription,
  cancelSubscription
};