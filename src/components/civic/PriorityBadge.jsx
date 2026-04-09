const priorityMap = {
  High: 'bg-pending/15 text-pending',
  Medium: 'bg-in-progress/15 text-in-progress',
  Low: 'bg-resolved/15 text-resolved',
};

export default function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${priorityMap[priority] || ''}`}>
      {priority}
    </span>
  );
}
