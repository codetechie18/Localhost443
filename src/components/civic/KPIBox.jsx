const variantStyles = {
  total: 'border-l-primary',
  pending: 'border-l-pending',
  'in-progress': 'border-l-in-progress',
  resolved: 'border-l-resolved',
};

const iconColors = {
  total: 'bg-primary/10 text-primary',
  pending: 'bg-pending/10 text-pending',
  'in-progress': 'bg-in-progress/10 text-in-progress',
  resolved: 'bg-resolved/10 text-resolved',
};

export default function KPIBox({ title, value, icon: Icon, variant = 'total', trend }) {
  return (
    <div className={`bg-card rounded-lg border-l-4 ${variantStyles[variant]} p-5 card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1 animate-count-up">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-resolved' : 'text-pending'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColors[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
    