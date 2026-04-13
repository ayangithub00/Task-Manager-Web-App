// ─────────────────────────────────────────────
// navbar.jsx  →  src/Components/navbar.jsx
// ─────────────────────────────────────────────
// Changes:
// 1. Shows role badge (Owner / Member) next to the nav links
// 2. Logout calls the backend to blacklist the refresh token

import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, X, Crown, Users } from "lucide-react";
import { useState } from "react";
import { logoutUser } from "../API/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read role from localStorage — stored there during login
  const role = localStorage.getItem("role");
  const isOwner = role === "owner";

  const handleLogout = async () => {
    // Calls backend to blacklist refresh token, then clears localStorage
    await logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <div className="w-4 h-4 rounded-md bg-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">TaskManager</span>
          </div>

          {/* Desktop nav links + role badge */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>

            {/* Role badge — visually reminds the user what they can do */}
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              isOwner
                ? "bg-amber-100 text-amber-700"  // warm gold for owners
                : "bg-blue-100 text-blue-700"    // cool blue for members
            }`}>
              {isOwner ? <Crown className="h-3 w-3" /> : <Users className="h-3 w-3" />}
              {isOwner ? "Owner" : "Member"}
            </span>
          </div>

          {/* Desktop logout */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-2">

              {/* Role badge in mobile menu too */}
              <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium w-fit ${
                isOwner ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
              }`}>
                {isOwner ? <Crown className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                {isOwner ? "Project Owner" : "Team Member"}
              </div>

              <button
                onClick={() => { navigate("/dashboard"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;