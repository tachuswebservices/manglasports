import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Mail
} from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    products: number;
    orders: number;
    users: number;
    totalRevenue?: number;
    pendingOrders?: number;
    completedOrders?: number;
    thisMonthOrders?: number;
    lastMonthOrders?: number;
    thisMonthRevenue?: number;
    lastMonthRevenue?: number;
  };
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  loading?: boolean;
  currentDateRange?: string; // Add this prop to track current date range
}

export default function DashboardStats({ stats, onDateRangeChange, loading, currentDateRange }: DashboardStatsProps) {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(currentDateRange || 'thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [emailTestLoading, setEmailTestLoading] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Update dateRange when currentDateRange prop changes
  useEffect(() => {
    if (currentDateRange) {
      setDateRange(currentDateRange);
    }
  }, [currentDateRange]);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setShowCustomDatePicker(false);
    
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    switch (range) {
      case 'today':
        startDate = today.toISOString().split('T')[0];
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday.toISOString().split('T')[0];
        break;
      case 'thisWeek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startDate = startOfWeek.toISOString().split('T')[0];
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        break;
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate = lastMonth.toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      case 'last3Months':
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        startDate = threeMonthsAgo.toISOString().split('T')[0];
        break;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = customStartDate;
          endDate = customEndDate;
        } else {
          return;
        }
        break;
    }

    if (onDateRangeChange && startDate) {
      console.log('Date range change:', { startDate, endDate, range });
      onDateRangeChange(startDate, endDate);
      // Update the current date range immediately for UI feedback
      setDateRange(range);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      handleDateRangeChange('custom');
    }
  };

  const handleTestEmail = async () => {
    if (!user?.email) {
      setEmailTestResult({ success: false, message: 'User email not found. Please log in again.' });
      return;
    }

    setEmailTestLoading(true);
    setEmailTestResult(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEmailTestResult({ success: true, message: `Test email sent successfully to ${user.email}! Check your inbox.` });
      } else {
        setEmailTestResult({ success: false, message: `Failed to send test email: ${result.error}` });
      }
    } catch (error) {
      setEmailTestResult({ success: false, message: 'Error testing email configuration. Please check your email settings.' });
    } finally {
      setEmailTestLoading(false);
    }
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'thisWeek': return 'This Week';
      case 'thisMonth': return 'This Month';
      case 'lastMonth': return 'Last Month';
      case 'last3Months': return 'Last 3 Months';
      case 'thisYear': return 'This Year';
      case 'custom': return 'Custom Range';
      default: return 'This Month';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Statistics</h2>
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-10 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="bg-slate-200 dark:bg-slate-700 h-4 w-24 rounded mb-2"></div>
              <div className="bg-slate-200 dark:bg-slate-700 h-8 w-16 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Statistics</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Showing data for <span className="font-semibold text-mangla-gold">{getDateRangeLabel()}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick Date Range Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={dateRange === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('today')}
            >
              Today
            </Button>
            <Button
              variant={dateRange === 'thisWeek' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('thisWeek')}
            >
              Week
            </Button>
            <Button
              variant={dateRange === 'thisMonth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('thisMonth')}
            >
              Month
            </Button>
            <Button
              variant={dateRange === 'thisYear' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('thisYear')}
            >
              Year
            </Button>
          </div>

          {/* Custom Date Range */}
          <div className="relative">
            <Button
              variant={dateRange === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowCustomDatePicker(!showCustomDatePicker)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Custom
            </Button>

            {showCustomDatePicker && (
              <div className="absolute right-0 top-full mt-2 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 min-w-80">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-mangla-gold focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-mangla-gold focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCustomDateSubmit}
                      disabled={!customStartDate || !customEndDate}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCustomDatePicker(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>

          {/* Test Email Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleTestEmail}
            disabled={emailTestLoading}
            title={user?.email ? `Send test email to ${user.email}` : 'Send test email'}
          >
            <Mail className="w-4 h-4" />
            {emailTestLoading ? 'Testing...' : `Test Email${user?.email ? ` (${user.email})` : ''}`}
          </Button>
        </div>

        {/* Email Test Result */}
        {emailTestResult && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            emailTestResult.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {emailTestResult.message}
          </div>
        )}
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Products
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {stats.products?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total products in inventory
            </div>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Orders
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {stats.orders?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total orders received
            </div>
            {stats.thisMonthOrders && stats.lastMonthOrders && (
              <div className="flex items-center gap-1 text-xs">
                {getGrowthPercentage(stats.thisMonthOrders, stats.lastMonthOrders) >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={getGrowthPercentage(stats.thisMonthOrders, stats.lastMonthOrders) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(getGrowthPercentage(stats.thisMonthOrders, stats.lastMonthOrders)).toFixed(1)}% from last month
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Total Users */}
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Users
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {stats.users?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Registered users
            </div>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Revenue
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {formatCurrency(stats.totalRevenue || 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total revenue generated
            </div>
            {stats.thisMonthRevenue && stats.lastMonthRevenue && (
              <div className="flex items-center gap-1 text-xs">
                {getGrowthPercentage(stats.thisMonthRevenue, stats.lastMonthRevenue) >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={getGrowthPercentage(stats.thisMonthRevenue, stats.lastMonthRevenue) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(getGrowthPercentage(stats.thisMonthRevenue, stats.lastMonthRevenue)).toFixed(1)}% from last month
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Status */}
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-500 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Order Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {stats.pendingOrders || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {stats.completedOrders || 0}
              </span>
            </div>
          </div>
        </Card>

        {/* Monthly Comparison */}
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Monthly Comparison</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {stats.thisMonthOrders || 0} orders
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Last Month</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {stats.lastMonthOrders || 0} orders
              </span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Package className="w-4 h-4 mr-2" />
              View Products
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Orders
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              View Users
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 