// src/api/auth.js

const BASE_URL = "http://127.0.0.1:8000/api/v1/auth/login/";

export const loginUser = async (formData) => {
  const response = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return response.json();
};

export const signupUser = async (formData) => {
  const response = await fetch(`${BASE_URL}/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return response.json();
};