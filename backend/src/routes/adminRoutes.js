const express = require("express");

const {
  dashboardStats,
  users,
  subscriptions,
  charities,
  recentUsers,
  recentDonations,
  recentWinners,
  createCharity: createCharityHandler,
  updateCharity: updateCharityHandler,
  updateCharityStatus: updateCharityStatusHandler
} = require("../controllers/adminController");

const {
  authMiddleware,
  adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =========================================
// ADMIN AUTHENTICATION
// =========================================

router.use(authMiddleware);
router.use(adminOnly);


// =========================================
// DASHBOARD
// =========================================

router.get(
  "/stats",
  dashboardStats
);


// =========================================
// USERS
// =========================================

router.get(
  "/users",
  users
);


// =========================================
// SUBSCRIPTIONS
// =========================================

router.get(
  "/subscriptions",
  subscriptions
);


// =========================================
// CHARITIES
// =========================================

// Get all charities
router.get(
  "/charities",
  charities
);

// Create charity
router.post(
  "/charities",
  createCharityHandler
);

// Update charity
router.put(
  "/charities/:id",
  updateCharityHandler
);

// Activate / deactivate charity
router.patch(
  "/charities/:id/status",
  updateCharityStatusHandler
);


// =========================================
// RECENT USERS
// =========================================

router.get(
  "/recent/users",
  recentUsers
);


// =========================================
// RECENT DONATIONS
// =========================================

router.get(
  "/recent/donations",
  recentDonations
);


// =========================================
// RECENT WINNERS
// =========================================

router.get(
  "/recent/winners",
  recentWinners
);


module.exports = router;