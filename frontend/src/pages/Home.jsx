import {
  ArrowRight,
  Heart,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";

import { Link } from "react-router-dom";


function Home() {
  return (
    <div className="home-page">

      {/* ================================= */}
      {/* NAVBAR */}
      {/* ================================= */}

      <header className="home-navbar">

        <div className="home-logo">
          <Heart size={22} />
          <span>
            Digital Heroes
          </span>
        </div>


        <nav className="home-nav">

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#charity">
            Charity
          </a>

          <a href="#impact">
            Our Impact
          </a>

        </nav>


        <div className="home-actions">

          <Link
            to="/login"
            className="login-link"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="primary-button"
          >
            Become a Hero
          </Link>

        </div>

      </header>


      {/* ================================= */}
      {/* HERO */}
      {/* ================================= */}

      <main>

        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-badge">
              <Sparkles size={16} />

              <span>
                Play. Give. Make an impact.
              </span>
            </div>


            <h1>
              Your scores can
              <span>
                help change lives.
              </span>
            </h1>


            <p>
              Digital Heroes brings people
              together through a simple
              monthly draw while giving
              you the power to support a
              charity you care about.
            </p>


            <div className="hero-buttons">

              <Link
                to="/register"
                className="hero-primary-button"
              >
                Become a Digital Hero

                <ArrowRight
                  size={20}
                />
              </Link>


              <a
                href="#how-it-works"
                className="hero-secondary-button"
              >
                See how it works
              </a>

            </div>


            <div className="hero-trust">

              <div>
                <Users size={18} />

                <span>
                  Community powered
                </span>
              </div>


              <div>
                <Heart size={18} />

                <span>
                  Charity focused
                </span>
              </div>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="hero-card">

              <div className="hero-card-icon">
                <Heart size={32} />
              </div>


              <span>
                Every contribution
              </span>


              <strong>
                Creates impact
              </strong>


              <p>
                Choose the cause
                that matters to you.
              </p>

            </div>


            <div className="floating-card top-card">

              <Trophy size={20} />

              <div>
                <strong>
                  Monthly Draw
                </strong>

                <span>
                  Your chance to win
                </span>
              </div>

            </div>


            <div className="floating-card bottom-card">

              <Heart size={20} />

              <div>
                <strong>
                  Give back
                </strong>

                <span>
                  Support a cause
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* ================================= */}
        {/* HOW IT WORKS */}
        {/* ================================= */}

        <section
          id="how-it-works"
          className="section"
        >

          <div className="section-heading">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              Three simple steps.
            </h2>

            <p>
              Becoming a Digital Hero
              is straightforward.
            </p>

          </div>


          <div className="steps-grid">

            <div className="step-card">

              <span className="step-number">
                01
              </span>

              <h3>
                Join
              </h3>

              <p>
                Create your account and
                choose your subscription.
              </p>

            </div>


            <div className="step-card">

              <span className="step-number">
                02
              </span>

              <h3>
                Add your scores
              </h3>

              <p>
                Enter your latest scores
                and take part in the
                monthly draw.
              </p>

            </div>


            <div className="step-card">

              <span className="step-number">
                03
              </span>

              <h3>
                Make an impact
              </h3>

              <p>
                Choose a charity and
                help support a cause
                you believe in.
              </p>

            </div>

          </div>

        </section>


        {/* ================================= */}
        {/* CHARITY */}
        {/* ================================= */}

        <section
          id="charity"
          className="charity-section"
        >

          <div className="charity-content">

            <span>
              YOUR CHOICE MATTERS
            </span>


            <h2>
              Give to a cause
              that means something
              to you.
            </h2>


            <p>
              Select your preferred charity
              when you join. You can choose
              to contribute at least 10% of
              your subscription and increase
              your contribution if you want.
            </p>


            <Link
              to="/register"
              className="hero-primary-button"
            >
              Choose your charity

              <ArrowRight
                size={20}
              />
            </Link>

          </div>


          <div className="charity-visual">

            <div className="charity-heart">
              <Heart size={56} />
            </div>


            <div className="charity-stat">

              <strong>
                10%
              </strong>

              <span>
                minimum contribution
              </span>

            </div>

          </div>

        </section>


        {/* ================================= */}
        {/* IMPACT */}
        {/* ================================= */}

        <section
          id="impact"
          className="section impact-section"
        >

          <div className="section-heading">

            <span>
              THE DIGITAL HERO COMMUNITY
            </span>

            <h2>
              Small contributions.
              Meaningful impact.
            </h2>

          </div>


          <div className="impact-grid">

            <div className="impact-card">

              <Heart size={28} />

              <strong>
                Support causes
              </strong>

              <p>
                Choose the charity
                closest to your heart.
              </p>

            </div>


            <div className="impact-card">

              <Users size={28} />

              <strong>
                Join a community
              </strong>

              <p>
                Be part of a community
                working toward positive
                change.
              </p>

            </div>


            <div className="impact-card">

              <Trophy size={28} />

              <strong>
                Take part
              </strong>

              <p>
                Manage your scores and
                participate in monthly
                draws.
              </p>

            </div>

          </div>

        </section>


        {/* ================================= */}
        {/* CTA */}
        {/* ================================= */}

        <section className="final-cta">

          <div>

            <span>
              READY TO MAKE A DIFFERENCE?
            </span>

            <h2>
              Become a Digital Hero.
            </h2>

            <p>
              Join the community and
              turn participation into
              positive impact.
            </p>

          </div>


          <Link
            to="/register"
            className="cta-button"
          >
            Get Started

            <ArrowRight
              size={20}
            />
          </Link>

        </section>

      </main>


      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}

      <footer className="home-footer">

        <div className="home-logo">
          <Heart size={20} />

          <span>
            Digital Heroes
          </span>
        </div>


        <p>
          Play with purpose. Give with heart.
        </p>


        <span>
          © 2026 Digital Heroes
        </span>

      </footer>

    </div>
  );
}


export default Home;