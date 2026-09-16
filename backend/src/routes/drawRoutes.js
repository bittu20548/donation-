const express = require("express");

const {
  createNewDraw,
  getAllDraws,
  getSingleDraw,
  publish
} = require("../controllers/drawController");

const {
  authMiddleware,
  adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================
// ALL DRAW ROUTES REQUIRE LOGIN
// ============================================

router.use(authMiddleware);


// ============================================
// VIEW DRAWS
// ============================================

// GET /api/draws

router.get(
  "/",
  getAllDraws
);


// ============================================
// GET SINGLE DRAW
// ============================================

// GET /api/draws/:id

router.get(
  "/:id",
  getSingleDraw
);


// ============================================
// ADMIN DRAW MANAGEMENT
// ============================================

// POST /api/draws

router.post(
  "/",
  adminOnly,
  createNewDraw
);


// ============================================
// PUBLISH DRAW
// ============================================

// POST /api/draws/:id/publish

router.post(
  "/:id/publish",
  adminOnly,
  publish
);


module.exports = router;