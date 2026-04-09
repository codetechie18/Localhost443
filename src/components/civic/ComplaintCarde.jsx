import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { MapPin, Calendar, Building2 } from 'lucide-react';

const statusSteps = ['Pending', 'In Progress', 'Resolved'];

function StatusTimeline({ current }) {
  const idx = statusSteps.indexOf(current);
  return (
    <div className="flex items-center gap-1 mt-3">
      {statusSteps.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded-full transition-colors ${
            i <= idx
              ? step === 'Pending' ? 'bg-pending' : step === 'In Progress' ? 'bg-in-progress' : 'bg-resolved'
              : 'bg-muted'
          }`} />
          <span className={`text-[10px] ${i <= idx ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            {step}
          </span>
          {i < statusSteps.length - 1 && (
            <div className={`w-6 h-0.5 ${i < idx ? 'bg-resolved' : 'bg-muted'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ComplaintCard({ complaint, onFeedback }) {
  return (
    <div className="bg-card rounded-lg card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden animate-fade-in">
      {complaint.image && (
        <img src={complaint.image} alt={complaint.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm">{complaint.title}</h3>
          <PriorityBadge priority={complaint.priority} />
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{complaint.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{complaint.location.address}</span>
          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{complaint.department}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{complaint.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={complaint.status} />
        </div>
        <StatusTimeline current={complaint.status} />
        {complaint.status === 'Resolved' && !complaint.feedback && onFeedback && (
          <button
            onClick={() => onFeedback(complaint.id)}
            className="w-full mt-2 text-xs py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Leave Feedback
          </button>
        )}
        {complaint.feedback && (
          <div className="mt-2 p-2 bg-muted rounded text-xs">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= complaint.feedback.rating ? 'text-in-progress' : 'text-muted-foreground'}>★</span>
              ))}
            </div>
            <p className="text-muted-foreground mt-1">{complaint.feedback.comment}</p>
          </div>
        )}
      </div>
    </div>
  );
}
