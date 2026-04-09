import { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, Package } from 'lucide-react';
import { ProductShelfItem, ProductType } from '../types';
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

export default function Products() {
  const [products, setProducts] = useState<ProductShelfItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    type: 'cleanser' as ProductType,
    openedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
  });

  useEffect(() => {
    setProducts(storage.getProductShelf());
  }, []);

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.brand.trim() || !newProduct.expiryDate) return;

    const product: ProductShelfItem = {
      id: Date.now().toString(),
      ...newProduct,
    };

    storage.saveProductShelfItem(product);
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      brand: '',
      type: 'cleanser',
      openedDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
    });
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Remove this product?')) {
      storage.deleteProductShelfItem(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { label: 'Expired', color: 'text-destructive', bg: 'bg-destructive/10' };
    if (days <= 30) return { label: `${days}d left`, color: 'text-orange-500', bg: 'bg-orange-500/10' };
    if (days <= 90) return { label: `${days}d left`, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { label: `${days}d left`, color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  const expiringProducts = products.filter(p => getDaysUntilExpiry(p.expiryDate) <= 30 && getDaysUntilExpiry(p.expiryDate) >= 0);
  const expiredProducts = products.filter(p => getDaysUntilExpiry(p.expiryDate) < 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <h2>Product Shelf</h2>
            <p className="text-muted-foreground">Track your skincare inventory</p>
          </div>
        </div>
      </div>

      {(expiringProducts.length > 0 || expiredProducts.length > 0) && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-orange-500 mb-2">Expiry Alerts</h4>
              {expiredProducts.length > 0 && (
                <p className="text-sm mb-2">
                  <strong>{expiredProducts.length}</strong> product{expiredProducts.length !== 1 ? 's' : ''} expired
                </p>
              )}
              {expiringProducts.length > 0 && (
                <p className="text-sm">
                  <strong>{expiringProducts.length}</strong> product{expiringProducts.length !== 1 ? 's' : ''} expiring within 30 days
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products.map(product => {
          const status = getExpiryStatus(product.expiryDate);

          return (
            <div key={product.id} className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{product.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type: </span>
                      <span className="capitalize">{product.type.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Opened: </span>
                      <span>{new Date(product.openedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Expires: </span>
                      <span>{new Date(product.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {products.length === 0 && !showAddForm && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No products in your shelf yet</p>
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

          <input
            type="text"
            placeholder="Brand"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Opened date</label>
              <input
                type="date"
                value={newProduct.openedDate}
                onChange={(e) => setNewProduct({ ...newProduct, openedDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Expiry date</label>
              <input
                type="date"
                value={newProduct.expiryDate}
                onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
              />
            </div>
          </div>

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
                setNewProduct({
                  name: '',
                  brand: '',
                  type: 'cleanser',
                  openedDate: new Date().toISOString().split('T')[0],
                  expiryDate: '',
                });
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
          Add Product to Shelf
        </button>
      )}
    </div>
  );
}
