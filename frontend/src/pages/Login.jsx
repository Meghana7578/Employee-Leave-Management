
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/api/login`,
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (response.data.user.role === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-icon">🔐</div>

        <h1>Welcome Back!</h1>
        <p className="login-subtitle">
          Login to your Employee Leave Management Portal
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login to Portal →</button>
        </form>

        {message && <p className="login-error">{message}</p>}

        <p className="login-register">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
