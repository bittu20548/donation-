const supabase = require("../config/supabase");

// =========================================
// DRAW NUMBER CONFIGURATION
// =========================================

const MIN_NUMBER = 1;
const MAX_NUMBER = 45;
const DRAW_NUMBER_COUNT = 5;


// =========================================
// GENERATE RANDOM DRAW NUMBERS
// =========================================

function generateRandomNumbers() {
  const numbers = [];

  while (
    numbers.length < DRAW_NUMBER_COUNT
  ) {
    const number =
      Math.floor(
        Math.random() *
          (MAX_NUMBER - MIN_NUMBER + 1)
      ) + MIN_NUMBER;

    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }

  return numbers.sort(
    (a, b) => a - b
  );
}


// =========================================
// GET SCORE FREQUENCY
// =========================================

async function getScoreFrequency() {
  const {
    data: scores,
    error
  } = await supabase
    .from("scores")
    .select("score");

  if (error) {
    console.error(
      "Get score frequency error:",
      error
    );

    throw new Error(
      "Unable to fetch score frequency"
    );
  }

  const frequency = {};

  for (let number = MIN_NUMBER;
       number <= MAX_NUMBER;
       number++) {
    frequency[number] = 0;
  }

  for (const item of scores || []) {
    frequency[item.score] =
      (frequency[item.score] || 0) + 1;
  }

  return frequency;
}


// =========================================
// GENERATE WEIGHTED DRAW NUMBERS
// =========================================

async function generateWeightedNumbers() {
  const frequency =
    await getScoreFrequency();

  const numbers = [];

  const pool = [];

  for (
    let number = MIN_NUMBER;
    number <= MAX_NUMBER;
    number++
  ) {
    // Every number gets a base weight
    // so numbers with zero frequency
    // can still be selected.
    const weight =
      frequency[number] + 1;

    for (
      let i = 0;
      i < weight;
      i++
    ) {
      pool.push(number);
    }
  }

  while (
    numbers.length <
    DRAW_NUMBER_COUNT
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          pool.length
      );

    const selectedNumber =
      pool[randomIndex];

    if (
      !numbers.includes(
        selectedNumber
      )
    ) {
      numbers.push(
        selectedNumber
      );
    }
  }

  return numbers.sort(
    (a, b) => a - b
  );
}


// =========================================
// CREATE DRAW
// =========================================

async function createDraw({
  drawDate,
  generationMethod = "random"
}) {
  if (!drawDate) {
    throw new Error(
      "Draw date is required"
    );
  }

  if (
    !["random", "weighted"].includes(
      generationMethod
    )
  ) {
    throw new Error(
      "Generation method must be random or weighted"
    );
  }

  // Check if draw already exists
  const {
    data: existingDraw,
    error: existingError
  } = await supabase
    .from("draws")
    .select("id")
    .eq("draw_date", drawDate)
    .maybeSingle();

  if (existingError) {
    console.error(
      "Existing draw check error:",
      existingError
    );

    throw new Error(
      "Unable to check existing draw"
    );
  }

  if (existingDraw) {
    throw new Error(
      "A draw already exists for this date"
    );
  }

  // Generate numbers
  let numbers;

  if (
    generationMethod ===
    "weighted"
  ) {
    numbers =
      await generateWeightedNumbers();
  } else {
    numbers =
      generateRandomNumbers();
  }

  // Insert draw
  const {
    data: draw,
    error
  } = await supabase
    .from("draws")
    .insert({
      draw_date: drawDate,
      numbers: numbers,
      generation_method:
        generationMethod,
      status: "draft"
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Create draw error:",
      error
    );

    throw new Error(
      "Unable to create draw"
    );
  }

  return draw;
}


// =========================================
// GET DRAWS
// =========================================

async function getDraws() {
  const {
    data,
    error
  } = await supabase
    .from("draws")
    .select("*")
    .order("draw_date", {
      ascending: false
    });

  if (error) {
    console.error(
      "Get draws error:",
      error
    );

    throw new Error(
      "Unable to fetch draws"
    );
  }

  return data || [];
}


// =========================================
// GET DRAW BY ID
// =========================================

async function getDrawById(
  drawId
) {
  const {
    data: draw,
    error
  } = await supabase
    .from("draws")
    .select("*")
    .eq("id", drawId)
    .maybeSingle();

  if (error) {
    console.error(
      "Get draw error:",
      error
    );

    throw new Error(
      "Unable to fetch draw"
    );
  }

  if (!draw) {
    throw new Error(
      "Draw not found"
    );
  }

  return draw;
}


// =========================================
// PUBLISH DRAW
// =========================================

async function publishDraw(
  drawId
) {
  const draw =
    await getDrawById(
      drawId
    );

  if (
    draw.status ===
    "published"
  ) {
    throw new Error(
      "Draw is already published"
    );
  }

  const {
    data: publishedDraw,
    error
  } = await supabase
    .from("draws")
    .update({
      status: "published",
      published_at:
        new Date().toISOString(),
      updated_at:
        new Date().toISOString()
    })
    .eq("id", drawId)
    .select()
    .single();

  if (error) {
    console.error(
      "Publish draw error:",
      error
    );

    throw new Error(
      "Unable to publish draw"
    );
  }

  return publishedDraw;
}


// =========================================
// EXPORTS
// =========================================

module.exports = {
  generateRandomNumbers,
  generateWeightedNumbers,
  createDraw,
  getDraws,
  getDrawById,
  publishDraw
};