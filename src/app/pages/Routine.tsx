import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Sun, Moon } from 'lucide-react';
import { RoutineProduct, ProductType, TimeOfDay } from '../types';
import { storage } from '../utils/storage';

const productTypes: { value: ProductType; label: string }[] = [
  { value: 'cleanser', label: 'Cleanser' },
  { value: 'toner', label: 'Toner' },
  { value: 'serum', label: 'Serum' },
  { value: 'moisturizer', label: 'Moisturizer' },
  { value: 'sunscreen', label: 'Sunscreen' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'eye-cream', label: 'Eye Cream' },
  { value: 'mask', label: 'Mask' },
];

export default function Routine() {
  const [products, setProducts] = useState<RoutineProduct[]>([]);
  const [activeTab, setActiveTab] = useState<TimeOfDay>('AM');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', type: 'cleanser' as ProductType });

  useEffect(() => {
    setProducts(storage.getRoutineProducts());
  }, []);

  const filteredProducts = products
    .filter(p => p.timeOfDay === activeTab)
    .sort((a, b) => a.order - b.order);

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) return;

    const product: RoutineProduct = {
      id: Date.now().toString(),
      name: newProduct.name,
      type: newProduct.type,
      timeOfDay: activeTab,
      order: filteredProducts.length,
      completed: false,
    };

    storage.saveRoutineProduct(product);
    setProducts([...products, product]);
    setNewProduct({ name: '', type: 'cleanser' });
    setShowAddForm(false);
  };

  const handleToggleComplete = (id: string) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, completed: !p.completed } : p
    );
    setProducts(updated);
    storage.updateRoutineProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    storage.deleteRoutineProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  const resetDaily = () => {
    const updated = products.map(p => ({ ...p, completed: false }));
    setProducts(updated);
    storage.updateRoutineProducts(updated);
  };

  const completedCount = filteredProducts.filter(p => p.completed).length;
  const totalCount = filteredProducts.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2>My Routine</h2>
        <button
          onClick={resetDaily}
          className="px-4 py-2 text-sm bg-secondary hover:bg-accent rounded-lg"
        >
          Reset Daily
        </button>
      </div>

      <div className="flex gap-2 bg-secondary p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('AM')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-colors ${
            activeTab === 'AM' ? 'bg-background shadow-sm' : 'hover:bg-accent'
          }`}
        >
          <Sun className="w-4 h-4" />
          Morning
        </button>
        <button
          onClick={() => setActiveTab('PM')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-colors ${
            activeTab === 'PM' ? 'bg-background shadow-sm' : 'hover:bg-accent'
          }`}
        >
          <Moon className="w-4 h-4" />
          Evening
        </button>
      </div>

      {totalCount > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors"
          >
            <button
              onClick={() => handleToggleComplete(product.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                product.completed
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground'
              }`}
            >
              {product.completed && <Check className="w-4 h-4" />}
            </button>

            <div className="flex-1">
              <div className={`flex items-center gap-2 ${product.completed ? 'line-through text-muted-foreground' : ''}`}>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded">{index + 1}</span>
                <span>{product.name}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 capitalize">{product.type.replace('-', ' ')}</p>
            </div>

            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="p-2 text-destructive hover:bg-destructive/10 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {filteredProducts.length === 0 && !showAddForm && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No products in your {activeTab === 'AM' ? 'morning' : 'evening'} routine yet</p>
          </div>
        )}
      </div>

      {showAddForm ? (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <input
            type="text"
            placeholder="Product name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
            autoFocus
          />

          <select
            value={newProduct.type}
            onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value as ProductType })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
          >
            {productTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleAddProduct}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Add Product
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewProduct({ name: '', type: 'cleanser' });
              }}
              className="px-4 py-2 bg-secondary hover:bg-accent rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-accent rounded-lg border-2 border-dashed border-border"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      )}
    </div>
  );
}
