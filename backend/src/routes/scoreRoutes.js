const express = require("express");

const router = express.Router();

const {
  getScores,
  createScore,
  editScore,
  removeScore
} = require("../controllers/scoreController");

const {
  authMiddleware
} = require("../middleware/authMiddleware");

const {
  requireActiveSubscription
} = require("../middleware/subscriptionMiddleware");


// ============================================
// GET MY SCORES
// GET /api/scores
// ============================================

router.get(
  "/",
  authMiddleware,
  getScores
);


// ============================================
// ADD SCORE
// POST /api/scores
// ============================================

router.post(
  "/",
  authMiddleware,
  requireActiveSubscription,
  createScore
);


// ============================================
// UPDATE SCORE
// PUT /api/scores/:id
// ============================================

router.put(
  "/:id",
  authMiddleware,
  requireActiveSubscription,
  editScore
);


// ============================================
// DELETE SCORE
// DELETE /api/scores/:id
// ============================================

router.delete(
  "/:id",
  authMiddleware,
  requireActiveSubscription,
  removeScore
);


module.exports = router;