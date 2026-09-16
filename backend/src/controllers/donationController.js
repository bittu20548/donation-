const {
  createDonation,
  getUserDonations,
  getDonationById,
  updateDonationStatus,
  getAllDonations,
  getDonationStats
} = require("../services/donationService");


// =========================================
// USER - CREATE DONATION
// =========================================

async function create(req, res) {
  try {
    const {
      charityId,
      amount,
      paymentReference
    } = req.body;

    if (!charityId) {
      return res.status(400).json({
        success: false,
        message: "charityId is required"
      });
    }

    if (amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Donation amount is required"
      });
    }

    const donation =
      await createDonation(
        req.user.id,
        charityId,
        amount,
        paymentReference || null
      );

    return res.status(201).json({
      success: true,
      message:
        "Donation created successfully",
      donation
    });

  } catch (error) {
    console.error(
      "Create donation error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// USER - GET MY DONATIONS
// =========================================

async function getMine(req, res) {
  try {
    const donations =
      await getUserDonations(
        req.user.id
      );

    return res.json({
      success: true,
      count: donations.length,
      donations
    });

  } catch (error) {
    console.error(
      "Get my donations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// USER - GET MY DONATION
// =========================================

async function getMineById(req, res) {
  try {
    const {
      id
    } = req.params;

    const donation =
      await getDonationById(
        id,
        req.user.id
      );

    return res.json({
      success: true,
      donation
    });

  } catch (error) {
    console.error(
      "Get donation error:",
      error
    );

    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ADMIN - GET ALL DONATIONS
// =========================================

async function getAll(req, res) {
  try {
    const donations =
      await getAllDonations();

    return res.json({
      success: true,
      count: donations.length,
      donations
    });

  } catch (error) {
    console.error(
      "Get all donations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ADMIN - GET DONATION STATS
// =========================================

async function getStats(req, res) {
  try {
    const stats =
      await getDonationStats();

    return res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error(
      "Get donation stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ADMIN - UPDATE DONATION STATUS
// =========================================

async function updateStatus(req, res) {
  try {
    const {
      id
    } = req.params;

    const {
      status,
      paymentReference
    } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Donation status is required"
      });
    }

    const donation =
      await updateDonationStatus(
        id,
        status,
        paymentReference || null
      );

    return res.json({
      success: true,
      message:
        "Donation status updated successfully",
      donation
    });

  } catch (error) {
    console.error(
      "Update donation status error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  create,
  getMine,
  getMineById,
  getAll,
  getStats,
  updateStatus
};