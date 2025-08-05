import React, { useEffect, useState, useRef } from 'react';
import AdminNavbar from '../components/layout/AdminNavbar';
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

// Import new admin components
import DashboardStats from '../components/admin/DashboardStats';
import ProductTable from '../components/admin/ProductTable';
import ProductCardGrid from '../components/admin/ProductCardGrid';
import ProductEditModal from '../components/admin/ProductEditModal';
import ProductAddModal from '../components/admin/ProductAddModal';
import ProductImageManager from '../components/admin/ProductImageManager';
import CategoryManager from '../components/admin/CategoryManager';
import BrandManager from '../components/admin/BrandManager';
import OrderCardGrid from '../components/admin/OrderCardGrid';
import BlogManager from '../components/admin/BlogManager';

// Cloudinary config (move to top-level scope)
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dvltehb8j/upload';
const UPLOAD_PRESET = 'unsigned';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [products, setProducts] = useState([]);
  const initialProductState = {
    name: '',
    numericPrice: '',
    images: [],
    categoryId: '',
    brandId: '',
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
  const [currentDateRange, setCurrentDateRange] = useState('thisMonth');
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

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [ordersPagination, setOrdersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Orders filter state
  const [currentOrderSearch, setCurrentOrderSearch] = useState('');
  const [currentOrderStatusFilter, setCurrentOrderStatusFilter] = useState('all');
  const [currentOrderDateFilter, setCurrentOrderDateFilter] = useState('all');

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor));

  const fetchStats = (startDate?: string, endDate?: string) => {
    setLoadingStats(true);
    setStatsError('');
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    fetch(`http://localhost:4000/api/users/admin/stats?${params}`)
      .then(res => {
        if (!res.ok) {
          return res.json().then(errorData => {
            throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch stats`);
          });
        }
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => {
        console.error('Stats fetch error:', err);
        setStatsError(err.message);
      })
      .finally(() => setLoadingStats(false));
  };

  // Add a wrapper function to update both stats and current date range
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    // Determine the range based on the dates
    const today = new Date();
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    let range = 'custom';
    
    // Check if it matches predefined ranges
    if (startDate === endDate && startDate === today.toISOString().split('T')[0]) {
      range = 'today';
    } else if (startDate === new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0] && 
               endDate === today.toISOString().split('T')[0]) {
      range = 'thisMonth';
    } else if (startDate === new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0] && 
               endDate === today.toISOString().split('T')[0]) {
      range = 'thisYear';
    } else if (startDate === new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0] && 
               endDate === new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0]) {
      range = 'lastMonth';
    } else {
      // Check for thisWeek - start of current week to today
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];
      
      if (startDate === startOfWeekStr && endDate === todayStr) {
        range = 'thisWeek';
      }
    }
    
    setCurrentDateRange(range);
    fetchStats(startDate, endDate);
  };

  useEffect(() => {
    fetchStats();
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

  const fetchOrders = (page = 1, limit = 10, search = '', status = '', dateFilter = '') => {
    setLoadingOrders(true);
    setOrdersError('');
    
    // Update current filter state
    setCurrentOrderSearch(search);
    setCurrentOrderStatusFilter(status || 'all');
    setCurrentOrderDateFilter(dateFilter || 'all');
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: search,
      status: status,
      dateFilter: dateFilter
    });
    
    fetch(`http://localhost:4000/api/orders?${params}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        // Validate the response structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format from server');
        }
        
        // Ensure orders is an array
        const ordersArray = Array.isArray(data.orders) ? data.orders : [];
        setOrders(ordersArray);
        
        // Ensure pagination object exists and has required fields
        const pagination = data.pagination || {};
        setOrdersPagination({
          currentPage: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 1,
          totalOrders: pagination.totalOrders || 0,
          limit: pagination.limit || 10,
          hasNextPage: pagination.hasNextPage || false,
          hasPrevPage: pagination.hasPrevPage || false
        });
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setOrdersError(err.message || 'Failed to fetch orders');
        setOrders([]);
        setOrdersPagination({
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false
        });
      })
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

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
    if (!newProduct.name || !newProduct.numericPrice || !newProduct.categoryId || !newProduct.brandId) {
      setAddProductError('Please fill all required fields.');
      setAddingProduct(false);
      return;
    }
    // Prepare payload with correct types
    const payload = {
      id: uuidv4(),
      name: newProduct.name,
      numericPrice: typeof newProduct.numericPrice === 'string' && newProduct.numericPrice === '' ? undefined : Number(newProduct.numericPrice),
      images: imageUrls,
      categoryId: typeof newProduct.categoryId === 'string' && newProduct.categoryId === '' ? undefined : Number(newProduct.categoryId),
      brandId: typeof newProduct.brandId === 'string' && newProduct.brandId === '' ? undefined : Number(newProduct.brandId),

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
    console.log('ADD PRODUCT - Features being sent:', payload.features);
    console.log('ADD PRODUCT - Full payload:', payload);
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
    if (!editProductState.name || !editProductState.numericPrice || !editProductState.categoryId || !editProductState.brandId) {
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
    console.log('EDIT PRODUCT - Features being sent:', payload.features);
    console.log('EDIT PRODUCT - Full payload:', payload);
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
    if (!over) return;
    if (active.id !== over.id) {
      setImageManagerImages((imgs) => {
        const getId = (img: any) => img.publicId || img.url;
        const oldIndex = imgs.findIndex(img => getId(img) === active.id);
        const newIndex = imgs.findIndex(img => getId(img) === over.id);
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
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold shadow-sm border-b-2 transition-all duration-150 ${activeTab === 'orders' ? 'bg-white dark:bg-slate-900 border-mangla-gold text-mangla-gold' : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-mangla-gold hover:border-mangla-gold'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold shadow-sm border-b-2 transition-all duration-150 ${activeTab === 'blog' ? 'bg-white dark:bg-slate-900 border-mangla-gold text-mangla-gold' : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-mangla-gold hover:border-mangla-gold'}`}
              onClick={() => setActiveTab('blog')}
            >
              Blog
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
                <DashboardStats 
                  stats={stats} 
                  loading={loadingStats}
                  onDateRangeChange={handleDateRangeChange}
                  currentDateRange={currentDateRange}
                />
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
                <ProductAddModal
                  open={showAddModal}
                  onOpenChange={setShowAddModal}
                  product={newProduct}
                  categories={categories}
                  brands={brands}
                  loading={addingProduct}
                  error={addProductError}
                  onChange={(field, value) => setNewProduct(prev => ({ ...prev, [field]: value }))}
                  onSave={handleAddProduct}
                  onCancel={() => setShowAddModal(false)}
                />
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
                      <ProductTable
                        products={filteredProducts.slice((page - 1) * limit, page * limit)}
                        categories={categories}
                        brands={brands}
                        page={page}
                        limit={limit}
                        totalPages={Math.ceil(filteredProducts.length / limit)}
                        onEdit={openEditModal}
                        onDelete={handleRemoveProduct}
                        onManageImages={(product) => {
                          setEditingProduct(product);
                          setEditProductState({ ...initialProductState, ...product, categoryId: String(product.categoryId), brandId: String(product.brandId) });
                          let imgs = Array.isArray(product.images)
                            ? product.images.map((img: any) =>
                                typeof img === 'string' ? { url: img, publicId: '' } : { url: img.url, publicId: img.publicId || '' }
                              )
                            : [];
                          setEditUploadedImages(imgs);
                          setImageManagerImages(imgs);
                          setShowImageManager(true);
                        }}
                        onPageChange={handlePageChange}
                        removingProductId={removingProductId}
                        removeProductError={removeProductError}
                      />
                    ) : (
                      <ProductCardGrid
                        products={filteredProducts}
                        categories={categories}
                        onEdit={openEditModal}
                        onDelete={handleRemoveProduct}
                        onManageImages={(product) => {
                          setEditingProduct(product);
                          setEditProductState({ ...initialProductState, ...product, categoryId: String(product.categoryId), brandId: String(product.brandId) });
                          let imgs = Array.isArray(product.images)
                            ? product.images.map((img: any) =>
                                typeof img === 'string' ? { url: img, publicId: '' } : { url: img.url, publicId: img.publicId || '' }
                              )
                            : [];
                          setEditUploadedImages(imgs);
                          setImageManagerImages(imgs);
                          setShowImageManager(true);
                        }}
                        removingProductId={removingProductId}
                      />
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

          {/* Orders Tab - Order Management */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Order Management</h2>
              
              {/* Orders Section */}
              <section>
                <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {loadingOrders ? (
                    <div className="text-center py-8">Loading orders...</div>
                  ) : ordersError ? (
                    <div className="text-center text-red-500 py-8">{ordersError}</div>
                  ) : (
                    <OrderCardGrid
                      orders={orders}
                      loading={loadingOrders}
                      error={ordersError}
                      onOrderUpdate={() => fetchOrders(ordersPagination.currentPage, ordersPagination.limit, currentOrderSearch, currentOrderStatusFilter === 'all' ? '' : currentOrderStatusFilter, currentOrderDateFilter === 'all' ? '' : currentOrderDateFilter)}
                      pagination={ordersPagination}
                      onPageChange={(newPage) => fetchOrders(newPage, ordersPagination.limit, currentOrderSearch, currentOrderStatusFilter === 'all' ? '' : currentOrderStatusFilter, currentOrderDateFilter === 'all' ? '' : currentOrderDateFilter)}
                      onLimitChange={(newLimit) => fetchOrders(1, newLimit, currentOrderSearch, currentOrderStatusFilter === 'all' ? '' : currentOrderStatusFilter, currentOrderDateFilter === 'all' ? '' : currentOrderDateFilter)}
                      onSearchChange={(search) => fetchOrders(1, ordersPagination.limit, search)}
                      onStatusFilterChange={(status) => fetchOrders(1, ordersPagination.limit, '', status)}
                      onDateFilterChange={(dateFilter) => fetchOrders(1, ordersPagination.limit, '', '', dateFilter)}
                      currentSearch={currentOrderSearch}
                      currentStatusFilter={currentOrderStatusFilter}
                      currentDateFilter={currentOrderDateFilter}
                    />
                  )}
                </div>
              </section>
            </div>
          )}

          {/* Blog Tab - Blog Management */}
          {activeTab === 'blog' && (
            <div>
              <BlogManager />
            </div>
          )}
        </div>
      </main>
      {/* Edit Product Modal */}
      <ProductEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        product={editProductState}
        categories={categories}
        brands={brands}
        loading={editLoading}
        error={editError}
        onChange={(field, value) => setEditProductState(prev => ({ ...prev, [field]: value }))}
        onSave={handleEditProduct}
        onCancel={() => setEditModalOpen(false)}
        onManageImages={openImageManager}
      />
      {/* Manage Categories Modal */}
      <CategoryManager
        categories={categories}
        loading={manageCategoryLoading}
        error={manageCategoryError}
        addModalOpen={showManageCategories}
        editModalOpen={editCategoryId !== null}
        editingCategory={categories.find(c => c.id === editCategoryId)}
        newCategoryName={newManageCategoryName}
        onAddModalOpen={() => setShowManageCategories(true)}
        onAddModalClose={() => setShowManageCategories(false)}
        onEditModalOpen={(category) => handleEditCategory(category)}
        onEditModalClose={() => setEditCategoryId(null)}
        onNewCategoryChange={setNewManageCategoryName}
        onAddCategory={handleAddNewCategory}
        onEditCategory={handleSaveEditCategory}
        onDeleteCategory={(id) => handleDeleteCategory(Number(id))}
      />
      {/* Manage Brands Modal */}
      <BrandManager
        brands={brands}
        loading={manageBrandLoading}
        error={manageBrandError}
        addModalOpen={showManageBrands}
        editModalOpen={editBrandId !== null}
        editingBrand={brands.find(b => b.id === editBrandId)}
        newBrandName={newManageBrandName}
        onAddModalOpen={() => setShowManageBrands(true)}
        onAddModalClose={() => setShowManageBrands(false)}
        onEditModalOpen={(brand) => handleEditBrand(brand)}
        onEditModalClose={() => setEditBrandId(null)}
        onNewBrandChange={setNewManageBrandName}
        onAddBrand={handleAddNewBrand}
        onEditBrand={handleSaveEditBrand}
        onDeleteBrand={(id) => handleDeleteBrand(Number(id))}
      />
      {/* Image Manager Modal */}
      <ProductImageManager
        open={showImageManager}
        onOpenChange={setShowImageManager}
        images={imageManagerImages}
        loading={imageManagerSaving}
        error={imageManagerError}
        onUpload={(files) => {
          const fileArray = Array.from(files).filter(
            file => file.type === 'image/jpeg' || file.type === 'image/png'
          );
          setImageManagerFiles(fileArray);
          setImageManagerPreviews(fileArray.map(file => URL.createObjectURL(file)));
        }}
        onDelete={(index) => {
          const img = imageManagerImages[index];
          setConfirmDeleteImg(img);
        }}
        onSave={handleImageManagerSave}
        onCancel={handleImageManagerCancel}
        onDragEnd={handleImageManagerDragEnd}
        onAddImages={handleImageManagerAdd}
        onRemoveImage={handleImageManagerRemove}
        imageManagerFiles={imageManagerFiles}
        imageManagerPreviews={imageManagerPreviews}
        imageManagerProgress={imageManagerProgress}
        imageManagerDeleting={imageManagerDeleting}
        imageManagerSaving={imageManagerSaving}
        imageManagerError={imageManagerError}
        setImageManagerFiles={setImageManagerFiles}
        setImageManagerPreviews={setImageManagerPreviews}
        setImageManagerProgress={setImageManagerProgress}
        setImageManagerError={setImageManagerError}
      />
    </div>
  );
};

export default AdminDashboard; 