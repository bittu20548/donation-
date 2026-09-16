const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  uploadProof,
  getWinner,
  approve,
  reject,
  markPaid
} = require("../controllers/winnerProofController");

const {
  authMiddleware,
  adminOnly
} = require("../middleware/authMiddleware");


// ============================================
// MULTER CONFIGURATION
// ============================================

const upload = multer({
  dest: "uploads/winner-proofs/"
});


// ============================================
// ALL ROUTES REQUIRE LOGIN
// ============================================

router.use(authMiddleware);


// ============================================
// USER - UPLOAD WINNER PROOF
// POST /api/winner-proofs/:winnerId
// ============================================

router.post(
  "/:winnerId",
  upload.single("proof"),
  uploadProof
);


// ============================================
// ADMIN - GET WINNER
// GET /api/winner-proofs/:winnerId
// ============================================

router.get(
  "/:winnerId",
  adminOnly,
  getWinner
);


// ============================================
// ADMIN - APPROVE WINNER
// PATCH /api/winner-proofs/:winnerId/approve
// ============================================

router.patch(
  "/:winnerId/approve",
  adminOnly,
  approve
);


// ============================================
// ADMIN - REJECT WINNER
// PATCH /api/winner-proofs/:winnerId/reject
// ============================================

router.patch(
  "/:winnerId/reject",
  adminOnly,
  reject
);


// ============================================
// ADMIN - MARK WINNER PAID
// PATCH /api/winner-proofs/:winnerId/paid
// ============================================

router.patch(
  "/:winnerId/paid",
  adminOnly,
  markPaid
);


module.exports = router;