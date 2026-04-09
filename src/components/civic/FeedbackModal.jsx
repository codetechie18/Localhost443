import { useState } from 'react';
import { X, Star } from 'lucide-react';

export default function FeedbackModal({ complaintId, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit(complaintId, { rating, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-card rounded-lg card-shadow p-6 w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Rate this resolution</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
              >
                <Star className={`w-8 h-8 transition-colors ${
                  s <= (hover || rating) ? 'fill-in-progress text-in-progress' : 'text-muted'
                }`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full p-3 rounded-lg border border-border bg-background text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={rating === 0}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
