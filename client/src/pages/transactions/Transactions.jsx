import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Salary",
  "Sales",
  "Rent",
  "Marketing",
  "Utilities",
  "Travel",
  "Software",
  "Other",
];
const empty = { amount: "", type: "income", category: "", date: "", notes: "" };

export default function Transactions() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(empty);

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    from: "",
    to: "",
  });

  const fetchTransactions = async (pg = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pg,
        limit: 10,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      };
      const { data } = await api.get("/transactions", { params });
      setTransactions(data.transactions);
      setTotal(data.total);
      setPages(data.pages);
      setPage(pg);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/transactions/${editItem._id}`, form);
        toast.success("Transaction updated!");
      } else {
        await api.post("/transactions", form);
        toast.success("Transaction created!");
      }
      setShowForm(false);
      setEditItem(null);
      setForm(empty);
      fetchTransactions(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving transaction");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Deleted!");
      fetchTransactions(page);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openEdit = (t) => {
    setEditItem(t);
    setForm({
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date?.slice(0, 10),
      notes: t.notes,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#e2e8f0" }}>
            Transactions
          </h1>
          <p style={{ color: "#4b5563", fontSize: 14, marginTop: 4 }}>
            {total} total records
          </p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditItem(null);
              setForm(empty);
            }}
          >
            + Add Transaction
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1, minWidth: 120 }}>
          <label>Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 130 }}>
          <label>From Date</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </div>
        <div style={{ flex: 1, minWidth: 130 }}>
          <label>To Date</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>
        <button
          className="btn btn-ghost"
          onClick={() =>
            setFilters({ type: "", category: "", from: "", to: "" })
          }
        >
          Clear
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && isAdmin && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#e2e8f0",
              marginBottom: 20,
            }}
          >
            {editItem ? "Edit Transaction" : "New Transaction"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
              }}
            >
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  required
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Notes</label>
                <input
                  placeholder="Optional notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary">
                {editItem ? "Update" : "Create"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditItem(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card">
        {loading ? (
          <div style={{ color: "#4b5563", padding: 20 }}>Loading...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2d3148" }}>
                {[
                  "Date",
                  "Category",
                  "Type",
                  "Amount",
                  "Notes",
                  isAdmin ? "Actions" : "",
                ]
                  .filter(Boolean)
                  .map((h) => (
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
                  ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} style={{ borderBottom: "1px solid #2d314820" }}>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#94a3b8",
                    }}
                  >
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#e2e8f0",
                    }}
                  >
                    {t.category}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span className={`badge badge-${t.type}`}>{t.type}</span>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: t.type === "income" ? "#10b981" : "#ef4444",
                    }}
                  >
                    {t.type === "income" ? "+" : "-"} ₹
                    {t.amount.toLocaleString("en-IN")}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#4b5563",
                    }}
                  >
                    {t.notes || "—"}
                  </td>
                  {isAdmin && (
                    <td
                      style={{ padding: "10px 12px", display: "flex", gap: 8 }}
                    >
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "4px 12px", fontSize: 12 }}
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: "4px 12px", fontSize: 12 }}
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 20,
              justifyContent: "center",
            }}
          >
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchTransactions(p)}
                className={`btn ${p === page ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "6px 14px", fontSize: 13 }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
