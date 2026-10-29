
import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-content">
          <span className="home-label">EMPLOYEE MANAGEMENT SYSTEM</span>

          <h1>
            Manage Your Leave,
            <span> The Smarter Way.</span>
          </h1>

          <p>
            Welcome to the Employee Leave Management Portal.
            Apply for leave, track application status, and manage
            employee leave requests in one convenient place.
          </p>

          <div className="home-actions">
            {user ? (
              <Link
                className="home-primary-btn"
                to={
                  user.role === "Admin"
                    ? "/admin-dashboard"
                    : "/employee-dashboard"
                }
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link className="home-primary-btn" to="/login">
                  Login to Portal →
                </Link>

                <Link className="home-secondary-btn" to="/register">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="home-visual">
          <div className="home-icon">📅</div>
          <h2>Leave Management</h2>
          <p>Simple. Organized. Efficient.</p>

          <div className="home-feature">
            <span>✓</span> Easy Leave Applications
          </div>
          <div className="home-feature">
            <span>✓</span> Track Leave Status
          </div>
          <div className="home-feature">
            <span>✓</span> Manage Requests Efficiently
          </div>
        </div>
      </section>

      <section className="home-bottom">
        <h2>Everything you need, in one portal.</h2>
        <p>
          A simple way for employees to apply for leave and for
          administrators to manage requests and employee records.
        </p>
      </section>
    </main>
  );
}

export default Home;
