import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
];

const StatCard = ({ label, value, color, icon }) => (
  <div className="card" style={{ flex: 1 }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 13, color: "#4b5563", marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const canSeeAnalytics = ["admin", "analyst"].includes(user?.role);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [recentRes, ...analyticsRes] = await Promise.all([
          api.get("/dashboard/recent"),
          ...(canSeeAnalytics
            ? [
                api.get("/dashboard/summary"),
                api.get("/dashboard/trends"),
                api.get("/dashboard/by-category"),
              ]
            : []),
        ]);

        setRecent(recentRes.data.transactions);

        if (canSeeAnalytics) {
          setSummary(analyticsRes[0].data.summary);

          // Format trends for chart
          const trendsMap = {};
          analyticsRes[1].data.data.forEach(({ _id, total }) => {
            const key = `${months[_id.month]} ${_id.year}`;
            if (!trendsMap[key])
              trendsMap[key] = { month: key, income: 0, expense: 0 };
            trendsMap[key][_id.type] = total;
          });
          setTrends(Object.values(trendsMap).slice(-6));

          // Format category data
          const catMap = {};
          analyticsRes[2].data.data.forEach(({ _id, total }) => {
            catMap[_id.category] = (catMap[_id.category] || 0) + total;
          });
          setByCategory(
            Object.entries(catMap).map(([name, value]) => ({ name, value })),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div style={{ color: "#4b5563", padding: 40 }}>Loading dashboard...</div>
    );

  const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#e2e8f0" }}>
          Dashboard
        </h1>
        <p style={{ color: "#4b5563", marginTop: 4 }}>
          Welcome back, {user?.name} ·{" "}
          <span className={`badge badge-${user?.role}`}>{user?.role}</span>
        </p>
      </div>

      {/* Summary Cards — analyst + admin only */}
      {canSeeAnalytics && summary && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <StatCard
            label="Total Income"
            value={fmt(summary.totalIncome)}
            color="#10b981"
            icon="📈"
          />
          <StatCard
            label="Total Expenses"
            value={fmt(summary.totalExpense)}
            color="#ef4444"
            icon="📉"
          />
          <StatCard
            label="Net Balance"
            value={fmt(summary.netBalance)}
            color={summary.netBalance >= 0 ? "#10b981" : "#ef4444"}
            icon="💰"
          />
        </div>
      )}

      {/* Charts Row */}
      {canSeeAnalytics && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {/* Trends Chart */}
          <div className="card" style={{ flex: 2, minWidth: 300 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 20,
                color: "#e2e8f0",
              }}
            >
              Monthly Trends
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trends}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#4b5563", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1d27",
                    border: "1px solid #2d3148",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Income"
                />
                <Bar
                  dataKey="expense"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Expense"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie */}
          <div className="card" style={{ flex: 1, minWidth: 260 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 20,
                color: "#e2e8f0",
              }}
            >
              By Category
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={byCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  nameKey="name"
                >
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1a1d27",
                    border: "1px solid #2d3148",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 20,
            color: "#e2e8f0",
          }}
        >
          Recent Transactions
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2d3148" }}>
              {["Date", "Category", "Type", "Amount", "Notes"].map((h) => (
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
            {recent.map((t) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
