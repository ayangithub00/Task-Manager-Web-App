// auth.js  →  src/API/auth.js
// ─────────────────────────────────────────────
// All functions that talk to the backend auth endpoints live here.
// We keep API calls in separate files (not inside components)
// so the code is clean and easy to maintain.
 
const BASE_URL = "http://127.0.0.1:8000/api/v1";
 
 
// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
// Sends username + password to the backend.
// If successful, the backend returns:
//   { access: "...", refresh: "..." }
// We store BOTH tokens in localStorage so:
//   - "token" (access) is sent with every protected API request
//   - "refresh_token" is sent when logging out (to blacklist it)
 
export const loginUser = async (formData) => {
  const response = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
 
  const data = await response.json();
 
  if (response.ok) {
    // Store the access token — used as "Bearer <token>" in all future requests
    localStorage.setItem("token", data.access);
 
    // Store the refresh token — needed to properly log out (blacklist it)
    localStorage.setItem("refresh_token", data.refresh);
 
    // Store the role — frontend uses this to decide what UI to show:
    // owners see "Create Project", "Assign Task" etc.
    // members only see their assigned tasks
    // We get role from /dashboard/ after login (see login.jsx)
  }
 
  return { data, ok: response.ok };
};
 
 
// ─────────────────────────────────────────────
// SIGNUP
// ─────────────────────────────────────────────
// Sends username, email, password, and role to the backend.
// Role is chosen by the user on the signup form.
 
export const signupUser = async (formData) => {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
 
  const data = await response.json();
  return { data, ok: response.ok };
};
 
 
// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
// Sends the refresh token to the backend so it gets blacklisted.
// After this, that refresh token can never be used again — even if stolen.
// Then we clear localStorage so the frontend forgets the user.
 
export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const accessToken = localStorage.getItem("token");
 
  try {
    await fetch(`${BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } catch (error) {
    // Even if the backend call fails, we still clear local storage
    console.error("Logout backend error:", error);
  } finally {
    // Always clear everything from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role"); // clear the stored role too
  }
};
 
 
// ─────────────────────────────────────────────
// FETCH ALL USERS
// ─────────────────────────────────────────────
// Returns [{id, username, role}, ...] for all users except the logged-in one.
// Used by owners to populate:
// 1. The "Add Members" dropdown when creating a project
// 2. The "Assign To" dropdown when creating a task
 
export const fetchAllUsers = async () => {
  const token = localStorage.getItem("token");
 
  const response = await fetch(`${BASE_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return response.json();
};
 