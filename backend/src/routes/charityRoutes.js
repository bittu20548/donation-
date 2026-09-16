const express = require("express");

const router = express.Router();

const {
  getCharities,
  getCharity,
  adminGetCharities,
  createCharity,
  updateCharity,
  updateCharityStatus,
  deleteCharity,
  selectCharity,
  getMyCharity
} = require("../controllers/charityController");

const {
  authMiddleware,
  adminOnly
} = require("../middleware/authMiddleware");


// ============================================
// PUBLIC
// ============================================

router.get(
  "/",
  getCharities
);


// ============================================
// ADMIN
// ============================================

router.get(
  "/admin/all",
  authMiddleware,
  adminOnly,
  adminGetCharities
);

router.post(
  "/admin",
  authMiddleware,
  adminOnly,
  createCharity
);

router.put(
  "/admin/:id",
  authMiddleware,
  adminOnly,
  updateCharity
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminOnly,
  updateCharityStatus
);

router.delete(
  "/admin/:id",
  authMiddleware,
  adminOnly,
  deleteCharity
);


// ============================================
// USER
// ============================================

router.get(
  "/user/me",
  authMiddleware,
  getMyCharity
);

router.post(
  "/user/select",
  authMiddleware,
  selectCharity
);


// ============================================
// SINGLE CHARITY
// KEEP THIS LAST
// ============================================

router.get(
  "/:id",
  getCharity
);


module.exports = router;