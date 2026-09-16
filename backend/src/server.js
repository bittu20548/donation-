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
// CORS
// =========================================

const allowedOrigins = [
  "https://lighthearted-rolpoly-3c321a.netlify.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without an origin
      // such as Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS: Origin not allowed")
      );
    },

    credentials: true
  })
);


// =========================================
// BODY PARSERS
// =========================================

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