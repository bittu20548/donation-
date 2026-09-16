import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api";

function getToken() {
  return localStorage.getItem("token");
}

export default function AdminDraws() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawDate, setDrawDate] = useState("");
  const [drawType, setDrawType] = useState("random");
  const [creating, setCreating] = useState(false);

  const loadDraws = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/draws`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load draws");
      }

      setDraws(data.draws || data.data || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDraws();
  }, []);

  const createDraw = async (e) => {
    e.preventDefault();

    if (!drawDate) {
      alert("Please select a draw date");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(`${API_URL}/draws`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          drawDate,
          drawType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create draw");
      }

      alert("Draw created successfully");

      setDrawDate("");
      setDrawType("random");

      loadDraws();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setCreating(false);
    }
  };

  const publishDraw = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to publish this draw?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/draws/${id}/publish`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish draw");
      }

      alert("Draw published successfully");

      loadDraws();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Draw Management</h1>
          <p>
            Create, manage and publish monthly Digital Heroes draws.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={loadDraws}
        >
          Refresh
        </button>
      </div>

      {/* CREATE DRAW */}

      <div className="admin-card">
        <h2>Create New Draw</h2>

        <form
          onSubmit={createDraw}
          className="admin-form-grid"
        >

          <div>
            <label>Draw Date</label>

            <input
              type="date"
              value={drawDate}
              onChange={(e) =>
                setDrawDate(e.target.value)
              }
              required
            />
          </div>

          <div>
            <label>Draw Type</label>

            <select
              value={drawType}
              onChange={(e) =>
                setDrawType(e.target.value)
              }
            >
              <option value="random">
                Random
              </option>

              <option value="algorithmic">
                Algorithmic
              </option>
            </select>
          </div>

          <div className="admin-form-button">
            <button
              type="submit"
              disabled={creating}
              className="admin-primary-btn"
            >
              {creating
                ? "Creating..."
                : "Create Draw"}
            </button>
          </div>

        </form>
      </div>

      {/* DRAW LIST */}

      <div className="admin-card">

        <div className="admin-card-header">
          <h2>All Draws</h2>

          <span>
            {draws.length} draws
          </span>
        </div>

        {loading ? (
          <div className="admin-loading">
            Loading draws...
          </div>
        ) : draws.length === 0 ? (
          <div className="admin-empty">
            No draws found.
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Numbers</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {draws.map((draw) => (

                  <tr key={draw.id}>

                    <td>
                      {draw.draw_date ||
                        draw.drawDate ||
                        "-"}
                    </td>

                    <td>
                      {Array.isArray(draw.numbers)
                        ? draw.numbers.join(", ")
                        : "-"}
                    </td>

                    <td>
                      {draw.draw_type ||
                        draw.drawType ||
                        "-"}
                    </td>

                    <td>

                      <span
                        className={`admin-status ${
                          draw.status === "published"
                            ? "active"
                            : "pending"
                        }`}
                      >
                        {draw.status || "draft"}
                      </span>

                    </td>

                    <td>

                      {draw.status !==
                        "published" && (

                        <button
                          className="admin-small-btn"
                          onClick={() =>
                            publishDraw(draw.id)
                          }
                        >
                          Publish
                        </button>

                      )}

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