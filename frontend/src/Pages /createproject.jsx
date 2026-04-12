import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FolderPlus,
  FileText,
  User,
  Users,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    username: "",
    members: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [memberTags, setMemberTags] = useState([]);
  const [memberInput, setMemberInput] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMember = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = memberInput.trim().replace(",", "");
      if (value && !memberTags.includes(value)) {
        setMemberTags([...memberTags, value]);
        setMemberInput("");
      }
    }
  };

  const handleRemoveMember = (memberToRemove) => {
    setMemberTags(memberTags.filter((member) => member !== memberToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/project/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          username: formData.username,
          members: memberTags,
        }),
      });

      const data = await response.json();
      console.log("CREATE PROJECT:", data);

      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert("Error creating project");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Create Project</h1>
            <p className="text-sm text-slate-500">Add a new project to your workspace</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6">
            <FolderPlus className="h-7 w-7 text-white" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-900">
                Project Name
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-900">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your project..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-900">
                Your Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Members */}
            <div className="space-y-2">
              <label htmlFor="members" className="text-sm font-medium text-slate-900">
                Team Members
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <div className="min-h-12 pl-12 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
                  <div className="flex flex-wrap gap-2">
                    {memberTags.map((member, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm"
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member)}
                          className="hover:text-slate-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      id="members"
                      type="text"
                      placeholder={memberTags.length === 0 ? "Type username and press Enter" : ""}
                      value={memberInput}
                      onChange={(e) => setMemberInput(e.target.value)}
                      onKeyDown={handleAddMember}
                      className="flex-1 min-w-32 h-8 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Press Enter or comma to add members
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="h-12 px-6 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Project
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;