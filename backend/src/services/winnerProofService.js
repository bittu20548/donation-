const fs = require("fs");
const path = require("path");

const supabase = require("../config/supabase");

const UPLOAD_DIR = path.join(
  process.cwd(),
  "uploads",
  "winner-proofs"
);

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, {
    recursive: true
  });
}


// =========================================
// UPLOAD WINNER PROOF
// =========================================

async function uploadWinnerProof(
  winnerId,
  userId,
  file
) {
  if (!file) {
    throw new Error(
      "Proof screenshot is required"
    );
  }

  // Make sure this winner belongs to this user
  const {
    data: winner,
    error: winnerError
  } = await supabase
    .from("winners")
    .select("*")
    .eq("id", winnerId)
    .eq("user_id", userId)
    .maybeSingle();

  if (winnerError) {
    console.error(
      "Winner lookup error:",
      winnerError
    );

    throw new Error(
      "Unable to find winner record"
    );
  }

  if (!winner) {
    throw new Error(
      "Winner record not found"
    );
  }

  if (
    winner.verification_status ===
    "approved"
  ) {
    throw new Error(
      "This winner has already been approved"
    );
  }


  // Create safe filename
  const extension =
    path.extname(file.originalname)
      .toLowerCase();

  const filename =
    `winner-${winnerId}-${Date.now()}${extension}`;

  const filePath =
    path.join(
      UPLOAD_DIR,
      filename
    );


  // Move uploaded file
  fs.renameSync(
    file.path,
    filePath
  );


  // Store relative path in database
  const proofPath =
    `/uploads/winner-proofs/${filename}`;


  const {
    data: updatedWinner,
    error: updateError
  } = await supabase
    .from("winners")
    .update({
      proof_image_url: proofPath,
      verification_status: "pending",
      updated_at:
        new Date().toISOString()
    })
    .eq("id", winnerId)
    .eq("user_id", userId)
    .select()
    .single();


  if (updateError) {
    console.error(
      "Winner proof update error:",
      updateError
    );

    // Remove uploaded file if database update fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw new Error(
      "Unable to save winner proof"
    );
  }

  return updatedWinner;
}


// =========================================
// ADMIN GET WINNER
// =========================================

async function getWinnerById(
  winnerId
) {
  const {
    data: winner,
    error
  } = await supabase
    .from("winners")
    .select(`
      *,
      users (
        id,
        name,
        email
      ),
      draws (
        id,
        draw_date,
        numbers
      )
    `)
    .eq("id", winnerId)
    .maybeSingle();

  if (error) {
    console.error(
      "Get winner error:",
      error
    );

    throw new Error(
      "Unable to fetch winner"
    );
  }

  if (!winner) {
    throw new Error(
      "Winner not found"
    );
  }

  return winner;
}


// =========================================
// ADMIN APPROVE WINNER
// =========================================

async function approveWinner(
  winnerId
) {
  const winner =
    await getWinnerById(
      winnerId
    );

  if (
    !winner.proof_image_url
  ) {
    throw new Error(
      "Winner proof has not been uploaded"
    );
  }

  if (
    winner.verification_status ===
    "approved"
  ) {
    throw new Error(
      "Winner is already approved"
    );
  }


  const {
    data: approvedWinner,
    error
  } = await supabase
    .from("winners")
    .update({
      verification_status:
        "approved",

      verified_at:
        new Date().toISOString(),

      updated_at:
        new Date().toISOString()
    })
    .eq("id", winnerId)
    .select()
    .single();


  if (error) {
    console.error(
      "Approve winner error:",
      error
    );

    throw new Error(
      "Unable to approve winner"
    );
  }

  return approvedWinner;
}


// =========================================
// ADMIN REJECT WINNER
// =========================================

async function rejectWinner(
  winnerId
) {
  const winner =
    await getWinnerById(
      winnerId
    );

  if (
    winner.verification_status ===
    "approved"
  ) {
    throw new Error(
      "An approved winner cannot be rejected"
    );
  }


  const {
    data: rejectedWinner,
    error
  } = await supabase
    .from("winners")
    .update({
      verification_status:
        "rejected",

      updated_at:
        new Date().toISOString()
    })
    .eq("id", winnerId)
    .select()
    .single();


  if (error) {
    console.error(
      "Reject winner error:",
      error
    );

    throw new Error(
      "Unable to reject winner"
    );
  }

  return rejectedWinner;
}


// =========================================
// ADMIN MARK PAYMENT PAID
// =========================================

async function markWinnerPaid(
  winnerId
) {
  const winner =
    await getWinnerById(
      winnerId
    );

  if (
    winner.verification_status !==
    "approved"
  ) {
    throw new Error(
      "Winner must be approved before payment"
    );
  }


  const {
    data: paidWinner,
    error
  } = await supabase
    .from("winners")
    .update({
      payment_status: "paid",

      paid_at:
        new Date().toISOString(),

      updated_at:
        new Date().toISOString()
    })
    .eq("id", winnerId)
    .select()
    .single();


  if (error) {
    console.error(
      "Mark payment paid error:",
      error
    );

    throw new Error(
      "Unable to mark payment as paid"
    );
  }

  return paidWinner;
}


module.exports = {
  uploadWinnerProof,
  getWinnerById,
  approveWinner,
  rejectWinner,
  markWinnerPaid
};