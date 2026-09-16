import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api";

function getToken() {
  return localStorage.getItem("token");
}

export default function AdminWinners() {
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState("");
  const [winners, setWinners] = useState([]);

  const [loadingDraws, setLoadingDraws] = useState(true);
  const [loadingWinners, setLoadingWinners] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function loadDraws() {
    try {
      setLoadingDraws(true);

      const response = await fetch(`${API_URL}/draws`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load draws"
        );
      }

      setDraws(data.draws || data.data || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingDraws(false);
    }
  }

  async function loadWinners(drawId) {
    if (!drawId) {
      setWinners([]);
      return;
    }

    try {
      setLoadingWinners(true);

      const response = await fetch(
        `${API_URL}/winners/draw/${drawId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load winners"
        );
      }

      setWinners(
        data.winners ||
        data.data ||
        []
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingWinners(false);
    }
  }

  useEffect(() => {
    loadDraws();
  }, []);

  useEffect(() => {
    loadWinners(selectedDraw);
  }, [selectedDraw]);

  async function processWinners() {
    if (!selectedDraw) {
      alert("Please select a draw first.");
      return;
    }

    const confirmed = window.confirm(
      "Process winners for this draw?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessing(true);

      const response = await fetch(
        `${API_URL}/winners/process/${selectedDraw}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to process winners"
        );
      }

      alert(
        data.message ||
        "Winners processed successfully."
      );

      await loadWinners(selectedDraw);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>
          <h1>Winner Management</h1>

          <p>
            Process draw winners and manage
            winner records.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={loadDraws}
        >
          Refresh
        </button>

      </div>


      {/* DRAW SELECTOR */}

      <div className="admin-card">

        <h2>Select Draw</h2>

        {loadingDraws ? (
          <div className="admin-loading">
            Loading draws...
          </div>
        ) : (

          <div className="admin-winner-controls">

            <select
              value={selectedDraw}
              onChange={(e) =>
                setSelectedDraw(e.target.value)
              }
            >

              <option value="">
                Select a draw
              </option>

              {draws.map((draw) => (

                <option
                  key={draw.id}
                  value={draw.id}
                >
                  {draw.draw_date ||
                    draw.drawDate ||
                    draw.id}
                  {" - "}
                  {draw.status || "draft"}
                </option>

              ))}

            </select>

            <button
              className="admin-primary-btn"
              onClick={processWinners}
              disabled={
                !selectedDraw ||
                processing
              }
            >
              {processing
                ? "Processing..."
                : "Process Winners"}
            </button>

          </div>

        )}

      </div>


      {/* WINNER LIST */}

      <div className="admin-card">

        <div className="admin-card-header">

          <h2>Winners</h2>

          <span>
            {winners.length} winners
          </span>

        </div>


        {!selectedDraw ? (

          <div className="admin-empty">
            Select a draw to view winners.
          </div>

        ) : loadingWinners ? (

          <div className="admin-loading">
            Loading winners...
          </div>

        ) : winners.length === 0 ? (

          <div className="admin-empty">
            No winners found for this draw.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Matches</th>
                  <th>Prize</th>
                  <th>Verification</th>
                  <th>Payment</th>
                </tr>

              </thead>

              <tbody>

                {winners.map((winner) => (

                  <tr key={winner.id}>

                    <td>
                      {winner.users?.name ||
                        winner.user?.name ||
                        winner.name ||
                        "-"}
                    </td>

                    <td>
                      {winner.users?.email ||
                        winner.user?.email ||
                        winner.email ||
                        "-"}
                    </td>

                    <td>
                      <strong>
                        {winner.match_count ??
                          winner.matches ??
                          winner.matchCount ??
                          0}
                      </strong>
                    </td>

                    <td>
                      ₹
                      {winner.prize_amount ??
                        winner.prizeAmount ??
                        0}
                    </td>

                    <td>

                      <span
                        className={`admin-status ${
                          winner.verification_status ===
                          "approved"
                            ? "active"
                            : winner.verification_status ===
                              "rejected"
                            ? "danger"
                            : "pending"
                        }`}
                      >
                        {winner.verification_status ||
                          "pending"}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`admin-status ${
                          winner.payment_status ===
                          "paid"
                            ? "active"
                            : "pending"
                        }`}
                      >
                        {winner.payment_status ||
                          "pending"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}