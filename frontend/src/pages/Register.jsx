import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  Heart,
  ArrowRight
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


function Register() {
  const navigate = useNavigate();

  const {
    register,
    error,
    clearError
  } = useAuth();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [formError, setFormError] =
    useState("");


  async function handleSubmit(event) {
    event.preventDefault();

    clearError();
    setFormError("");


    // Password confirmation
    if (
      password !==
      confirmPassword
    ) {
      setFormError(
        "Passwords do not match"
      );

      return;
    }


    // Minimum password length
    if (password.length < 8) {
      setFormError(
        "Password must be at least 8 characters"
      );

      return;
    }


    setLoading(true);


    try {
      await register(
        name,
        email,
        password
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="register-page">

      <div className="auth-card">

        {/* ============================= */}
        {/* LOGO */}
        {/* ============================= */}

        <Link
          to="/"
          className="auth-logo"
        >
          <Heart size={23} />

          <span>
            Digital Heroes
          </span>
        </Link>


        {/* ============================= */}
        {/* HEADING */}
        {/* ============================= */}

        <h1>
          Become a Digital Hero
        </h1>

        <p>
          Create your account and
          start making an impact.
        </p>


        {/* ============================= */}
        {/* FORM */}
        {/* ============================= */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Enter your name"
              autoComplete="name"
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              required
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={
                confirmPassword
              }
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
            />

          </div>


          {/* ERROR */}

          {(formError || error) && (
            <div className="auth-error">
              {formError || error}
            </div>
          )}


          {/* BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : (
                <>
                  Create Account

                  <ArrowRight
                    size={18}
                  />
                </>
              )}

          </button>

        </form>


        {/* ============================= */}
        {/* LOGIN LINK */}
        {/* ============================= */}

        <div className="auth-footer">

          <span>
            Already have an account?{" "}
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}


export default Register;