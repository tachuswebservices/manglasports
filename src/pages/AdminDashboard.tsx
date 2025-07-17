import React, { useEffect, useState, useRef } from 'react';
import AdminNavbar from '../components/layout/AdminNavbar';
import Footer from '../components/layout/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '../components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { X, Upload, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [products, setProducts] = useState([]);
  const initialProductState = {
    name: '',
    price: '',
    categoryId: '',
    brandId: '',
    images: [],
    numericPrice: '',
    originalPrice: '',
    rating: '',
    shortDescription: '',
    inStock: false,
    isNew: false,
    isHot: false
  };
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);
  const [addProductError, setAddProductError] = useState('');
  const [removingProductId, setRemovingProductId] = useState(null);
  const [removeProductError, setRemoveProductError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productView, setProductView] = useState<'table' | 'card'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editProductState, setEditProductState] = useState(initialProductState);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setLoadingStats(true);
    setStatsError('');
    fetch('http://localhost:4000/api/users/admin/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => setStatsError(err.message))
      .finally(() => setLoadingStats(false));
    setLoadingProducts(true);
    setProductsError('');
    fetch(`http://localhost:4000/api/products?page=${page}&limit=${limit}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data.products);
        setTotalProducts(data.total);
      })
      .catch(err => setProductsError(err.message))
      .finally(() => setLoadingProducts(false));
    // Fetch categories and brands for modal dropdowns
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(setCategories);
    fetch('http://localhost:4000/api/brands')
      .then(res => res.json())
      .then(setBrands);
  }, [page, limit]);

  // Handle multiple image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type === 'image/jpeg' || file.type === 'image/png'
    );
    // Add new files to existing, but max 5
    const newFiles = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map(file => URL.createObjectURL(file)));
    // Reset the input value so the same file can be selected again if needed
    if (e.target.value) e.target.value = '';
  };
  const handleRemoveImage = (idx: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleAddProduct = async () => {
    setAddingProduct(true);
    setAddProductError('');
    let imageUrls: string[] = [];
    // If new image files are selected, upload them first
    if (imageFiles.length > 0) {
      const formData = new FormData();
      imageFiles.forEach(file => formData.append('images', file));
      try {
        const res = await fetch('http://localhost:4000/api/products/upload-image', {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('Image upload failed');
        const data = await res.json();
        imageUrls = data.imageUrls;
      } catch (err: any) {
        setAddProductError(err.message || 'Image upload failed');
        setAddingProduct(false);
        return;
      }
    }
    // Prepare payload with correct types
    const payload = {
      ...newProduct,
      images: imageUrls,
      categoryId: newProduct.categoryId ? Number(newProduct.categoryId) : undefined,
      brandId: newProduct.brandId ? Number(newProduct.brandId) : undefined,
      numericPrice: newProduct.numericPrice ? Number(newProduct.numericPrice) : undefined,
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      rating: newProduct.rating ? Number(newProduct.rating) : undefined,
    };
    fetch('http://localhost:4000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add product');
        return res.json();
      })
      .then(product => {
        setProducts([...products, product]);
        setNewProduct(initialProductState);
        setImageFiles([]);
        setImagePreviews([]);
      })
      .catch(err => setAddProductError(err.message))
      .finally(() => setAddingProduct(false));
  };

  const handleRemoveProduct = (id) => {
    setRemovingProductId(id);
    setRemoveProductError('');
    fetch(`http://localhost:4000/api/products/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to remove product');
        setProducts(products.filter(p => p.id !== id));
      })
      .catch(err => setRemoveProductError(err.message))
      .finally(() => setRemovingProductId(null));
  };

  // Open edit modal and prefill state
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setEditProductState({
      ...initialProductState,
      ...product,
      categoryId: String(product.categoryId),
      brandId: String(product.brandId),
    });
    setEditImageFiles([]);
    setEditImagePreviews([]);
    setEditModalOpen(true);
    setEditError('');
  };
  // Handle edit image file selection
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type === 'image/jpeg' || file.type === 'image/png'
    );
    const newFiles = [...editImageFiles, ...files].slice(0, 5);
    setEditImageFiles(newFiles);
    setEditImagePreviews(newFiles.map(file => URL.createObjectURL(file)));
    if (e.target.value) e.target.value = '';
  };
  const handleRemoveEditImage = (idx: number) => {
    const newFiles = editImageFiles.filter((_, i) => i !== idx);
    const newPreviews = editImagePreviews.filter((_, i) => i !== idx);
    setEditImageFiles(newFiles);
    setEditImagePreviews(newPreviews);
  };
  // Remove an existing image (from product.images)
  const handleRemoveExistingEditImage = (idx: number) => {
    if (!editingProduct) return;
    const newImages = (editProductState.images || []).filter((_: any, i: number) => i !== idx);
    setEditProductState({ ...editProductState, images: newImages });
  };
  // Handle edit submit
  const handleEditProduct = async () => {
    setEditLoading(true);
    setEditError('');
    let imageUrls = editProductState.images || [];
    // If new image files are selected, upload them
    if (editImageFiles.length > 0) {
      const formData = new FormData();
      editImageFiles.forEach(file => formData.append('images', file));
      try {
        const res = await fetch('http://localhost:4000/api/products/upload-image', {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('Image upload failed');
        const data = await res.json();
        imageUrls = [...imageUrls, ...data.imageUrls];
      } catch (err: any) {
        setEditError(err.message || 'Image upload failed');
        setEditLoading(false);
        return;
      }
    }
    // Prepare payload
    const payload = {
      ...editProductState,
      images: imageUrls,
      categoryId: editProductState.categoryId ? Number(editProductState.categoryId) : undefined,
      brandId: editProductState.brandId ? Number(editProductState.brandId) : undefined,
      numericPrice: editProductState.numericPrice ? Number(editProductState.numericPrice) : undefined,
      originalPrice: editProductState.originalPrice ? Number(editProductState.originalPrice) : undefined,
      rating: editProductState.rating ? Number(editProductState.rating) : undefined,
    };
    fetch(`http://localhost:4000/api/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update product');
        return res.json();
      })
      .then(product => {
        setProducts(products.map(p => (p.id === product.id ? product : p)));
        setEditModalOpen(false);
        setEditingProduct(null);
      })
      .catch(err => setEditError(err.message))
      .finally(() => setEditLoading(false));
  };

  // Filtered and searched products (client-side for current page)
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? product.categoryId === Number(filterCategory) : true;
    const matchesBrand = filterBrand ? product.brandId === Number(filterBrand) : true;
    return matchesSearch && matchesCategory && matchesBrand;
  });
  // Pagination controls
  const totalPages = Math.ceil(totalProducts / limit);
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="bg-mangla min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 min-h-[calc(100vh-64px)] py-10 px-2 sm:px-0">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight text-mangla-gold drop-shadow-sm">Admin Dashboard</h1>
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8">
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold shadow-sm border-b-2 transition-all duration-150 ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-900 border-mangla-gold text-mangla-gold' : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-mangla-gold hover:border-mangla-gold'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold shadow-sm border-b-2 transition-all duration-150 ${activeTab === 'products' ? 'bg-white dark:bg-slate-900 border-mangla-gold text-mangla-gold' : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-mangla-gold hover:border-mangla-gold'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
          </div>

          {/* Dashboard Tab - Statistics */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Statistics Overview</h2>
              {loadingStats ? (
                <div className="text-center py-12">Loading statistics...</div>
              ) : statsError ? (
                <div className="text-center text-red-500 py-12">{statsError}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-8 rounded-xl shadow bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-center border border-mangla-gold">
                    <div className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Total Products</div>
                    <div className="text-4xl font-extrabold text-mangla-gold drop-shadow">{stats.products}</div>
                  </Card>
                  <Card className="p-8 rounded-xl shadow bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-center border border-green-400">
                    <div className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Total Orders</div>
                    <div className="text-4xl font-extrabold text-green-500 drop-shadow">{stats.orders}</div>
                  </Card>
                  <Card className="p-8 rounded-xl shadow bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-center border border-purple-400">
                    <div className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Total Users</div>
                    <div className="text-4xl font-extrabold text-purple-500 drop-shadow">{stats.users}</div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Products Tab - Product Management */}
          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Product Management</h2>
              {/* View toggle, search, and filters */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2 items-center">
                  <button
                    className={`px-3 py-1 rounded-l border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium ${productView === 'table' ? 'text-mangla-gold border-mangla-gold' : 'text-slate-500'}`}
                    onClick={() => setProductView('table')}
                  >
                    Table View
                  </button>
                  <button
                    className={`px-3 py-1 rounded-r border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium ${productView === 'card' ? 'text-mangla-gold border-mangla-gold' : 'text-slate-500'}`}
                    onClick={() => setProductView('card')}
                  >
                    Card View
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-mangla-gold"
                    />
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="px-2 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    value={filterBrand}
                    onChange={e => setFilterBrand(e.target.value)}
                    className="px-2 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setShowAddModal(true)} className="bg-mangla-gold hover:bg-mangla-gold/90 text-white font-semibold shadow px-6 py-2 rounded-lg">
                      Add New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg w-full sm:max-w-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-mangla-gold">
                    <DialogHeader>
                      <DialogTitle className="text-mangla-gold">Add New Product</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddProduct();
                      }}
                      className="flex flex-col gap-4 w-full"
                    >
                      <Input
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        disabled={addingProduct}
                        required
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        disabled={addingProduct}
                        required
                      />
                      <Select
                        value={newProduct.categoryId || ''}
                        onValueChange={val => setNewProduct({ ...newProduct, categoryId: val })}
                        disabled={addingProduct}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={newProduct.brandId || ''}
                        onValueChange={val => setNewProduct({ ...newProduct, brandId: val })}
                        disabled={addingProduct}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map(brand => (
                            <SelectItem key={brand.id} value={String(brand.id)}>{brand.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-col gap-2">
                        <label className="font-medium">Product Images (.jpg, .png, up to 5)</label>
                        <input
                          id="product-image-upload"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          multiple
                          onChange={handleImageChange}
                          disabled={addingProduct}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('product-image-upload')?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-fit"
                          disabled={addingProduct || imageFiles.length >= 5}
                        >
                          <Upload className="w-4 h-4" /> Upload
                        </button>
                        {imagePreviews.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {imagePreviews.map((preview, idx) => (
                              <div key={idx} className="relative">
                                <img src={preview} alt={`Preview ${idx + 1}`} className="max-h-32 rounded border" />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
                                  onClick={() => handleRemoveImage(idx)}
                                  aria-label="Remove image"
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Input
                        placeholder="Numeric Price"
                        type="number"
                        value={newProduct.numericPrice || ''}
                        onChange={e => setNewProduct({ ...newProduct, numericPrice: e.target.value })}
                        disabled={addingProduct}
                        required
                      />
                      <Input
                        placeholder="Original Price"
                        type="number"
                        value={newProduct.originalPrice || ''}
                        onChange={e => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        disabled={addingProduct}
                      />
                      <Input
                        placeholder="Rating"
                        type="number"
                        value={newProduct.rating || ''}
                        onChange={e => setNewProduct({ ...newProduct, rating: e.target.value })}
                        disabled={addingProduct}
                        required
                      />
                      <Textarea
                        placeholder="Short Description"
                        value={newProduct.shortDescription || ''}
                        onChange={e => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                        disabled={addingProduct}
                        rows={3}
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!newProduct.inStock}
                            onChange={e => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                            disabled={addingProduct}
                          />
                          In Stock
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!newProduct.isNew}
                            onChange={e => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                            disabled={addingProduct}
                          />
                          New
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!newProduct.isHot}
                            onChange={e => setNewProduct({ ...newProduct, isHot: e.target.checked })}
                            disabled={addingProduct}
                          />
                          Hot
                        </label>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={addingProduct}>
                          {addingProduct ? 'Adding...' : 'Add Product'}
                        </Button>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                            Cancel
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                      {addProductError && <div className="text-red-500 mb-2">{addProductError}</div>}
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              {/* Products Table Section */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">All Products</h3>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm">Show</span>
                    <select value={limit} onChange={handleLimitChange} className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm">per page</span>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {loadingProducts ? (
                    <div className="text-center py-8">Loading products...</div>
                  ) : productsError ? (
                    <div className="text-center text-red-500 py-8">{productsError}</div>
                  ) : productView === 'table' ? (
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800">
                          <th className="py-3 px-4 border-b font-semibold text-left">ID</th>
                          <th className="py-3 px-4 border-b font-semibold text-left">Name</th>
                          <th className="py-3 px-4 border-b font-semibold text-left">Price</th>
                          <th className="py-3 px-4 border-b font-semibold text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <td className="py-2 px-4 border-b text-xs text-slate-500 dark:text-slate-400">{product.id}</td>
                            <td className="py-2 px-4 border-b font-medium">{product.name}</td>
                            <td className="py-2 px-4 border-b">{product.price}</td>
                            <td className="py-2 px-4 border-b">
                              {/* Edit and Remove buttons will go here */}
                              <Button
                                variant="outline"
                                className="px-3 py-1 text-sm mr-2"
                                onClick={() => openEditModal(product)}
                                disabled={removingProductId === product.id}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleRemoveProduct(product.id)}
                                disabled={removingProductId === product.id}
                                className="px-3 py-1 text-sm"
                              >
                                {removingProductId === product.id ? 'Removing...' : 'Remove'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="rounded-xl shadow border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col gap-2">
                          <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded mb-2 flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt={product.name} className="object-contain max-h-40 w-full" />
                            ) : (
                              <span className="text-slate-400 text-xs">No Image</span>
                            )}
                          </div>
                          <div className="font-semibold text-lg text-slate-800 dark:text-slate-100">{product.name}</div>
                          <div className="text-mangla-gold font-bold text-xl">₹{product.price}</div>
                          <div className="flex gap-2 mt-2">
                            {/* Edit and Remove buttons will go here */}
                            <Button
                              variant="outline"
                              className="px-3 py-1 text-sm mr-2"
                              onClick={() => openEditModal(product)}
                              disabled={removingProductId === product.id}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRemoveProduct(product.id)}
                              disabled={removingProductId === product.id}
                              className="px-3 py-1 text-sm"
                            >
                              {removingProductId === product.id ? 'Removing...' : 'Remove'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {removeProductError && <div className="text-red-500 mt-2 px-4 pb-4">{removeProductError}</div>}
                </div>
                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 py-4">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&lt;</Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`px-3 py-1 rounded ${p === page ? 'bg-mangla-gold text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                        onClick={() => handlePageChange(p)}
                        disabled={p === page}
                      >
                        {p}
                      </button>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>&gt;</Button>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {/* Edit Product Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg w-full sm:max-w-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-mangla-gold">
          <DialogHeader>
            <DialogTitle className="text-mangla-gold">Edit Product</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleEditProduct();
            }}
            className="flex flex-col gap-4 w-full"
          >
            <Input
              placeholder="Product Name"
              value={editProductState.name}
              onChange={e => setEditProductState({ ...editProductState, name: e.target.value })}
              disabled={editLoading}
              required
            />
            <Input
              placeholder="Price"
              type="number"
              value={editProductState.price}
              onChange={e => setEditProductState({ ...editProductState, price: e.target.value })}
              disabled={editLoading}
              required
            />
            <Select
              value={editProductState.categoryId || ''}
              onValueChange={val => setEditProductState({ ...editProductState, categoryId: val })}
              disabled={editLoading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={editProductState.brandId || ''}
              onValueChange={val => setEditProductState({ ...editProductState, brandId: val })}
              disabled={editLoading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={String(brand.id)}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Product Images (.jpg, .png, up to 5)</label>
              <input
                ref={editFileInputRef}
                id="edit-product-image-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleEditImageChange}
                disabled={editLoading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => editFileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-fit"
                disabled={editLoading || ((editProductState.images?.length || 0) + editImageFiles.length) >= 5}
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              {/* Existing images */}
              {editProductState.images && editProductState.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editProductState.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Product ${idx + 1}`} className="max-h-32 rounded border" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
                        onClick={() => handleRemoveExistingEditImage(idx)}
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* New images to be uploaded */}
              {editImagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editImagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <img src={preview} alt={`Preview ${idx + 1}`} className="max-h-32 rounded border" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
                        onClick={() => handleRemoveEditImage(idx)}
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Input
              placeholder="Numeric Price"
              type="number"
              value={editProductState.numericPrice}
              onChange={e => setEditProductState({ ...editProductState, numericPrice: e.target.value })}
              disabled={editLoading}
              required
            />
            <Input
              placeholder="Original Price"
              type="number"
              value={editProductState.originalPrice}
              onChange={e => setEditProductState({ ...editProductState, originalPrice: e.target.value })}
              disabled={editLoading}
            />
            <Input
              placeholder="Rating"
              type="number"
              value={editProductState.rating}
              onChange={e => setEditProductState({ ...editProductState, rating: e.target.value })}
              disabled={editLoading}
              required
            />
            <Textarea
              placeholder="Short Description"
              value={editProductState.shortDescription || ''}
              onChange={e => setEditProductState({ ...editProductState, shortDescription: e.target.value })}
              disabled={editLoading}
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!editProductState.inStock}
                  onChange={e => setEditProductState({ ...editProductState, inStock: e.target.checked })}
                  disabled={editLoading}
                />
                In Stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!editProductState.isNew}
                  onChange={e => setEditProductState({ ...editProductState, isNew: e.target.checked })}
                  disabled={editLoading}
                />
                New
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!editProductState.isHot}
                  onChange={e => setEditProductState({ ...editProductState, isHot: e.target.checked })}
                  disabled={editLoading}
                />
                Hot
              </label>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
            {editError && <div className="text-red-500 mb-2">{editError}</div>}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard; 