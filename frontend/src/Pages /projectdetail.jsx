// ─────────────────────────────────────────────
// projectdetail.jsx  →  src/Pages/projectdetail.jsx
// ─────────────────────────────────────────────
// Fix: instead of relying on project.members from the project response
// (which can be empty if serializer returns broken data),
// we now call the dedicated GET /api/v1/project/{id}/members/ endpoint
// to get a guaranteed fresh list of members for the "Assign To" dropdown.

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTasks, createTask } from "../API/task";
import TaskCard from "../Components/taskcard";
import TaskForm from "../Components/taskform";
import {
  ArrowLeft, ClipboardList, Plus,
  CheckCircle2, Clock, AlertCircle,
} from "lucide-react";

const BASE_URL = "https://task-manager-web-app-u927.onrender.com/api/v1";

const ProjectDetail = () => {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]); // separate state for members
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const isOwner = localStorage.getItem("role") === "owner";

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        // ── Fetch 1: full project details (name, description, etc.) ──
        const projectRes = await fetch(`${BASE_URL}/project/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projectData = await projectRes.json();
        setProject(projectData);

        // ── Fetch 2: project members from dedicated endpoint ──
        // GET /api/v1/project/{id}/members/ returns [{id, username, role}, ...]
        // This is more reliable than projectData.members because:
        // 1. It always returns fresh data
        // 2. MemberSerializer guarantees role is never null
        // 3. If members weren't loading before, this dedicated call will work
        const membersRes = await fetch(`${BASE_URL}/project/${id}/members/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const membersData = await membersRes.json();

        // membersData is an array like: [{id: 2, username: "john", role: "member"}, ...]
        setProjectMembers(Array.isArray(membersData) ? membersData : []);

        // ── Fetch 3: tasks for this project ──
        const taskData = await getTasks(id);
        const filtered = Array.isArray(taskData)
          ? taskData.filter((task) => String(task.project) === String(id))
          : [];
        setTasks(filtered);

      } catch (error) {
        console.error("ProjectDetail fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddTask = async (taskData) => {
    const newTask = await createTask(id, taskData);
    setTasks((prev) => [...prev, newTask]);
    setShowForm(false);
  };

  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "Todo").length;

  const stats = [
    { label: "Total Tasks", value: tasks.length, icon: ClipboardList, bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { label: "Completed", value: completedTasks, icon: CheckCircle2, bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
    { label: "In Progress", value: inProgressTasks, icon: Clock, bgColor: "bg-amber-50", textColor: "text-amber-600" },
    { label: "Pending", value: pendingTasks, icon: AlertCircle, bgColor: "bg-slate-100", textColor: "text-slate-600" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {project?.name || "Project Tasks"}
              </h1>
              <p className="text-sm text-slate-500">
                {/* Now uses projectMembers.length — always accurate */}
                {projectMembers.length} member{projectMembers.length !== 1 ? "s" : ""} · Manage and track tasks
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="h-11 px-5 rounded-xl bg-slate-900 text-white font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Members panel — owners only */}
        {isOwner && projectMembers.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Project Members</h3>
            <div className="flex flex-wrap gap-2">
              {projectMembers.map((member) => (
                <span
                  key={member.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                    {member.username.charAt(0).toUpperCase()}
                  </span>
                  {member.username}
                  <span className="text-slate-400 text-xs">({member.role})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Task form — owners only */}
        {isOwner && showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Task</h3>
            {/* Pass projectId — TaskForm fetches its own members internally now */}
            <TaskForm
              onAddTask={handleAddTask}
              projectId={id}
            />
          </div>
        )}

        {/* Tasks list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">All Tasks</h2>
            <p className="text-sm text-slate-500">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} in this project
            </p>
          </div>

          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks yet</h3>
              {isOwner ? (
                <>
                  <p className="text-slate-500 mb-6">Get started by creating the first task</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="h-11 px-5 rounded-xl bg-slate-900 text-white font-medium inline-flex items-center gap-2 hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Create Task
                  </button>
                </>
              ) : (
                <p className="text-slate-500">No tasks have been assigned to this project yet.</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;