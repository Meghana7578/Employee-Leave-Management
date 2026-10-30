
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employeeName: "",
    department: "",
    designation: "",
    email: "",
    mobile: ""
  });

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  async function fetchEmployees() {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees`,
        { headers }
      );

      setEmployees(response.data);
      setMessage("");
      setIsError(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load employees."
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      employeeName: "",
      department: "",
      designation: "",
      email: "",
      mobile: ""
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/api/employees/${editingId}`,
          form,
          { headers }
        );
        setMessage("Employee updated successfully.");
      } else {
        await axios.post(
          `${API_URL}/api/employees`,
          form,
          { headers }
        );
        setMessage("Employee added successfully.");
      }

      resetForm();
      await fetchEmployees();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Operation failed."
      );
      setIsError(true);
    }
  }

  function handleEdit(employee) {
    setForm({
      employeeName: employee.employeeName || "",
      department: employee.department || "",
      designation: employee.designation || "",
      email: employee.email || "",
      mobile: employee.mobile || ""
    });

    setEditingId(employee._id);
    setMessage("");
    setIsError(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setMessage("");
    setIsError(false);

    try {
      await axios.delete(
        `${API_URL}/api/employees/${id}`,
        { headers }
      );

      setMessage("Employee deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchEmployees();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete employee."
      );
      setIsError(true);
    }
  }

  return (
    <main className="manage-employees-page">
      <section className="employees-heading">
        <div>
          <span className="employees-label">ADMINISTRATION PORTAL</span>
          <h1>Manage Employees</h1>
          <p>Add, update, and manage employee records.</p>
        </div>

        <div className="employees-heading-icon">👥</div>
      </section>

      {message && (
        <p className={isError ? "employees-error" : "employees-success"}>
          {message}
        </p>
      )}

      <section className="employee-form-card">
        <div className="employee-section-heading">
          <span className="employee-form-icon">
            {editingId ? "✏️" : "➕"}
          </span>
          <div>
            <h2>{editingId ? "Update Employee" : "Add New Employee"}</h2>
            <p>
              {editingId
                ? "Update the employee details below."
                : "Enter the details to add an employee record."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="employee-form-grid">
            <div>
              <label htmlFor="employeeName">Employee Name</label>
              <input
                id="employeeName"
                name="employeeName"
                placeholder="Enter full name"
                value={form.employeeName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                placeholder="Enter department"
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
                placeholder="Enter designation"
                value={form.designation}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="employeeEmail">Email Address</label>
              <input
                id="employeeEmail"
                name="email"
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="employee-mobile-field">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="employee-form-actions">
            <button type="submit">
              {editingId ? "Save Changes" : "Add Employee"} →
            </button>

            {editingId && (
              <button
                type="button"
                className="employee-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="employee-records-section">
        <div className="employee-records-heading">
          <div>
            <h2>Employee Records</h2>
            <p>View and manage registered employee information.</p>
          </div>

          <span className="employee-count">
            {employees.length} Employees
          </span>
        </div>

        {loading && (
          <p className="employee-empty-message">Loading employees...</p>
        )}

        {!loading && employees.length === 0 && !isError && (
          <div className="employee-empty-message">
            <span>📭</span>
            <h3>No Employees Found</h3>
            <p>Employee records will appear here.</p>
          </div>
        )}

        {!loading && employees.length > 0 && (
          <div className="employee-record-grid">
            {employees.map((employee) => (
              <article className="employee-record-card" key={employee._id}>
                <div className="employee-record-top">
                  <div className="employee-avatar">
                    {(employee.employeeName || "E").charAt(0).toUpperCase()}
                  </div>

                  <div className="employee-record-name">
                    <h3>{employee.employeeName}</h3>
                    <span>{employee.employeeId}</span>
                  </div>
                </div>

                <div className="employee-record-details">
                  <p>
                    <span>Department</span>
                    <strong>{employee.department}</strong>
                  </p>
                  <p>
                    <span>Designation</span>
                    <strong>{employee.designation}</strong>
                  </p>
                  <p>
                    <span>Email</span>
                    <strong>{employee.email}</strong>
                  </p>
                  <p>
                    <span>Mobile</span>
                    <strong>{employee.mobile}</strong>
                  </p>
                </div>

                <div className="employee-record-actions">
                  <button
                    type="button"
                    className="employee-edit-btn"
                    onClick={() => handleEdit(employee)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    className="employee-delete-btn"
                    onClick={() => handleDelete(employee._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ManageEmployees;
