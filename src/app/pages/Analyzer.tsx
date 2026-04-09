import { useState } from 'react';
import { ScanBarcode, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { analyzeIngredients } from '../utils/aiCoach';

export default function Analyzer() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [analysis, setAnalysis] = useState<{ safe: string[]; caution: string[]; avoid: string[] } | null>(null);

  const handleAnalyze = () => {
    if (!ingredientInput.trim()) return;

    const ingredients = ingredientInput
      .split(/[,\n]/)
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const result = analyzeIngredients(ingredients);
    setAnalysis(result);
  };

  const mockProducts = [
    {
      name: 'Gentle Hydrating Cleanser',
      brand: 'CeraVe',
      ingredients: ['Water', 'Glycerin', 'Ceramides', 'Hyaluronic Acid', 'Niacinamide']
    },
    {
      name: 'Daily Moisturizing Lotion',
      brand: 'CeraVe',
      ingredients: ['Water', 'Glycerin', 'Ceramides', 'Petrolatum', 'Dimethicone']
    },
    {
      name: 'Retinol Serum',
      brand: 'The Ordinary',
      ingredients: ['Water', 'Retinol', 'Squalane', 'Vitamin E', 'BHA']
    }
  ];

  const loadSampleProduct = (ingredients: string[]) => {
    setIngredientInput(ingredients.join(', '));
    setAnalysis(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ScanBarcode className="w-8 h-8 text-primary" />
        <div>
          <h2>Ingredient Analyzer</h2>
          <p className="text-muted-foreground">Check product ingredients for safety</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <label className="block">Enter ingredients</label>
        <textarea
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          placeholder="Paste ingredients here (comma or line separated)&#10;Example: Water, Glycerin, Niacinamide, Hyaluronic Acid..."
          className="w-full min-h-32 p-3 rounded-lg border border-border bg-input-background resize-none"
        />

        <button
          onClick={handleAnalyze}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <ScanBarcode className="w-4 h-4" />
          Analyze Ingredients
        </button>
      </div>

      {analysis && (
        <div className="space-y-4">
          {analysis.avoid.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-destructive mb-2">Avoid ({analysis.avoid.length})</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    These ingredients may be harmful or irritating
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.avoid.map((ingredient, index) => (
                  <span key={index} className="px-3 py-1 bg-destructive/20 text-destructive rounded">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.caution.length > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <Info className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-orange-500 mb-2">Use with Caution ({analysis.caution.length})</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Active ingredients that may cause sensitivity
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.caution.map((ingredient, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-500/20 text-orange-600 rounded">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.safe.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-green-500 mb-2">Safe Ingredients ({analysis.safe.length})</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generally safe and well-tolerated
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.safe.map((ingredient, index) => (
                  <span key={index} className="px-3 py-1 bg-green-500/20 text-green-600 rounded">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <h3>Sample Products</h3>
        <p className="text-sm text-muted-foreground">Click to analyze popular products</p>
        {mockProducts.map((product, index) => (
          <button
            key={index}
            onClick={() => loadSampleProduct(product.ingredients)}
            className="w-full text-left bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors"
          >
            <h4 className="mb-1">{product.name}</h4>
            <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {product.ingredients.join(', ')}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-secondary/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
        <p>💡 This analyzer provides basic guidance. Always consult with a dermatologist for specific concerns.</p>
      </div>
    </div>
  );
}
