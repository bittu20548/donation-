const supabase = require("../config/supabase");


// =========================================
// GET USER SCORES
// =========================================

async function getUserScores(userId) {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .order("score_date", {
      ascending: false
    });

  if (error) {
    console.error("Get scores error:", error);
    throw new Error("Unable to fetch scores");
  }

  return data || [];
}


// =========================================
// ADD SCORE
// =========================================

async function addScore(userId, score, scoreDate) {
  // Validate score
  if (!Number.isInteger(score)) {
    throw new Error("Score must be a whole number");
  }

  if (score < 1 || score > 45) {
    throw new Error(
      "Score must be between 1 and 45"
    );
  }

  // Validate date
  if (!scoreDate) {
    throw new Error("Score date is required");
  }

  // Check duplicate date
  const { data: existingScore, error: existingError } =
    await supabase
      .from("scores")
      .select("id")
      .eq("user_id", userId)
      .eq("score_date", scoreDate)
      .maybeSingle();

  if (existingError) {
    console.error(
      "Duplicate score check error:",
      existingError
    );

    throw new Error(
      "Unable to check existing score"
    );
  }

  if (existingScore) {
    throw new Error(
      "A score already exists for this date. Edit or delete the existing score."
    );
  }


  // Insert new score
  const { data: newScore, error: insertError } =
    await supabase
      .from("scores")
      .insert({
        user_id: userId,
        score: score,
        score_date: scoreDate
      })
      .select()
      .single();

  if (insertError) {
    console.error(
      "Insert score error:",
      insertError
    );

    throw new Error("Unable to add score");
  }


  // Get all scores after insertion
  const scores = await getUserScores(userId);


  // Keep only latest 5 scores
  if (scores.length > 5) {
    const scoresToDelete = scores.slice(5);

    const idsToDelete = scoresToDelete.map(
      (item) => item.id
    );

    const { error: deleteError } =
      await supabase
        .from("scores")
        .delete()
        .in("id", idsToDelete);

    if (deleteError) {
      console.error(
        "Old score deletion error:",
        deleteError
      );

      throw new Error(
        "Score added but unable to remove old scores"
      );
    }
  }


  // Return latest 5
  const latestScores = await getUserScores(userId);

  return latestScores.slice(0, 5);
}


// =========================================
// UPDATE SCORE
// =========================================

async function updateScore(
  userId,
  scoreId,
  score,
  scoreDate
) {
  // Validate score
  if (!Number.isInteger(score)) {
    throw new Error("Score must be a whole number");
  }

  if (score < 1 || score > 45) {
    throw new Error(
      "Score must be between 1 and 45"
    );
  }

  if (!scoreDate) {
    throw new Error("Score date is required");
  }


  // Check that score belongs to user
  const { data: existingScore, error: findError } =
    await supabase
      .from("scores")
      .select("*")
      .eq("id", scoreId)
      .eq("user_id", userId)
      .maybeSingle();

  if (findError) {
    console.error(findError);
    throw new Error("Unable to find score");
  }

  if (!existingScore) {
    throw new Error("Score not found");
  }


  // Check whether another score already uses this date
  const { data: duplicateScore, error: duplicateError } =
    await supabase
      .from("scores")
      .select("id")
      .eq("user_id", userId)
      .eq("score_date", scoreDate)
      .neq("id", scoreId)
      .maybeSingle();

  if (duplicateError) {
    console.error(duplicateError);
    throw new Error(
      "Unable to check duplicate date"
    );
  }

  if (duplicateScore) {
    throw new Error(
      "Another score already exists for this date"
    );
  }


  // Update score
  const { data: updatedScore, error: updateError } =
    await supabase
      .from("scores")
      .update({
        score,
        score_date: scoreDate,
        updated_at: new Date().toISOString()
      })
      .eq("id", scoreId)
      .eq("user_id", userId)
      .select()
      .single();

  if (updateError) {
    console.error(updateError);
    throw new Error("Unable to update score");
  }

  return updatedScore;
}


// =========================================
// DELETE SCORE
// =========================================

async function deleteScore(userId, scoreId) {
  const { data: existingScore, error: findError } =
    await supabase
      .from("scores")
      .select("id")
      .eq("id", scoreId)
      .eq("user_id", userId)
      .maybeSingle();

  if (findError) {
    console.error(findError);
    throw new Error("Unable to find score");
  }

  if (!existingScore) {
    throw new Error("Score not found");
  }


  const { error: deleteError } =
    await supabase
      .from("scores")
      .delete()
      .eq("id", scoreId)
      .eq("user_id", userId);

  if (deleteError) {
    console.error(deleteError);
    throw new Error("Unable to delete score");
  }

  return true;
}


module.exports = {
  getUserScores,
  addScore,
  updateScore,
  deleteScore
};