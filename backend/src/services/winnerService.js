const supabase = require("../config/supabase");


// =========================================
// GET PUBLISHED DRAW
// =========================================

async function getPublishedDraw(drawId) {
  const {
    data: draw,
    error
  } = await supabase
    .from("draws")
    .select("*")
    .eq("id", drawId)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(
      "Get published draw error:",
      error
    );

    throw new Error(
      "Unable to fetch published draw"
    );
  }

  if (!draw) {
    throw new Error(
      "Published draw not found"
    );
  }

  return draw;
}


// =========================================
// GET ACTIVE SUBSCRIBERS
// =========================================

async function getActiveSubscribers() {
  const {
    data: subscriptions,
    error
  } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("status", "active");

  if (error) {
    console.error(
      "Get active subscribers error:",
      error
    );

    throw new Error(
      "Unable to fetch active subscribers"
    );
  }

  return subscriptions || [];
}


// =========================================
// GET USER SCORES
// =========================================

async function getUserScores(userId) {
  const {
    data: scores,
    error
  } = await supabase
    .from("scores")
    .select("id, user_id, score")
    .eq("user_id", userId)
    .order("score_date", {
      ascending: false
    })
    .limit(5);

  if (error) {
    console.error(
      "Get user scores error:",
      error
    );

    throw new Error(
      "Unable to fetch user scores"
    );
  }

  return scores || [];
}


// =========================================
// CALCULATE MATCH
// =========================================

function calculateMatch(
  userScores,
  drawNumbers
) {
  const userNumbers =
    userScores.map(
      (item) => Number(item.score)
    );

  const winningNumbers =
    drawNumbers.map(
      (number) => Number(number)
    );

  const matchedNumbers =
    userNumbers.filter(
      (number) =>
        winningNumbers.includes(number)
    );

  return {
    matchCount:
      matchedNumbers.length,

    matchedNumbers
  };
}


// =========================================
// CHECK ALL WINNERS
// =========================================

async function findWinners(drawId) {
  const draw =
    await getPublishedDraw(
      drawId
    );

  const subscribers =
    await getActiveSubscribers();

  const winners = [];

  for (const subscription of subscribers) {
    const userId =
      subscription.user_id;

    const scores =
      await getUserScores(
        userId
      );

    if (!scores.length) {
      continue;
    }

    const result =
      calculateMatch(
        scores,
        draw.numbers
      );

    // Only 3, 4 and 5 matches are prizes
    if (
      result.matchCount >= 3
    ) {
      winners.push({
        userId,
        drawId,
        matchType:
          result.matchCount,
        matchedNumbers:
          result.matchedNumbers
      });
    }
  }

  return winners;
}


// =========================================
// SAVE WINNERS
// =========================================

async function saveWinners(
  drawId,
  winners
) {
  if (!winners.length) {
    return [];
  }

  const rows =
    winners.map(
      (winner) => ({
        draw_id:
          winner.drawId,

        user_id:
          winner.userId,

        match_type:
          winner.matchType,

        matched_numbers:
          winner.matchedNumbers,

        verification_status:
          "pending",

        payment_status:
          "pending"
      })
    );

  const {
    data,
    error
  } = await supabase
    .from("winners")
    .insert(rows)
    .select();

  if (error) {
    console.error(
      "Save winners error:",
      error
    );

    throw new Error(
      "Unable to save winners"
    );
  }

  return data || [];
}


// =========================================
// PROCESS DRAW WINNERS
// =========================================

async function processDrawWinners(
  drawId
) {
  const winners =
    await findWinners(
      drawId
    );

  const savedWinners =
    await saveWinners(
      drawId,
      winners
    );

  return {
    drawId,

    winnerCount:
      savedWinners.length,

    winners:
      savedWinners
  };
}


// =========================================
// GET WINNERS FOR DRAW
// =========================================

async function getDrawWinners(
  drawId
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
      )
    `)
    .eq("draw_id", drawId)
    .order("match_type", {
      ascending: false
    });

  if (error) {
    console.error(
      "Get draw winners error:",
      error
    );

    throw new Error(
      "Unable to fetch draw winners"
    );
  }

  return data || [];
}


// =========================================
// EXPORTS
// =========================================

module.exports = {
  getPublishedDraw,
  getActiveSubscribers,
  getUserScores,
  calculateMatch,
  findWinners,
  saveWinners,
  processDrawWinners,
  getDrawWinners
};