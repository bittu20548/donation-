const express = require("express");

const router = express.Router();

const {
  processWinners,
  getWinners
} = require("../controllers/winnerController");

const {
  authMiddleware,
  adminOnly
} = require("../middleware/authMiddleware");


// ============================================
// AUTHENTICATION
// ============================================

router.use(authMiddleware);


// ============================================
// GET WINNERS FOR DRAW
// GET /api/winners/draw/:drawId
// ============================================

router.get(
  "/draw/:drawId",
  adminOnly,
  getWinners
);


// ============================================
// PROCESS WINNERS
// POST /api/winners/process/:drawId
// ============================================

router.post(
  "/process/:drawId",
  adminOnly,
  processWinners
);


module.exports = router;