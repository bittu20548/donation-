import { useEffect, useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  Heart,
  ArrowRight
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


function Login() {
  const navigate = useNavigate();

  const {
    login,
    error,
    clearError,
    isAuthenticated,
    user,
    loading: authLoading
  } = useAuth();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =========================================
  // IF ALREADY LOGGED IN
  // REDIRECT AUTOMATICALLY
  // =========================================

  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated &&
      user
    ) {
      if (user.role === "admin") {
        navigate("/admin", {
          replace: true
        });
      } else {
        navigate("/dashboard", {
          replace: true
        });
      }
    }
  }, [
    authLoading,
    isAuthenticated,
    user,
    navigate
  ]);


  // =========================================
  // LOGIN
  // =========================================

  async function handleSubmit(event) {
    event.preventDefault();

    clearError();

    setLoading(true);


    try {
      const data =
        await login(
          email.trim(),
          password
        );


      if (
        data &&
        data.success &&
        data.user
      ) {
        if (
          data.user.role ===
          "admin"
        ) {
          navigate("/admin", {
            replace: true
          });
        } else {
          navigate("/dashboard", {
            replace: true
          });
        }

        return;
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

    } finally {
      setLoading(false);
    }
  }


  // =========================================
  // LOADING AUTH STATE
  // =========================================

  if (authLoading) {
    return (
      <div className="login-page">

        <div className="auth-card">

          <div className="auth-logo">
            <Heart size={23} />

            <span>
              Digital Heroes
            </span>
          </div>

          <p
            style={{
              textAlign: "center"
            }}
          >
            Loading...
          </p>

        </div>

      </div>
    );
  }


  // =========================================
  // UI
  // =========================================

  return (
    <div className="login-page">

      <div className="auth-card">

        {/* ================================= */}
        {/* LOGO */}
        {/* ================================= */}

        <Link
          to="/"
          className="auth-logo"
        >

          <Heart size={23} />

          <span>
            Digital Heroes
          </span>

        </Link>


        {/* ================================= */}
        {/* HEADING */}
        {/* ================================= */}

        <h1>
          Welcome back
        </h1>

        <p>
          Login to your Digital Heroes
          account.
        </p>


        {/* ================================= */}
        {/* FORM */}
        {/* ================================= */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="login-email">
              Email address
            </label>

            <input
              id="login-email"
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

            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading ? (
              "Logging in..."
            ) : (
              <>
                Login

                <ArrowRight
                  size={18}
                />
              </>
            )}

          </button>

        </form>


        {/* ================================= */}
        {/* REGISTER */}
        {/* ================================= */}

        <div className="auth-footer">

          <span>
            Don't have an account?{" "}
          </span>

          <Link to="/register">
            Create an account
          </Link>

        </div>


        {/* ================================= */}
        {/* HOME */}
        {/* ================================= */}

        <div
          style={{
            textAlign: "center",
            marginTop: "18px"
          }}
        >

          <Link
            to="/"
            style={{
              color: "#78837e",
              fontSize: "12px"
            }}
          >
            ← Back to homepage
          </Link>

        </div>

      </div>

    </div>
  );
}


export default Login;