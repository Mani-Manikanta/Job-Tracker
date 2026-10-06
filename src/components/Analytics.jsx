import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { STATUSES, COLORS } from "../constants";

const weekStart = (dateStr) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  return d.toISOString().slice(5, 10);
};

export default function Analytics({ jobs }) {
  if (jobs.length === 0) return <p className="empty">Add applications to see your analytics.</p>;

  const byStatus = STATUSES.map((s) => ({ name: s, value: jobs.filter((j) => j.status === s).length }));
  const weekly = Object.entries(
    jobs.reduce((acc, j) => ({ ...acc, [weekStart(j.date)]: (acc[weekStart(j.date)] || 0) + 1 }), {})
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, count]) => ({ week, count }));

  return (
    <div className="charts">
      <div className="panel">
        <h3>Status breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} label>
              {byStatus.map((e) => <Cell key={e.name} fill={COLORS[e.name]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="panel">
        <h3>Applications per week (week starting MM-DD)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weekly}>
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f6df5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
