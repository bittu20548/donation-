const supabase = require("../config/supabase");

// ============================================
// GET ALL CHARITIES
// ============================================

async function getAllCharities({
  search = "",
  category = "",
  includeInactive = false
} = {}) {

  let query = supabase
    .from("charities")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  // Only active charities for normal users
  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  // Category filter
  if (category) {
    query = query.eq("category", category);
  }

  // Search
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  const {
    data,
    error
  } = await query;

  if (error) {
    throw error;
  }

  return data;
}


// ============================================
// GET CHARITY BY ID
// ============================================

async function getCharityById(id) {

  const {
    data,
    error
  } = await supabase
    .from("charities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}


// ============================================
// CREATE CHARITY
// ============================================

async function createCharity(charityData) {

  const {
    name,
    description,
    category,
    image_url,
    website_url
  } = charityData;


  if (!name || !name.trim()) {
    throw new Error("Charity name is required");
  }


  const {
    data,
    error
  } = await supabase
    .from("charities")
    .insert([
      {
        name: name.trim(),
        description: description || null,
        category: category || null,
        image_url: image_url || null,
        website_url: website_url || null,
        is_active: true
      }
    ])
    .select()
    .single();


  if (error) {
    throw error;
  }


  return data;
}


// ============================================
// UPDATE CHARITY
// ============================================

async function updateCharity(id, charityData) {

  const {
    name,
    description,
    category,
    image_url,
    website_url
  } = charityData;


  const updateData = {};


  if (name !== undefined) {
    updateData.name = name.trim();
  }

  if (description !== undefined) {
    updateData.description =
      description || null;
  }

  if (category !== undefined) {
    updateData.category =
      category || null;
  }

  if (image_url !== undefined) {
    updateData.image_url =
      image_url || null;
  }

  if (website_url !== undefined) {
    updateData.website_url =
      website_url || null;
  }


  const {
    data,
    error
  } = await supabase
    .from("charities")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();


  if (error) {
    throw error;
  }


  return data;
}


// ============================================
// ACTIVATE / DEACTIVATE CHARITY
// ============================================

async function setCharityStatus(id, isActive) {

  const {
    data,
    error
  } = await supabase
    .from("charities")
    .update({
      is_active: isActive
    })
    .eq("id", id)
    .select()
    .single();


  if (error) {
    throw error;
  }


  return data;
}


// ============================================
// DELETE CHARITY
// ============================================

async function deleteCharity(id) {

  const {
    error
  } = await supabase
    .from("charities")
    .delete()
    .eq("id", id);


  if (error) {
    throw error;
  }


  return {
    message: "Charity deleted successfully"
  };
}


// ============================================
// USER SELECT CHARITY
// ============================================

async function selectCharity(
  userId,
  charityId,
  percentage = 10
) {

  if (percentage < 10 || percentage > 100) {
    throw new Error(
      "Charity percentage must be between 10 and 100"
    );
  }


  // Check charity
  const {
    data: charity,
    error: charityError
  } = await supabase
    .from("charities")
    .select("id")
    .eq("id", charityId)
    .eq("is_active", true)
    .single();


  if (charityError || !charity) {
    throw new Error(
      "Charity not found or inactive"
    );
  }


  const {
    data,
    error
  } = await supabase
    .from("users")
    .update({
      charity_id: charityId,
      charity_percentage: percentage
    })
    .eq("id", userId)
    .select(
      "id,name,email,charity_id,charity_percentage"
    )
    .single();


  if (error) {
    throw error;
  }


  return data;
}


// ============================================
// GET USER CHARITY
// ============================================

async function getUserCharity(userId) {

  const {
    data,
    error
  } = await supabase
    .from("users")
    .select(`
      id,
      charity_id,
      charity_percentage,
      charities (
        id,
        name,
        description,
        category,
        image_url,
        website_url
      )
    `)
    .eq("id", userId)
    .single();


  if (error) {
    throw error;
  }


  return data;
}


module.exports = {

  getAllCharities,
  getCharityById,

  createCharity,
  updateCharity,
  setCharityStatus,
  deleteCharity,

  selectCharity,
  getUserCharity

};