
import { useEffect, useState } from "react";
import axios from "axios";

function ManageLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  async function fetchLeaves() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/leaveApplications",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setLeaves(response.data);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not load leave requests."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function updateStatus(id, status) {
    setMessage("");

    try {
      await axios.put(
        `http://localhost:5000/api/leaveApplications/${id}`,
        { leaveStatus: status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage(`Leave request ${status.toLowerCase()} successfully.`);
      await fetchLeaves();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not update leave status."
      );
    }
  }

  function getStatusClass(status) {
    if (status === "Approved") return "request-status approved";
    if (status === "Rejected") return "request-status rejected";
    return "request-status pending";
  }

  return (
    <main className="manage-requests-page">
      <section className="requests-heading">
        <div>
          <span className="requests-label">ADMINISTRATION PORTAL</span>
          <h1>Manage Leave Requests</h1>
          <p>Review employee applications and update their leave status.</p>
        </div>
        <div className="requests-icon">📋</div>
      </section>

      {!loading && (
        <section className="requests-summary">
          <div>
            <span>Total Requests</span>
            <strong>{leaves.length}</strong>
          </div>
          <div>
            <span>Pending</span>
            <strong>{leaves.filter(leave => leave.leaveStatus === "Pending").length}</strong>
          </div>
          <div>
            <span>Approved</span>
            <strong>{leaves.filter(leave => leave.leaveStatus === "Approved").length}</strong>
          </div>
          <div>
            <span>Rejected</span>
            <strong>{leaves.filter(leave => leave.leaveStatus === "Rejected").length}</strong>
          </div>
        </section>
      )}

      {message && <p className="requests-message">{message}</p>}

      {loading && <p className="requests-message">Loading leave requests...</p>}

      {!loading && !message && leaves.length === 0 && (
        <div className="requests-empty">
          <span>📭</span>
          <h2>No Leave Requests</h2>
          <p>Employee leave applications will appear here.</p>
        </div>
      )}

      {!loading && leaves.length > 0 && (
        <section className="requests-list">
          {leaves.map((leave) => (
            <article className="request-card" key={leave._id}>
              <div className="request-card-header">
                <div>
                  <span className="request-small-label">EMPLOYEE ID</span>
                  <h2>{leave.employeeId}</h2>
                </div>
                <span className={getStatusClass(leave.leaveStatus)}>
                  {leave.leaveStatus || "Pending"}
                </span>
              </div>

              <div className="request-details">
                <div>
                  <span>Leave Type</span>
                  <strong>{leave.leaveType}</strong>
                </div>
                <div>
                  <span>From Date</span>
                  <strong>{new Date(leave.fromDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span>To Date</span>
                  <strong>{new Date(leave.toDate).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="request-reason">
                <span>Reason for Leave</span>
                <p>{leave.reason}</p>
              </div>

              {leave.leaveStatus === "Pending" && (
                <div className="request-actions">
                  <button
                    className="request-approve"
                    onClick={() => updateStatus(leave._id, "Approved")}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="request-reject"
                    onClick={() => updateStatus(leave._id, "Rejected")}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default ManageLeaveRequests;
