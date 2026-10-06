import { useState } from "react";
import { STATUSES } from "../constants";

const blank = () => ({ company: "", role: "", link: "", salary: "", notes: "", date: new Date().toISOString().slice(0, 10), status: "Applied" });

export default function JobForm({ job, onSave, onClose }) {
  const [form, setForm] = useState(job || blank());
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, company: form.company.trim(), role: form.role.trim() });
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{job ? "Edit application" : "Add application"}</h2>
        <label>Company<input required value={form.company} onChange={set("company")} /></label>
        <label>Role<input required value={form.role} onChange={set("role")} /></label>
        <div className="row">
          <label>Date applied<input type="date" required value={form.date} onChange={set("date")} /></label>
          <label>Status
            <select value={form.status} onChange={set("status")}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <div className="row">
          <label>Salary<input placeholder="e.g. 6 LPA" value={form.salary} onChange={set("salary")} /></label>
          <label>Job link<input type="url" placeholder="https://" value={form.link} onChange={set("link")} /></label>
        </div>
        <label>Notes<textarea rows="3" value={form.notes} onChange={set("notes")} /></label>
        <div className="actions">
          <button type="button" className="ghost" onClick={onClose}>Cancel</button>
          <button type="submit">Save application</button>
        </div>
      </form>
    </div>
  );
}
