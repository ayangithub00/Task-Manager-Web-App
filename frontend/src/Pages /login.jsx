// ─────────────────────────────────────────────
// login.jsx  →  src/Pages/login.jsx
// ─────────────────────────────────────────────
// After a successful login we:
// 1. Store the access token (used for all API requests)
// 2. Store the refresh token (used for logout)
// 3. Fetch /dashboard/ to get the user's role
// 4. Store the role in localStorage so ALL components can read it
//    without making another API call

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Step 1: Send username + password to get JWT tokens
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Step 2: Store both tokens
        // access token → sent as "Authorization: Bearer <token>" in every request
        localStorage.setItem("token", data.access)
        // refresh token → sent to /logout/ to blacklist it on logout
        localStorage.setItem("refresh_token", data.refresh)

        // Step 3: Fetch the dashboard to get the user's role
        // We need role RIGHT NOW so the dashboard knows what UI to show
        const dashRes = await fetch("http://127.0.0.1:8000/api/v1/dashboard/", {
          headers: { Authorization: `Bearer ${data.access}` },
        })
        const dashData = await dashRes.json()

        // Step 4: Store role in localStorage
        // Every component that needs to know "is this user an owner or member?"
        // just reads: localStorage.getItem("role")
        localStorage.setItem("role", dashData.role)

        // Step 5: Go to dashboard
        navigate("/dashboard")
      } else {
        setError(data.detail || data.error || "Login failed. Check your credentials.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h2>
          <p className="text-slate-500">Enter your credentials to access your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Username field — backend JWT login expects "username", not email */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-900">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-slate-900">Password</label>
              <Link to="/forgot-password" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-slate-900 text-white font-medium flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          {"Don't have an account?"}{" "}
          <Link to="/signup" className="font-medium text-slate-900 hover:underline underline-offset-4">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}