const {
  uploadWinnerProof,
  getWinnerById,
  approveWinner,
  rejectWinner,
  markWinnerPaid
} = require("../services/winnerProofService");


// =========================================
// USER - UPLOAD WINNER PROOF
// =========================================

async function uploadProof(req, res) {
  try {
    const {
      winnerId
    } = req.params;

    if (!winnerId) {
      return res.status(400).json({
        success: false,
        message: "Winner ID is required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload a proof screenshot"
      });
    }

    const winner =
      await uploadWinnerProof(
        winnerId,
        req.user.id,
        req.file
      );

    return res.json({
      success: true,
      message:
        "Winner proof uploaded successfully",
      winner
    });

  } catch (error) {
    console.error(
      "Upload proof error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ADMIN - GET WINNER
// =========================================

async function getWinner(req, res) {
  try {
    const {
      winnerId
    } = req.params;

    if (!winnerId) {
      return res.status(400).json({
        success: false,
        message: "Winner ID is required"
      });
    }

    const winner =
      await getWinnerById(
        winnerId
      );

    return res.json({
      success: true,
      winner
    });

  } catch (error) {
    console.error(
      "Get winner error:",
      error
    );

    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ADMIN - APPROVE WINNER
// =========================================

async function approve(req, res) {
  try {
    const {
      winnerId
    } = req.params;

    if (!winnerId) {
      return res.status(400).json({
        success: false,
        message: "Winner ID is required"
      });
    }

    const winner =
      await approveWinner(
        winnerId
      );

    return res.json({
      success: true,
      message:
        "Winner approved successfully",
      winner
    });

  } catch (error) {
    console.error(
      "Approve winner error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ADMIN - REJECT WINNER
// =========================================

async function reject(req, res) {
  try {
    const {
      winnerId
    } = req.params;

    if (!winnerId) {
      return res.status(400).json({
        success: false,
        message: "Winner ID is required"
      });
    }

    const winner =
      await rejectWinner(
        winnerId
      );

    return res.json({
      success: true,
      message:
        "Winner rejected successfully",
      winner
    });

  } catch (error) {
    console.error(
      "Reject winner error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


// =========================================
// ADMIN - MARK PAYMENT AS PAID
// =========================================

async function markPaid(req, res) {
  try {
    const {
      winnerId
    } = req.params;

    if (!winnerId) {
      return res.status(400).json({
        success: false,
        message: "Winner ID is required"
      });
    }

    const winner =
      await markWinnerPaid(
        winnerId
      );

    return res.json({
      success: true,
      message:
        "Winner payment marked as paid",
      winner
    });

  } catch (error) {
    console.error(
      "Mark winner paid error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  uploadProof,
  getWinner,
  approve,
  reject,
  markPaid
};