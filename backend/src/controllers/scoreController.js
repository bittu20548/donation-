const {
  getUserScores,
  addScore,
  updateScore,
  deleteScore
} = require("../services/scoreService");


// =========================================
// GET SCORES
// =========================================

async function getScores(req, res) {
  try {
    const scores = await getUserScores(
      req.user.id
    );

    return res.json({
      success: true,
      scores
    });
  } catch (error) {
    console.error("Get scores error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ADD SCORE
// =========================================

async function createScore(req, res) {
  try {
    const { score, scoreDate } = req.body;

    if (
      score === undefined ||
      scoreDate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Score and scoreDate are required"
      });
    }

    const numericScore = Number(score);

    const scores = await addScore(
      req.user.id,
      numericScore,
      scoreDate
    );

    return res.status(201).json({
      success: true,
      message: "Score added successfully",
      scores
    });
  } catch (error) {
    console.error("Create score error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// UPDATE SCORE
// =========================================

async function editScore(req, res) {
  try {
    const { id } = req.params;
    const { score, scoreDate } = req.body;

    if (
      score === undefined ||
      scoreDate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Score and scoreDate are required"
      });
    }

    const numericScore = Number(score);

    const updatedScore = await updateScore(
      req.user.id,
      id,
      numericScore,
      scoreDate
    );

    return res.json({
      success: true,
      message: "Score updated successfully",
      score: updatedScore
    });
  } catch (error) {
    console.error("Edit score error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// DELETE SCORE
// =========================================

async function removeScore(req, res) {
  try {
    const { id } = req.params;

    await deleteScore(
      req.user.id,
      id
    );

    return res.json({
      success: true,
      message: "Score deleted successfully"
    });
  } catch (error) {
    console.error("Delete score error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  getScores,
  createScore,
  editScore,
  removeScore
};