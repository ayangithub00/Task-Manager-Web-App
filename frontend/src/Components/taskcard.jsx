import { CheckCircle2, Clock, Circle, Flag, Calendar } from "lucide-react";

const TaskCard = ({ task }) => {
  const statusConfig = {
    Done: {
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    "In Progress": {
      icon: Clock,
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
    },
    Todo: {
      icon: Circle,
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
    },
  };

  const priorityConfig = {
    high: {
      bg: "bg-red-50",
      text: "text-red-600",
      label: "High",
    },
    medium: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      label: "Medium",
    },
    low: {
      bg: "bg-slate-50",
      text: "text-slate-600",
      label: "Low",
    },
  };

  const status = statusConfig[task.status] || statusConfig.Todo;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const StatusIcon = status.icon;

  return (
    <div className="px-6 py-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Left side */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Status Icon */}
          <div className={`p-2 rounded-lg ${status.bg} mt-0.5`}>
            <StatusIcon className={`h-4 w-4 ${status.text}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900 mb-1 truncate">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-slate-500 line-clamp-1 mb-2">
                {task.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
              >
                {task.status}
              </span>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${priority.bg} ${priority.text}`}
              >
                <Flag className="h-3 w-3" />
                {priority.label}
              </span>

              {/* Due Date */}
              {task.due_date && (
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;