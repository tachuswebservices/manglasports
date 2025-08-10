import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Package, User, Calendar, IndianRupee, Edit2, Save, Search, Filter, X, Clock, Truck, CheckCircle, AlertCircle, XCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { buildApiUrl, API_CONFIG } from '@/config/api';

interface OrderCardGridProps {
  orders: any[];
  loading?: boolean;
  error?: string;
  onOrderUpdate?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  onStatusFilterChange?: (status: string) => void;
  onDateFilterChange?: (dateFilter: string) => void;
  // Add current filter values as props
  currentSearch?: string;
  currentStatusFilter?: string;
  currentDateFilter?: string;
}

const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled', 'completed'];

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  shipped: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Truck },
  delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
};

const OrderCardGrid: React.FC<OrderCardGridProps> = ({ 
  orders, 
  loading, 
  error, 
  onOrderUpdate,
  pagination,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onStatusFilterChange,
  onDateFilterChange,
  // Add current filter values as props
  currentSearch,
  currentStatusFilter,
  currentDateFilter
}) => {
  const [editItem, setEditItem] = useState<{ orderId: number; itemId: number } | null>(null);
  const [editFields, setEditFields] = useState<any>({});
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);



  // Synchronize internal filter states with props
  useEffect(() => {
    if (currentSearch !== undefined) setSearchTerm(currentSearch);
    if (currentStatusFilter !== undefined) setStatusFilter(currentStatusFilter);
    if (currentDateFilter !== undefined) setDateFilter(currentDateFilter);
    setHasSearched(!!currentSearch); // Mark as searched if prop is provided
  }, [currentSearch, currentStatusFilter, currentDateFilter]);

  const handleEdit = (orderId: number, item: any) => {
    setEditItem({ orderId, itemId: item.id });
    setEditFields({
      status: item.status || 'pending',
      expectedDate: item.expectedDate ? new Date(item.expectedDate).toISOString().split('T')[0] : '',
      courierPartner: item.courierPartner || '',
      trackingId: item.trackingId || '',
    });
  };

  const handleSave = async (orderId: number, itemId: number) => {
    try {
      // Validate required fields
      if (!editFields.status) {
        alert('Status is required');
        return;
      }

      // Call backend to update order item
      const response = await fetch(buildApiUrl(API_CONFIG.ORDERS.ITEMS(itemId.toString())), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFields),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update order item: ${response.status}`);
      }
      
      setEditItem(null);
      // Refresh the orders data
      if (onOrderUpdate) {
        onOrderUpdate();
      }
    } catch (error) {
      console.error('Error updating order item:', error);
      alert(`Failed to update order item: ${error.message}`);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearch = () => {
    setHasSearched(true);
    setIsSearching(true);
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (onStatusFilterChange) {
      onStatusFilterChange(value);
    }
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    if (onDateFilterChange) {
      onDateFilterChange(value);
    }
  };

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setHasSearched(false); // Reset search flag
    setIsSearching(false);
    if (onSearchChange) onSearchChange('');
    if (onStatusFilterChange) onStatusFilterChange('all');
    if (onDateFilterChange) onDateFilterChange('all');
  }, [onSearchChange, onStatusFilterChange, onDateFilterChange]);

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border flex items-center gap-1 px-2 py-1 text-xs font-medium`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mangla-gold mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading orders...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filter Controls - Always Show */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchTerm}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-mangla-gold focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all duration-200"
            />
            <Button
              size="sm"
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-mangla-gold hover:bg-mangla-gold/90 text-white"
            >
              {isSearching ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 transition-all duration-200"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(statusFilter !== 'all' || dateFilter !== 'all') && (
              <Badge className="ml-1 bg-mangla-gold text-white text-xs">Active</Badge>
            )}
          </Button>

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Enhanced Filter Options */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-mangla-gold focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all duration-200"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => handleDateFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-mangla-gold focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all duration-200"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="lastWeek">Last 7 Days</option>
                  <option value="lastMonth">Last 30 Days</option>
                </select>
              </div>

              {/* Limit Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Items per Page
                </label>
                <select
                  value={pagination?.limit || 10}
                  onChange={(e) => onLimitChange?.(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-mangla-gold focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all duration-200"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Quick Stats
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-700 p-2 rounded border text-center">
                    <div className="font-bold text-mangla-gold">{orders?.length || 0}</div>
                    <div className="text-slate-500">Showing</div>
                  </div>
                  <div className="bg-white dark:bg-slate-700 p-2 rounded border text-center">
                    <div className="font-bold text-slate-600 dark:text-slate-300">{pagination?.totalOrders || 0}</div>
                    <div className="text-slate-500">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Results Count - Always Show */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-mangla-gold">{orders?.length || 0}</span> of <span className="font-semibold">{pagination?.totalOrders || 0}</span> orders
          {pagination && pagination.totalPages > 1 && (
            <span className="ml-2 text-slate-500">
              (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
          )}
        </div>
        {orders && orders.length > 0 && (
          <div className="text-xs text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Orders Display - Conditional */}
      {!orders || !Array.isArray(orders) || orders.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              {!orders ? 'Failed to load orders' : 'No orders found.'}
            </p>
            {!orders && (
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            )}
            {orders && orders.length === 0 && (
              <div className="mt-4 text-sm text-slate-500">
                Try adjusting your search criteria or filters
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Enhanced Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map(order => {
              // Ensure order has required fields
              const orderId = order?.id || 'Unknown';
              const userName = order?.user?.name || 'Unknown User';
              const totalAmount = order?.totalAmount || 0;
              const createdAt = order?.createdAt ? new Date(order.createdAt) : null;
              const orderItems = Array.isArray(order?.orderItems) ? order.orderItems : [];
              
              return (
                <Card key={orderId} className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-mangla-gold" />
                        <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
                          Order #{orderId}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {createdAt ? createdAt.toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{userName}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <IndianRupee className="w-4 h-4" />
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          ₹{totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {orderItems.length} items
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-3">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Order Items
                    </div>
                    
                    <div className="space-y-3">
                      {orderItems.length > 0 ? (
                        orderItems.map((item: any) => {
                          const itemId = item?.id || 'unknown';
                          const itemName = item?.name || 'Unknown Product';
                          const itemQuantity = item?.quantity || 0;
                          const itemPrice = item?.price || 0;
                          const itemStatus = item?.status || 'pending';
                          const itemExpectedDate = item?.expectedDate ? new Date(item.expectedDate) : null;
                          const itemCourier = item?.courierPartner || '';
                          const itemTracking = item?.trackingId || '';
                          
                          return (
                            <div key={itemId} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                                    {itemName}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1">
                                    Qty: {itemQuantity} × ₹{itemPrice} = ₹{(itemQuantity * itemPrice).toFixed(2)}
                                  </div>
                                </div>
                                <div className="ml-2">
                                  {getStatusBadge(itemStatus)}
                                </div>
                              </div>

                              {editItem && editItem.orderId === orderId && editItem.itemId === itemId ? (
                                <div className="space-y-3 mt-3 p-3 bg-white dark:bg-slate-700 rounded border">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Status
                                      </label>
                                      <select
                                        className="w-full text-xs rounded border px-2 py-1 bg-white dark:bg-slate-600"
                                        value={editFields.status}
                                        onChange={e => setEditFields((f: any) => ({ ...f, status: e.target.value }))}
                                      >
                                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Expected Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full text-xs rounded border px-2 py-1 bg-white dark:bg-slate-600"
                                        value={editFields.expectedDate}
                                        onChange={e => setEditFields((f: any) => ({ ...f, expectedDate: e.target.value }))}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Courier
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full text-xs rounded border px-2 py-1 bg-white dark:bg-slate-600"
                                        value={editFields.courierPartner}
                                        onChange={e => setEditFields((f: any) => ({ ...f, courierPartner: e.target.value }))}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Tracking ID
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full text-xs rounded border px-2 py-1 bg-white dark:bg-slate-600"
                                        value={editFields.trackingId}
                                        onChange={e => setEditFields((f: any) => ({ ...f, trackingId: e.target.value }))}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button size="sm" onClick={() => handleSave(orderId, itemId)} className="flex-1">
                                      <Save className="w-3 h-3 mr-1" />
                                      Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditItem(null)} className="flex-1">
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Expected:</span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {itemExpectedDate ? itemExpectedDate.toLocaleDateString() : 'Not set'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Courier:</span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {itemCourier || 'Not set'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Tracking:</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-mono">
                                      {itemTracking || 'Not set'}
                                    </span>
                                  </div>
                                  <div className="flex justify-end pt-2">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => handleEdit(orderId, item)}
                                      className="text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
                                    >
                                      <Edit2 className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-slate-500 py-4">No items found</div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onPageChange?.(pagination.currentPage - 1)} 
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange?.(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onPageChange?.(pagination.currentPage + 1)} 
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderCardGrid; 