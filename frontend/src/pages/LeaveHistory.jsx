
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaves() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const response = await axios.get(
          `${API_URL}/api/leaveApplications/my/${user.employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setLeaves(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
          "Could not load leave history. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLeaves();
  }, []);

  function getStatusClass(status) {
    const value = (status || "").toLowerCase();

    if (value === "approved") return "history-status approved";
    if (value === "rejected") return "history-status rejected";

    return "history-status pending";
  }

  return (
    <main className="leave-history-page">
      <section className="history-heading">
        <div>
          <span className="history-label">EMPLOYEE PORTAL</span>
          <h1>Leave History</h1>
          <p>View your submitted leave applications and their current status.</p>
        </div>

        <div className="history-icon">📅</div>
      </section>

      <section className="history-content">
        <div className="history-summary">
          <div>
            <span>Total Applications</span>
            <strong>{leaves.length}</strong>
          </div>
          <div>
            <span>Approved</span>
            <strong>{leaves.filter(leave => leave.leaveStatus === "Approved").length}</strong>
          </div>
          <div>
            <span>Pending</span>
            <strong>{leaves.filter(leave => leave.leaveStatus === "Pending").length}</strong>
          </div>
          <div>
            <span>Rejected</span>
            <strong>{leaves.filter(leave => leave.leaveStatus === "Rejected").length}</strong>
          </div>
        </div>

        {loading && <p className="history-message">Loading leave history...</p>}

        {!loading && message && (
          <p className="history-error">{message}</p>
        )}

        {!loading && !message && leaves.length === 0 && (
          <div className="history-empty">
            <span>📭</span>
            <h2>No Leave Applications Yet</h2>
            <p>Your submitted leave applications will appear here.</p>
          </div>
        )}

        {!loading && !message && leaves.length > 0 && (
          <div className="history-list">
            {leaves.map((leave) => (
              <article key={leave._id} className="history-card">
                <div className="history-card-top">
                  <div>
                    <span className="history-type-label">LEAVE TYPE</span>
                    <h2>{leave.leaveType}</h2>
                  </div>

                  <span className={getStatusClass(leave.leaveStatus)}>
                    {leave.leaveStatus || "Pending"}
                  </span>
                </div>

                <div className="history-dates">
                  <div>
                    <span>From Date</span>
                    <strong>
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </strong>
                  </div>
                  <div>
                    <span>To Date</span>
                    <strong>
                      {new Date(leave.toDate).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                <div className="history-reason">
                  <span>Reason</span>
                  <p>{leave.reason}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default LeaveHistory;
