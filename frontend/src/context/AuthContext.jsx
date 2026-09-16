import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser
} from "../services/authService";


// =========================================
// CREATE CONTEXT
// =========================================

const AuthContext =
  createContext(null);


// =========================================
// AUTH PROVIDER
// =========================================

export function AuthProvider({
  children
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  // =======================================
  // LOAD USER ON APP START
  // =======================================

  useEffect(() => {
    async function loadUser() {
      const token =
        localStorage.getItem(
          "digitalHeroesToken"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data =
          await getCurrentUser();

        if (data.success) {
          setUser(data.user);

          localStorage.setItem(
            "digitalHeroesUser",
            JSON.stringify(data.user)
          );
        }
      } catch (error) {
        console.error(
          "Load user error:",
          error
        );

        localStorage.removeItem(
          "digitalHeroesToken"
        );

        localStorage.removeItem(
          "digitalHeroesUser"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);


  // =======================================
  // REGISTER
  // =======================================

  async function register(
    name,
    email,
    password
  ) {
    setError(null);

    try {
      const data =
        await registerUser(
          name,
          email,
          password
        );

      if (!data.success) {
        throw new Error(
          data.message ||
          "Registration failed"
        );
      }

      localStorage.setItem(
        "digitalHeroesToken",
        data.token
      );

      localStorage.setItem(
        "digitalHeroesUser",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return data;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed";

      setError(message);

      throw new Error(message);
    }
  }


  // =======================================
  // LOGIN
  // =======================================

  async function login(
    email,
    password
  ) {
    setError(null);

    try {
      const data =
        await loginUser(
          email,
          password
        );

      if (!data.success) {
        throw new Error(
          data.message ||
          "Login failed"
        );
      }

      localStorage.setItem(
        "digitalHeroesToken",
        data.token
      );

      localStorage.setItem(
        "digitalHeroesUser",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return data;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed";

      setError(message);

      throw new Error(message);
    }
  }


  // =======================================
  // LOGOUT
  // =======================================

  function logout() {
    localStorage.removeItem(
      "digitalHeroesToken"
    );

    localStorage.removeItem(
      "digitalHeroesUser"
    );

    setUser(null);
    setError(null);
  }


  // =======================================
  // CLEAR ERROR
  // =======================================

  function clearError() {
    setError(null);
  }


  // =======================================
  // PROVIDER
  // =======================================

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin:
      user?.role === "admin",

    register,
    login,
    logout,
    clearError
  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// =========================================
// USE AUTH HOOK
// =========================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}