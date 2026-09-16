import { useEffect, useState } from "react";
import {
  CreditCard,
  Check,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

function Subscription() {
  const [subscription, setSubscription] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const token =
    localStorage.getItem(
      "digitalHeroesToken"
    );

  async function loadSubscription() {
    try {
      const response = await fetch(
        `${API_URL}/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load subscription"
        );
      }

      setSubscription(
        data.subscription
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscription();
  }, []);

  async function subscribe(plan) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/subscriptions`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            plan
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to activate subscription"
        );
      }

      setSubscription(
        data.subscription
      );

      setMessage(
        "Subscription activated successfully."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function cancelSubscription() {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel your subscription?"
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/subscriptions/cancel`,
        {
          method: "POST",

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
            "Unable to cancel subscription"
        );
      }

      setSubscription(
        data.subscription
      );

      setMessage(
        "Subscription cancelled successfully."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="inner-page-header">

        <div>
          <p className="dashboard-eyebrow">
            MEMBERSHIP
          </p>

          <h1>
            Subscription
          </h1>

          <p>
            Manage your Digital Heroes
            membership.
          </p>
        </div>

        <div className="inner-page-icon">
          <CreditCard size={28} />
        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {message && (
        <div className="dashboard-success">
          {message}
        </div>
      )}


      {/* LOADING */}

      {loading ? (

        <div className="dashboard-loading">
          Loading subscription...
        </div>

      ) : subscription ? (

        /* ACTIVE SUBSCRIPTION */

        <section className="subscription-current">

          <div className="subscription-status">

            <div className="status-check">
              <Check size={20} />
            </div>

            <div>
              <span>
                CURRENT PLAN
              </span>

              <h2>
                {subscription.plan ===
                "yearly"
                  ? "Yearly"
                  : "Monthly"}
              </h2>
            </div>

          </div>


          <div className="subscription-details">

            <div>
              <span>
                Amount
              </span>

              <strong>
                ₹{subscription.amount}
              </strong>
            </div>


            <div>
              <span>
                Status
              </span>

              <strong className="status-active">
                {subscription.status}
              </strong>
            </div>


            <div>
              <span>
                Renewal
              </span>

              <strong>
                {subscription.renewal_date
                  ? new Date(
                      subscription.renewal_date
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : "—"}
              </strong>
            </div>

          </div>


          {subscription.status ===
            "active" && (

            <button
              type="button"
              className="cancel-button"
              disabled={saving}
              onClick={
                cancelSubscription
              }
            >
              {saving
                ? "Cancelling..."
                : "Cancel subscription"}
            </button>

          )}

        </section>

      ) : (

        /* PLANS */

        <section>

          <div className="section-title-small">

            <h2>
              Choose your plan
            </h2>

            <p>
              Become a Digital Hero and
              participate in the community.
            </p>

          </div>


          <div className="plans-grid">

            {/* MONTHLY */}

            <div className="plan-card">

              <p>
                MONTHLY
              </p>

              <h2>
                ₹499
                <span>
                  /month
                </span>
              </h2>


              <div className="plan-features">

                <div>
                  <Check size={16} />
                  Monthly draw participation
                </div>

                <div>
                  <Check size={16} />
                  Choose your charity
                </div>

                <div>
                  <Check size={16} />
                  Manage your scores
                </div>

              </div>


              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  subscribe("monthly")
                }
              >
                Choose monthly

                <ArrowRight size={17} />
              </button>

            </div>


            {/* YEARLY */}

            <div className="plan-card featured">

              <span className="plan-badge">
                YEARLY PLAN
              </span>

              <p>
                YEARLY
              </p>

              <h2>
                ₹4999
                <span>
                  /year
                </span>
              </h2>


              <div className="plan-features">

                <div>
                  <Check size={16} />
                  Monthly draw participation
                </div>

                <div>
                  <Check size={16} />
                  Choose your charity
                </div>

                <div>
                  <Check size={16} />
                  Manage your scores
                </div>

              </div>


              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  subscribe("yearly")
                }
              >
                Choose yearly

                <ArrowRight size={17} />
              </button>

            </div>

          </div>

        </section>

      )}


      {/* BACK */}

      <Link
        to="/dashboard"
        className="back-dashboard-link"
      >
        ← Back to dashboard
      </Link>

    </div>
  );
}

export default Subscription;