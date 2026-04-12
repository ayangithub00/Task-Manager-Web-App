const BASE_URL = "http://127.0.0.1:8000/api/v1";

// 🔹 Get tasks by project
export const getTasks = async (projectId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/tasks/?project=${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

// 🔹 Create new task
export const createTask = async (projectId, taskData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...taskData,
      project: projectId,
      assigned_to: 1, // temp
      created_at: "2026-04-09",
    }),
  });

  const data = await response.json();
console.log("ERROR:", data);
return data;
};