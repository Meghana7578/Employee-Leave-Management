import ManageEmployees from "./pages/ManageEmployees";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveHistory from "./pages/LeaveHistory";
import LeaveStatus from "./pages/LeaveStatus";
import AdminDashboard from "./pages/AdminDashboard";
import ManageLeaveRequests from "./pages/ManageLeaveRequests";
import LeaveReports from "./pages/LeaveReports";
import EmployeeProfile from "./pages/EmployeeProfile";
function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  }

  return (
    <nav>
      <h2>Employee Leave Management</h2>

      <div>
        <Link to="/">Home</Link>{" "}

        {!user ? (
          <>
            <Link to="/register">Register</Link>{" "}
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <span>Welcome, {user.name}</span>{" "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/leave-history" element={<LeaveHistory />} />
        <Route path="/leave-status" element={<LeaveStatus />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
  path="/manage-leaves"
  element={<ManageLeaveRequests />}
/>
<Route
  path="/manage-employees"
  element={<ManageEmployees />}
/>
<Route path="/leave-reports" element={<LeaveReports />} />
<Route
  path="/employee-profile"
  element={<EmployeeProfile />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
