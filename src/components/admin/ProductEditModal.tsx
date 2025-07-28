import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface ProductEditModalProps {
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
  onManageImages: () => void;
}

export default function ProductEditModal({
  open, onOpenChange, product, categories, brands, loading, error, onChange, onSave, onCancel, onManageImages
}: ProductEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full sm:max-w-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-mangla-gold">
        <DialogHeader>
          <DialogTitle className="text-mangla-gold">Edit Product</DialogTitle>
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
          <Button type="button" variant="outline" onClick={onManageImages} className="mb-2">Manage Images</Button>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
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