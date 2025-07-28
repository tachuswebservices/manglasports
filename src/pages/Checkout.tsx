import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AddressModal, { Address } from '@/components/checkout/AddressModal';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import { ArrowLeft, Image } from 'lucide-react';

const API_BASE = 'http://localhost:4000/api/addresses';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout: React.FC = () => {
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch addresses for the user
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${API_BASE}?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setAddresses(data);
        // Auto-select default address if present
        const def = data.find((a: Address) => a.isDefault);
        setSelectedAddressId(def ? def.id! : (data[0]?.id || null));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleAdd = () => {
    setEditAddress(null);
    setModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditAddress(address);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this address?')) return;
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    setAddresses(addresses.filter(a => a.id !== id));
    if (selectedAddressId === id) setSelectedAddressId(addresses[0]?.id || null);
  };

  const handleSave = async (address: Address) => {
    if (!user) return;
    let saved: Address;
    if (address.id) {
      // Edit
      const res = await fetch(`${API_BASE}/${address.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      saved = await res.json();
      setAddresses(addresses.map(a => (a.id === saved.id ? saved : a)));
    } else {
      // Add
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...address, userId: user.id }),
      });
      saved = await res.json();
      setAddresses([...addresses, saved]);
    }
    setModalOpen(false);
    setEditAddress(null);
    if (address.isDefault) setSelectedAddressId(saved.id!);
  };

  const handlePayment = async () => {
    if (!user || !selectedAddressId || cart.length === 0) return;
    // 1. Create Razorpay order on backend
    const res = await fetch('http://localhost:4000/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: getCartTotal(),
        currency: 'INR',
        receipt: `order_rcpt_${Date.now()}`,
        notes: {
          userId: user.id,
          addressId: selectedAddressId,
        },
      }),
    });
    const order = await res.json();
    if (!order.id) {
      alert('Failed to create payment order.');
      return;
    }
    // 2. Open Razorpay modal
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || window.RAZORPAY_KEY_ID || '', // Set your key in env or window
      amount: order.amount,
      currency: order.currency,
      name: 'Mangla Sports',
      description: 'Order Payment',
      order_id: order.id,
      handler: async function (response: any) {
        // 3. Verify payment on backend
        const verifyRes = await fetch('http://localhost:4000/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert('Payment successful!');
          // TODO: Place order, clear cart, redirect, etc.
        } else {
          alert('Payment verification failed.');
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      notes: {
        addressId: selectedAddressId,
      },
      theme: {
        color: '#FFD700',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className={cn(
      'min-h-screen flex flex-col items-center py-8 px-2',
      isDark ? 'bg-mangla' : 'bg-[#f8fafc]'
    )}>
      <div className="w-full max-w-3xl mb-4">
        <Link to="/products" className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors',
          isDark ? 'bg-mangla-dark-gray text-mangla-gold hover:bg-mangla-gold/10' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-100'
        )}>
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>
      </div>
      <div className={cn(
        'w-full max-w-3xl rounded-2xl shadow-lg p-6 sm:p-10',
        isDark ? 'bg-mangla-dark-gray text-white' : 'bg-white text-slate-900'
      )}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Checkout</h2>
        <h3 className="text-lg font-semibold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <div className="text-gray-500 mb-6 text-center">Your cart is empty.</div>
        ) : (
          <div className="mb-6">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {cart.map(item => {
                const hasOffer = typeof item.offerPrice === 'number' && item.offerPrice > 0;
                const mainPrice = hasOffer ? item.offerPrice : (typeof item.numericPrice === 'number' && !isNaN(item.numericPrice) ? item.numericPrice : (typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, '')) : (typeof item.price === 'number' ? item.price : 0)));
                const crossedPrice = hasOffer ? (typeof item.numericPrice === 'number' && !isNaN(item.numericPrice) ? item.numericPrice : (typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, '')) : (typeof item.price === 'number' ? item.price : 0))) : null;
                const gst = typeof item.gst === 'number' ? item.gst : 18;
                const gstAmount = (mainPrice * item.quantity * gst) / 100;
                return (
                  <li key={item.id} className="py-4 flex items-center gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-base sm:text-lg truncate">{item.name || 'Product'}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      <div className="text-xs text-gray-500">GST: {gst}%</div>
                    </div>
                    
                    {/* Price */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-lg">₹{(mainPrice * item.quantity).toLocaleString()}</span>
                        {hasOffer && (
                          <span className="text-sm line-through text-gray-500">₹{(crossedPrice * item.quantity).toLocaleString()}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">GST Amt: ₹{gstAmount.toLocaleString()}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {/* Subtotal, GST, Grand Total */}
            <div className="flex flex-col gap-1 mt-6">
              {(() => {
                let subtotal = 0, totalGst = 0;
                cart.forEach(item => {
                  const hasOffer = typeof item.offerPrice === 'number' && item.offerPrice > 0;
                  const mainPrice = hasOffer ? item.offerPrice : (typeof item.numericPrice === 'number' && !isNaN(item.numericPrice) ? item.numericPrice : (typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, '')) : (typeof item.price === 'number' ? item.price : 0)));
                  const gst = typeof item.gst === 'number' ? item.gst : 18;
                  subtotal += mainPrice * item.quantity;
                  totalGst += (mainPrice * item.quantity * gst) / 100;
                });
                const grandTotal = subtotal + totalGst;
                return <>
                  <div className="flex justify-between items-center"><span className="font-bold text-lg">Subtotal:</span><span className="font-bold">₹{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center"><span className="font-bold text-lg">Total GST:</span><span className="font-bold">₹{totalGst.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center mt-2"><span className="font-bold text-xl">Grand Total:</span><span className="font-bold text-2xl text-mangla-gold">₹{grandTotal.toLocaleString()}</span></div>
                </>;
              })()}
            </div>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 mt-8">Shipping Address</h3>
        <div className="mb-6">
          {loading ? (
            <div className="text-gray-500">Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div className="text-gray-500">No address found. <Button size="sm" onClick={handleAdd}>Add Address</Button></div>
          ) : (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className={cn(
                    'border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all',
                    selectedAddressId === addr.id
                      ? 'border-mangla-gold bg-mangla-gold/10'
                      : isDark
                        ? 'border-gray-700 bg-mangla-dark-gray/60'
                        : 'border-gray-200 bg-gray-50'
                  )}
                >
                  <div onClick={() => setSelectedAddressId(addr.id!)} className="flex-1 cursor-pointer">
                    <div className="font-medium text-base flex items-center gap-2">
                      {addr.name}
                      {addr.isDefault && <span className="text-xs text-mangla-gold bg-mangla-gold/20 px-2 py-0.5 rounded ml-2">Default</span>}
                    </div>
                    <div className="text-sm">{addr.line1}{addr.line2 && ', ' + addr.line2}</div>
                    <div className="text-sm">{addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</div>
                    {addr.phone && <div className="text-xs text-gray-500">Phone: {addr.phone}</div>}
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(addr)} className="rounded-full px-4">Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(addr.id!)} className="rounded-full px-4">Delete</Button>
                  </div>
                </div>
              ))}
              <Button size="sm" className="mt-2 rounded-full px-6" onClick={handleAdd} variant="secondary">Add New Address</Button>
            </div>
          )}
        </div>
        <Button
          className="w-full py-3 text-lg rounded-full bg-mangla-gold hover:bg-mangla-gold/90 text-mangla-dark-gray font-bold mt-4"
          disabled={cart.length === 0 || !selectedAddressId}
          onClick={handlePayment}
        >
          Pay Now
        </Button>
      </div>
      <AddressModal open={modalOpen} onClose={() => { setModalOpen(false); setEditAddress(null); }} onSave={handleSave} initialAddress={editAddress} />
    </div>
  );
};

export default Checkout; 