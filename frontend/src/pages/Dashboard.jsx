import {
  Link
} from "react-router-dom";

import {
  Trophy,
  Heart,
  CreditCard,
  Gift,
  ArrowRight,
  Sparkles
} from "lucide-react";

import {
  useAuth
} from "../context/AuthContext";


function Dashboard() {
  const {
    user
  } = useAuth();


  return (
    <div className="dashboard-page">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="dashboard-top">

        <div>

          <p className="dashboard-eyebrow">
            YOUR DIGITAL HERO SPACE
          </p>

          <h1>
            Welcome back,{" "}
            {user?.name?.split(" ")[0]}
          </h1>

          <p className="dashboard-description">
            Manage your scores, charity,
            subscription and winnings
            from one place.
          </p>

        </div>


        <div className="dashboard-welcome-icon">
          <Sparkles size={28} />
        </div>

      </div>


      {/* ================================= */}
      {/* QUICK ACTIONS */}
      {/* ================================= */}

      <div className="dashboard-grid">


        {/* SUBSCRIPTION */}

        <Link
          to="/dashboard/subscription"
          className="dashboard-card dashboard-card-link"
        >

          <div className="dashboard-card-icon">
            <CreditCard size={22} />
          </div>

          <h3>
            Subscription
          </h3>

          <p>
            Manage your plan and
            renewal details.
          </p>

          <span className="dashboard-card-link-text">
            Manage

            <ArrowRight size={15} />

          </span>

        </Link>


        {/* SCORES */}

        <Link
          to="/dashboard/scores"
          className="dashboard-card dashboard-card-link"
        >

          <div className="dashboard-card-icon">
            <Trophy size={22} />
          </div>

          <h3>
            My Scores
          </h3>

          <p>
            Add and manage your latest
            five scores.
          </p>

          <span className="dashboard-card-link-text">
            Manage

            <ArrowRight size={15} />

          </span>

        </Link>


        {/* CHARITY */}

        <Link
          to="/dashboard/charity"
          className="dashboard-card dashboard-card-link"
        >

          <div className="dashboard-card-icon">
            <Heart size={22} />
          </div>

          <h3>
            My Charity
          </h3>

          <p>
            Choose the cause you want
            to support.
          </p>

          <span className="dashboard-card-link-text">
            View charity

            <ArrowRight size={15} />

          </span>

        </Link>


        {/* WINNINGS */}

        <Link
          to="/dashboard/winnings"
          className="dashboard-card dashboard-card-link"
        >

          <div className="dashboard-card-icon">
            <Gift size={22} />
          </div>

          <h3>
            Winnings
          </h3>

          <p>
            Check your draw results
            and winnings.
          </p>

          <span className="dashboard-card-link-text">
            View winnings

            <ArrowRight size={15} />

          </span>

        </Link>

      </div>


      {/* ================================= */}
      {/* CHARITY MESSAGE */}
      {/* ================================= */}

      <section className="dashboard-impact">

        <div className="dashboard-impact-icon">
          <Heart size={26} />
        </div>


        <div>

          <p className="dashboard-eyebrow">
            YOUR IMPACT
          </p>

          <h2>
            Play with purpose.
            Give with heart.
          </h2>

          <p>
            Your Digital Heroes membership
            helps support causes chosen by
            our community.
          </p>

        </div>


        <Link
          to="/dashboard/charity"
          className="dashboard-impact-button"
        >
          Explore charity

          <ArrowRight size={17} />

        </Link>

      </section>

    </div>
  );
}


export default Dashboard;