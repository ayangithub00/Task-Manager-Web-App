// src/api/project.js

const BASE_URL = "http://127.0.0.1:8000/api/v1";

export const getProjects = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/project/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};