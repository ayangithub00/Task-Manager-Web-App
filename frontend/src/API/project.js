// src/api/project.js

const BASE_URL = "https://task-manager-web-app-u927.onrender.com/api/v1";

export const getProjects = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/project/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};