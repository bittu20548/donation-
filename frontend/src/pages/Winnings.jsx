import {
  Gift,
  Trophy,
  ArrowRight
} from "lucide-react";

import {
  Link
} from "react-router-dom";


function Winnings() {
  return (
    <div className="dashboard-page">

      <div className="inner-page-header">

        <div>

          <p className="dashboard-eyebrow">
            MONTHLY DRAW
          </p>

          <h1>
            My Winnings
          </h1>

          <p>
            View your draw results,
            winning matches and payment
            status.
          </p>

        </div>


        <div className="inner-page-icon">
          <Gift size={28} />
        </div>

      </div>


      <section className="empty-state winnings-empty">

        <div className="empty-state-large-icon">
          <Trophy size={34} />
        </div>

        <h2>
          Your winnings will appear here
        </h2>

        <p>
          When you win a monthly draw,
          your winning details and
          verification status will be
          displayed here.
        </p>


        <Link
          to="/dashboard/scores"
          className="dashboard-primary-button"
        >
          Manage my scores

          <ArrowRight size={17} />

        </Link>

      </section>


      <Link
        to="/dashboard"
        className="back-dashboard-link"
      >
        ← Back to dashboard
      </Link>

    </div>
  );
}


export default Winnings;