import { useState } from "react";
import {
  FileText,
  AlignLeft,
  Flag,
  Calendar,
  CircleDot,
  Plus,
  ChevronDown,
} from "lucide-react";

const TaskForm = ({ onAddTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "medium",
    due_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsLoading(true);
    try {
      await onAddTask(formData);
      setFormData({
        title: "",
        description: "",
        status: "Todo",
        priority: "medium",
        due_date: "",
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !formData.title}
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