import { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Star, Droplets, Save } from 'lucide-react';
import { CheckInEntry, SkinMood, SkinConcern } from '../types';
import { storage } from '../utils/storage';

const moodOptions: { value: SkinMood; label: string; icon: typeof Smile; color: string }[] = [
  { value: 'great', label: 'Great', icon: Smile, color: 'text-green-500' },
  { value: 'good', label: 'Good', icon: Smile, color: 'text-blue-500' },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'text-yellow-500' },
  { value: 'bad', label: 'Bad', icon: Frown, color: 'text-orange-500' },
  { value: 'terrible', label: 'Terrible', icon: Frown, color: 'text-destructive' },
];

const concernOptions: { value: SkinConcern; label: string }[] = [
  { value: 'acne', label: 'Acne' },
  { value: 'dry', label: 'Dry' },
  { value: 'oily', label: 'Oily' },
  { value: 'redness', label: 'Redness' },
  { value: 'sensitive', label: 'Sensitive' },
  { value: 'combination', label: 'Combination' },
];

export default function CheckIn() {
  const today = new Date().toISOString().split('T')[0];
  const [mood, setMood] = useState<SkinMood>('okay');
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const todayEntry = storage.getCheckIns().find(e => e.date === today);
    if (todayEntry) {
      setMood(todayEntry.mood);
      setConcerns(todayEntry.concerns);
      setWaterIntake(todayEntry.waterIntake);
      setRating(todayEntry.rating);
      setNotes(todayEntry.notes);
    }
  }, [today]);

  const handleSave = () => {
    const entry: CheckInEntry = {
      id: today,
      date: today,
      mood,
      concerns,
      waterIntake,
      rating,
      notes,
    };

    storage.saveCheckIn(entry);
    setSaved(true);
    window.dispatchEvent(new Event('checkin-update'));

    setTimeout(() => setSaved(false), 2000);
  };

  const toggleConcern = (concern: SkinConcern) => {
    setConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2>Daily Check-in</h2>
        <p className="text-muted-foreground mt-1">{new Date(today).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="space-y-4 bg-card border border-border rounded-lg p-6">
        <div>
          <label className="block mb-3">How is your skin feeling today?</label>
          <div className="flex gap-2">
            {moodOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    mood === option.value
                      ? 'border-primary bg-secondary'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${option.color}`} />
                  <span className="text-sm">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block mb-3">Skin concerns</label>
          <div className="flex flex-wrap gap-2">
            {concernOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleConcern(option.value)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  concerns.includes(option.value)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-3">
            <Droplets className="w-4 h-4 text-blue-500" />
            Water intake: {waterIntake} glasses
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="12"
              value={waterIntake}
              onChange={(e) => setWaterIntake(Number(e.target.value))}
              className="flex-1"
            />
            <div className="flex gap-1">
              <button
                onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                className="w-8 h-8 rounded bg-secondary hover:bg-accent flex items-center justify-center"
              >
                -
              </button>
              <button
                onClick={() => setWaterIntake(Math.min(12, waterIntake + 1))}
                className="w-8 h-8 rounded bg-secondary hover:bg-accent flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-3">Overall rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className="p-2"
              >
                <Star
                  className={`w-8 h-8 ${
                    value <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-3">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How does your skin feel? Any reactions or improvements?"
            className="w-full min-h-32 p-3 rounded-lg border border-border bg-input-background resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Check-in'}
        </button>
      </div>
    </div>
  );
}
