const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// =========================================
// ROUTES
// =========================================

const authRoutes =
  require("./routes/authRoutes");

const subscriptionRoutes =
  require("./routes/subscriptionRoutes");

const scoreRoutes =
  require("./routes/scoreRoutes");

const charityRoutes =
  require("./routes/charityRoutes");

const drawRoutes =
  require("./routes/drawRoutes");

const winnerRoutes =
  require("./routes/winnerRoutes");

const winnerProofRoutes =
  require("./routes/winnerProofRoutes");

const donationRoutes =
  require("./routes/donationRoutes");

const adminRoutes =
  require("./routes/adminRoutes");


// =========================================
// APP
// =========================================

const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

    credentials: true
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true
  })
);


// =========================================
// STATIC FILES
// =========================================

// Winner proof uploaded images
app.use(
  "/uploads",
  express.static("uploads")
);


// =========================================
// ROOT
// =========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Digital Heroes API is running"
  });
});


// =========================================
// HEALTH CHECK
// =========================================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "API is healthy"
    });
  }
);


// =========================================
// API ROUTES
// =========================================


// -----------------------------------------
// AUTHENTICATION
// -----------------------------------------

app.use(
  "/api/auth",
  authRoutes
);


// -----------------------------------------
// SUBSCRIPTIONS
// -----------------------------------------

app.use(
  "/api/subscriptions",
  subscriptionRoutes
);


// -----------------------------------------
// SCORES
// -----------------------------------------

app.use(
  "/api/scores",
  scoreRoutes
);


// -----------------------------------------
// CHARITIES
// -----------------------------------------

app.use(
  "/api/charities",
  charityRoutes
);


// -----------------------------------------
// DRAWS
// -----------------------------------------

app.use(
  "/api/draws",
  drawRoutes
);


// -----------------------------------------
// WINNERS
// -----------------------------------------

app.use(
  "/api/winners",
  winnerRoutes
);


// -----------------------------------------
// WINNER PROOF
// -----------------------------------------

app.use(
  "/api/winner-proofs",
  winnerProofRoutes
);


// -----------------------------------------
// DONATIONS
// -----------------------------------------

app.use(
  "/api/donations",
  donationRoutes
);


// -----------------------------------------
// ADMIN
// -----------------------------------------

app.use(
  "/api/admin",
  adminRoutes
);


// =========================================
// 404 HANDLER
// =========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "Route not found"
    });
  }
);


// =========================================
// ERROR HANDLER
// =========================================

app.use(
  (err, req, res, next) => {
    console.error(
      "Server error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error"
    });
  }
);


// =========================================
// START SERVER
// =========================================

const PORT =
  process.env.PORT || 5001;

app.listen(
  PORT,
  () => {
    console.log(
      `Digital Heroes API running on port ${PORT}`
    );
  }
);