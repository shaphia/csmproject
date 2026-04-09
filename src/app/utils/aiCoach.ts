import { SkinConcern, ProductType } from '../types';

interface CoachResponse {
  message: string;
  recommendations: string[];
}

export function getAICoachAdvice(concerns: SkinConcern[], currentProducts: ProductType[]): CoachResponse {
  const concernsSet = new Set(concerns);
  const productsSet = new Set(currentProducts);

  let message = '';
  const recommendations: string[] = [];

  if (concernsSet.has('acne')) {
    message = 'For acne-prone skin, focus on gentle cleansing and targeted treatments.';
    if (!productsSet.has('cleanser')) recommendations.push('Add a gentle, non-comedogenic cleanser');
    if (!productsSet.has('treatment')) recommendations.push('Consider adding a salicylic acid or benzoyl peroxide treatment');
    recommendations.push('Avoid heavy, oil-based moisturizers');
  } else if (concernsSet.has('dry')) {
    message = 'Dry skin needs extra hydration and moisture barrier repair.';
    if (!productsSet.has('serum')) recommendations.push('Add a hydrating serum with hyaluronic acid');
    if (!productsSet.has('moisturizer')) recommendations.push('Use a rich, emollient moisturizer');
    recommendations.push('Consider adding a facial oil in your PM routine');
  } else if (concernsSet.has('oily')) {
    message = 'Oily skin benefits from lightweight, oil-free products.';
    if (!productsSet.has('toner')) recommendations.push('Try a balancing toner with niacinamide');
    recommendations.push('Use gel-based or water-based moisturizers');
    recommendations.push('Look for mattifying sunscreen formulas');
  } else if (concernsSet.has('sensitive') || concernsSet.has('redness')) {
    message = 'Sensitive skin requires gentle, fragrance-free products.';
    recommendations.push('Choose products with minimal ingredients');
    recommendations.push('Look for soothing ingredients like centella or calendula');
    recommendations.push('Avoid harsh exfoliants and fragrances');
  } else {
    message = 'Your skin routine looks balanced. Maintain consistency for best results.';
    recommendations.push('Continue with your current routine');
    recommendations.push('Monitor how your skin responds to seasonal changes');
  }

  if (!productsSet.has('sunscreen')) {
    recommendations.unshift('⚠️ Always use sunscreen daily (SPF 30+)');
  }

  return { message, recommendations };
}

export function getRoutineAdvice(timeOfDay: 'AM' | 'PM', products: ProductType[]): string[] {
  const advice: string[] = [];
  const productsSet = new Set(products);

  if (timeOfDay === 'AM') {
    const amOrder = ['cleanser', 'toner', 'serum', 'eye-cream', 'moisturizer', 'sunscreen'];
    advice.push('Morning routine order:');
    amOrder.forEach((type, index) => {
      if (productsSet.has(type as ProductType)) {
        advice.push(`${index + 1}. ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}`);
      }
    });

    if (!productsSet.has('sunscreen')) {
      advice.push('⚠️ Don\'t forget sunscreen as your last step!');
    }
  } else {
    const pmOrder = ['cleanser', 'treatment', 'toner', 'serum', 'eye-cream', 'moisturizer'];
    advice.push('Evening routine order:');
    pmOrder.forEach((type, index) => {
      if (productsSet.has(type as ProductType)) {
        advice.push(`${index + 1}. ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}`);
      }
    });

    advice.push('💡 PM is the best time for active treatments');
  }

  return advice;
}

export function analyzeIngredients(ingredients: string[]): { safe: string[]; caution: string[]; avoid: string[] } {
  const harmfulIngredients = new Set([
    'parabens', 'sulfates', 'phthalates', 'formaldehyde', 'triclosan',
    'oxybenzone', 'hydroquinone', 'coal tar', 'mercury', 'lead'
  ]);

  const cautionIngredients = new Set([
    'alcohol', 'fragrance', 'perfume', 'retinol', 'aha', 'bha',
    'vitamin c', 'benzoyl peroxide', 'salicylic acid'
  ]);

  const safe: string[] = [];
  const caution: string[] = [];
  const avoid: string[] = [];

  ingredients.forEach(ingredient => {
    const lower = ingredient.toLowerCase();
    let found = false;

    for (const harmful of harmfulIngredients) {
      if (lower.includes(harmful)) {
        avoid.push(ingredient);
        found = true;
        break;
      }
    }

    if (!found) {
      for (const cautionItem of cautionIngredients) {
        if (lower.includes(cautionItem)) {
          caution.push(ingredient);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      safe.push(ingredient);
    }
  });

  return { safe, caution, avoid };
}
