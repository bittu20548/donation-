import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api";

function getToken() {
  return localStorage.getItem("token");
}

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    amount: 0,
    pending: 0,
    completed: 0
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${getToken()}`
      };

      const [donationsResponse, statsResponse] =
        await Promise.all([
          fetch(`${API_URL}/donations/admin/all`, {
            headers
          }),

          fetch(`${API_URL}/donations/admin/stats`, {
            headers
          })
        ]);

      const donationsData =
        await donationsResponse.json();

      const statsData =
        await statsResponse.json();

      if (!donationsResponse.ok) {
        throw new Error(
          donationsData.message ||
            "Failed to load donations"
        );
      }

      if (!statsResponse.ok) {
        throw new Error(
          statsData.message ||
            "Failed to load donation statistics"
        );
      }

      setDonations(
        donationsData.donations ||
        donationsData.data ||
        []
      );

      setStats(
        statsData.stats ||
        statsData.data ||
        statsData ||
        {}
      );

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (
    donationId,
    status
  ) => {

    try {
      setUpdating(donationId);

      const response = await fetch(
        `${API_URL}/donations/admin/${donationId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },

          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update donation"
        );
      }

      alert(
        `Donation marked as ${status}`
      );

      loadData();

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>

          <h1>Donation Management</h1>

          <p>
            Monitor charity donations and
            payment status.
          </p>

        </div>

        <button
          className="admin-refresh-btn"
          onClick={loadData}
        >
          Refresh
        </button>

      </div>


      {/* STATISTICS */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">

          <span>Total Donations</span>

          <strong>
            {stats.total ||
              stats.totalDonations ||
              donations.length ||
              0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>Total Amount</span>

          <strong>
            ₹
            {stats.amount ||
              stats.totalAmount ||
              stats.total_donation_amount ||
              0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>Pending</span>

          <strong>
            {stats.pending ||
              stats.pendingDonations ||
              0}
          </strong>

        </div>


        <div className="admin-stat-card">

          <span>Completed</span>

          <strong>
            {stats.completed ||
              stats.completedDonations ||
              0}
          </strong>

        </div>

      </div>


      {/* DONATION TABLE */}

      <div className="admin-card">

        <div className="admin-card-header">

          <h2>All Donations</h2>

          <span>
            {donations.length} records
          </span>

        </div>


        {loading ? (

          <div className="admin-loading">
            Loading donations...
          </div>

        ) : donations.length === 0 ? (

          <div className="admin-empty">
            No donations found.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>User</th>

                  <th>Charity</th>

                  <th>Amount</th>

                  <th>Percentage</th>

                  <th>Status</th>

                  <th>Date</th>

                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {donations.map(
                  (donation) => (

                    <tr
                      key={donation.id}
                    >

                      <td>

                        {donation.users?.name ||
                          donation.user?.name ||
                          donation.name ||
                          "-"}

                        <br />

                        <small>
                          {donation.users?.email ||
                            donation.user?.email ||
                            donation.email ||
                            ""}
                        </small>

                      </td>


                      <td>

                        {donation.charities?.name ||
                          donation.charity?.name ||
                          donation.charity_name ||
                          "-"}

                      </td>


                      <td>

                        ₹
                        {donation.amount ||
                          donation.donation_amount ||
                          0}

                      </td>


                      <td>

                        {donation.percentage ||
                          donation.charity_percentage ||
                          0}
                        %

                      </td>


                      <td>

                        <span
                          className={`admin-status ${
                            donation.status ===
                            "completed" ||
                            donation.status ===
                            "paid"
                              ? "active"
                              : donation.status ===
                                "failed"
                              ? "danger"
                              : "pending"
                          }`}
                        >
                          {donation.status ||
                            "pending"}
                        </span>

                      </td>


                      <td>

                        {donation.created_at
                          ? new Date(
                              donation.created_at
                            ).toLocaleDateString()
                          : "-"}

                      </td>


                      <td>

                        <div className="admin-action-group">

                          {donation.status !==
                            "completed" && (

                            <button
                              className="admin-small-btn"
                              disabled={
                                updating ===
                                donation.id
                              }
                              onClick={() =>
                                updateStatus(
                                  donation.id,
                                  "completed"
                                )
                              }
                            >
                              Mark Completed
                            </button>

                          )}

                          {donation.status !==
                            "failed" && (

                            <button
                              className="admin-danger-btn"
                              disabled={
                                updating ===
                                donation.id
                              }
                              onClick={() =>
                                updateStatus(
                                  donation.id,
                                  "failed"
                                )
                              }
                            >
                              Failed
                            </button>

                          )}

                        </div>

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