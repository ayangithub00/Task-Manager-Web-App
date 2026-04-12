import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTasks, createTask } from "../API/task";
import TaskCard from "../Components/taskcard";
import TaskForm from "../Components/taskform";
import {
  ArrowLeft,
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(id);
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  const handleAddTask = async (taskData) => {
    const newTask = await createTask(id, taskData);
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };
  
const completedTasks = tasks.filter((task) => task.status === "Done").length;
const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;
const pendingTasks = tasks.filter((task) => task.status === "Todo").length;

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: ClipboardList,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      label: "Pending",
      value: pendingTasks,
      icon: AlertCircle,
      bgColor: "bg-slate-100",
      textColor: "text-slate-600",
    },
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
            <Link
              to="/dashboard"
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Project Tasks</h1>
              <p className="text-sm text-slate-500">Manage and track your project tasks</p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="h-11 px-5 rounded-xl bg-slate-900 text-white font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Task
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-slate-200"
            >
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

        {/* Task Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Task</h3>
            <TaskForm onAddTask={handleAddTask} />
          </div>
        )}

        {/* Tasks List */}
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
              <p className="text-slate-500 mb-6">
                Get started by creating your first task
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="h-11 px-5 rounded-xl bg-slate-900 text-white font-medium inline-flex items-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Task
              </button>
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