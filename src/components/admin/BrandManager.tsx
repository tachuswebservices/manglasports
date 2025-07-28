import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface BrandManagerProps {
  brands: any[];
  loading: boolean;
  error: string;
  addModalOpen: boolean;
  editModalOpen: boolean;
  editingBrand: any;
  newBrandName: string;
  onAddModalOpen: () => void;
  onAddModalClose: () => void;
  onEditModalOpen: (brand: any) => void;
  onEditModalClose: () => void;
  onNewBrandChange: (name: string) => void;
  onAddBrand: () => void;
  onEditBrand: () => void;
  onDeleteBrand: (id: string) => void;
}

export default function BrandManager({
  brands, loading, error, addModalOpen, editModalOpen, editingBrand,
  newBrandName, onAddModalOpen, onAddModalClose, onEditModalOpen, onEditModalClose,
  onNewBrandChange, onAddBrand, onEditBrand, onDeleteBrand
}: BrandManagerProps) {
  const [showAddNewModal, setShowAddNewModal] = useState(false);

  if (!addModalOpen) return null;

  const handleAddNewClick = () => {
    setShowAddNewModal(true);
  };

  const handleAddNewClose = () => {
    setShowAddNewModal(false);
  };

  return (
    <>
      <Dialog open={addModalOpen} onOpenChange={onAddModalClose}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Brand Management</DialogTitle>
          </DialogHeader>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Brands</h2>
            <Button onClick={handleAddNewClick} className="bg-mangla-gold hover:bg-mangla-gold/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </div>
          {/* Brands List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {brand.productCount || 0} products
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEditModalOpen(brand)}
                      className="w-8 h-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onDeleteBrand(brand.id)}
                      disabled={loading}
                      className="w-8 h-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Brand Modal */}
      <Dialog open={showAddNewModal} onOpenChange={handleAddNewClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <Input
                placeholder="Enter brand name"
                value={newBrandName}
                onChange={(e) => onNewBrandChange(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              onAddBrand();
              handleAddNewClose();
            }} disabled={loading || !newBrandName.trim()}>
              {loading ? 'Adding...' : 'Add Brand'}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary" onClick={handleAddNewClose}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Modal */}
      <Dialog open={editModalOpen} onOpenChange={onEditModalClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <Input
                placeholder="Enter brand name"
                value={editingBrand?.name || ''}
                onChange={(e) => onNewBrandChange(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onEditBrand} disabled={loading || !editingBrand?.name?.trim()}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary" onClick={onEditModalClose}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 