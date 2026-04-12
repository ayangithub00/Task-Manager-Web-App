import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../API/project";
import ProjectCard from "../Components/projectcard";
import {
  FolderKanban,
  ClipboardList,
  CheckCircle2,
  Plus,
  TrendingUp,
  BarChart3,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("token");

      try {
        const res1 = await fetch("http://127.0.0.1:8000/api/v1/dashboard/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dashboardData = await res1.json();

        const projectData = await getProjects();

        if (res1.ok) {
          setData(dashboardData);
          setProjects(projectData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/v1/project/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Sample chart data - replace with real data from your API
  const activityData = [
    { name: "Mon", tasks: 4 },
    { name: "Tue", tasks: 7 },
    { name: "Wed", tasks: 5 },
    { name: "Thu", tasks: 8 },
    { name: "Fri", tasks: 12 },
    { name: "Sat", tasks: 6 },
    { name: "Sun", tasks: 3 },
  ];

  const projectProgressData = [
    { name: "Week 1", completed: 20, total: 30 },
    { name: "Week 2", completed: 35, total: 45 },
    { name: "Week 3", completed: 50, total: 60 },
    { name: "Week 4", completed: 70, total: 80 },
  ];

  const taskDistribution = [
    { name: "Completed", value: data?.completed_tasks || 0, color: "#10b981" },
    { name: "In Progress", value: Math.max(0, (data?.assigned_tasks || 0) - (data?.completed_tasks || 0)), color: "#3b82f6" },
    { name: "Pending", value: 5, color: "#f59e0b" },
  ];

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Projects",
      value: data.total_projects,
      icon: FolderKanban,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12%",
      changeType: "positive",
    },
    {
      label: "Assigned Tasks",
      value: data.assigned_tasks,
      icon: ClipboardList,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      change: "+8%",
      changeType: "positive",
    },
    {
      label: "Completed Tasks",
      value: data.completed_tasks,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      change: "+24%",
      changeType: "positive",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <div className="w-5 h-5 rounded-md bg-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-medium text-sm">
                {data.username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-900">{data.username}</p>
                <p className="text-xs text-slate-500">{data.email}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Welcome back, {data.username}
          </h1>
          <p className="text-slate-500">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Weekly Activity</h3>
                <p className="text-sm text-slate-500">Tasks completed this week</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-900" />
                <span className="text-sm text-slate-600">Tasks</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="#0f172a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTasks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Task Status</h3>
              <p className="text-sm text-slate-500">Distribution overview</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {taskDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Progress Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Project Progress</h3>
              <p className="text-sm text-slate-500">Monthly completion rate</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-900" />
                <span className="text-sm text-slate-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-sm text-slate-600">Total</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Your Projects</h2>
            <p className="text-sm text-slate-500">
              {projects.length} {projects.length === 1 ? "project" : "projects"} total
            </p>
          </div>
          <button
            onClick={() => navigate("/create-project")}
            className="h-11 px-5 rounded-xl bg-slate-900 text-white font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No projects yet</h3>
            <p className="text-slate-500 mb-6">
              Get started by creating your first project
            </p>
            <button
              onClick={() => navigate("/create-project")}
              className="h-11 px-5 rounded-xl bg-slate-900 text-white font-medium inline-flex items-center gap-2 hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;