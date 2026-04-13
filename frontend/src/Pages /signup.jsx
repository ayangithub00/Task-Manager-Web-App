// ─────────────────────────────────────────────
// signup.jsx  →  src/Pages/signup.jsx
// ─────────────────────────────────────────────
// The signup page now includes a ROLE SELECTOR.
// Users choose between:
//   "Owner"  → can create projects, add members, assign tasks
//   "Member" → gets added to projects and works on assigned tasks

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Briefcase, Users } from "lucide-react"
import { signupUser } from "../API/auth"

export default function Signup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",  // will be set when user clicks Owner or Member card
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Called when user clicks the Owner or Member role card
  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

    // Make sure the user has picked a role before submitting
    if (!formData.role) {
      setError("Please select a role to continue.")
      return
    }

    setIsLoading(true)

    try {
      const { data, ok } = await signupUser(formData)

      if (ok) {
        // Registration successful — send them to login
        navigate("/login")
      } else {
        // Show any validation errors from the backend (e.g. "username already exists")
        const errorMsg = Object.values(data).flat().join(" ")
        setError(errorMsg || "Signup failed. Please try again.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Live password strength checks shown below the password field
  const passwordChecks = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(formData.password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <div className="w-5 h-5 rounded-md bg-white" />
          </div>
          <span className="text-xl font-semibold text-slate-900">TaskManager</span>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create account</h2>
          <p className="text-slate-500">Get started with your free account today</p>
        </div>

        {/* ── ROLE SELECTOR ── */}
        {/* This is the most important new addition.
            Users click one of these cards to set their role.
            The selected card gets a dark border + checkmark. */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-900 text-center">I want to...</p>
          <div className="grid grid-cols-2 gap-4">

            {/* Owner Card */}
            <button
              type="button"
              onClick={() => handleRoleSelect("owner")}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                formData.role === "owner"
                  ? "border-slate-900 bg-slate-900 text-white"  // selected state
                  : "border-slate-200 bg-white hover:border-slate-400"  // unselected
              }`}
            >
              {/* Checkmark shown only when this role is selected */}
              {formData.role === "owner" && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <Check className="h-3 w-3 text-slate-900" />
                </div>
              )}
              <Briefcase className={`h-6 w-6 mb-2 ${formData.role === "owner" ? "text-white" : "text-slate-600"}`} />
              <p className={`font-semibold text-sm ${formData.role === "owner" ? "text-white" : "text-slate-900"}`}>
                Project Owner
              </p>
              <p className={`text-xs mt-1 ${formData.role === "owner" ? "text-slate-300" : "text-slate-500"}`}>
                Create & manage projects
              </p>
            </button>

            {/* Member Card */}
            <button
              type="button"
              onClick={() => handleRoleSelect("member")}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                formData.role === "member"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              {formData.role === "member" && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <Check className="h-3 w-3 text-slate-900" />
                </div>
              )}
              <Users className={`h-6 w-6 mb-2 ${formData.role === "member" ? "text-white" : "text-slate-600"}`} />
              <p className={`font-semibold text-sm ${formData.role === "member" ? "text-white" : "text-slate-900"}`}>
                Team Member
              </p>
              <p className={`text-xs mt-1 ${formData.role === "member" ? "text-slate-300" : "text-slate-500"}`}>
                Work on assigned tasks
              </p>
            </button>
          </div>
        </div>

        {/* Error message (shown if role not selected or backend returns error) */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">

          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-900">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="username"
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-900">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-900">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Live password strength indicators */}
            {formData.password && (
              <div className="flex flex-wrap gap-2 pt-2">
                {passwordChecks.map((check, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors ${
                      check.met ? "bg-slate-900/10 text-slate-900" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {check.met && <Check className="h-3 w-3" />}
                    {check.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-slate-900 hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}