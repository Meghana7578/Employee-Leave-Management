
import { useState } from "react";
import axios from "axios";
import API_URL from "../api";

function ApplyLeave() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    employeeId: user.employeeId || "",
    leaveType: "CL",
    fromDate: "",
    toDate: "",
    reason: ""
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

    if (form.toDate < form.fromDate) {
      setIsError(true);
      setMessage("To Date cannot be earlier than From Date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/leaveApplications`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("Leave application submitted successfully!");

      setForm({
        employeeId: user.employeeId || "",
        leaveType: "CL",
        fromDate: "",
        toDate: "",
        reason: ""
      });
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Leave application failed"
      );
    }
  }

  return (
    <main className="apply-leave-page">
      <section className="apply-leave-card">
        <div className="apply-leave-heading">
          <div className="apply-leave-icon">📝</div>
          <div>
            <h1>Apply for Leave</h1>
            <p>Fill in the details below to submit your leave request.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="employeeId">Employee ID</label>
          <input
            id="employeeId"
            name="employeeId"
            value={form.employeeId}
            readOnly
            required
          />

          <label htmlFor="leaveType">Leave Type</label>
          <select
            id="leaveType"
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            required
          >
            <option value="CL">Casual Leave (CL)</option>
            <option value="SL">Sick Leave (SL)</option>
            <option value="EL">Earned Leave (EL)</option>
            <option value="OD">On Duty (OD)</option>
          </select>

          <div className="apply-date-fields">
            <div>
              <label htmlFor="fromDate">From Date</label>
              <input
                id="fromDate"
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="toDate">To Date</label>
              <input
                id="toDate"
                type="date"
                name="toDate"
                min={form.fromDate || undefined}
                value={form.toDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label htmlFor="reason">Reason for Leave</label>
          <textarea
            id="reason"
            name="reason"
            placeholder="Briefly explain why you need leave..."
            value={form.reason}
            onChange={handleChange}
            rows={4}
            required
          />

          <button type="submit">Submit Leave Request →</button>
        </form>

        {message && (
          <p className={isError ? "apply-leave-error" : "apply-leave-success"}>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}

export default ApplyLeave;
