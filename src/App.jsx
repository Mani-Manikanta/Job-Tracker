import { useState, useMemo } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Board from "./components/Board";
import Analytics from "./components/Analytics";
import JobForm from "./components/JobForm";
import { SAMPLE_JOBS } from "./constants";

export default function App() {
  const [jobs, setJobs] = useLocalStorage("dc-jobs", SAMPLE_JOBS);
  const [theme, setTheme] = useLocalStorage("dc-theme", "light");
  const [tab, setTab] = useState("board");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [editing, setEditing] = useState(null); // null = closed, {} = new, job = edit

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    const list = jobs.filter((j) => `${j.company} ${j.role}`.toLowerCase().includes(q));
    const sorters = {
      newest: (a, b) => b.date.localeCompare(a.date),
      oldest: (a, b) => a.date.localeCompare(b.date),
      company: (a, b) => a.company.localeCompare(b.company),
    };
    return [...list].sort(sorters[sort]);
  }, [jobs, search, sort]);

  const responded = jobs.filter((j) => j.status !== "Applied").length;
  const responseRate = jobs.length ? Math.round((responded / jobs.length) * 100) : 0;

  const save = (job) => {
    setJobs(job.id ? jobs.map((j) => (j.id === job.id ? job : j)) : [{ ...job, id: crypto.randomUUID() }, ...jobs]);
    setEditing(null);
  };
  const move = (id, status) => setJobs(jobs.map((j) => (j.id === id ? { ...j, status } : j)));
  const remove = (id) => window.confirm("Delete this application?") && setJobs(jobs.filter((j) => j.id !== id));

  const exportCsv = () => {
    const head = ["company", "role", "status", "date", "salary", "link", "notes"];
    const rows = jobs.map((j) => head.map((h) => `"${String(j[h] ?? "").replace(/"/g, '""')}"`).join(","));
    const url = URL.createObjectURL(new Blob([[head.join(","), ...rows].join("\n")], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "applications.csv" }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app" data-theme={theme}>
      <header>
        <div>
          <h1>DevConnect</h1>
          <p>{jobs.length} applications | {responseRate}% heard back</p>
        </div>
        <div className="header-actions">
          <button className="ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
          <button className="ghost" onClick={exportCsv}>Export CSV</button>
          <button onClick={() => setEditing({})}>Add application</button>
        </div>
      </header>

      <div className="toolbar">
        <div className="tabs">
          <button className={tab === "board" ? "active" : ""} onClick={() => setTab("board")}>Board</button>
          <button className={tab === "analytics" ? "active" : ""} onClick={() => setTab("analytics")}>Analytics</button>
        </div>
        <input placeholder="Search company or role" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort applications">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A-Z</option>
        </select>
      </div>

      {tab === "board" ? (
        <Board jobs={visible} onMove={move} onEdit={setEditing} onDelete={remove} />
      ) : (
        <Analytics jobs={jobs} />
      )}

      {editing && <JobForm job={editing.id ? editing : null} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
