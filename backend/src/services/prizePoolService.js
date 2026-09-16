const supabase = require("../config/supabase");


// =========================================
// PRIZE PERCENTAGES
// =========================================

const PRIZE_PERCENTAGES = {
  5: 40,
  4: 35,
  3: 25
};


// =========================================
// GET ACTIVE SUBSCRIBER COUNT
// =========================================

async function getActiveSubscriberCount() {
  const {
    count,
    error
  } = await supabase
    .from("subscriptions")
    .select("id", {
      count: "exact",
      head: true
    })
    .eq("status", "active");

  if (error) {
    console.error(
      "Active subscriber count error:",
      error
    );

    throw new Error(
      "Unable to count active subscribers"
    );
  }

  return count || 0;
}


// =========================================
// CALCULATE PRIZE POOL
// =========================================

async function calculatePrizePool(
  subscriptionPrice
) {
  if (
    !subscriptionPrice ||
    Number(subscriptionPrice) <= 0
  ) {
    throw new Error(
      "Subscription price must be greater than zero"
    );
  }

  const activeSubscribers =
    await getActiveSubscriberCount();

  const totalPool =
    activeSubscribers *
    Number(subscriptionPrice);

  const fiveNumberPrize =
    totalPool * 0.40;

  const fourNumberPrize =
    totalPool * 0.35;

  const threeNumberPrize =
    totalPool * 0.25;

  return {
    activeSubscribers,

    subscriptionPrice:
      Number(subscriptionPrice),

    totalPool,

    prizes: {
      5: fiveNumberPrize,
      4: fourNumberPrize,
      3: threeNumberPrize
    }
  };
}


// =========================================
// GET PREVIOUS 5-NUMBER ROLLOVER
// =========================================

async function getPreviousRollover(
  drawId
) {
  // Find the current draw
  const {
    data: currentDraw,
    error: currentDrawError
  } = await supabase
    .from("draws")
    .select("draw_date")
    .eq("id", drawId)
    .single();

  if (currentDrawError) {
    console.error(
      "Current draw lookup error:",
      currentDrawError
    );

    throw new Error(
      "Unable to find current draw"
    );
  }

  // Find the previous draw
  const {
    data: previousDraw,
    error: previousDrawError
  } = await supabase
    .from("draws")
    .select("id, draw_date")
    .lt(
      "draw_date",
      currentDraw.draw_date
    )
    .order("draw_date", {
      ascending: false
    })
    .limit(1)
    .maybeSingle();

  if (previousDrawError) {
    console.error(
      "Previous draw lookup error:",
      previousDrawError
    );

    throw new Error(
      "Unable to find previous draw"
    );
  }

  // No previous draw
  if (!previousDraw) {
    return 0;
  }

  // Get previous 5-number prize pool
  const {
    data: previousPrizePool,
    error: prizeError
  } = await supabase
    .from("prize_pools")
    .select(
      "amount, rollover_amount"
    )
    .eq(
      "draw_id",
      previousDraw.id
    )
    .eq(
      "match_type",
      5
    )
    .maybeSingle();

  if (prizeError) {
    console.error(
      "Previous prize pool error:",
      prizeError
    );

    throw new Error(
      "Unable to fetch previous prize pool"
    );
  }

  if (!previousPrizePool) {
    return 0;
  }

  return Number(
    previousPrizePool.rollover_amount || 0
  );
}


// =========================================
// CREATE PRIZE POOL
// =========================================

async function createPrizePool(
  drawId,
  subscriptionPrice
) {
  const calculation =
    await calculatePrizePool(
      subscriptionPrice
    );

  // Get jackpot rollover
  const rolloverAmount =
    await getPreviousRollover(
      drawId
    );

  const rows = [
    {
      draw_id: drawId,

      match_type: 5,

      percentage: 40,

      amount:
        calculation.prizes[5] +
        rolloverAmount,

      rollover_amount: 0
    },

    {
      draw_id: drawId,

      match_type: 4,

      percentage: 35,

      amount:
        calculation.prizes[4],

      rollover_amount: 0
    },

    {
      draw_id: drawId,

      match_type: 3,

      percentage: 25,

      amount:
        calculation.prizes[3],

      rollover_amount: 0
    }
  ];

  const {
    data,
    error
  } = await supabase
    .from("prize_pools")
    .insert(rows)
    .select();

  if (error) {
    console.error(
      "Create prize pool error:",
      error
    );

    throw new Error(
      "Unable to create prize pool"
    );
  }

  return {
    drawId,

    activeSubscribers:
      calculation.activeSubscribers,

    totalPool:
      calculation.totalPool,

    rolloverAmount,

    prizePools: data
  };
}


// =========================================
// SET 5-NUMBER ROLLOVER
// =========================================

async function setRollover(
  drawId,
  rolloverAmount
) {
  const amount =
    Number(rolloverAmount);

  if (amount < 0) {
    throw new Error(
      "Rollover amount cannot be negative"
    );
  }

  const {
    data,
    error
  } = await supabase
    .from("prize_pools")
    .update({
      rollover_amount: amount,
      updated_at:
        new Date().toISOString()
    })
    .eq("draw_id", drawId)
    .eq("match_type", 5)
    .select()
    .single();

  if (error) {
    console.error(
      "Set rollover error:",
      error
    );

    throw new Error(
      "Unable to update rollover"
    );
  }

  return data;
}


// =========================================
// GET PRIZE POOL
// =========================================

async function getPrizePool(
  drawId
) {
  const {
    data,
    error
  } = await supabase
    .from("prize_pools")
    .select("*")
    .eq("draw_id", drawId)
    .order("match_type", {
      ascending: false
    });

  if (error) {
    console.error(
      "Get prize pool error:",
      error
    );

    throw new Error(
      "Unable to fetch prize pool"
    );
  }

  return data || [];
}


// =========================================
// EXPORTS
// =========================================

module.exports = {
  PRIZE_PERCENTAGES,
  getActiveSubscriberCount,
  calculatePrizePool,
  getPreviousRollover,
  createPrizePool,
  setRollover,
  getPrizePool
};