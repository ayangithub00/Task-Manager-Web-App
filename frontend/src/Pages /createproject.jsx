// ─────────────────────────────────────────────
// createproject.jsx  →  src/Pages/createproject.jsx
// ─────────────────────────────────────────────
// Key changes:
// 1. Removed the "username" field (backend ignores it, derives from JWT)
// 2. Members are now picked from a DROPDOWN of real users fetched from /api/v1/users/
//    instead of typing usernames blindly (which could result in typos / invalid users)
// 3. If user is not an owner, we redirect them — members can't create projects

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllUsers } from "../API/auth";
import {
  FolderPlus, FileText, Users,
  ArrowLeft, ArrowRight, X, UserPlus,
} from "lucide-react";

const CreateProject = () => {
  const navigate = useNavigate();

  // If the logged-in user is not an owner, redirect to dashboard immediately.
  // This is a FRONTEND guard — the backend also blocks it, but this gives a better UX.
  const role = localStorage.getItem("role");
  if (role !== "owner") {
    navigate("/dashboard");
    return null;
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // allUsers → fetched from /api/v1/users/ → array of {id, username, role}
  const [allUsers, setAllUsers] = useState([]);

  // selectedMembers → array of user objects the owner has chosen to add
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch all available users when the component loads
  // so the owner can pick from a real dropdown instead of typing usernames
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchAllUsers();
        // Only show members in the dropdown — owners manage, members work
        const memberUsers = Array.isArray(users)
          ? users.filter((u) => u.role === "member")
          : [];
        setAllUsers(memberUsers);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Called when owner picks a user from the dropdown
  const handleAddMember = (e) => {
    const userId = Number(e.target.value);
    if (!userId) return;

    // Find the full user object from allUsers
    const user = allUsers.find((u) => u.id === userId);

    // Don't add duplicates
    if (user && !selectedMembers.find((m) => m.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }

    // Reset the dropdown back to placeholder after selection
    e.target.value = "";
  };

  // Remove a member from the selection by clicking the X on their tag
  const handleRemoveMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== userId));
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
          // Send member USERNAMES — the backend resolves them to User objects
          // and adds them to the project's M2M members field
          members: selectedMembers.map((m) => m.username),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert(data.detail || "Error creating project");
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

            {/* ── ADD MEMBERS DROPDOWN ── */}
            {/* Instead of typing usernames blindly, owner picks from a real list.
                The dropdown shows all users with role='member'.
                Each picked user appears as a removable tag below the dropdown. */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Add Team Members
              </label>

              {/* Dropdown to pick members */}
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  onChange={handleAddMember}
                  defaultValue=""
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a member to add...</option>
                  {allUsers
                    // Filter out already-selected members from the dropdown
                    .filter((u) => !selectedMembers.find((m) => m.id === u.id))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))
                  }
                </select>
              </div>

              {/* Selected members shown as removable tags */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedMembers.map((member) => (
                    <span
                      key={member.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-sm"
                    >
                      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">
                        {member.username.charAt(0).toUpperCase()}
                      </span>
                      {member.username}
                      {/* X button removes this member from selection */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="hover:text-red-300 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-500">
                {allUsers.length === 0
                  ? "No members available to add yet."
                  : "Select members from the dropdown above."}
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