import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f1117",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40 }}>💹</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#e2e8f0",
              marginTop: 8,
            }}
          >
            FinDash
          </h1>
          <p style={{ color: "#4b5563", fontSize: 14, marginTop: 4 }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@demo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: 12, marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#0f1117",
            borderRadius: 8,
            border: "1px solid #2d3148",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "#4b5563",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            DEMO ACCOUNTS
          </p>
          {[
            { role: "Admin", email: "admin@demo.com" },
            { role: "Analyst", email: "analyst@demo.com" },
            { role: "Viewer", email: "viewer@demo.com" },
          ].map((d) => (
            <div
              key={d.role}
              style={{
                fontSize: 12,
                color: "#94a3b8",
                marginBottom: 4,
                cursor: "pointer",
              }}
              onClick={() =>
                setForm({ email: d.email, password: "password123" })
              }
            >
              <span style={{ color: "#3b82f6" }}>{d.role}:</span> {d.email} /
              password123
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          No account?{" "}
          <Link to="/register" style={{ color: "#3b82f6" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
