const charityService = require("../services/charityService");


// ============================================
// GET CHARITIES
// ============================================

async function getCharities(req, res) {

  try {

    const {
      search,
      category
    } = req.query;


    const charities =
      await charityService.getAllCharities({
        search,
        category,
        includeInactive: false
      });


    res.json({
      success: true,
      charities
    });

  } catch (error) {

    console.error(
      "Get charities error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch charities"
    });

  }
}


// ============================================
// GET SINGLE CHARITY
// ============================================

async function getCharity(req, res) {

  try {

    const charity =
      await charityService.getCharityById(
        req.params.id
      );


    res.json({
      success: true,
      charity
    });

  } catch (error) {

    console.error(
      "Get charity error:",
      error
    );

    res.status(404).json({
      success: false,
      message: "Charity not found"
    });

  }
}


// ============================================
// ADMIN GET CHARITIES
// ============================================

async function adminGetCharities(req, res) {

  try {

    const {
      search,
      category
    } = req.query;


    const charities =
      await charityService.getAllCharities({
        search,
        category,
        includeInactive: true
      });


    res.json({
      success: true,
      charities
    });

  } catch (error) {

    console.error(
      "Admin get charities error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch charities"
    });

  }
}


// ============================================
// ADMIN CREATE CHARITY
// ============================================

async function createCharity(req, res) {

  try {

    const charity =
      await charityService.createCharity(
        req.body
      );


    res.status(201).json({
      success: true,
      message: "Charity created successfully",
      charity
    });

  } catch (error) {

    console.error(
      "Create charity error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}


// ============================================
// ADMIN UPDATE CHARITY
// ============================================

async function updateCharity(req, res) {

  try {

    const charity =
      await charityService.updateCharity(
        req.params.id,
        req.body
      );


    res.json({
      success: true,
      message: "Charity updated successfully",
      charity
    });

  } catch (error) {

    console.error(
      "Update charity error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}


// ============================================
// ADMIN STATUS
// ============================================

async function updateCharityStatus(req, res) {

  try {

    const {
      is_active
    } = req.body;


    const charity =
      await charityService.setCharityStatus(
        req.params.id,
        Boolean(is_active)
      );


    res.json({
      success: true,
      message: "Charity status updated",
      charity
    });

  } catch (error) {

    console.error(
      "Charity status error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}


// ============================================
// ADMIN DELETE
// ============================================

async function deleteCharity(req, res) {

  try {

    const result =
      await charityService.deleteCharity(
        req.params.id
      );


    res.json({
      success: true,
      ...result
    });

  } catch (error) {

    console.error(
      "Delete charity error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}


// ============================================
// USER SELECT CHARITY
// ============================================

async function selectCharity(req, res) {

  try {

    const {
      charity_id,
      percentage
    } = req.body;


    const user =
      await charityService.selectCharity(
        req.user.id,
        charity_id,
        Number(percentage || 10)
      );


    res.json({
      success: true,
      message: "Charity selected successfully",
      user
    });

  } catch (error) {

    console.error(
      "Select charity error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}


// ============================================
// USER MY CHARITY
// ============================================

async function getMyCharity(req, res) {

  try {

    const data =
      await charityService.getUserCharity(
        req.user.id
      );


    res.json({
      success: true,
      data
    });

  } catch (error) {

    console.error(
      "My charity error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch your charity"
    });

  }
}


module.exports = {

  getCharities,
  getCharity,

  adminGetCharities,
  createCharity,
  updateCharity,
  updateCharityStatus,
  deleteCharity,

  selectCharity,
  getMyCharity

};