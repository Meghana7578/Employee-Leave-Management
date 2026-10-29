
import { useEffect, useState } from "react";
import axios from "axios";

function LeaveReports() {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/leaveApplications",
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
          "Failed to load leave reports."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const approved = leaves.filter(
    (leave) => leave.leaveStatus === "Approved"
  ).length;

  const pending = leaves.filter(
    (leave) => leave.leaveStatus === "Pending"
  ).length;

  const rejected = leaves.filter(
    (leave) => leave.leaveStatus === "Rejected"
  ).length;

  function getStatusClass(status) {
    if (status === "Approved") return "report-status approved";
    if (status === "Rejected") return "report-status rejected";
    return "report-status pending";
  }

  return (
    <main className="leave-reports-page">
      <section className="reports-heading">
        <div>
          <span className="reports-label">ADMINISTRATION PORTAL</span>
          <h1>Leave Reports</h1>
          <p>Overview of employee leave applications and their status.</p>
        </div>

        <div className="reports-icon">📊</div>
      </section>

      <section className="reports-summary">
        <div className="report-stat total">
          <span className="report-stat-icon">📋</span>
          <p>Total Applications</p>
          <strong>{leaves.length}</strong>
        </div>

        <div className="report-stat approved-stat">
          <span className="report-stat-icon">✓</span>
          <p>Approved</p>
          <strong>{approved}</strong>
        </div>

        <div className="report-stat pending-stat">
          <span className="report-stat-icon">◷</span>
          <p>Pending</p>
          <strong>{pending}</strong>
        </div>

        <div className="report-stat rejected-stat">
          <span className="report-stat-icon">✕</span>
          <p>Rejected</p>
          <strong>{rejected}</strong>
        </div>
      </section>

      <section className="report-details-section">
        <div className="report-details-heading">
          <div>
            <h2>Application Details</h2>
            <p>All employee leave applications.</p>
          </div>

          <span className="report-count">{leaves.length} Records</span>
        </div>

        {loading && (
          <p className="report-message">Loading leave reports...</p>
        )}

        {!loading && message && (
          <p className="report-error">{message}</p>
        )}

        {!loading && !message && leaves.length === 0 && (
          <div className="report-empty">
            <span>📭</span>
            <h3>No Leave Applications Found</h3>
            <p>Submitted employee leave applications will appear here.</p>
          </div>
        )}

        {!loading && !message && leaves.length > 0 && (
          <div className="report-records">
            {leaves.map((leave) => (
              <article className="report-record" key={leave._id}>
                <div className="report-record-header">
                  <div>
                    <span className="report-field-label">EMPLOYEE ID</span>
                    <h3>{leave.employeeId}</h3>
                  </div>

                  <span className={getStatusClass(leave.leaveStatus)}>
                    {leave.leaveStatus || "Pending"}
                  </span>
                </div>

                <div className="report-record-grid">
                  <div>
                    <span>Leave Type</span>
                    <strong>{leave.leaveType}</strong>
                  </div>

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

                  <div>
                    <span>Applied On</span>
                    <strong>
                      {leave.applicationDate
                        ? new Date(leave.applicationDate).toLocaleDateString()
                        : "Not available"}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default LeaveReports;
