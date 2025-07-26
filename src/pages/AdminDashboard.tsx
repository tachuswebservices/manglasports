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
import { X, Upload, Search, Plus, Pencil, Trash, Eye, Image as ImageIcon, Check, ChevronLeft, ChevronRight, ShieldAlert, LayoutGrid, List, Tag } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../components/ui/tooltip';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../components/ui/alert-dialog';
import { useToast } from '../components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Dialog as SimpleDialog } from '../components/ui/dialog';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Cloudinary config (move to top-level scope)
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dvltehb8j/upload';
const UPLOAD_PRESET = 'unsigned';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [products, setProducts] = useState([]);
  const initialProductState = {
    name: '',
    price: '',
    numericPrice: '',
    images: [],
    categoryId: '',
    brandId: '',
    rating: '',
    reviewCount: '',
    soldCount: '',
    inStock: false,
    isNew: false,
    isHot: false,
    shortDescription: '',
    gst: '',
    offerPrice: '',
    features: [],
    specifications: [],
  };
  // For new product
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // Store uploaded images as { url, publicId }
  const [uploadedImages, setUploadedImages] = useState<{ url: string, publicId: string }[]>([]);

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
  // For edit product
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  // Store uploaded images for edit as { url, publicId }
  const [editUploadedImages, setEditUploadedImages] = useState<{ url: string, publicId: string }[]>([]);
  // Track images marked for deletion (publicId)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  // Inline add new category/brand state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [addingBrand, setAddingBrand] = useState(false);
  const [brandError, setBrandError] = useState('');
  // Category/Brand management modal state
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [showManageBrands, setShowManageBrands] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number|null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editBrandId, setEditBrandId] = useState<number|null>(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [manageCategoryError, setManageCategoryError] = useState('');
  const [manageBrandError, setManageBrandError] = useState('');
  const [manageCategoryLoading, setManageCategoryLoading] = useState(false);
  const [manageBrandLoading, setManageBrandLoading] = useState(false);
  const { toast } = useToast();
  // For search/filter in modals
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  // For add new inline
  const [addingNewCategory, setAddingNewCategory] = useState(false);
  const [newManageCategoryName, setNewManageCategoryName] = useState('');
  const [addingNewBrand, setAddingNewBrand] = useState(false);
  const [newManageBrandName, setNewManageBrandName] = useState('');
  const [deleteCategoryId, setDeleteCategoryId] = useState<number|null>(null);
  const [deleteBrandId, setDeleteBrandId] = useState<number|null>(null);
  // For delete confirmation input
  const [deleteCategoryInput, setDeleteCategoryInput] = useState('');
  const [deleteBrandInput, setDeleteBrandInput] = useState('');
  // Track upload progress for each image
  const [imageUploadProgress, setImageUploadProgress] = useState<number[]>([]);
  const [editImageUploadProgress, setEditImageUploadProgress] = useState<number[]>([]);
  // For tracking image deletion loading state
  const [deletingImagePublicId, setDeletingImagePublicId] = useState<string | null>(null);
  // Modal state for image management
  const [showImageManager, setShowImageManager] = useState(false);
  const [imageManagerImages, setImageManagerImages] = useState<{ url: string, publicId: string }[]>([]);
  const [imageManagerPreviews, setImageManagerPreviews] = useState<string[]>([]);
  const [imageManagerFiles, setImageManagerFiles] = useState<File[]>([]);
  const [imageManagerProgress, setImageManagerProgress] = useState<number[]>([]);
  const [imageManagerDeleting, setImageManagerDeleting] = useState<string | null>(null);
  const [imageManagerError, setImageManagerError] = useState('');
  const [imageManagerSaving, setImageManagerSaving] = useState(false);
  // Delete mode for image manager
  const [deleteMode, setDeleteMode] = useState(false);
  const [confirmDeleteImg, setConfirmDeleteImg] = useState<{ url: string, publicId: string } | null>(null);

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor));

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
      .then(data => {
        setProducts(Array.isArray(data.products) ? data.products.map(prod => ({
          ...prod,
          images: Array.isArray(prod.images)
            ? prod.images.map(img => typeof img === 'string' ? { url: img, publicId: '' } : { url: img.url, publicId: img.publicId || '' })
            : [],
        })) : []);
        setTotalProducts(data.total || 0);
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
  }, []);

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
    // Cloudinary upload
    let imageObjs: { url: string, publicId: string }[] = Array.isArray(uploadedImages)
      ? uploadedImages.map(img => typeof img === 'string' ? { url: img, publicId: '' } : { url: img.url, publicId: img.publicId || '' })
      : [];
    if (imageFiles.length > 0) {
      setImageUploadProgress(Array(imageFiles.length).fill(0));
      try {
        const uploaded = await Promise.all(imageFiles.map((file, idx) =>
          uploadToCloudinaryWithProgress(file, (percent) => {
            setImageUploadProgress(prev => {
              const copy = [...prev];
              copy[idx] = percent;
              return copy;
            });
          })
        ));
        imageObjs = [...imageObjs, ...uploaded];
        setUploadedImages(imageObjs);
      } catch (err: any) {
        setAddProductError('Image upload failed: ' + (err.message || 'Cloudinary error'));
        setAddingProduct(false);
        setImageUploadProgress([]);
        return;
      }
      setImageUploadProgress([]);
    }
    const imageUrls = imageObjs.map(img => img.url);
    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.numericPrice || !newProduct.categoryId || !newProduct.brandId || !newProduct.rating) {
      setAddProductError('Please fill all required fields.');
      setAddingProduct(false);
      return;
    }
    // Prepare payload with correct types
    const payload = {
      id: uuidv4(),
      name: newProduct.name,
      price: newProduct.price,
      numericPrice: typeof newProduct.numericPrice === 'string' && newProduct.numericPrice === '' ? undefined : Number(newProduct.numericPrice),
      images: imageUrls,
      categoryId: typeof newProduct.categoryId === 'string' && newProduct.categoryId === '' ? undefined : Number(newProduct.categoryId),
      brandId: typeof newProduct.brandId === 'string' && newProduct.brandId === '' ? undefined : Number(newProduct.brandId),
      rating: typeof newProduct.rating === 'string' && newProduct.rating === '' ? undefined : Number(newProduct.rating),
      reviewCount: typeof newProduct.reviewCount === 'string' && newProduct.reviewCount === '' ? undefined : Number(newProduct.reviewCount),
      soldCount: typeof newProduct.soldCount === 'string' && newProduct.soldCount === '' ? undefined : Number(newProduct.soldCount),
      gst: typeof newProduct.gst === 'string' && newProduct.gst === '' ? 18 : Number(newProduct.gst),
      offerPrice: typeof newProduct.offerPrice === 'string' && newProduct.offerPrice === '' ? 0 : Number(newProduct.offerPrice),
      shortDescription: newProduct.shortDescription || undefined,
      inStock: !!newProduct.inStock,
      isNew: !!newProduct.isNew,
      isHot: !!newProduct.isHot,
      features: Array.isArray(newProduct.features) ? newProduct.features.filter(f => f && f.value).map(f => ({ value: f.value })) : [],
      specifications: Array.isArray(newProduct.specifications) ? newProduct.specifications.filter(s => s && s.key && s.value).map(s => ({ key: s.key, value: s.value })) : [],
    };
    try {
      const res = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add product');
      }
      const product = await res.json();
      setProducts([...products, product]);
      setNewProduct(initialProductState);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (err: any) {
      setAddProductError(err.message || 'Failed to add product');
    } finally {
      setAddingProduct(false);
    }
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
    let imageObjsEdit: { url: string, publicId: string }[] = Array.isArray(editUploadedImages)
      ? editUploadedImages.map(img => typeof img === 'string' ? { url: img, publicId: '' } : { url: img.url, publicId: img.publicId || '' })
      : [];
    // Add existing images from editProductState.images (if not already objects)
    if (Array.isArray(editProductState.images)) {
      for (const img of editProductState.images) {
        if (typeof img === 'string' && !imageObjsEdit.some(i => i.url === img)) {
          imageObjsEdit.push({ url: img, publicId: '' }); // publicId unknown for legacy images
        } else if (typeof img === 'object' && img.url && !imageObjsEdit.some(i => i.url === img.url)) {
          imageObjsEdit.push(img);
        }
      }
    }
    // If new image files are selected, upload them to Cloudinary
    if (editImageFiles.length > 0) {
      setEditImageUploadProgress(Array(editImageFiles.length).fill(0));
      try {
        const uploaded = await Promise.all(editImageFiles.map((file, idx) =>
          uploadToCloudinaryWithProgress(file, (percent) => {
            setEditImageUploadProgress(prev => {
              const copy = [...prev];
              copy[idx] = percent;
              return copy;
            });
          })
        ));
        imageObjsEdit = [...imageObjsEdit, ...uploaded];
        setEditUploadedImages(imageObjsEdit);
      } catch (err: any) {
        setEditError('Image upload failed: ' + (err.message || 'Cloudinary error'));
        setEditLoading(false);
        setEditImageUploadProgress([]);
        return;
      }
      setEditImageUploadProgress([]);
    }
    // Remove images marked for deletion
    imageObjsEdit = imageObjsEdit.filter(img => !imagesToDelete.includes(img.publicId));
    const imageUrls = imageObjsEdit.map(img => img.url);
    // Validate required fields
    if (!editProductState.name || !editProductState.price || !editProductState.numericPrice || !editProductState.categoryId || !editProductState.brandId || !editProductState.rating) {
      setEditError('Please fill all required fields.');
      setEditLoading(false);
      return;
    }
    // Prepare payload
    const payload = {
      ...editProductState,
      images: imageUrls,
      categoryId: typeof editProductState.categoryId === 'string' && editProductState.categoryId === '' ? undefined : Number(editProductState.categoryId),
      brandId: typeof editProductState.brandId === 'string' && editProductState.brandId === '' ? undefined : Number(editProductState.brandId),
      numericPrice: typeof editProductState.numericPrice === 'string' && editProductState.numericPrice === '' ? undefined : Number(editProductState.numericPrice),
      rating: typeof editProductState.rating === 'string' && editProductState.rating === '' ? undefined : Number(editProductState.rating),
      reviewCount: typeof editProductState.reviewCount === 'string' && editProductState.reviewCount === '' ? undefined : Number(editProductState.reviewCount),
      soldCount: typeof editProductState.soldCount === 'string' && editProductState.soldCount === '' ? undefined : Number(editProductState.soldCount),
      gst: typeof editProductState.gst === 'string' && editProductState.gst === '' ? 18 : Number(editProductState.gst),
      offerPrice: typeof editProductState.offerPrice === 'string' && editProductState.offerPrice === '' ? 0 : Number(editProductState.offerPrice),
      shortDescription: editProductState.shortDescription || undefined,
      inStock: !!editProductState.inStock,
      isNew: !!editProductState.isNew,
      isHot: !!editProductState.isHot,
      features: Array.isArray(editProductState.features) ? editProductState.features.filter(f => f && f.value).map(f => ({ value: f.value })) : [],
      specifications: Array.isArray(editProductState.specifications) ? editProductState.specifications.filter(s => s && s.key && s.value).map(s => ({ key: s.key, value: s.value })) : [],
    };
    try {
      const res = await fetch(`http://localhost:4000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update product');
      }
      const product = await res.json();
      setProducts(products.map(p => (p.id === product.id ? product : p)));
      setEditModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update product');
    } finally {
      setEditLoading(false);
    }
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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    setCategoryError('');
    try {
      const res = await fetch('http://localhost:4000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add category');
      }
      const cat = await res.json();
      setCategories([...categories, cat]);
      setNewProduct(p => ({ ...p, categoryId: String(cat.id) }));
      setEditProductState(p => ({ ...p, categoryId: String(cat.id) }));
      setShowAddCategory(false);
      setNewCategoryName('');
    } catch (err: any) {
      setCategoryError(err.message || 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    setAddingBrand(true);
    setBrandError('');
    try {
      const res = await fetch('http://localhost:4000/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add brand');
      }
      const brand = await res.json();
      setBrands([...brands, brand]);
      setNewProduct(p => ({ ...p, brandId: String(brand.id) }));
      setEditProductState(p => ({ ...p, brandId: String(brand.id) }));
      setShowAddBrand(false);
      setNewBrandName('');
    } catch (err: any) {
      setBrandError(err.message || 'Failed to add brand');
    } finally {
      setAddingBrand(false);
    }
  };

  // Category management handlers
  const handleEditCategory = (cat: any) => {
    setEditCategoryId(cat.id);
    setEditCategoryName(cat.name);
    setManageCategoryError('');
  };
  const handleSaveEditCategory = async () => {
    if (!editCategoryName.trim() || editCategoryId == null) return;
    setManageCategoryLoading(true);
    setManageCategoryError('');
    try {
      const res = await fetch(`http://localhost:4000/api/categories/${editCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCategoryName.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update category');
      }
      const updated = await res.json();
      setCategories(categories.map(c => c.id === updated.id ? updated : c));
      setEditCategoryId(null);
      setEditCategoryName('');
    } catch (err: any) {
      setManageCategoryError(err.message || 'Failed to update category');
    } finally {
      setManageCategoryLoading(false);
    }
  };
  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Delete this category?')) return;
    setManageCategoryLoading(true);
    setManageCategoryError('');
    try {
      const res = await fetch(`http://localhost:4000/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category');
      }
      setCategories(categories.filter(c => c.id !== id));
    } catch (err: any) {
      setManageCategoryError(err.message || 'Failed to delete category');
    } finally {
      setManageCategoryLoading(false);
    }
  };

  // Brand management handlers
  const handleEditBrand = (brand: any) => {
    setEditBrandId(brand.id);
    setEditBrandName(brand.name);
    setManageBrandError('');
  };
  const handleSaveEditBrand = async () => {
    if (!editBrandName.trim() || editBrandId == null) return;
    setManageBrandLoading(true);
    setManageBrandError('');
    try {
      const res = await fetch(`http://localhost:4000/api/brands/${editBrandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editBrandName.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update brand');
      }
      const updated = await res.json();
      setBrands(brands.map(b => b.id === updated.id ? updated : b));
      setEditBrandId(null);
      setEditBrandName('');
    } catch (err: any) {
      setManageBrandError(err.message || 'Failed to update brand');
    } finally {
      setManageBrandLoading(false);
    }
  };
  const handleDeleteBrand = async (id: number) => {
    if (!window.confirm('Delete this brand?')) return;
    setManageBrandLoading(true);
    setManageBrandError('');
    try {
      const res = await fetch(`http://localhost:4000/api/brands/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete brand');
      }
      setBrands(brands.filter(b => b.id !== id));
    } catch (err: any) {
      setManageBrandError(err.message || 'Failed to delete brand');
    } finally {
      setManageBrandLoading(false);
    }
  };

  // Add new category from modal
  const handleAddNewCategory = async () => {
    if (!newManageCategoryName.trim()) return;
    setManageCategoryLoading(true);
    setManageCategoryError('');
    try {
      const res = await fetch('http://localhost:4000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newManageCategoryName.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add category');
      }
      const created = await res.json();
      setCategories([...categories, created]);
      setNewManageCategoryName('');
      setAddingNewCategory(false);
      toast({ title: 'Category added', description: created.name + ' created successfully.' });
    } catch (err: any) {
      setManageCategoryError(err.message || 'Failed to add category');
      toast({ title: 'Error', description: err.message || 'Failed to add category', variant: 'destructive' });
    } finally {
      setManageCategoryLoading(false);
    }
  };
  // Add new brand from modal
  const handleAddNewBrand = async () => {
    if (!newManageBrandName.trim()) return;
    setManageBrandLoading(true);
    setManageBrandError('');
    try {
      const res = await fetch('http://localhost:4000/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newManageBrandName.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add brand');
      }
      const created = await res.json();
      setBrands([...brands, created]);
      setNewManageBrandName('');
      setAddingNewBrand(false);
      toast({ title: 'Brand added', description: created.name + ' created successfully.' });
    } catch (err: any) {
      setManageBrandError(err.message || 'Failed to add brand');
      toast({ title: 'Error', description: err.message || 'Failed to add brand', variant: 'destructive' });
    } finally {
      setManageBrandLoading(false);
    }
  };

  // Filtered lists
  const filteredCategories = categories.filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()));
  const filteredBrands = brands.filter(brand => brand.name.toLowerCase().includes(brandSearch.toLowerCase()));

  // Reset confirmation input when dialog closes
  useEffect(() => { if (!showManageCategories) setDeleteCategoryInput(''); }, [showManageCategories]);
  useEffect(() => { if (!showManageBrands) setDeleteBrandInput(''); }, [showManageBrands]);

  // Helper: upload to Cloudinary with progress
  function uploadToCloudinaryWithProgress(file: File, onProgress: (percent: number) => void): Promise<{ url: string, publicId: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      xhr.open('POST', CLOUDINARY_URL);
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      });
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url, publicId: data.public_id });
        } else {
          reject(new Error('Cloudinary upload failed'));
        }
      };
      xhr.onerror = () => reject(new Error('Cloudinary upload failed'));
      xhr.send(formData);
    });
  }

  // Open image manager modal with current images
  const openImageManager = () => {
    // Always load the latest images for the current product
    let imgs = editUploadedImages.filter(img => !imagesToDelete.includes(img.publicId));
    setImageManagerImages(imgs);
    setImageManagerPreviews([]);
    setImageManagerFiles([]);
    setImageManagerProgress([]);
    setImageManagerError('');
    setShowImageManager(true);
  };

  // Handle drag end
  const handleImageManagerDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImageManagerImages((imgs) => {
        const oldIndex = imgs.findIndex(img => img.publicId === active.id);
        const newIndex = imgs.findIndex(img => img.publicId === over.id);
        return arrayMove(imgs, oldIndex, newIndex);
      });
    }
  };

  // Add new images in manager
  const handleImageManagerAdd = async () => {
    setImageManagerError('');
    setImageManagerProgress(Array(imageManagerFiles.length).fill(0));
    try {
      const uploaded = await Promise.all(imageManagerFiles.map((file, idx) =>
        uploadToCloudinaryWithProgress(file, (percent) => {
          setImageManagerProgress(prev => {
            const copy = [...prev];
            copy[idx] = percent;
            return copy;
          });
        })
      ));
      setImageManagerImages([...imageManagerImages, ...uploaded]);
      setImageManagerFiles([]);
      setImageManagerPreviews([]);
      setImageManagerProgress([]);
    } catch (err: any) {
      setImageManagerError('Image upload failed: ' + (err.message || 'Cloudinary error'));
      setImageManagerProgress([]);
    }
  };

  // Remove image in manager
  const handleImageManagerRemove = async (img: { url: string, publicId: string }) => {
    // Always remove from UI
    setImageManagerImages(prev => prev.filter(i => !(i.url === img.url && i.publicId === img.publicId)));
    if (!img.publicId) return;
    setImageManagerDeleting(img.publicId);
    try {
      const res = await fetch(`http://localhost:4000/api/products/delete-image/${img.publicId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete image from Cloudinary');
      }
    } catch (err: any) {
      setImageManagerError('Failed to delete image: ' + (err.message || 'Cloudinary error'));
    } finally {
      setImageManagerDeleting(null);
    }
  };

  // Save images from manager to edit product
  const handleImageManagerSave = async () => {
    setImageManagerSaving(true);
    setImageManagerError('');
    const newImages = imageManagerImages.map(img =>
      typeof img === 'string' ? { url: img, publicId: '' } : { url: img.url, publicId: img.publicId || '' }
    );
    try {
      if (!editingProduct) throw new Error('No product selected');
      const res = await fetch(`http://localhost:4000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingProduct, images: newImages }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update product images');
      }
      // Update product in UI
      setProducts(products => products.map(p => p.id === editingProduct.id ? { ...p, images: newImages } : p));
      setEditUploadedImages(newImages);
      setImagesToDelete([]);
      setShowImageManager(false);
      toast({ title: 'Images updated', description: 'Product images updated successfully.' });
    } catch (err: any) {
      setImageManagerError(err.message || 'Failed to update images');
      toast({ title: 'Failed to update images', description: err.message || 'Error', variant: 'destructive' });
    } finally {
      setImageManagerSaving(false);
    }
  };

  // Cancel manager (discard changes)
  const handleImageManagerCancel = () => {
    setShowImageManager(false);
  };

  // Sortable image item
  function SortableImage({ img, idx, onRemove, deleteMode }: { img: { url: string, publicId: string }, idx: number, onRemove: (img: { url: string, publicId: string }) => void, deleteMode: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.publicId });
    return (
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
        className="relative cursor-move"
        {...attributes}
        {...listeners}
      >
        <img src={img.url} alt={`Image ${idx + 1}`} className={`max-h-32 rounded border ${deleteMode ? 'border-red-500' : ''}`} />
        {deleteMode && (
          <button
            type="button"
            className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
            onClick={e => { e.stopPropagation(); onRemove(img); }}
            aria-label="Remove image"
            disabled={imageManagerDeleting === img.publicId}
          >
            {imageManagerDeleting === img.publicId ? (
              <span className="animate-spin"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></span>
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
          </button>
        )}
      </div>
    );
  }

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
                  <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild>
                      <Button size="icon" variant={productView === 'table' ? 'default' : 'outline'} className="rounded-full" onClick={() => setProductView('table')} aria-label="Table View">
                        <LayoutGrid className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger><TooltipContent>Table View</TooltipContent></Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild>
                      <Button size="icon" variant={productView === 'card' ? 'default' : 'outline'} className="rounded-full" onClick={() => setProductView('card')} aria-label="Card View">
                        <List className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger><TooltipContent>Card View</TooltipContent></Tooltip>
                  </TooltipProvider>
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
                <div className="flex gap-2 mb-2 sm:mb-0">
                  <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild>
                      <Button size="icon" className="bg-mangla-gold hover:bg-mangla-gold/90 text-white shadow rounded-full" onClick={() => setShowAddModal(true)} aria-label="Add Product">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger><TooltipContent>Add Product</TooltipContent></Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="rounded-full" onClick={() => setShowManageCategories(true)} aria-label="Manage Categories">
                        <ImageIcon className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger><TooltipContent>Manage Categories</TooltipContent></Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="rounded-full" onClick={() => setShowManageBrands(true)} aria-label="Manage Brands">
                        <Tag className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger><TooltipContent>Manage Brands</TooltipContent></Tooltip>
                  </TooltipProvider>
                </div>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <span />
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
                      <label className="font-medium">Product Name</label>
                      <Input
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        disabled={addingProduct}
                        required
                      />
                      <label className="font-medium">Price (display string, e.g. ₹1,999)</label>
                      <Input
                        placeholder="Price (display string, e.g. ₹1,999)"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        disabled={addingProduct}
                        required
                      />
                      <label className="font-medium">Numeric Price (number)</label>
                      <Input
                        placeholder="Numeric Price (number)"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={typeof newProduct.numericPrice === 'string' && newProduct.numericPrice === '' ? '' : String(newProduct.numericPrice)}
                        onChange={e => setNewProduct({ ...newProduct, numericPrice: e.target.value.replace(/[^0-9.]/g, '') })}
                        disabled={addingProduct}
                        required
                      />
                      <label className="font-medium">Rating (float)</label>
                      <Input
                        placeholder="Rating (float)"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9.]*"
                        value={typeof newProduct.rating === 'string' && newProduct.rating === '' ? '' : String(newProduct.rating)}
                        onChange={e => setNewProduct({ ...newProduct, rating: e.target.value.replace(/[^0-9.]/g, '') })}
                        disabled={addingProduct}
                        required
                      />
                      <label className="font-medium">Review Count (optional)</label>
                      <Input
                        placeholder="Review Count (optional)"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={typeof newProduct.reviewCount === 'string' && newProduct.reviewCount === '' ? '' : String(newProduct.reviewCount)}
                        onChange={e => setNewProduct({ ...newProduct, reviewCount: e.target.value.replace(/[^0-9]/g, '') })}
                        disabled={addingProduct}
                      />
                      <label className="font-medium">Sold Count (optional)</label>
                      <Input
                        placeholder="Sold Count (optional)"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={typeof newProduct.soldCount === 'string' && newProduct.soldCount === '' ? '' : String(newProduct.soldCount)}
                        onChange={e => setNewProduct({ ...newProduct, soldCount: e.target.value.replace(/[^0-9]/g, '') })}
                        disabled={addingProduct}
                      />
                      <label className="font-medium">Short Description (optional)</label>
                      <Textarea
                        placeholder="Short Description (optional)"
                        value={newProduct.shortDescription}
                        onChange={e => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                        disabled={addingProduct}
                        rows={2}
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
                          <div className="p-2 border-t flex items-center gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => setShowAddCategory(true)}>
                              + Add New
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                      {/* Add Category Modal */}
                      <SimpleDialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                        <DialogContent className="max-w-xs w-full">
                          <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                          </DialogHeader>
                          <Input
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            disabled={addingCategory}
                            autoFocus
                          />
                          {categoryError && <div className="text-red-500 text-sm mt-1">{categoryError}</div>}
                          <DialogFooter>
                            <Button onClick={handleAddCategory} disabled={addingCategory || !newCategoryName.trim()}>
                              {addingCategory ? 'Adding...' : 'Add'}
                            </Button>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary" onClick={() => setShowAddCategory(false)}>Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </SimpleDialog>
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
                          <div className="p-2 border-t flex items-center gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => setShowAddBrand(true)}>
                              + Add New
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                      {/* Add Brand Modal */}
                      <SimpleDialog open={showAddBrand} onOpenChange={setShowAddBrand}>
                        <DialogContent className="max-w-xs w-full">
                          <DialogHeader>
                            <DialogTitle>Add New Brand</DialogTitle>
                          </DialogHeader>
                          <Input
                            placeholder="Brand Name"
                            value={newBrandName}
                            onChange={e => setNewBrandName(e.target.value)}
                            disabled={addingBrand}
                            autoFocus
                          />
                          {brandError && <div className="text-red-500 text-sm mt-1">{brandError}</div>}
                          <DialogFooter>
                            <Button onClick={handleAddBrand} disabled={addingBrand || !newBrandName.trim()}>
                              {addingBrand ? 'Adding...' : 'Add'}
                            </Button>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary" onClick={() => setShowAddBrand(false)}>Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </SimpleDialog>
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
                        {uploadedImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {uploadedImages.map((img, idx) => (
                              <div key={img.url} className="relative">
                                <img src={img.url} alt={`Uploaded ${idx + 1}`} className="max-h-32 rounded border" />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
                                  onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                                  aria-label="Remove image"
                                  disabled={addingProduct && imageUploadProgress.length > 0}
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {imagePreviews.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {imagePreviews.map((preview, idx) => (
                              <div key={preview} className="relative">
                                <img src={preview} alt={`Preview ${idx + 1}`} className="max-h-32 rounded border opacity-60" />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
                                  onClick={() => handleRemoveImage(idx)}
                                  aria-label="Remove image"
                                  disabled={addingProduct && imageUploadProgress.length > 0}
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </button>
                                {addingProduct && imageUploadProgress[idx] !== undefined && (
                                  <div className="absolute left-1 bottom-1 right-1 bg-white/80 rounded px-1 py-0.5 text-xs text-blue-700 font-semibold flex items-center">
                                    {imageUploadProgress[idx] < 100 ? (
                                      <>
                                        <span>Uploading: {imageUploadProgress[idx]}%</span>
                                        <span className="ml-1 animate-spin"><svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></span>
                                      </>
                                    ) : (
                                      <span>Uploaded</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Input
                        placeholder="GST (%)"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9.]*"
                        value={typeof newProduct.gst === 'string' && newProduct.gst === '' ? '' : String(newProduct.gst)}
                        onChange={e => setNewProduct({ ...newProduct, gst: e.target.value.replace(/[^0-9.]/g, '') })}
                        disabled={addingProduct}
                        required
                      />
                      <Input
                        placeholder="Offer Price"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9.]*"
                        value={typeof newProduct.offerPrice === 'string' && newProduct.offerPrice === '' ? '' : String(newProduct.offerPrice)}
                        onChange={e => setNewProduct({ ...newProduct, offerPrice: e.target.value.replace(/[^0-9.]/g, '') })}
                        disabled={addingProduct}
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
                        <Button type="submit" disabled={addingProduct || imageUploadProgress.some(p => p > 0 && p < 100)}>
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
                          <th className="px-4 py-2 text-left w-8">#</th>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Price</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.slice((page - 1) * limit, page * limit).map((product, idx) => (
                          <tr key={product.id} className="border-b hover:bg-accent/30 transition">
                            <td className="px-4 py-2">
                              <span
                                className={
                                  `inline-block min-w-[2rem] px-2 py-1 text-xs font-bold text-white rounded-md text-center ` +
                                  (product.inStock
                                    ? 'bg-green-500/90'
                                    : 'bg-red-500/90')
                                }
                              >
                                {(page - 1) * limit + idx + 1}
                              </span>
                            </td>
                            <td className="px-4 py-2 font-medium">{product.name}</td>
                            <td className="px-4 py-2">{categories.find(c => c.id === product.categoryId)?.name || '-'}</td>
                            <td className="px-4 py-2">₹{product.price}</td>
                            <td className="px-4 py-2 flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => openEditModal(product)} aria-label="Edit">
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="icon" variant="destructive" onClick={() => handleRemoveProduct(product.id)} aria-label="Delete">
                                      <Trash className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => {
                                      setEditingProduct(product);
                                      setEditProductState({ ...initialProductState, ...product, categoryId: String(product.categoryId), brandId: String(product.brandId) });
                                      // Support both array of strings and array of { url, publicId }
                                      let imgs = Array.isArray(product.images)
                                        ? product.images.map((img: any) =>
                                            typeof img === 'string' ? { url: img, publicId: '' } : { url: img.url, publicId: img.publicId || '' }
                                          )
                                        : [];
                                      setEditUploadedImages(imgs);
                                      setImageManagerImages(imgs);
                                      setShowImageManager(true);
                                    }} aria-label="Manage Images">
                                      <Upload className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Manage Images</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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
                    <Button variant="outline" size="icon" onClick={() => handlePageChange(page - 1)} disabled={page === 1} aria-label="Previous Page">
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
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
                    <Button variant="outline" size="icon" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} aria-label="Next Page">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
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
            <label className="font-medium">Product Name</label>
            <Input
              placeholder="Product Name"
              value={editProductState.name}
              onChange={e => setEditProductState({ ...editProductState, name: e.target.value })}
              disabled={editLoading}
              required
            />
            <label className="font-medium">Price (display string, e.g. ₹1,999)</label>
            <Input
              placeholder="Price (display string, e.g. ₹1,999)"
              value={editProductState.price}
              onChange={e => setEditProductState({ ...editProductState, price: e.target.value })}
              disabled={editLoading}
              required
            />
            <label className="font-medium">Numeric Price (number)</label>
            <Input
              placeholder="Numeric Price (number)"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={typeof editProductState.numericPrice === 'string' && editProductState.numericPrice === '' ? '' : String(editProductState.numericPrice)}
              onChange={e => setEditProductState({ ...editProductState, numericPrice: e.target.value.replace(/[^0-9.]/g, '') })}
              disabled={editLoading}
              required
            />
            <label className="font-medium">Rating (float)</label>
            <Input
              placeholder="Rating (float)"
              type="text"
              inputMode="numeric"
              pattern="[0-9.]*"
              value={typeof editProductState.rating === 'string' && editProductState.rating === '' ? '' : String(editProductState.rating)}
              onChange={e => setEditProductState({ ...editProductState, rating: e.target.value.replace(/[^0-9.]/g, '') })}
              disabled={editLoading}
              required
            />
            <label className="font-medium">Review Count (optional)</label>
            <Input
              placeholder="Review Count (optional)"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={typeof editProductState.reviewCount === 'string' && editProductState.reviewCount === '' ? '' : String(editProductState.reviewCount)}
              onChange={e => setEditProductState({ ...editProductState, reviewCount: e.target.value.replace(/[^0-9]/g, '') })}
              disabled={editLoading}
            />
            <label className="font-medium">Sold Count (optional)</label>
            <Input
              placeholder="Sold Count (optional)"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={typeof editProductState.soldCount === 'string' && editProductState.soldCount === '' ? '' : String(editProductState.soldCount)}
              onChange={e => setEditProductState({ ...editProductState, soldCount: e.target.value.replace(/[^0-9]/g, '') })}
              disabled={editLoading}
            />
            <label className="font-medium">Short Description (optional)</label>
            <Textarea
              placeholder="Short Description (optional)"
              value={editProductState.shortDescription}
              onChange={e => setEditProductState({ ...editProductState, shortDescription: e.target.value })}
              disabled={editLoading}
              rows={2}
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
                      <img src={preview} alt={`Preview ${idx + 1}`} className="max-h-32 rounded border opacity-60" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
                        onClick={() => handleRemoveEditImage(idx)}
                        aria-label="Remove image"
                        disabled={editLoading && editImageUploadProgress.length > 0}
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                      {editLoading && editImageUploadProgress[idx] !== undefined && (
                        <div className="absolute left-1 bottom-1 right-1 bg-white/80 rounded px-1 py-0.5 text-xs text-blue-700 font-semibold flex items-center">
                          {editImageUploadProgress[idx] < 100 ? (
                            <>
                              <span>Uploading: {editImageUploadProgress[idx]}%</span>
                              <span className="ml-1 animate-spin"><svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></span>
                            </>
                          ) : (
                            <span>Uploaded</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Input
              placeholder="GST (%)"
              type="text"
              inputMode="numeric"
              pattern="[0-9.]*"
              value={typeof editProductState.gst === 'string' && editProductState.gst === '' ? '' : String(editProductState.gst)}
              onChange={e => setEditProductState({ ...editProductState, gst: e.target.value.replace(/[^0-9.]/g, '') })}
              disabled={editLoading}
              required
            />
            <Input
              placeholder="Offer Price"
              type="text"
              inputMode="numeric"
              pattern="[0-9.]*"
              value={typeof editProductState.offerPrice === 'string' && editProductState.offerPrice === '' ? '' : String(editProductState.offerPrice)}
              onChange={e => setEditProductState({ ...editProductState, offerPrice: e.target.value.replace(/[^0-9.]/g, '') })}
              disabled={editLoading}
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
            <Button type="button" variant="outline" onClick={openImageManager} className="mb-2">Manage Images</Button>
            <DialogFooter>
              <Button type="submit" disabled={editLoading || editImageUploadProgress.some(p => p > 0 && p < 100)}>
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
      {/* Manage Categories Modal */}
      <SimpleDialog open={showManageCategories} onOpenChange={setShowManageCategories}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>
          <div className="mb-3 flex items-center gap-2">
            <Input
              placeholder="Search categories..."
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
              className="flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" onClick={() => setAddingNewCategory(v => !v)} aria-label="Add Category">
                    <Plus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add New Category</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {addingNewCategory && (
            <div className="flex items-center gap-2 mb-3 animate-fade-in">
              <Input
                placeholder="Category name"
                value={newManageCategoryName}
                onChange={e => setNewManageCategoryName(e.target.value)}
                disabled={manageCategoryLoading}
                autoFocus
              />
              <Button size="sm" onClick={handleAddNewCategory} disabled={manageCategoryLoading || !newManageCategoryName.trim()}>
                {manageCategoryLoading ? <span className="animate-spin mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></span> : 'Add'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setAddingNewCategory(false); setNewManageCategoryName(''); }} disabled={manageCategoryLoading}>Cancel</Button>
            </div>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredCategories.length === 0 && <div className="text-muted-foreground text-center py-6">No categories found.</div>}
            {filteredCategories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 rounded hover:bg-accent px-2 py-1 transition">
                {editCategoryId === cat.id ? (
                  <>
                    <Input
                      value={editCategoryName}
                      onChange={e => setEditCategoryName(e.target.value)}
                      disabled={manageCategoryLoading}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveEditCategory} disabled={manageCategoryLoading || !editCategoryName.trim()}>
                      {manageCategoryLoading ? <span className="animate-spin mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></span> : 'Save'}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditCategoryId(null)} disabled={manageCategoryLoading}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 truncate font-medium">{cat.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => handleEditCategory(cat)} disabled={manageCategoryLoading} aria-label="Edit">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => setDeleteCategoryId(cat.id)} aria-label="Delete">
                                <Trash className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  <div className="text-destructive font-semibold mb-2">Warning: This will delete <b>all products</b> in this category. This action cannot be undone.</div>
                                  <div>To confirm, type <span className="font-mono bg-muted px-1 rounded">Yes Delete</span> below:</div>
                                  <Input
                                    className="mt-2"
                                    placeholder="Type Yes Delete to confirm"
                                    value={deleteCategoryInput}
                                    onChange={e => setDeleteCategoryInput(e.target.value)}
                                    autoFocus
                                  />
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => { setDeleteCategoryId(null); setDeleteCategoryInput(''); }}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={deleteCategoryInput !== 'Yes Delete'}
                                  onClick={async () => {
                                    if (deleteCategoryInput !== 'Yes Delete') {
                                      toast({ title: 'Confirmation failed', description: 'You must type Yes Delete to confirm.', variant: 'destructive' });
                                      return;
                                    }
                                    setDeleteCategoryId(null);
                                    setDeleteCategoryInput('');
                                    await handleDeleteCategory(cat.id);
                                    toast({ title: 'Category deleted', description: cat.name + ' and all related products deleted.' });
                                  }}
                                >Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </div>
            ))}
          </div>
          {manageCategoryError && <div className="text-red-500 text-sm mt-2">{manageCategoryError}</div>}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowManageCategories(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </SimpleDialog>
      {/* Manage Brands Modal */}
      <SimpleDialog open={showManageBrands} onOpenChange={setShowManageBrands}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Manage Brands</DialogTitle>
          </DialogHeader>
          <div className="mb-3 flex items-center gap-2">
            <Input
              placeholder="Search brands..."
              value={brandSearch}
              onChange={e => setBrandSearch(e.target.value)}
              className="flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" onClick={() => setAddingNewBrand(v => !v)} aria-label="Add Brand">
                    <Plus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add New Brand</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {addingNewBrand && (
            <div className="flex items-center gap-2 mb-3 animate-fade-in">
              <Input
                placeholder="Brand name"
                value={newManageBrandName}
                onChange={e => setNewManageBrandName(e.target.value)}
                disabled={manageBrandLoading}
                autoFocus
              />
              <Button size="sm" onClick={handleAddNewBrand} disabled={manageBrandLoading || !newManageBrandName.trim()}>
                {manageBrandLoading ? <span className="animate-spin mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></span> : 'Add'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setAddingNewBrand(false); setNewManageBrandName(''); }} disabled={manageBrandLoading}>Cancel</Button>
            </div>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredBrands.length === 0 && <div className="text-muted-foreground text-center py-6">No brands found.</div>}
            {filteredBrands.map(brand => (
              <div key={brand.id} className="flex items-center gap-2 rounded hover:bg-accent px-2 py-1 transition">
                {editBrandId === brand.id ? (
                  <>
                    <Input
                      value={editBrandName}
                      onChange={e => setEditBrandName(e.target.value)}
                      disabled={manageBrandLoading}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveEditBrand} disabled={manageBrandLoading || !editBrandName.trim()}>
                      {manageBrandLoading ? <span className="animate-spin mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></span> : 'Save'}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditBrandId(null)} disabled={manageBrandLoading}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 truncate font-medium">{brand.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => setDeleteBrandId(brand.id)} aria-label="Delete">
                                <Trash className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                                <AlertDialogDescription>
                                  <div className="text-destructive font-semibold mb-2">Warning: This will delete <b>all products</b> in this brand. This action cannot be undone.</div>
                                  <div>To confirm, type <span className="font-mono bg-muted px-1 rounded">Yes Delete</span> below:</div>
                                  <Input
                                    className="mt-2"
                                    placeholder="Type Yes Delete to confirm"
                                    value={deleteBrandInput}
                                    onChange={e => setDeleteBrandInput(e.target.value)}
                                    autoFocus
                                  />
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => { setDeleteBrandId(null); setDeleteBrandInput(''); }}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={deleteBrandInput !== 'Yes Delete'}
                                  onClick={async () => {
                                    if (deleteBrandInput !== 'Yes Delete') {
                                      toast({ title: 'Confirmation failed', description: 'You must type Yes Delete to confirm.', variant: 'destructive' });
                                      return;
                                    }
                                    setDeleteBrandId(null);
                                    setDeleteBrandInput('');
                                    await handleDeleteBrand(brand.id);
                                    toast({ title: 'Brand deleted', description: brand.name + ' and all related products deleted.' });
                                  }}
                                >Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </div>
            ))}
          </div>
          {manageBrandError && <div className="text-red-500 text-sm mt-2">{manageBrandError}</div>}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowManageBrands(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </SimpleDialog>
      {/* Image Manager Modal */}
      <Dialog open={showImageManager} onOpenChange={setShowImageManager}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Manage Product Images</DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-sm text-muted-foreground">Drag to reorder. Add or remove images as needed.</div>
          {deleteMode ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {imageManagerImages.map((img, idx) => (
                <SortableImage
                  key={img.publicId || img.url}
                  img={img}
                  idx={idx}
                  deleteMode={deleteMode}
                  onRemove={img => setConfirmDeleteImg(img)}
                />
              ))}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleImageManagerDragEnd}>
              <SortableContext items={imageManagerImages.map(img => img.publicId)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {imageManagerImages.map((img, idx) => (
                    <SortableImage
                      key={img.publicId || img.url}
                      img={img}
                      idx={idx}
                      deleteMode={deleteMode}
                      onRemove={img => setConfirmDeleteImg(img)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
          {/* Add new images */}
          <div className="mb-2">
            <input
              id="image-manager-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={e => {
                const files = Array.from(e.target.files || []).filter(
                  file => file.type === 'image/jpeg' || file.type === 'image/png'
                );
                setImageManagerFiles(files);
                setImageManagerPreviews(files.map(file => URL.createObjectURL(file)));
              }}
            />
            <TooltipProvider>
              <Tooltip><TooltipTrigger asChild>
                <Button type="button" size="icon" onClick={() => document.getElementById('image-manager-upload')?.click()} disabled={imageManagerFiles.length > 0 || imageManagerProgress.some(p => p > 0 && p < 100)} aria-label="Add Images">
                  <Plus className="w-5 h-5" />
                </Button>
              </TooltipTrigger><TooltipContent>Add Images</TooltipContent></Tooltip>
            </TooltipProvider>
          </div>
          {/* Show previews and upload progress for new images */}
          {imageManagerPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {imageManagerPreviews.map((preview, idx) => (
                <div key={preview} className="relative">
                  <img src={preview} alt={`Preview ${idx + 1}`} className="max-h-32 rounded border opacity-60" />
                  {imageManagerProgress[idx] !== undefined && (
                    <div className="absolute left-1 bottom-1 right-1 bg-white/80 rounded px-1 py-0.5 text-xs text-blue-700 font-semibold flex items-center">
                      {imageManagerProgress[idx] < 100 ? (
                        <>
                          <span>Uploading: {imageManagerProgress[idx]}%</span>
                          <span className="ml-1 animate-spin"><svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></span>
                        </>
                      ) : (
                        <span>Uploaded</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {imageManagerFiles.length > 0 && (
            <Button type="button" onClick={handleImageManagerAdd} disabled={imageManagerProgress.some(p => p > 0 && p < 100)}>
              Upload Selected Images
            </Button>
          )}
          {imageManagerError && <div className="text-red-500 text-sm mt-2">{imageManagerError}</div>}
          <DialogFooter>
            <TooltipProvider>
              <Tooltip><TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={handleImageManagerCancel} disabled={imageManagerSaving} aria-label="Cancel">
                  <X className="w-5 h-5" />
                </Button>
              </TooltipTrigger><TooltipContent>Cancel</TooltipContent></Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip><TooltipTrigger asChild>
                <Button onClick={handleImageManagerSave} size="icon" disabled={imageManagerSaving} aria-label="Save">
                  <Check className="w-5 h-5" />
                </Button>
              </TooltipTrigger><TooltipContent>Save</TooltipContent></Tooltip>
            </TooltipProvider>
          </DialogFooter>
          {/* Confirm delete dialog */}
          {confirmDeleteImg && (
            <Dialog open={true} onOpenChange={open => { if (!open) setConfirmDeleteImg(null); }}>
              <DialogContent className="max-w-xs w-full">
                <DialogHeader>
                  <DialogTitle>Delete Image?</DialogTitle>
                </DialogHeader>
                <div className="mb-2 text-sm text-red-600">Are you sure you want to delete this image? This cannot be undone.</div>
                <img src={confirmDeleteImg.url} alt="To delete" className="max-h-32 rounded border mb-2" />
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setConfirmDeleteImg(null)}>Cancel</Button>
                  <Button variant="destructive" size="icon" onClick={async () => {
                    await handleImageManagerRemove(confirmDeleteImg);
                    setConfirmDeleteImg(null);
                  }} aria-label="Delete">
                    <Trash className="w-5 h-5" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <div className="flex items-center justify-between mb-2">
            <TooltipProvider>
              <Tooltip><TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant={deleteMode ? 'destructive' : 'outline'}
                  onClick={() => setDeleteMode(v => !v)}
                  aria-label={deleteMode ? 'Exit Delete Mode' : 'Delete Mode'}
                >
                  <ShieldAlert className="w-5 h-5" />
                </Button>
              </TooltipTrigger><TooltipContent>{deleteMode ? 'Exit Delete Mode' : 'Delete Mode'}</TooltipContent></Tooltip>
            </TooltipProvider>
            {deleteMode && (
              <span className="flex items-center text-xs text-red-600 font-semibold ml-2"><ShieldAlert className="w-4 h-4 mr-1" />Delete Mode is active. Click the cross to delete images.</span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard; 