import React, { useEffect, useState } from 'react';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [products, setProducts] = useState([]);
  const initialProductState = {
    name: '',
    price: '',
    categoryId: '',
    brandId: '',
    image: '',
    numericPrice: '',
    originalPrice: '',
    rating: '',
    shortDescription: '',
    inStock: false,
    isNew: false,
    isHot: false
  };
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
    fetch('http://localhost:4000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setProductsError(err.message))
      .finally(() => setLoadingProducts(false));
    // Fetch categories and brands for modal dropdowns
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(setCategories);
    fetch('http://localhost:4000/api/brands')
      .then(res => res.json())
      .then(setBrands);
  }, []);

  const handleAddProduct = () => {
    setAddingProduct(true);
    setAddProductError('');
    // Prepare payload with correct types
    const payload = {
      ...newProduct,
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

  return (
    <div className="bg-mangla min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
        </div>

        {/* Dashboard Tab - Statistics */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Statistics Overview</h2>
            {loadingStats ? (
              <div className="text-center">Loading statistics...</div>
            ) : statsError ? (
              <div className="text-center text-red-500">{statsError}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 text-center">
                  <div className="text-lg font-semibold mb-2">Total Products</div>
                  <div className="text-3xl font-bold text-blue-600">{stats.products}</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-lg font-semibold mb-2">Total Orders</div>
                  <div className="text-3xl font-bold text-green-600">{stats.orders}</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-lg font-semibold mb-2">Total Users</div>
                  <div className="text-3xl font-bold text-purple-600">{stats.users}</div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Products Tab - Product Management */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Product Management</h2>
            <div className="mb-6">
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button onClick={() => setShowAddModal(true)}>
                    Add New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg w-full sm:max-w-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
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
                    <Input
                      placeholder="Image URL"
                      value={newProduct.image || ''}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                      disabled={addingProduct}
                      required
                    />
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
              <h3 className="text-xl font-semibold mb-4">All Products</h3>
              {loadingProducts ? (
                <div className="text-center">Loading products...</div>
              ) : productsError ? (
                <div className="text-center text-red-500">{productsError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded shadow">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Price</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="py-2 px-4 border-b">{product.id}</td>
                          <td className="py-2 px-4 border-b">{product.name}</td>
                          <td className="py-2 px-4 border-b">{product.price}</td>
                          <td className="py-2 px-4 border-b">
                            <Button
                              variant="destructive"
                              onClick={() => handleRemoveProduct(product.id)}
                              disabled={removingProductId === product.id}
                            >
                              {removingProductId === product.id ? 'Removing...' : 'Remove'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {removeProductError && <div className="text-red-500 mt-2">{removeProductError}</div>}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard; 