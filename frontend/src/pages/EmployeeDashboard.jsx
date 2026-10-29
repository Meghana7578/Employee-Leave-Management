
import { Link } from "react-router-dom";

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <main className="employee-dashboard">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-label">
            EMPLOYEE LEAVE MANAGEMENT PORTAL
          </span>

          <h1>
            Welcome back, {user.name || (user.role === "Admin" ? "Admin" : "Employee")}!
          </h1>

          <p>
            {user.role === "Admin"
              ? "Manage employee leave requests and records from your dashboard."
              : "Manage your leave applications and keep track of their status."}
          </p>
        </div>

        <div className="dashboard-avatar">
          {user.role === "Admin" ? "🛡️" : "👋"}
        </div>
      </section>

      {user.role === "Admin" ? (
        <section className="dashboard-section">
          <h2>Administration</h2>
          <p className="dashboard-description">
            Access the administration section to manage leave requests.
          </p>

          <div className="dashboard-links">
            <Link to="/admin-dashboard">
              <span className="dashboard-card-icon">📋</span>
              <strong>Manage Leave Requests</strong>
              <span>Review and process leave applications →</span>
            </Link>
          </div>
        </section>
      ) : (
        <section className="dashboard-section">
          <h2>Your Leave Workspace</h2>
          <p className="dashboard-description">
            Choose an option below to manage your leave applications.
          </p>

          <div className="dashboard-links">
            <Link to="/apply-leave">
              <span className="dashboard-card-icon">📝</span>
              <strong>Apply Leave</strong>
              <span>Submit a new leave application →</span>
            </Link>

            <Link to="/leave-history">
              <span className="dashboard-card-icon">📅</span>
              <strong>Leave History</strong>
              <span>View your previous applications →</span>
            </Link>

            <Link to="/leave-status">
              <span className="dashboard-card-icon">🔎</span>
              <strong>Leave Status</strong>
              <span>Check the status of your requests →</span>
            </Link>

            <Link to="/employee-profile">
  <span className="dashboard-card-icon">👤</span>
  <strong>My Profile</strong>
  <span>View and update your details →</span>
</Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default EmployeeDashboard;
