const supabase = require("../config/supabase");


// =========================================
// CREATE DONATION
// =========================================

async function createDonation(
  userId,
  charityId,
  amount,
  paymentReference = null
) {
  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Donation amount must be greater than zero"
    );
  }


  // Check charity
  const {
    data: charity,
    error: charityError
  } = await supabase
    .from("charities")
    .select("id, name")
    .eq("id", charityId)
    .eq("is_active", true)
    .maybeSingle();

  if (charityError) {
    console.error(
      "Donation charity lookup error:",
      charityError
    );

    throw new Error(
      "Unable to check charity"
    );
  }

  if (!charity) {
    throw new Error(
      "Charity not found"
    );
  }


  // Create donation
  const {
    data: donation,
    error
  } = await supabase
    .from("donations")
    .insert({
      user_id: userId,
      charity_id: charityId,
      amount: numericAmount,
      status: "pending",
      payment_reference:
        paymentReference
    })
    .select(`
      *,
      charities (
        id,
        name
      )
    `)
    .single();


  if (error) {
    console.error(
      "Create donation error:",
      error
    );

    throw new Error(
      "Unable to create donation"
    );
  }

  return donation;
}


// =========================================
// GET USER DONATIONS
// =========================================

async function getUserDonations(
  userId
) {
  const {
    data: donations,
    error
  } = await supabase
    .from("donations")
    .select(`
      *,
      charities (
        id,
        name,
        category,
        image_url
      )
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false
    });


  if (error) {
    console.error(
      "Get user donations error:",
      error
    );

    throw new Error(
      "Unable to fetch donations"
    );
  }

  return donations || [];
}


// =========================================
// GET DONATION BY ID
// =========================================

async function getDonationById(
  donationId,
  userId = null
) {
  let query = supabase
    .from("donations")
    .select(`
      *,
      users (
        id,
        name,
        email
      ),
      charities (
        id,
        name,
        category
      )
    `)
    .eq("id", donationId);


  // If userId exists, make sure
  // the donation belongs to that user.
  if (userId) {
    query = query.eq(
      "user_id",
      userId
    );
  }


  const {
    data: donation,
    error
  } = await query.maybeSingle();


  if (error) {
    console.error(
      "Get donation error:",
      error
    );

    throw new Error(
      "Unable to fetch donation"
    );
  }

  if (!donation) {
    throw new Error(
      "Donation not found"
    );
  }

  return donation;
}


// =========================================
// UPDATE DONATION STATUS
// =========================================

async function updateDonationStatus(
  donationId,
  status,
  paymentReference = null
) {
  const allowedStatuses = [
    "pending",
    "completed",
    "failed",
    "refunded"
  ];

  if (
    !allowedStatuses.includes(
      status
    )
  ) {
    throw new Error(
      "Invalid donation status"
    );
  }


  const updateData = {
    status,
    updated_at:
      new Date().toISOString()
  };


  if (paymentReference) {
    updateData.payment_reference =
      paymentReference;
  }


  const {
    data: donation,
    error
  } = await supabase
    .from("donations")
    .update(updateData)
    .eq("id", donationId)
    .select(`
      *,
      users (
        id,
        name,
        email
      ),
      charities (
        id,
        name
      )
    `)
    .single();


  if (error) {
    console.error(
      "Update donation status error:",
      error
    );

    throw new Error(
      "Unable to update donation status"
    );
  }

  return donation;
}


// =========================================
// ADMIN - GET ALL DONATIONS
// =========================================

async function getAllDonations() {
  const {
    data: donations,
    error
  } = await supabase
    .from("donations")
    .select(`
      *,
      users (
        id,
        name,
        email
      ),
      charities (
        id,
        name,
        category
      )
    `)
    .order("created_at", {
      ascending: false
    });


  if (error) {
    console.error(
      "Get all donations error:",
      error
    );

    throw new Error(
      "Unable to fetch all donations"
    );
  }

  return donations || [];
}


// =========================================
// ADMIN - DONATION STATISTICS
// =========================================

async function getDonationStats() {
  const {
    data: donations,
    error
  } = await supabase
    .from("donations")
    .select(
      "amount, status"
    );


  if (error) {
    console.error(
      "Donation statistics error:",
      error
    );

    throw new Error(
      "Unable to calculate donation statistics"
    );
  }


  const stats = {
    totalDonations: donations.length,
    completedDonations: 0,
    pendingDonations: 0,
    failedDonations: 0,
    refundedDonations: 0,
    totalAmount: 0,
    completedAmount: 0
  };


  for (const donation of donations) {
    const amount =
      Number(donation.amount) || 0;


    switch (donation.status) {
      case "completed":
        stats.completedDonations += 1;
        stats.completedAmount += amount;
        break;

      case "pending":
        stats.pendingDonations += 1;
        break;

      case "failed":
        stats.failedDonations += 1;
        break;

      case "refunded":
        stats.refundedDonations += 1;
        break;
    }


    stats.totalAmount += amount;
  }


  return stats;
}


module.exports = {
  createDonation,
  getUserDonations,
  getDonationById,
  updateDonationStatus,
  getAllDonations,
  getDonationStats
};