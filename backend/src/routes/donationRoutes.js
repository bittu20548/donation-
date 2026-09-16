const express = require("express");

const {
  create,
  getMine,
  getMineById,
  getAll,
  getStats,
  updateStatus
} = require("../controllers/donationController");

const {
  authMiddleware,
  adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =========================================
// AUTHENTICATION
// =========================================

router.use(authMiddleware);


// =========================================
// ADMIN ROUTES
// =========================================

router.get(
  "/admin/all",
  adminOnly,
  getAll
);

router.get(
  "/admin/stats",
  adminOnly,
  getStats
);

router.patch(
  "/admin/:id/status",
  adminOnly,
  updateStatus
);


// =========================================
// USER ROUTES
// =========================================

router.post(
  "/",
  create
);

router.get(
  "/",
  getMine
);

router.get(
  "/:id",
  getMineById
);


module.exports = router;