import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#1a1d27",
          borderRight: "1px solid #2d3148",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 24px 32px" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#3b82f6" }}>
            💹 FinDash
          </div>
          <div style={{ fontSize: "12px", color: "#4b5563", marginTop: 4 }}>
            Finance Dashboard
          </div>
        </div>

        {/* Nav Links */}
        <nav
          style={{
            flex: 1,
            padding: "0 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {[
            {
              to: "/dashboard",
              label: "📊 Dashboard",
              roles: ["viewer", "analyst", "admin"],
            },
            {
              to: "/transactions",
              label: "💰 Transactions",
              roles: ["viewer", "analyst", "admin"],
            },
            { to: "/users", label: "👥 Users", roles: ["admin"] },
          ]
            .filter((l) => l.roles.includes(user?.role))
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "all 0.2s",
                  background: isActive ? "#3b82f620" : "transparent",
                  color: isActive ? "#3b82f6" : "#94a3b8",
                  borderLeft: isActive
                    ? "3px solid #3b82f6"
                    : "3px solid transparent",
                })}
              >
                {link.label}
              </NavLink>
            ))}
        </nav>

        {/* User Info */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #2d3148" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 12 }}>
            {user?.email}
          </div>
          <span className={`badge badge-${user?.role}`}>{user?.role}</span>
          <button
            onClick={handleLogout}
            className="btn btn-ghost"
            style={{ width: "100%", marginTop: 12, fontSize: 13 }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "32px",
          overflowY: "auto",
          background: "#0f1117",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
