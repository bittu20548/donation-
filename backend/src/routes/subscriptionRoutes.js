const express = require("express");

const router = express.Router();

const {
  subscribe,
  getSubscription,
  cancel
} = require("../controllers/subscriptionController");

const {
  authMiddleware
} = require("../middleware/authMiddleware");


// ============================================
// CREATE SUBSCRIPTION
// POST /api/subscriptions
// ============================================

router.post(
  "/",
  authMiddleware,
  subscribe
);


// ============================================
// GET MY SUBSCRIPTION
// GET /api/subscriptions
// ============================================

router.get(
  "/",
  authMiddleware,
  getSubscription
);


// ============================================
// CANCEL SUBSCRIPTION
// POST /api/subscriptions/cancel
// ============================================

router.post(
  "/cancel",
  authMiddleware,
  cancel
);


module.exports = router;