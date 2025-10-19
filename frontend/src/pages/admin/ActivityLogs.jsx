import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    action: "",
    userId: "",
    limit: 50
  });

  // Fetch logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      
      const params = new URLSearchParams();
      if (filter.action) params.append("action", filter.action);
      if (filter.userId) params.append("userId", filter.userId);
      params.append("limit", filter.limit);

      const response = await api.get(`/activity-logs?${params.toString()}`);
      setLogs(response.data.logs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Action icon & color
  const getActionStyle = (action) => {
    const styles = {
      LOGIN_SUCCESS: { icon: "✅", color: "#4CAF50", bg: "#E8F5E9" },
      LOGIN_BLOCKED: { icon: "🚫", color: "#f44336", bg: "#FFEBEE" },
      AVATAR_UPLOAD: { icon: "📸", color: "#2196F3", bg: "#E3F2FD" },
      PASSWORD_RESET: { icon: "🔑", color: "#FF9800", bg: "#FFF3E0" },
      LOGOUT: { icon: "👋", color: "#9E9E9E", bg: "#F5F5F5" }
    };
    return styles[action] || { icon: "📋", color: "#666", bg: "#f9f9f9" };
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: 20 }}>
      <h1 style={{ color: "#2196F3", marginBottom: 10 }}>📊 Activity Logs (Admin)</h1>
      <p style={{ color: "#666", marginBottom: 30 }}>
        Ghi lại hoạt động người dùng & chống brute force login
      </p>

      {/* Filters */}
      <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 12, marginBottom: 30, display: "flex", gap: 15, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#555" }}>
            Action Type
          </label>
          <select
            value={filter.action}
            onChange={(e) => setFilter({ ...filter, action: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: 6, border: "2px solid #ddd", fontSize: 14 }}
          >
            <option value="">All Actions</option>
            <option value="LOGIN_SUCCESS">✅ Login Success</option>
            <option value="LOGIN_BLOCKED">🚫 Login Blocked</option>
            <option value="AVATAR_UPLOAD">📸 Avatar Upload</option>
            <option value="PASSWORD_RESET">🔑 Password Reset</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#555" }}>
            User ID
          </label>
          <input
            type="text"
            placeholder="Filter by User ID"
            value={filter.userId}
            onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: 6, border: "2px solid #ddd", fontSize: 14 }}
          />
        </div>

        <div style={{ width: 150 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14, color: "#555" }}>
            Limit
          </label>
          <input
            type="number"
            min="10"
            max="200"
            value={filter.limit}
            onChange={(e) => setFilter({ ...filter, limit: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: 6, border: "2px solid #ddd", fontSize: 14 }}
          />
        </div>

        <button
          onClick={fetchLogs}
          style={{ padding: "10px 24px", background: "#2196F3", color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 14 }}
        >
          🔍 Search
        </button>

        <button
          onClick={() => {
            setFilter({ action: "", userId: "", limit: 50 });
            setTimeout(fetchLogs, 100);
          }}
          style={{ padding: "10px 24px", background: "#9E9E9E", color: "white", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 14 }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
          ⏳ Loading logs...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: 15, background: "#FFEBEE", color: "#f44336", borderRadius: 8, marginBottom: 20, fontWeight: 500 }}>
          ❌ {error}
        </div>
      )}

      {/* Logs Table */}
      {!loading && !error && (
        <>
          <div style={{ marginBottom: 15, color: "#666", fontSize: 14 }}>
            Showing <strong>{logs.length}</strong> logs
          </div>

          {logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#999", background: "#f9f9f9", borderRadius: 12 }}>
              📭 No logs found
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <thead>
                  <tr style={{ background: "#2196F3", color: "white" }}>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600 }}>ID</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600 }}>Time</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600 }}>User ID</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600 }}>Action</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600 }}>Details</th>
                    <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600 }}>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => {
                    const style = getActionStyle(log.action);
                    return (
                      <tr key={log.id} style={{ borderBottom: "1px solid #f0f0f0", background: index % 2 === 0 ? "white" : "#fafafa" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#666" }}>#{log.id}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#333", whiteSpace: "nowrap" }}>
                          {formatTime(log.timestamp)}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#2196F3", fontWeight: 600 }}>
                          {log.userId}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ display: "inline-block", padding: "6px 12px", borderRadius: 6, background: style.bg, color: style.color, fontSize: 12, fontWeight: 600 }}>
                            {style.icon} {log.action}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#666", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {JSON.stringify(log.details)}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#666" }}>
                          {log.ip}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
