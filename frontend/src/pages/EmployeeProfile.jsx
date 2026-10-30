
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

function EmployeeProfile() {
  const [profile, setProfile] = useState({
    employeeName: "",
    email: "",
    department: "",
    designation: "",
    mobile: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/employees/my-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProfile({
          employeeName: response.data.employeeName || "",
          email: response.data.email || "",
          department: response.data.department || "",
          designation: response.data.designation || "",
          mobile: response.data.mobile || ""
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function handleChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/api/employees/my-profile`,
        {
          department: profile.department,
          designation: profile.designation,
          mobile: profile.mobile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile((previous) => ({
        ...previous,
        ...response.data.employee
      }));

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="profile-page">Loading profile...</main>;
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-heading">
          <div className="profile-avatar">👤</div>
          <span className="profile-label">EMPLOYEE ACCOUNT</span>
          <h1>My Profile</h1>
          <p>View and update your employee details.</p>
        </div>

        {message && <p className="profile-success">{message}</p>}
        {error && <p className="profile-error">{error}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            Employee Name
            <input value={profile.employeeName} readOnly />
          </label>

          <label>
            Email
            <input type="email" value={profile.email} readOnly />
          </label>

          <label>
            Department
            <input
              name="department"
              value={profile.department}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Designation
            <input
              name="designation"
              value={profile.designation}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Mobile
            <input
              name="mobile"
              type="tel"
              value={profile.mobile}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default EmployeeProfile;
