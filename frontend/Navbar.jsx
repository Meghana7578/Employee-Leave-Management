
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 25px",
      backgroundColor: "#1e3a8a",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Employee Leave Portal
      </Link>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {user && (
          <>
            <span>{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
