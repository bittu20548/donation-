import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import MyScores from "./pages/MyScores";
import MyCharity from "./pages/MyCharity";
import Subscription from "./pages/Subscription";
import Winnings from "./pages/Winnings";

import AdminLayout from "./layouts/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminCharities from "./pages/admin/AdminCharities";
import AdminDraws from "./pages/admin/AdminDraws";
import AdminWinners from "./pages/admin/AdminWinners";
import AdminDonations from "./pages/admin/AdminDonations";

import "./index.css";


// =========================================
// GET USER FROM LOCAL STORAGE
// =========================================

function getUser() {
  try {
    const user = localStorage.getItem("digitalHeroesUser");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to read user:", error);
    return null;
  }
}


// =========================================
// PROTECTED ROUTE
// =========================================

function ProtectedRoute() {
  const token = localStorage.getItem("digitalHeroesToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}


// =========================================
// ADMIN ROUTE
// =========================================

function AdminRoute() {
  const token = localStorage.getItem("digitalHeroesToken");
  const user = getUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}


// =========================================
// 404 PAGE
// =========================================

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <h1>404</h1>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link to="/">
        Go to Home
      </Link>
    </div>
  );
}


// =========================================
// APP
// =========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================= */}
        {/* PUBLIC ROUTES */}
        {/* ================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================= */}
        {/* USER PROTECTED ROUTES */}
        {/* ================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/dashboard/scores"
            element={<MyScores />}
          />

          <Route
            path="/dashboard/charity"
            element={<MyCharity />}
          />

          <Route
            path="/dashboard/subscription"
            element={<Subscription />}
          />

          <Route
            path="/dashboard/winnings"
            element={<Winnings />}
          />

        </Route>


        {/* ================================= */}
        {/* ADMIN ROUTES */}
        {/* ================================= */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="users"
              element={<AdminUsers />}
            />

            <Route
              path="subscriptions"
              element={<AdminSubscriptions />}
            />

            <Route
              path="charities"
              element={<AdminCharities />}
            />

            <Route
              path="draws"
              element={<AdminDraws />}
            />

            <Route
              path="winners"
              element={<AdminWinners />}
            />

            <Route
              path="donations"
              element={<AdminDonations />}
            />

          </Route>

        </Route>


        {/* ================================= */}
        {/* 404 */}
        {/* ================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;