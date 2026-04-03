import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      toast.success("Role updated!");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/users/${id}/status`, { status });
      toast.success("Status updated!");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div style={{ color: "#4b5563" }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#e2e8f0" }}>
          User Management
        </h1>
        <p style={{ color: "#4b5563", fontSize: 14, marginTop: 4 }}>
          {users.length} total users
        </p>
      </div>

      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2d3148" }}>
              {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      fontSize: 12,
                      color: "#4b5563",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: "1px solid #2d314820" }}>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#e2e8f0",
                    fontWeight: 500,
                  }}
                >
                  {u.name}
                </td>
                <td style={{ padding: "12px", fontSize: 13, color: "#94a3b8" }}>
                  {u.email}
                </td>
                <td style={{ padding: "12px" }}>
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    style={{
                      background: "#0f1117",
                      border: "1px solid #2d3148",
                      color: "#e2e8f0",
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    <option value="viewer">viewer</option>
                    <option value="analyst">analyst</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ padding: "12px" }}>
                  <span className={`badge badge-${u.status}`}>{u.status}</span>
                </td>
                <td style={{ padding: "12px", fontSize: 12, color: "#4b5563" }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() =>
                      updateStatus(
                        u._id,
                        u.status === "active" ? "inactive" : "active",
                      )
                    }
                    className={`btn ${u.status === "active" ? "btn-danger" : "btn-primary"}`}
                    style={{ padding: "4px 12px", fontSize: 12 }}
                  >
                    {u.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
