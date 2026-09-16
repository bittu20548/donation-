import api from "./api";


// =========================================
// REGISTER
// =========================================

export async function registerUser(
  name,
  email,
  password
) {
  const response =
    await api.post(
      "/auth/register",
      {
        name,
        email,
        password
      }
    );

  return response.data;
}


// =========================================
// LOGIN
// =========================================

export async function loginUser(
  email,
  password
) {
  const response =
    await api.post(
      "/auth/login",
      {
        email,
        password
      }
    );

  return response.data;
}


// =========================================
// GET CURRENT USER
// =========================================

export async function getCurrentUser() {
  const response =
    await api.get("/auth/me");

  return response.data;
}