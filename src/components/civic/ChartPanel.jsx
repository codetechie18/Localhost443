import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = {
  pending: '#e84118',
  inProgress: '#fbc531',
  resolved: '#44bd32',
  primary: '#2f3640',
};

export function TrendChart({ data }) {
  return (
    <div className="bg-card rounded-lg card-shadow p-5 animate-fade-in">
      <h3 className="font-semibold text-sm mb-4">Complaints vs Resolved</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,9%,87%)" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="complaints" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="resolved" stroke={COLORS.resolved} strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusDonut({ stats }) {
  const data = [
    { name: 'Pending', value: stats.pending, color: COLORS.pending },
    { name: 'In Progress', value: stats.inProgress, color: COLORS.inProgress },
    { name: 'Resolved', value: stats.resolved, color: COLORS.resolved },
  ];
  return (
    <div className="bg-card rounded-lg card-shadow p-5 animate-fade-in">
      <h3 className="font-semibold text-sm mb-4">Status Breakdown</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PriorityBar({ complaints }) {
  const data = [
    { priority: 'High', count: complaints.filter((c) => c.priority === 'High').length },
    { priority: 'Medium', count: complaints.filter((c) => c.priority === 'Medium').length },
    { priority: 'Low', count: complaints.filter((c) => c.priority === 'Low').length },
  ];
  const barColors = { High: COLORS.pending, Medium: COLORS.inProgress, Low: COLORS.resolved };
  return (
    <div className="bg-card rounded-lg card-shadow p-5 animate-fade-in">
      <h3 className="font-semibold text-sm mb-4">Priority Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,9%,87%)" />
          <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.priority} fill={barColors[entry.priority]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyChart({ data }) {
  return (
    <div className="bg-card rounded-lg card-shadow p-5 animate-fade-in">
      <h3 className="font-semibold text-sm mb-4">Monthly Complaint Tracker</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,9%,87%)" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="complaints" stroke={COLORS.primary} strokeWidth={2} fill={COLORS.primary} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WorkloadChart({ data }) {
  return (
    <div className="bg-card rounded-lg card-shadow p-5 animate-fade-in">
      <h3 className="font-semibold text-sm mb-4">Complaints Handled Per Day</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,9%,87%)" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="resolved" fill={COLORS.resolved} radius={[6, 6, 0, 0]} name="Handled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
