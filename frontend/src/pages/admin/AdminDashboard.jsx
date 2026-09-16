import { useEffect, useState } from "react";

import {
  Users,
  CreditCard,
  Heart,
  Trophy,
  Gift,
  IndianRupee
} from "lucide-react";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";


function AdminDashboard() {

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD ADMIN STATISTICS
  // ==========================================

  async function loadStats() {

    try {

      const token =
        localStorage.getItem(
          "digitalHeroesToken"
        );


      if (!token) {
        throw new Error(
          "Authentication token not found"
        );
      }


      const response =
        await fetch(
          `${API_URL}/admin/stats`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to load admin statistics"
        );

      }


      setStats(
        data.stats
      );

    } catch (error) {

      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadStats();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="admin-page">

        <div className="admin-loading">

          Loading admin dashboard...

        </div>

      </div>
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="admin-page">


      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="admin-page-header">

        <div>

          <p className="admin-eyebrow">
            ADMINISTRATION
          </p>


          <h1>
            Admin Dashboard
          </h1>


          <p>
            Overview of your Digital Heroes
            platform.
          </p>

        </div>

      </div>


      {/* ================================== */}
      {/* ERROR */}
      {/* ================================== */}

      {error && (

        <div className="admin-error">

          {error}

        </div>

      )}


      {/* ================================== */}
      {/* STATISTICS */}
      {/* ================================== */}

      <div className="admin-stats-grid">


        {/* USERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">

            <Users
              size={21}
            />

          </div>


          <span>
            Total Users
          </span>


          <strong>
            {stats?.users ?? 0}
          </strong>

        </div>


        {/* SUBSCRIPTIONS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">

            <CreditCard
              size={21}
            />

          </div>


          <span>
            Active Subscriptions
          </span>


          <strong>
            {stats?.activeSubscriptions ?? 0}
          </strong>

        </div>


        {/* CHARITIES */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">

            <Heart
              size={21}
            />

          </div>


          <span>
            Active Charities
          </span>


          <strong>
            {stats?.activeCharities ?? 0}
          </strong>

        </div>


        {/* DRAWS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">

            <Trophy
              size={21}
            />

          </div>


          <span>
            Total Draws
          </span>


          <strong>
            {stats?.draws ?? 0}
          </strong>

        </div>


        {/* WINNERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">

            <Gift
              size={21}
            />

          </div>


          <span>
            Winners
          </span>


          <strong>
            {stats?.winners ?? 0}
          </strong>

        </div>


        {/* DONATIONS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">

            <IndianRupee
              size={21}
            />

          </div>


          <span>
            Completed Donations
          </span>


          <strong>
            ₹
            {Number(
              stats?.completedDonationAmount || 0
            ).toLocaleString("en-IN")}
          </strong>

        </div>

      </div>


      {/* ================================== */}
      {/* INFORMATION */}
      {/* ================================== */}

      <div className="admin-info-card">

        <div>

          <h2>
            Digital Heroes Administration
          </h2>


          <p>
            Use the sidebar to manage users,
            subscriptions, charities, monthly
            draws, winners and donations.
          </p>

        </div>

      </div>


    </div>

  );
}


export default AdminDashboard;