import { useEffect, useState } from "react";

import {
  Users,
  Search,
  Shield,
  User,
  RefreshCw
} from "lucide-react";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";


function AdminUsers() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  // ==========================================
  // LOAD USERS
  // ==========================================

  async function loadUsers() {

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
          `${API_URL}/admin/users`,
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
          "Unable to load users"
        );

      }


      setUsers(
        data.users || []
      );

    } catch (error) {

      console.error(
        "Admin users error:",
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

    loadUsers();

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers =
    users.filter((user) => {

      const searchText =
        search
          .toLowerCase()
          .trim();


      if (!searchText) {
        return true;
      }


      return (
        user.name
          ?.toLowerCase()
          .includes(searchText) ||

        user.email
          ?.toLowerCase()
          .includes(searchText) ||

        user.role
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  // ==========================================
  // DATE FORMAT
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
            Users
          </h1>


          <p>
            View and manage registered
            Digital Heroes users.
          </p>

        </div>


        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadUsers}
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

          <Search size={17} />

          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <div className="admin-result-count">

          <Users size={16} />

          {filteredUsers.length}
          {" "}
          users

        </div>

      </div>


      {/* ================================= */}
      {/* USERS TABLE */}
      {/* ================================= */}

      <div className="admin-table-card">

        {loading ? (

          <div className="admin-table-loading">

            Loading users...

          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="admin-empty">

            <Users size={35} />

            <h3>
              No users found
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "There are no registered users yet."}
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
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Charity
                  </th>

                  <th>
                    Joined
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                    >

                      {/* USER */}

                      <td>

                        <div className="admin-user-cell">

                          <div className="admin-table-avatar">

                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}

                          </div>


                          <div>

                            <strong>
                              {user.name ||
                                "Unknown User"}
                            </strong>

                            <span>
                              ID:{" "}
                              {user.id
                                ?.slice(0, 8)}
                              ...
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>

                        <span className="admin-email">

                          {user.email}

                        </span>

                      </td>


                      {/* ROLE */}

                      <td>

                        <span
                          className={
                            user.role ===
                            "admin"
                              ? "admin-role admin-role-admin"
                              : "admin-role"
                          }
                        >

                          {user.role ===
                          "admin" ? (
                            <Shield
                              size={14}
                            />
                          ) : (
                            <User
                              size={14}
                            />
                          )}

                          {user.role ||
                            "user"}

                        </span>

                      </td>


                      {/* CHARITY */}

                      <td>

                        {user.charity_id ? (

                          <span className="admin-charity-status">

                            Selected

                            {user.charity_percentage
                              ? ` · ${user.charity_percentage}%`
                              : ""}

                          </span>

                        ) : (

                          <span className="admin-muted">

                            Not selected

                          </span>

                        )}

                      </td>


                      {/* DATE */}

                      <td>

                        <span className="admin-muted">

                          {formatDate(
                            user.created_at
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


export default AdminUsers;