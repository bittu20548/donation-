import { useEffect, useState } from "react";

import {
  CreditCard,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";


function AdminSubscriptions() {

  const [subscriptions, setSubscriptions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  // ==========================================
  // LOAD SUBSCRIPTIONS
  // ==========================================

  async function loadSubscriptions() {

    setLoading(true);
    setError("");

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
          `${API_URL}/admin/subscriptions`,
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
          "Unable to load subscriptions"
        );
      }


      setSubscriptions(
        data.subscriptions || []
      );

    } catch (error) {

      console.error(
        "Admin subscriptions error:",
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

    loadSubscriptions();

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredSubscriptions =
    subscriptions.filter(
      (subscription) => {

        const searchText =
          search
            .toLowerCase()
            .trim();


        if (!searchText) {
          return true;
        }


        const userName =
          subscription.users?.name
            ?.toLowerCase() || "";


        const userEmail =
          subscription.users?.email
            ?.toLowerCase() || "";


        const plan =
          subscription.plan
            ?.toLowerCase() || "";


        const status =
          subscription.status
            ?.toLowerCase() || "";


        return (
          userName.includes(
            searchText
          ) ||

          userEmail.includes(
            searchText
          ) ||

          plan.includes(
            searchText
          ) ||

          status.includes(
            searchText
          )
        );

      }
    );


  // ==========================================
  // DATE
  // ==========================================

  function formatDate(date) {

    if (!date) {
      return "—";
    }


    return new Date(date)
      .toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

  }


  // ==========================================
  // STATUS ICON
  // ==========================================

  function StatusIcon({ status }) {

    if (status === "active") {

      return (
        <CheckCircle
          size={14}
        />
      );

    }


    if (
      status === "cancelled" ||
      status === "expired"
    ) {

      return (
        <XCircle
          size={14}
        />
      );

    }


    return (
      <Clock
        size={14}
      />
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="admin-page">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="admin-page-header">

        <div>

          <p className="admin-eyebrow">
            ADMINISTRATION
          </p>


          <h1>
            Subscriptions
          </h1>


          <p>
            View all user subscription
            records and their status.
          </p>

        </div>


        <button
          type="button"
          className="admin-refresh-button"
          onClick={
            loadSubscriptions
          }
          disabled={loading}
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "admin-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (

        <div className="admin-error">

          {error}

        </div>

      )}


      {/* ================================= */}
      {/* TOOLBAR */}
      {/* ================================= */}

      <div className="admin-toolbar">

        <div className="admin-search">

          <Search
            size={17}
          />

          <input
            type="text"
            placeholder="Search user, email, plan or status..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <div className="admin-result-count">

          <CreditCard
            size={16}
          />

          {filteredSubscriptions.length}
          {" "}
          subscriptions

        </div>

      </div>


      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div className="admin-table-card">

        {loading ? (

          <div className="admin-table-loading">

            Loading subscriptions...

          </div>

        ) : filteredSubscriptions.length === 0 ? (

          <div className="admin-empty">

            <CreditCard
              size={35}
            />

            <h3>
              No subscriptions found
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "No subscription records exist yet."}
            </p>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Plan
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Started
                  </th>

                  <th>
                    Renewal
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredSubscriptions.map(
                  (subscription) => (

                    <tr
                      key={
                        subscription.id
                      }
                    >

                      {/* USER */}

                      <td>

                        <div className="admin-user-cell">

                          <div className="admin-table-avatar">

                            {subscription
                              .users
                              ?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}

                          </div>


                          <div>

                            <strong>

                              {subscription
                                .users
                                ?.name ||
                                "Unknown User"}

                            </strong>


                            <span>

                              {subscription
                                .users
                                ?.email ||
                                "—"}

                            </span>

                          </div>

                        </div>

                      </td>


                      {/* PLAN */}

                      <td>

                        <span className="admin-plan">

                          {subscription.plan
                            ? subscription.plan
                                .charAt(0)
                                .toUpperCase() +
                              subscription.plan.slice(1)
                            : "—"}

                        </span>

                      </td>


                      {/* AMOUNT */}

                      <td>

                        <strong>

                          ₹
                          {Number(
                            subscription.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-status admin-status-${subscription.status}`}
                        >

                          <StatusIcon
                            status={
                              subscription.status
                            }
                          />

                          {subscription.status ||
                            "unknown"}

                        </span>

                      </td>


                      {/* STARTED */}

                      <td>

                        <span className="admin-muted">

                          {formatDate(
                            subscription.started_at
                          )}

                        </span>

                      </td>


                      {/* RENEWAL */}

                      <td>

                        <span className="admin-muted">

                          {formatDate(
                            subscription.renewal_date
                          )}

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );
}


export default AdminSubscriptions;