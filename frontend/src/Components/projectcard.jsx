import { useNavigate } from "react-router-dom";
import { FolderOpen, Pencil, Trash2, ArrowRight, Users } from "lucide-react";

const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();

  if (!project) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Card Header */}
      <div
        onClick={() => navigate(`/project/${project.id}`)}
        className="p-6 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
            <FolderOpen className="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" />
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
        </div>

        <h2 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
          {project.name}
        </h2>
        <p className="text-sm text-slate-500 line-clamp-2 min-h-10">
          {project.description || "No description provided"}
        </p>

        {/* Members indicator */}
        {project.members && project.members.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-500">
              {project.members.length} member{project.members.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/edit-project/${project.id}`);
          }}
          className="flex-1 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="flex-1 h-9 rounded-lg border border-red-200 bg-white text-red-600 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;