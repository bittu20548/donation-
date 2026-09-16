import { useEffect, useState } from "react";

import {
  Heart,
  Search,
  Check,
  ArrowRight
} from "lucide-react";

import {
  Link
} from "react-router-dom";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";


function MyCharity() {
  const [charities, setCharities] =
    useState([]);

  const [myCharity, setMyCharity] =
    useState(null);

  const [percentage, setPercentage] =
    useState(10);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const token =
    localStorage.getItem(
      "digitalHeroesToken"
    );


  // =========================================
  // LOAD CHARITIES
  // =========================================

  async function loadCharities() {
    try {
      const response =
        await fetch(
          `${API_URL}/charities${
            search
              ? `?search=${encodeURIComponent(search)}`
              : ""
          }`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load charities"
        );
      }

      setCharities(
        data.charities || []
      );

    } catch (error) {
      setError(
        error.message
      );
    }
  }


  // =========================================
  // LOAD MY CHARITY
  // =========================================

  async function loadMyCharity() {
    try {
      const response =
        await fetch(
          `${API_URL}/charities/my`,
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
          "Unable to load your charity"
        );
      }

      setMyCharity(
        data.charity
      );

      setPercentage(
        data.charityPercentage || 10
      );

    } catch (error) {
      setError(
        error.message
      );
    }
  }


  useEffect(() => {

    async function load() {
      setLoading(true);

      await Promise.all([
        loadCharities(),
        loadMyCharity()
      ]);

      setLoading(false);
    }

    load();

  }, []);


  // =========================================
  // SEARCH
  // =========================================

  async function handleSearch(event) {
    event.preventDefault();

    await loadCharities();
  }


  // =========================================
  // SELECT CHARITY
  // =========================================

  async function selectCharity(
    charityId
  ) {
    setSaving(true);

    setError("");
    setMessage("");

    try {

      const response =
        await fetch(
          `${API_URL}/charities/select`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              charityId,
              charityPercentage:
                Number(percentage)
            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to select charity"
        );
      }


      setMyCharity(
        data.charity
      );


      setMessage(
        "Your charity selection has been updated."
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setSaving(false);

    }
  }


  return (
    <div className="dashboard-page">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="inner-page-header">

        <div>

          <p className="dashboard-eyebrow">
            YOUR IMPACT
          </p>

          <h1>
            My Charity
          </h1>

          <p>
            Choose a cause you care about
            and decide how much of your
            subscription goes toward it.
          </p>

        </div>


        <div className="inner-page-icon">
          <Heart size={28} />
        </div>

      </div>


      {/* ================================= */}
      {/* CURRENT CHARITY */}
      {/* ================================= */}

      <section className="current-charity-card">

        <div className="current-charity-icon">
          <Heart size={28} />
        </div>


        <div className="current-charity-content">

          <p className="dashboard-eyebrow">
            CURRENT CHARITY
          </p>

          <h2>
            {myCharity?.name ||
              "No charity selected"}
          </h2>

          <p>
            {myCharity?.description ||
              "Choose a charity below to start supporting a cause."}
          </p>

        </div>


        <div className="charity-percentage">

          <strong>
            {percentage}%
          </strong>

          <span>
            contribution
          </span>

        </div>

      </section>


      {/* ================================= */}
      {/* CONTRIBUTION */}
      {/* ================================= */}

      <section className="dashboard-white-section">

        <div className="section-title-small">

          <h2>
            Your contribution
          </h2>

          <p>
            You can contribute at least
            10% of your subscription.
          </p>

        </div>


        <div className="percentage-controls">

          {[10, 20, 30, 50, 75, 100].map(
            (value) => (

              <button
                key={value}
                type="button"
                className={
                  percentage === value
                    ? "percentage-button active"
                    : "percentage-button"
                }
                onClick={() =>
                  setPercentage(value)
                }
              >
                {value}%
              </button>

            )
          )}

        </div>

      </section>


      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <section className="dashboard-white-section">

        <div className="section-title-small">

          <h2>
            Choose a charity
          </h2>

          <p>
            Select the organisation you
            want to support.
          </p>

        </div>


        <form
          className="charity-search"
          onSubmit={handleSearch}
        >

          <Search size={19} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search charities..."
          />

          <button type="submit">
            Search
          </button>

        </form>


        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {message && (
          <div className="dashboard-success">
            {message}
          </div>
        )}


        {/* CHARITY LIST */}

        {loading ? (

          <div className="dashboard-loading">
            Loading charities...
          </div>

        ) : charities.length === 0 ? (

          <div className="empty-state">
            <Heart size={30} />

            <h3>
              No charities found
            </h3>

            <p>
              Try a different search.
            </p>
          </div>

        ) : (

          <div className="charity-grid">

            {charities.map(
              (charity) => {

                const selected =
                  myCharity?.id ===
                  charity.id;


                return (
                  <div
                    key={charity.id}
                    className={
                      selected
                        ? "charity-card selected"
                        : "charity-card"
                    }
                  >

                    <div className="charity-card-image">

                      {charity.image_url ? (

                        <img
                          src={
                            charity.image_url
                          }
                          alt={
                            charity.name
                          }
                        />

                      ) : (

                        <Heart
                          size={32}
                        />

                      )}

                    </div>


                    <div className="charity-card-body">

                      <span className="charity-category">
                        {charity.category ||
                          "Community"}
                      </span>


                      <h3>
                        {charity.name}
                      </h3>


                      <p>
                        {charity.description ||
                          "Supporting meaningful community causes."}
                      </p>


                      <button
                        type="button"
                        disabled={
                          saving ||
                          selected
                        }
                        onClick={() =>
                          selectCharity(
                            charity.id
                          )
                        }
                      >

                        {selected ? (
                          <>
                            <Check
                              size={16}
                            />

                            Selected
                          </>
                        ) : (
                          <>
                            Support this charity

                            <ArrowRight
                              size={16}
                            />
                          </>
                        )}

                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>


      {/* ================================= */}
      {/* BACK */}
      {/* ================================= */}

      <Link
        to="/dashboard"
        className="back-dashboard-link"
      >
        ← Back to dashboard
      </Link>

    </div>
  );
}


export default MyCharity;