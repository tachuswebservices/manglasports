import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export interface Address {
  id?: number;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  initialAddress?: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({ open, onClose, onSave, initialAddress }) => {
  const [address, setAddress] = useState<Address>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    if (initialAddress) setAddress(initialAddress);
    else setAddress({
      name: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false
    });
  }, [initialAddress, open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(address);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-lg space-y-4 relative">
        <button type="button" onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">×</button>
        <h2 className="text-xl font-bold mb-2">{initialAddress ? 'Edit Address' : 'Add Address'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Label (e.g. Home, Office)</label>
            <input name="name" value={address.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input name="phone" value={address.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Address Line 1</label>
            <input name="line1" value={address.line1} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Address Line 2</label>
            <input name="line2" value={address.line2} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input name="city" value={address.city} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">State</label>
            <input name="state" value={address.state} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Postal Code</label>
            <input name="postalCode" value={address.postalCode} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Country</label>
            <input name="country" value={address.country} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <input type="checkbox" name="isDefault" checked={!!address.isDefault} onChange={handleChange} id="isDefault" className="mr-2" />
          <label htmlFor="isDefault" className="text-sm">Set as default address</label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{initialAddress ? 'Save Changes' : 'Add Address'}</Button>
        </div>
      </form>
    </div>
  );
};

export default AddressModal; 