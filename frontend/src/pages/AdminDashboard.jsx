import {
  Users,
  CreditCard,
  Heart,
  Trophy,
  Gift,
  IndianRupee
} from "lucide-react";

import { useEffect, useState } from "react";


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


  async function loadStats() {
    try {

      const token =
        localStorage.getItem(
          "digitalHeroesToken"
        );


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
        "Admin stats error:",
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


  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          Loading admin dashboard...
        </div>
      </div>
    );
  }


  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>

          <p className="admin-eyebrow">
            ADMINISTRATION
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage Digital Heroes,
            subscriptions, charities,
            draws and winners.
          </p>

        </div>

      </div>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* STATS */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Users size={21} />
          </div>

          <span>
            Total Users
          </span>

          <strong>
            {stats?.users || 0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CreditCard size={21} />
          </div>

          <span>
            Active Subscriptions
          </span>

          <strong>
            {stats?.activeSubscriptions || 0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Heart size={21} />
          </div>

          <span>
            Active Charities
          </span>

          <strong>
            {stats?.activeCharities || 0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Trophy size={21} />
          </div>

          <span>
            Draws
          </span>

          <strong>
            {stats?.draws || 0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Gift size={21} />
          </div>

          <span>
            Winners
          </span>

          <strong>
            {stats?.winners || 0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <IndianRupee size={21} />
          </div>

          <span>
            Completed Donations
          </span>

          <strong>
            ₹
            {stats?.completedDonationAmount ||
              0}
          </strong>

        </div>

      </div>


      {/* INFO */}

      <div className="admin-info-card">

        <div>

          <h2>
            Digital Heroes Administration
          </h2>

          <p>
            Use the navigation menu to
            manage users, subscriptions,
            charities, draws, winners and
            donations.
          </p>

        </div>

      </div>

    </div>
  );
}


export default AdminDashboard;