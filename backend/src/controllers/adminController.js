const {
  getDashboardStats,
  getUsers,
  getSubscriptions,
  getCharities,
  getRecentUsers,
  getRecentDonations,
  getRecentWinners,
  createCharity,
  updateCharity,
  updateCharityStatus
} = require("../services/adminService");


// =========================================
// DASHBOARD STATISTICS
// =========================================

async function dashboardStats(req, res) {
  try {
    const stats =
      await getDashboardStats();

    return res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET ALL USERS
// =========================================

async function users(req, res) {
  try {
    const data =
      await getUsers();

    return res.json({
      success: true,
      count: data.length,
      users: data
    });

  } catch (error) {
    console.error(
      "Admin users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET ALL SUBSCRIPTIONS
// =========================================

async function subscriptions(req, res) {
  try {
    const data =
      await getSubscriptions();

    return res.json({
      success: true,
      count: data.length,
      subscriptions: data
    });

  } catch (error) {
    console.error(
      "Admin subscriptions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET ALL CHARITIES
// =========================================

async function charities(req, res) {
  try {
    const data =
      await getCharities();

    return res.json({
      success: true,
      count: data.length,
      charities: data
    });

  } catch (error) {
    console.error(
      "Admin charities error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET RECENT USERS
// =========================================

async function recentUsers(req, res) {
  try {
    const data =
      await getRecentUsers();

    return res.json({
      success: true,
      users: data
    });

  } catch (error) {
    console.error(
      "Recent users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET RECENT DONATIONS
// =========================================

async function recentDonations(
  req,
  res
) {
  try {
    const data =
      await getRecentDonations();

    return res.json({
      success: true,
      donations: data
    });

  } catch (error) {
    console.error(
      "Recent donations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET RECENT WINNERS
// =========================================

async function recentWinners(
  req,
  res
) {
  try {
    const data =
      await getRecentWinners();

    return res.json({
      success: true,
      winners: data
    });

  } catch (error) {
    console.error(
      "Recent winners error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// CREATE CHARITY
// =========================================

async function createCharityHandler(
  req,
  res
) {
  try {
    const {
      name,
      description,
      category,
      imageUrl,
      websiteUrl
    } = req.body;

    const charity =
      await createCharity({
        name,
        description,
        category,
        imageUrl,
        websiteUrl
      });

    return res.status(201).json({
      success: true,
      message:
        "Charity created successfully",
      charity
    });

  } catch (error) {
    console.error(
      "Create charity controller error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// UPDATE CHARITY
// =========================================

async function updateCharityHandler(
  req,
  res
) {
  try {
    const {
      id
    } = req.params;

    const {
      name,
      description,
      category,
      imageUrl,
      websiteUrl
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Charity ID is required"
      });
    }

    const charity =
      await updateCharity(
        id,
        {
          name,
          description,
          category,
          imageUrl,
          websiteUrl
        }
      );

    return res.json({
      success: true,
      message:
        "Charity updated successfully",
      charity
    });

  } catch (error) {
    console.error(
      "Update charity controller error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ACTIVATE / DEACTIVATE CHARITY
// =========================================

async function updateCharityStatusHandler(
  req,
  res
) {
  try {
    const {
      id
    } = req.params;

    const {
      isActive
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Charity ID is required"
      });
    }

    if (
      typeof isActive !==
      "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false"
      });
    }

    const charity =
      await updateCharityStatus(
        id,
        isActive
      );

    return res.json({
      success: true,
      message:
        isActive
          ? "Charity activated successfully"
          : "Charity deactivated successfully",
      charity
    });

  } catch (error) {
    console.error(
      "Update charity status controller error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// EXPORTS
// =========================================

module.exports = {
  dashboardStats,
  users,
  subscriptions,
  charities,
  recentUsers,
  recentDonations,
  recentWinners,
  createCharity:
    createCharityHandler,
  updateCharity:
    updateCharityHandler,
  updateCharityStatus:
    updateCharityStatusHandler
};