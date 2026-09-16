const {
  createDraw,
  getDraws,
  getDrawById,
  publishDraw
} = require("../services/drawService");


// =========================================
// CREATE DRAW
// POST /api/draws
// ADMIN ONLY
// =========================================

async function createNewDraw(req, res) {
  try {
    const {
      drawDate,
      generationMethod
    } = req.body;

    if (!drawDate) {
      return res.status(400).json({
        success: false,
        message: "Draw date is required"
      });
    }

    const draw =
      await createDraw({
        drawDate,
        generationMethod:
          generationMethod || "random"
      });

    return res.status(201).json({
      success: true,
      message: "Draw created successfully",
      draw
    });

  } catch (error) {
    console.error(
      "Create draw error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET ALL DRAWS
// GET /api/draws
// =========================================

async function getAllDraws(req, res) {
  try {
    const draws =
      await getDraws();

    return res.json({
      success: true,
      count: draws.length,
      draws
    });

  } catch (error) {
    console.error(
      "Get draws error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET DRAW BY ID
// GET /api/draws/:id
// =========================================

async function getSingleDraw(req, res) {
  try {
    const {
      id
    } = req.params;

    const draw =
      await getDrawById(id);

    return res.json({
      success: true,
      draw
    });

  } catch (error) {
    console.error(
      "Get draw error:",
      error
    );

    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// PUBLISH DRAW
// POST /api/draws/:id/publish
// ADMIN ONLY
// =========================================

async function publish(req, res) {
  try {
    const {
      id
    } = req.params;

    const draw =
      await publishDraw(id);

    return res.json({
      success: true,
      message: "Draw published successfully",
      draw
    });

  } catch (error) {
    console.error(
      "Publish draw error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  createNewDraw,
  getAllDraws,
  getSingleDraw,
  publish
};