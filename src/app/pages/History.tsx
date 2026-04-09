import { useState, useEffect } from 'react';
import { Calendar, Trash2, Star, Droplets } from 'lucide-react';
import { CheckInEntry } from '../types';
import { storage } from '../utils/storage';

export default function History() {
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    setEntries(storage.getCheckIns().sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, []);

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;

    const entryDate = new Date(entry.date);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (filter === 'week') return daysAgo <= 7;
    if (filter === 'month') return daysAgo <= 30;
    return true;
  });

  const handleDelete = (id: string) => {
    if (confirm('Delete this entry?')) {
      storage.deleteCheckIn(id);
      setEntries(entries.filter(e => e.id !== id));
      window.dispatchEvent(new Event('checkin-update'));
    }
  };

  const moodEmoji = (mood: string) => {
    const emojis = { great: '😊', good: '🙂', okay: '😐', bad: '😕', terrible: '😢' };
    return emojis[mood as keyof typeof emojis] || '😐';
  };

  const averageRating = filteredEntries.length > 0
    ? (filteredEntries.reduce((sum, e) => sum + e.rating, 0) / filteredEntries.length).toFixed(1)
    : '0';

  const averageWater = filteredEntries.length > 0
    ? (filteredEntries.reduce((sum, e) => sum + e.waterIntake, 0) / filteredEntries.length).toFixed(1)
    : '0';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2>History</h2>
        <div className="flex gap-2">
          {(['all', 'week', 'month'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-accent'
              }`}
            >
              {f === 'all' ? 'All' : f === 'week' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
      </div>

      {filteredEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Total entries</div>
            <div className="text-2xl">{filteredEntries.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Average rating
            </div>
            <div className="text-2xl">{averageRating} / 5</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              Average water
            </div>
            <div className="text-2xl">{averageWater} glasses</div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{moodEmoji(entry.mood)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      {entry.rating}/5
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      {entry.waterIntake} glasses
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {entry.concerns.length > 0 && (
              <div className="mb-2">
                <div className="text-sm text-muted-foreground mb-1">Concerns</div>
                <div className="flex flex-wrap gap-2">
                  {entry.concerns.map(concern => (
                    <span key={concern} className="px-2 py-1 bg-secondary rounded text-sm capitalize">
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.notes && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Notes</div>
                <p className="text-sm">{entry.notes}</p>
              </div>
            )}
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No entries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
