import { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Lightbulb } from 'lucide-react';
import { SkinConcern } from '../types';
import { storage } from '../utils/storage';
import { getAICoachAdvice, getRoutineAdvice } from '../utils/aiCoach';

export default function AICoach() {
  const [concerns, setConcerns] = useState<SkinConcern[]>([]);
  const [advice, setAdvice] = useState<{ message: string; recommendations: string[] } | null>(null);
  const [amAdvice, setAmAdvice] = useState<string[]>([]);
  const [pmAdvice, setPmAdvice] = useState<string[]>([]);

  useEffect(() => {
    const latestCheckIn = storage.getCheckIns().sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    if (latestCheckIn) {
      setConcerns(latestCheckIn.concerns);
    }
  }, []);

  useEffect(() => {
    if (concerns.length > 0) {
      const products = storage.getRoutineProducts();
      const productTypes = products.map(p => p.type);
      const coachAdvice = getAICoachAdvice(concerns, productTypes);
      setAdvice(coachAdvice);

      const amProducts = products.filter(p => p.timeOfDay === 'AM').map(p => p.type);
      const pmProducts = products.filter(p => p.timeOfDay === 'PM').map(p => p.type);

      setAmAdvice(getRoutineAdvice('AM', amProducts));
      setPmAdvice(getRoutineAdvice('PM', pmProducts));
    }
  }, [concerns]);

  const concernOptions: { value: SkinConcern; label: string }[] = [
    { value: 'acne', label: 'Acne' },
    { value: 'dry', label: 'Dry' },
    { value: 'oily', label: 'Oily' },
    { value: 'redness', label: 'Redness' },
    { value: 'sensitive', label: 'Sensitive' },
    { value: 'combination', label: 'Combination' },
  ];

  const toggleConcern = (concern: SkinConcern) => {
    setConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-primary" />
        <div>
          <h2>AI Skin Coach</h2>
          <p className="text-muted-foreground">Get personalized skincare guidance</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <label className="block">What are your skin concerns?</label>
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

      {advice && (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="mb-2">Personalized Advice</h3>
              <p className="text-muted-foreground">{advice.message}</p>
            </div>
          </div>

          {advice.recommendations.length > 0 && (
            <div className="space-y-2 pl-9">
              {advice.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {amAdvice.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-yellow-500" />
            <h3>Morning Routine Order</h3>
          </div>
          <div className="space-y-2">
            {amAdvice.map((step, index) => (
              <div key={index} className={step.startsWith('⚠️') ? 'text-destructive' : step.startsWith('💡') ? 'text-muted-foreground italic' : ''}>
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {pmAdvice.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-blue-500" />
            <h3>Evening Routine Order</h3>
          </div>
          <div className="space-y-2">
            {pmAdvice.map((step, index) => (
              <div key={index} className={step.startsWith('⚠️') ? 'text-destructive' : step.startsWith('💡') ? 'text-muted-foreground italic' : ''}>
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-secondary/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
        <p>💡 This is basic AI guidance. For personalized advice, consult with a dermatologist.</p>
      </div>
    </div>
  );
}
