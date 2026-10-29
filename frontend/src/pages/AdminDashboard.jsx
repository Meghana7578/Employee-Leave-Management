
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <main className="admin-dashboard">
      <section className="admin-welcome">
        <div>
          <span className="admin-label">ADMINISTRATION PORTAL</span>
          <h1>Welcome, Admin!</h1>
          <p>
            Manage employee records, review leave requests, and view leave
            reports from one place.
          </p>
        </div>

        <div className="admin-welcome-icon">🛡️</div>
      </section>

      <section className="admin-workspace">
        <h2>Administration Workspace</h2>
        <p className="admin-description">
          Select an option below to continue.
        </p>

        <div className="admin-action-grid">
          <Link to="/manage-leaves" className="admin-action-card">
            <span className="admin-action-icon">📋</span>
            <h3>Manage Leave Requests</h3>
            <p>Review employee applications and approve or reject requests.</p>
            <span className="admin-action-link">Open requests →</span>
          </Link>

          <Link to="/manage-employees" className="admin-action-card">
            <span className="admin-action-icon">👥</span>
            <h3>Manage Employees</h3>
            <p>View and manage employee records.</p>
            <span className="admin-action-link">View employees →</span>
          </Link>

          <Link to="/leave-reports" className="admin-action-card">
            <span className="admin-action-icon">📊</span>
            <h3>Leave Reports</h3>
            <p>View leave application summaries and status counts.</p>
            <span className="admin-action-link">View reports →</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
