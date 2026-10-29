
import { useEffect, useState } from "react";
import axios from "axios";

function LeaveStatus() {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaveStatus() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const response = await axios.get(
          `http://localhost:5000/api/leaveApplications/my/${user.employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setLeaves(response.data);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
          "Could not load leave status."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLeaveStatus();
  }, []);

  function getStatusClass(status) {
    const value = (status || "").toLowerCase();

    if (value === "approved") return "status-badge status-approved";
    if (value === "rejected") return "status-badge status-rejected";

    return "status-badge status-pending";
  }

  return (
    <main className="leave-status-page">
      <section className="leave-status-heading">
        <div>
          <span className="status-page-label">EMPLOYEE PORTAL</span>
          <h1>Leave Status</h1>
          <p>Track the latest status of your leave applications.</p>
        </div>

        <div className="status-page-icon">🔎</div>
      </section>

      {!loading && !message && (
        <section className="status-overview">
          <div>
            <span>Total Requests</span>
            <strong>{leaves.length}</strong>
          </div>
          <div>
            <span>Approved</span>
            <strong>
              {leaves.filter(leave => leave.leaveStatus === "Approved").length}
            </strong>
          </div>
          <div>
            <span>Pending</span>
            <strong>
              {leaves.filter(leave => leave.leaveStatus === "Pending").length}
            </strong>
          </div>
          <div>
            <span>Rejected</span>
            <strong>
              {leaves.filter(leave => leave.leaveStatus === "Rejected").length}
            </strong>
          </div>
        </section>
      )}

      {loading && (
        <p className="status-info">Loading your leave status...</p>
      )}

      {!loading && message && (
        <p className="status-error">{message}</p>
      )}

      {!loading && !message && leaves.length === 0 && (
        <div className="status-empty">
          <span>📭</span>
          <h2>No Leave Requests Found</h2>
          <p>Your submitted leave requests will appear here.</p>
        </div>
      )}

      {!loading && !message && leaves.length > 0 && (
        <section className="status-list">
          {leaves.map((leave) => (
            <article key={leave._id} className="status-card">
              <div className="status-card-header">
                <div className="status-leave-icon">📄</div>
                <div className="status-leave-title">
                  <span>LEAVE TYPE</span>
                  <h2>{leave.leaveType}</h2>
                </div>
                <span className={getStatusClass(leave.leaveStatus)}>
                  {leave.leaveStatus || "Pending"}
                </span>
              </div>

              <div className="status-date-row">
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
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default LeaveStatus;
