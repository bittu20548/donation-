const supabase = require("../config/supabase");


// =========================================
// DASHBOARD OVERVIEW
// =========================================

async function getDashboardStats() {
  const [
    usersResult,
    subscriptionsResult,
    charitiesResult,
    drawsResult,
    winnersResult,
    donationsResult
  ] = await Promise.all([
    supabase
      .from("users")
      .select("id", {
        count: "exact",
        head: true
      }),

    supabase
      .from("subscriptions")
      .select("id", {
        count: "exact",
        head: true
      })
      .eq("status", "active"),

    supabase
      .from("charities")
      .select("id", {
        count: "exact",
        head: true
      })
      .eq("is_active", true),

    supabase
      .from("draws")
      .select("id", {
        count: "exact",
        head: true
      }),

    supabase
      .from("winners")
      .select("id", {
        count: "exact",
        head: true
      }),

    supabase
      .from("donations")
      .select("amount, status")
  ]);


  if (usersResult.error) {
    console.error(
      "Users statistics error:",
      usersResult.error
    );

    throw new Error(
      "Unable to fetch user statistics"
    );
  }


  if (subscriptionsResult.error) {
    console.error(
      "Subscriptions statistics error:",
      subscriptionsResult.error
    );

    throw new Error(
      "Unable to fetch subscription statistics"
    );
  }


  if (charitiesResult.error) {
    console.error(
      "Charities statistics error:",
      charitiesResult.error
    );

    throw new Error(
      "Unable to fetch charity statistics"
    );
  }


  if (drawsResult.error) {
    console.error(
      "Draws statistics error:",
      drawsResult.error
    );

    throw new Error(
      "Unable to fetch draw statistics"
    );
  }


  if (winnersResult.error) {
    console.error(
      "Winners statistics error:",
      winnersResult.error
    );

    throw new Error(
      "Unable to fetch winner statistics"
    );
  }


  if (donationsResult.error) {
    console.error(
      "Donations statistics error:",
      donationsResult.error
    );

    throw new Error(
      "Unable to fetch donation statistics"
    );
  }


  let completedDonationAmount = 0;

  for (
    const donation
    of donationsResult.data || []
  ) {
    if (
      donation.status ===
      "completed"
    ) {
      completedDonationAmount +=
        Number(donation.amount) || 0;
    }
  }


  return {
    users:
      usersResult.count || 0,

    activeSubscriptions:
      subscriptionsResult.count || 0,

    activeCharities:
      charitiesResult.count || 0,

    draws:
      drawsResult.count || 0,

    winners:
      winnersResult.count || 0,

    donations:
      donationsResult.data?.length || 0,

    completedDonationAmount
  };
}


// =========================================
// GET USERS
// =========================================

async function getUsers() {
  const {
    data,
    error
  } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      role,
      charity_id,
      charity_percentage,
      created_at
    `)
    .order("created_at", {
      ascending: false
    });


  if (error) {
    console.error(
      "Get admin users error:",
      error
    );

    throw new Error(
      "Unable to fetch users"
    );
  }


  return data || [];
}


// =========================================
// GET SUBSCRIPTIONS
// =========================================

async function getSubscriptions() {
  const {
    data,
    error
  } = await supabase
    .from("subscriptions")
    .select(`
      *,
      users (
        id,
        name,
        email
      )
    `)
    .order("created_at", {
      ascending: false
    });


  if (error) {
    console.error(
      "Get admin subscriptions error:",
      error
    );

    throw new Error(
      "Unable to fetch subscriptions"
    );
  }


  return data || [];
}


// =========================================
// GET CHARITIES
// =========================================

async function getCharities() {
  const {
    data,
    error
  } = await supabase
    .from("charities")
    .select("*")
    .order("created_at", {
      ascending: false
    });


  if (error) {
    console.error(
      "Get admin charities error:",
      error
    );

    throw new Error(
      "Unable to fetch charities"
    );
  }


  return data || [];
}


// =========================================
// GET RECENT USERS
// =========================================

async function getRecentUsers(
  limit = 10
) {
  const {
    data,
    error
  } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      role,
      created_at
    `)
    .order("created_at", {
      ascending: false
    })
    .limit(limit);


  if (error) {
    console.error(
      "Get recent users error:",
      error
    );

    throw new Error(
      "Unable to fetch recent users"
    );
  }


  return data || [];
}


// =========================================
// GET RECENT DONATIONS
// =========================================

async function getRecentDonations(
  limit = 10
) {
  const {
    data,
    error
  } = await supabase
    .from("donations")
    .select(`
      id,
      amount,
      status,
      created_at,
      users (
        id,
        name
      ),
      charities (
        id,
        name
      )
    `)
    .order("created_at", {
      ascending: false
    })
    .limit(limit);


  if (error) {
    console.error(
      "Get recent donations error:",
      error
    );

    throw new Error(
      "Unable to fetch recent donations"
    );
  }


  return data || [];
}


// =========================================
// GET RECENT WINNERS
// =========================================

async function getRecentWinners(
  limit = 10
) {
  const {
    data,
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
        draw_date
      )
    `)
    .order("created_at", {
      ascending: false
    })
    .limit(limit);


  if (error) {
    console.error(
      "Get recent winners error:",
      error
    );

    throw new Error(
      "Unable to fetch recent winners"
    );
  }


  return data || [];
}


// =========================================
// CREATE CHARITY
// =========================================

async function createCharity(
  charityData
) {
  const {
    name,
    description,
    category,
    imageUrl,
    websiteUrl
  } = charityData;


  if (
    !name ||
    !name.trim()
  ) {
    throw new Error(
      "Charity name is required"
    );
  }


  const {
    data: charity,
    error
  } = await supabase
    .from("charities")
    .insert({
      name: name.trim(),
      description:
        description || null,
      category:
        category || null,
      image_url:
        imageUrl || null,
      website_url:
        websiteUrl || null,
      is_active: true
    })
    .select()
    .single();


  if (error) {
    console.error(
      "Create charity error:",
      error
    );

    throw new Error(
      "Unable to create charity"
    );
  }


  return charity;
}


// =========================================
// UPDATE CHARITY
// =========================================

async function updateCharity(
  charityId,
  charityData
) {
  const {
    name,
    description,
    category,
    imageUrl,
    websiteUrl
  } = charityData;


  if (
    !name ||
    !name.trim()
  ) {
    throw new Error(
      "Charity name is required"
    );
  }


  const {
    data: charity,
    error
  } = await supabase
    .from("charities")
    .update({
      name: name.trim(),
      description:
        description || null,
      category:
        category || null,
      image_url:
        imageUrl || null,
      website_url:
        websiteUrl || null,
      updated_at:
        new Date().toISOString()
    })
    .eq("id", charityId)
    .select()
    .single();


  if (error) {
    console.error(
      "Update charity error:",
      error
    );

    throw new Error(
      "Unable to update charity"
    );
  }


  return charity;
}


// =========================================
// ACTIVATE / DEACTIVATE CHARITY
// =========================================

async function updateCharityStatus(
  charityId,
  isActive
) {
  if (
    typeof isActive !==
    "boolean"
  ) {
    throw new Error(
      "isActive must be true or false"
    );
  }


  const {
    data: charity,
    error
  } = await supabase
    .from("charities")
    .update({
      is_active: isActive,
      updated_at:
        new Date().toISOString()
    })
    .eq("id", charityId)
    .select()
    .single();


  if (error) {
    console.error(
      "Update charity status error:",
      error
    );

    throw new Error(
      "Unable to update charity status"
    );
  }


  return charity;
}


// =========================================
// EXPORTS
// =========================================

module.exports = {
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
};