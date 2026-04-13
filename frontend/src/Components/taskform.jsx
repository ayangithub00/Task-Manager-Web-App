import { useState, useEffect } from "react";
import {
  FileText, AlignLeft, Flag, Calendar,
  CircleDot, Plus, ChevronDown, UserCheck,
} from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

// TaskForm now fetches its own members using projectId.
// This means it doesn't depend on the parent (projectdetail.jsx)
// passing projectMembers correctly — it goes and gets them itself.
// This is the most reliable approach because:
//   1. It runs exactly when the form is shown (not when the page first loads)
//   2. It always gets fresh data from the /members/ endpoint we added
//   3. If the parent had stale/empty members, this bypasses that entirely

const TaskForm = ({ onAddTask, projectId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "medium",
    due_date: "",
    assigned_to: "",
  });

  // members → fetched directly inside this component using projectId
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch project members as soon as the form mounts (when owner clicks "Add Task")
  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${BASE_URL}/project/${projectId}/members/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // data should be [{id, username, role}, ...]
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch members:", err);
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };

    if (projectId) fetchMembers();
  }, [projectId]); // re-runs if projectId changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    if (!formData.assigned_to) {
      alert("Please select a team member to assign this task to.");
      return;
    }
    setIsLoading(true);
    try {
      await onAddTask(formData);
      setFormData({
        title: "",
        description: "",
        status: "Todo",
        priority: "medium",
        due_date: "",
        assigned_to: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const priorityColors = {
    low: "text-slate-500",
    medium: "text-amber-500",
    high: "text-red-500",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={formData.title}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Due Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <div className="relative">
          <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <textarea
            name="description"
            placeholder="Add a description..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Assign To dropdown — populated from /project/{id}/members/ */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Assign To</label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
              required
            >
              {/* Show a loading state while members are being fetched */}
              {loadingMembers ? (
                <option value="">Loading members...</option>
              ) : members.length === 0 ? (
                // If no members found, tell the owner why
                <option value="">No members in this project yet</option>
              ) : (
                <>
                  <option value="">Select member...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.username} ({member.role})
                    </option>
                  ))}
                </>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <div className="relative">
            <CircleDot className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Priority</label>
          <div className="relative">
            <Flag className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${priorityColors[formData.priority]}`} />
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !formData.title || loadingMembers}
        className="h-11 px-6 rounded-lg bg-slate-900 text-white font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add Task
          </>
        )}
      </button>
    </form>
  );
};

export default TaskForm;