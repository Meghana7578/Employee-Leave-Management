
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    mobile: ""
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        form
      );

      setMessage(response.data.message);

      setForm({
        name: "",
        email: "",
        password: "",
        department: "",
        designation: "",
        mobile: ""
      });
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-icon">👤</div>

        <h1>Create Your Account</h1>
        <p className="register-subtitle">
          Register as an employee to access the leave management portal.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="register-fields">
            <div>
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                placeholder="e.g. IT"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                name="designation"
                placeholder="e.g. Developer"
                value={form.designation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            value={form.mobile}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account →</button>
        </form>

        {message && (
          <p className={isError ? "register-error" : "register-success"}>
            {message}
          </p>
        )}

        <p className="register-login">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
