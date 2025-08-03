import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';

interface ProductAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  categories: any[];
  brands: any[];
  loading: boolean;
  error: string;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductAddModal({
  open, onOpenChange, product, categories, brands, loading, error, onChange, onSave, onCancel
}: ProductAddModalProps) {
  const [newFeature, setNewFeature] = useState('');
  const [features, setFeatures] = useState<string[]>(() => {
    if (product.features && Array.isArray(product.features)) {
      return product.features.map((f: any) => f.value || f).filter(Boolean);
    }
    return [];
  });

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      onChange('features', updatedFeatures.map(value => ({ value })));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    onChange('features', updatedFeatures.map(value => ({ value })));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full sm:max-w-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-mangla-gold">
        <DialogHeader>
          <DialogTitle className="text-mangla-gold">Add New Product</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave();
          }}
          className="flex flex-col gap-4 w-full"
        >
          <label className="font-medium">Product Name</label>
          <Input
            placeholder="Product Name"
            value={product.name}
            onChange={e => onChange('name', e.target.value)}
            disabled={loading}
            required
          />
          <label className="font-medium">Price (display string, e.g. ₹1,999)</label>
          <Input
            placeholder="Price (display string, e.g. ₹1,999)"
            value={product.price}
            onChange={e => onChange('price', e.target.value)}
            disabled={loading}
            required
          />
          <label className="font-medium">Numeric Price (number)</label>
          <Input
            placeholder="Numeric Price (number)"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={typeof product.numericPrice === 'string' && product.numericPrice === '' ? '' : String(product.numericPrice)}
            onChange={e => onChange('numericPrice', e.target.value.replace(/[^0-9.]/g, ''))}
            disabled={loading}
            required
          />
          <label className="font-medium">Rating (float)</label>
          <Input
            placeholder="Rating (float)"
            type="text"
            inputMode="numeric"
            pattern="[0-9.]*"
            value={typeof product.rating === 'string' && product.rating === '' ? '' : String(product.rating)}
            onChange={e => onChange('rating', e.target.value.replace(/[^0-9.]/g, ''))}
            disabled={loading}
            required
          />
          <label className="font-medium">Review Count (optional)</label>
          <Input
            placeholder="Review Count (optional)"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={typeof product.reviewCount === 'string' && product.reviewCount === '' ? '' : String(product.reviewCount)}
            onChange={e => onChange('reviewCount', e.target.value.replace(/[^0-9]/g, ''))}
            disabled={loading}
          />
          <label className="font-medium">Sold Count (optional)</label>
          <Input
            placeholder="Sold Count (optional)"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={typeof product.soldCount === 'string' && product.soldCount === '' ? '' : String(product.soldCount)}
            onChange={e => onChange('soldCount', e.target.value.replace(/[^0-9]/g, ''))}
            disabled={loading}
          />
          <label className="font-medium">Short Description (optional)</label>
          <Textarea
            placeholder="Short Description (optional)"
            value={product.shortDescription}
            onChange={e => onChange('shortDescription', e.target.value)}
            disabled={loading}
            rows={2}
          />
          
          {/* Features Management */}
          <div className="space-y-3">
            <label className="font-medium">Key Features</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a feature (e.g., High Accuracy)"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addFeature}
                disabled={loading || !newFeature.trim()}
                size="sm"
                className="px-3"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Display Features */}
            {features.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Features:</p>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-sm"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        disabled={loading}
                        className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <label className="font-medium">Category</label>
          <select
            value={product.categoryId || ''}
            onChange={e => onChange('categoryId', e.target.value)}
            disabled={loading}
            required
            className="px-2 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <label className="font-medium">Brand</label>
          <select
            value={product.brandId || ''}
            onChange={e => onChange('brandId', e.target.value)}
            disabled={loading}
            required
            className="px-2 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="">Select Brand</option>
            {brands.map((brand: any) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          <Input
            placeholder="GST (%)"
            type="text"
            inputMode="numeric"
            pattern="[0-9.]*"
            value={typeof product.gst === 'string' && product.gst === '' ? '' : String(product.gst)}
            onChange={e => onChange('gst', e.target.value.replace(/[^0-9.]/g, ''))}
            disabled={loading}
            required
          />
          <Input
            placeholder="Offer Price"
            type="text"
            inputMode="numeric"
            pattern="[0-9.]*"
            value={typeof product.offerPrice === 'string' && product.offerPrice === '' ? '' : String(product.offerPrice)}
            onChange={e => onChange('offerPrice', e.target.value.replace(/[^0-9.]/g, ''))}
            disabled={loading}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!product.inStock}
                onChange={e => onChange('inStock', e.target.checked)}
                disabled={loading}
              />
              In Stock
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!product.isNew}
                onChange={e => onChange('isNew', e.target.checked)}
                disabled={loading}
              />
              New
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!product.isHot}
                onChange={e => onChange('isHot', e.target.checked)}
                disabled={loading}
              />
              Hot
            </label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
          {error && <div className="text-red-500 mb-2">{error}</div>}
        </form>
      </DialogContent>
    </Dialog>
  );
} 