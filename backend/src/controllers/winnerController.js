const {
  processDrawWinners,
  getDrawWinners
} = require("../services/winnerService");


// =========================================
// PROCESS DRAW WINNERS
// POST /api/winners/process/:drawId
// ADMIN ONLY
// =========================================

async function processWinners(req, res) {
  try {
    const {
      drawId
    } = req.params;

    if (!drawId) {
      return res.status(400).json({
        success: false,
        message: "Draw ID is required"
      });
    }

    const result =
      await processDrawWinners(
        drawId
      );

    return res.json({
      success: true,
      message:
        "Draw winners processed successfully",
      ...result
    });

  } catch (error) {
    console.error(
      "Process winners error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// GET DRAW WINNERS
// GET /api/winners/draw/:drawId
// ADMIN ONLY
// =========================================

async function getWinners(req, res) {
  try {
    const {
      drawId
    } = req.params;

    if (!drawId) {
      return res.status(400).json({
        success: false,
        message: "Draw ID is required"
      });
    }

    const winners =
      await getDrawWinners(
        drawId
      );

    return res.json({
      success: true,
      count: winners.length,
      winners
    });

  } catch (error) {
    console.error(
      "Get winners error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  processWinners,
  getWinners
};