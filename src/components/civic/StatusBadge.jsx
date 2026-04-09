const statusMap = {
  Pending: 'status-pending',
  'In Progress': 'status-in-progress',
  Resolved: 'status-resolved',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusMap[status] || ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'Pending' ? 'bg-pending' : status === 'In Progress' ? 'bg-in-progress' : 'bg-resolved'
      }`} />
      {status}
    </span>
  );
}
