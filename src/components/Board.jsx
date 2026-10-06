import { useState } from "react";
import { STATUSES, COLORS } from "../constants";

export default function Board({ jobs, onMove, onEdit, onDelete }) {
  const [over, setOver] = useState(null);

  return (
    <div className="board">
      {STATUSES.map((status) => {
        const list = jobs.filter((j) => j.status === status);
        return (
          <section
            key={status}
            className={`column ${over === status ? "over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOver(status); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => { onMove(e.dataTransfer.getData("text/plain"), status); setOver(null); }}
          >
            <h3 style={{ borderColor: COLORS[status] }}>
              {status} <span className="count">{list.length}</span>
            </h3>
            {list.length === 0 && <p className="empty">Drag an application here</p>}
            {list.map((job) => (
              <article key={job.id} className="card" draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", job.id)}>
                <strong>{job.company}</strong>
                <span>{job.role}</span>
                <small>{job.date}{job.salary && ` | ${job.salary}`}</small>
                {job.notes && <p className="notes">{job.notes}</p>}
                <div className="card-actions">
                  {job.link && <a href={job.link} target="_blank" rel="noreferrer">Open posting</a>}
                  <button className="link" onClick={() => onEdit(job)}>Edit</button>
                  <button className="link danger" onClick={() => onDelete(job.id)}>Delete</button>
                </div>
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
