// ─────────────────────────────────────────────
// task.js  →  src/API/task.js
// ─────────────────────────────────────────────
// All API calls related to tasks live here.
 
const BASE_URL = "https://task-manager-web-app-u927.onrender.com/api/v1";
 
 
// ─────────────────────────────────────────────
// GET TASKS BY PROJECT
// ─────────────────────────────────────────────
// Fetches all tasks the user can see, filtered by project.
// The backend will return only tasks for projects the user owns or is a member of.
// We also filter by ?project=<id> so we only get tasks for THIS project.
 
export const getTasks = async (projectId) => {
  const token = localStorage.getItem("token");
 
  const response = await fetch(`${BASE_URL}/tasks/?project=${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return response.json();
};
 
 
// ─────────────────────────────────────────────
// CREATE TASK
// ─────────────────────────────────────────────
// Creates a new task inside a specific project.
// taskData comes from TaskForm and includes:
//   title, description, status, priority, due_date, assigned_to (user id)
// We add project id and today's date dynamically — no hardcoding.
 
export const createTask = async (projectId, taskData) => {
  const token = localStorage.getItem("token");
 
  // Get today's date in YYYY-MM-DD format (what Django DateField expects)
  const today = new Date().toISOString().split("T")[0];
 
  const response = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...taskData,           // spread all form fields (title, description, etc.)
      project: projectId,    // attach this task to the correct project
      created_at: today,     // dynamically set today's date (not hardcoded)
      // assigned_to comes from taskData — owner picks it from a dropdown
    }),
  });
 
  const data = await response.json();
  return data;
};
 
 
// ─────────────────────────────────────────────
// GET TASK STATS
// ─────────────────────────────────────────────
// Calls the custom /tasks/stats/ endpoint we defined in the backend.
// Returns counts: { completed, in_progress, todo, total }
 
export const getTaskStats = async () => {
  const token = localStorage.getItem("token");
 
  const response = await fetch(`${BASE_URL}/tasks/stats/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
 
  return response.json();
};
 