import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import { LogOut, User, MapPin, List, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import AddressModal, { Address } from '@/components/checkout/AddressModal';
import { Link } from 'react-router-dom';
import { buildApiUrl, buildApiUrlWithParams, API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

const sections = [
  { key: 'orders', label: 'Orders', icon: List },
  { key: 'profile', label: 'Edit Profile', icon: User },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
];

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const currentPwRef = useRef<HTMLInputElement>(null);
  const newPwRef = useRef<HTMLInputElement>(null);
  const confirmPwRef = useRef<HTMLInputElement>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  // Auto-switch tab based on ?tab= param
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && sections.some(s => s.key === tab)) {
      setActive(tab);
    }
  }, [searchParams]);

  // Fetch orders when user or tab changes
  useEffect(() => {
    if (active === 'orders' && user) {
      setOrdersLoading(true);
      fetch(buildApiUrlWithParams(API_CONFIG.ORDERS.USER_ORDERS, { userId: user.id.toString() }))
        .then(res => res.json())
        .then(data => {
          // Handle new API response format with pagination
          if (data && data.orders) {
            setOrders(data.orders);
          } else if (Array.isArray(data)) {
            // Fallback for old format
            setOrders(data);
          } else {
            setOrders([]);
          }
        })
        .catch(err => {
          console.error('Error fetching orders:', err);
          setOrders([]);
        })
        .finally(() => setOrdersLoading(false));
    }
  }, [active, user]);

  // Fetch addresses for the user (for addresses tab)
  useEffect(() => {
    if (active === 'addresses' && user) {
      setAddressLoading(true);
      fetch(buildApiUrlWithParams(API_CONFIG.ADDRESSES.BASE, { userId: user.id.toString() }))
        .then(res => res.json())
        .then(data => setAddresses(data))
        .finally(() => setAddressLoading(false));
    }
  }, [active, user]);

  // Update name
  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccess('');
    setEditError('');
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.USERS.BY_ID(user.id.toString())), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) throw new Error('Failed to update name');
      setEditSuccess('Name updated successfully!');
    } catch (err: any) {
      setEditError(err.message || 'Failed to update name');
    } finally {
      setEditLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwSuccess('');
    setPwError('');
    const current = currentPwRef.current?.value || '';
    const next = newPwRef.current?.value || '';
    const confirm = confirmPwRef.current?.value || '';
    if (!current || !next || !confirm) {
      setPwError('All fields are required');
      setPwLoading(false);
      return;
    }
    if (next !== confirm) {
      setPwError('New passwords do not match');
      setPwLoading(false);
      return;
    }
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.USERS.CHANGE_PASSWORD(user.id.toString())), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data && data.error === 'Current password is incorrect') {
          setPwError('Current password is incorrect');
        } else {
          setPwError('Failed to change password');
        }
        setPwLoading(false);
        return;
      }
      setPwSuccess('Password changed successfully!');
      if (currentPwRef.current) currentPwRef.current.value = '';
      if (newPwRef.current) newPwRef.current.value = '';
      if (confirmPwRef.current) confirmPwRef.current.value = '';
    } catch (err: any) {
      setPwError(err.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  // Password strength meter
  const handleNewPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (newPwRef.current) newPwRef.current.value = val;
    // Simple strength: length + number + special char
    let score = 0;
    if (val.length >= 6) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(val)) score++;
    setPwStrength(score);
  };

  const handleAddAddress = () => {
    setEditAddress(null);
    setAddressModalOpen(true);
  };
  const handleEditAddress = (address: Address) => {
    setEditAddress(address);
    setAddressModalOpen(true);
  };
  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await fetch(buildApiUrl(API_CONFIG.ADDRESSES.BY_ID(id.toString())), { method: 'DELETE' });
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };
  const handleSaveAddress = async (address: Address) => {
    if (!user) return;
    let saved: Address;
    if (address.id) {
      // Edit
      try {
        const res = await fetch(buildApiUrl(API_CONFIG.ADDRESSES.BY_ID(address.id)), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(address),
        });
        if (res.ok) {
          saved = await res.json();
          setAddresses(prev => prev.map(a => (a.id === saved.id ? saved : a)));
          toast.success('Address updated successfully');
        } else {
          const data = await res.json();
          toast.error(data.error || 'Failed to update address');
        }
      } catch (error) {
        toast.error('Failed to update address');
      }
    } else {
      // Add
      try {
        const res = await fetch(buildApiUrl(API_CONFIG.ADDRESSES.BASE), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...address, userId: user.id }),
        });
        if (res.ok) {
          saved = await res.json();
          setAddresses(prev => [...prev, saved]);
          toast.success('Address added successfully');
        } else {
          const data = await res.json();
          toast.error(data.error || 'Failed to add address');
        }
      } catch (error) {
        toast.error('Failed to add address');
      }
    }
    setAddressModalOpen(false);
    setEditAddress(null);
  };

  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      isDark ? 'bg-mangla' : 'bg-[#f8fafc]'
    )}>
      {/* Top bar with Home and Logout (always visible) */}
      <div className={cn(
        'w-full flex items-center justify-between px-2 py-2 gap-2 border-b',
        isDark ? 'bg-mangla-dark-gray border-gray-700' : 'bg-white border-gray-200'
      )}>
        <Link to="/" className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors',
          isDark ? 'bg-mangla-dark-gray text-mangla-gold hover:bg-mangla-gold/10' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-100'
        )}>
          <ArrowLeft className="w-5 h-5" />
          Home
        </Link>
        <Button
          variant="destructive"
          className="flex items-center gap-2 rounded-full px-4"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" /> Logout
        </Button>
      </div>
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar for desktop only */}
        <aside className={cn(
          'hidden md:flex w-64 p-8 flex-col gap-4 border-r',
          isDark ? 'bg-mangla-dark-gray border-gray-700' : 'bg-white border-gray-200'
        )}>
          <div className="mb-8 flex flex-col gap-3">
            <User className="w-8 h-8 text-mangla-gold" />
            <div>
              <div className="font-bold text-lg">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors w-full',
                active === key
                  ? isDark
                    ? 'bg-mangla-gold/20 text-mangla-gold'
                    : 'bg-mangla-gold/10 text-mangla-gold'
                  : isDark
                    ? 'hover:bg-gray-700 text-white'
                    : 'hover:bg-gray-100 text-slate-900'
              )}
              onClick={() => setActive(key)}
            >
              <Icon className="w-5 h-5" />
              {key === 'profile' ? 'Profile' : label === 'Back to Home' ? 'Home' : label}
            </button>
          ))}
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-10">
          {active === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Your Orders</h2>
              {ordersLoading ? (
                <div className="text-gray-500">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-gray-500">You have no orders yet.</div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className={cn(
                      'rounded-xl border p-4 shadow-sm',
                      isDark ? 'bg-mangla-dark-gray/60 border-gray-700' : 'bg-white border-gray-200')}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="font-medium text-mangla-gold">Order #{order.id}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                        <div className={cn('text-xs font-semibold px-2 py-1 rounded',
                          order.orderItems?.every((item: any) => item.status === 'completed') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}
                        >
                          {order.orderItems?.every((item: any) => item.status === 'completed') ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                      <div className="mb-2 text-sm text-gray-500">Total: <span className="font-bold text-mangla-gold">₹{order.totalAmount?.toLocaleString('en-IN') || 0}</span></div>
                      <div className="mb-2 text-xs text-gray-500">Address: {order.address ? `${order.address.line1}, ${order.address.city}, ${order.address.state}, ${order.address.postalCode}` : 'N/A'}</div>
                      <div className="text-sm">
                        <div className="font-semibold mb-1">Items:</div>
                        <ul className="space-y-2">
                          {order.orderItems?.map((item: any) => (
                            <li key={item.id} className="border rounded p-2 bg-slate-50 dark:bg-slate-800">
                              <div className="flex flex-col gap-1">
                                <div className="font-medium text-mangla-gold">{item.name}</div>
                                <div className="text-xs text-gray-500">Qty: {item.quantity} | Price: ₹{item.price}</div>
                                <div className="flex gap-2 items-center text-xs">
                                  <span>Status:</span>
                                  <span className={
                                    item.status === 'completed' ? 'text-green-600' :
                                    item.status === 'cancelled' ? 'text-red-500' :
                                    'text-yellow-500'
                                  }>{item.status || 'pending'}</span>
                                </div>
                                <div className="text-xs">Expected Date: {item.expectedDate ? new Date(item.expectedDate).toLocaleDateString() : 'N/A'}</div>
                                <div className="text-xs">Courier: {item.courierPartner || 'N/A'}</div>
                                <div className="text-xs">Tracking ID: {item.trackingId || 'N/A'}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {active === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <form onSubmit={handleNameSave} className="max-w-md space-y-4 mb-8">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    className={cn('w-full p-2 border rounded', isDark ? 'bg-mangla-dark-gray border-gray-700 text-white' : 'bg-white border-gray-200 text-slate-900')}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    className={cn('w-full p-2 border rounded bg-gray-100 text-gray-500', isDark ? 'border-gray-700' : 'border-gray-200')}
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <Button type="submit" className="rounded-full px-6" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</Button>
                {editSuccess && <div className="text-green-600 text-sm mt-2">{editSuccess}</div>}
                {editError && <div className="text-red-600 text-sm mt-2">{editError}</div>}
              </form>
              <div className="max-w-md">
                <h3 className="font-semibold mb-2">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Current Password</label>
                    <div className="relative">
                      <input
                        ref={currentPwRef}
                        type={showCurrent ? 'text' : 'password'}
                        className={cn('w-full p-2 border rounded pr-10', isDark ? 'bg-mangla-dark-gray border-gray-700 text-white' : 'bg-white border-gray-200 text-slate-900')}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mangla-gold"
                        onClick={() => setShowCurrent(v => !v)}
                        tabIndex={-1}
                      >
                        {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">New Password</label>
                    <div className="relative">
                      <input
                        ref={newPwRef}
                        type={showNew ? 'text' : 'password'}
                        className={cn('w-full p-2 border rounded pr-10', isDark ? 'bg-mangla-dark-gray border-gray-700 text-white' : 'bg-white border-gray-200 text-slate-900')}
                        required
                        minLength={6}
                        onChange={handleNewPwChange}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mangla-gold"
                        onClick={() => setShowNew(v => !v)}
                        tabIndex={-1}
                      >
                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="h-2 mt-1">
                      <div className={cn(
                        'h-2 rounded transition-all',
                        pwStrength === 0 ? 'bg-gray-200' :
                        pwStrength === 1 ? 'bg-red-400 w-1/3' :
                        pwStrength === 2 ? 'bg-yellow-400 w-2/3' :
                        'bg-green-500 w-full'
                      )}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Password strength: {pwStrength === 0 ? 'Too short' : pwStrength === 1 ? 'Weak' : pwStrength === 2 ? 'Medium' : 'Strong'}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Confirm New Password</label>
                    <div className="relative">
                      <input
                        ref={confirmPwRef}
                        type={showConfirm ? 'text' : 'password'}
                        className={cn('w-full p-2 border rounded pr-10', isDark ? 'bg-mangla-dark-gray border-gray-700 text-white' : 'bg-white border-gray-200 text-slate-900')}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mangla-gold"
                        onClick={() => setShowConfirm(v => !v)}
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="rounded-full px-6" disabled={pwLoading}>{pwLoading ? 'Changing...' : 'Change Password'}</Button>
                  {pwSuccess && <div className="text-green-600 text-sm mt-2">{pwSuccess}</div>}
                  {pwError && <div className="text-red-600 text-sm mt-2">{pwError}</div>}
                </form>
              </div>
            </div>
          )}
          {active === 'addresses' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Your Addresses</h2>
              {addressLoading ? (
                <div className="text-gray-500">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="text-gray-500">No address found. <Button size="sm" onClick={handleAddAddress}>Add Address</Button></div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className={cn(
                        'border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all',
                        addr.isDefault ? 'border-mangla-gold bg-mangla-gold/10' : isDark ? 'border-gray-700 bg-mangla-dark-gray/60' : 'border-gray-200 bg-gray-50'
                      )}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-base flex items-center gap-2">
                          {addr.name}
                          {addr.isDefault && <span className="text-xs text-mangla-gold bg-mangla-gold/20 px-2 py-0.5 rounded ml-2">Default</span>}
                        </div>
                        <div className="text-sm">{addr.line1}{addr.line2 && ', ' + addr.line2}</div>
                        <div className="text-sm">{addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</div>
                        {addr.phone && <div className="text-xs text-gray-500">Phone: {addr.phone}</div>}
                      </div>
                      <div className="flex gap-2 ml-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditAddress(addr)} className="rounded-full px-4">Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteAddress(addr.id!)} className="rounded-full px-4">Delete</Button>
                      </div>
                    </div>
                  ))}
                  <Button size="sm" className="mt-2 rounded-full px-6" onClick={handleAddAddress} variant="secondary">Add New Address</Button>
                </div>
              )}
              <AddressModal open={addressModalOpen} onClose={() => { setAddressModalOpen(false); setEditAddress(null); }} onSave={handleSaveAddress} initialAddress={editAddress} />
            </div>
          )}
        </main>
      </div>
      {/* Bottom navbar for mobile only */}
      <nav className={cn(
        'fixed bottom-0 left-0 right-0 z-40 flex md:hidden justify-around items-center py-2 border-t',
        isDark ? 'bg-mangla-dark-gray border-gray-700' : 'bg-white border-gray-200'
      )}>
        {sections.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={cn(
              'flex flex-col items-center gap-1 px-2 py-1 rounded-full font-medium transition-colors',
              active === key
                ? isDark
                  ? 'bg-mangla-gold/20 text-mangla-gold' : 'bg-mangla-gold/10 text-mangla-gold'
                : isDark
                  ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-slate-900'
            )}
            onClick={() => setActive(key)}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{key === 'profile' ? 'Profile' : label === 'Back to Home' ? 'Home' : label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Profile; 