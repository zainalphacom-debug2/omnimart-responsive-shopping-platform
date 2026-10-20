import React, { useState, useEffect } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { DeliveryAddress } from '../types';
import { useShop } from '../context/ShopContext';

export const AddressModal: React.FC = () => {
  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    editingAddress,
    setEditingAddress,
    addAddress,
    updateAddress,
    country: currentCountry,
  } = useShop();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: currentCountry || 'Pakistan',
    state: '',
    city: '',
    postalCode: '',
    streetAddress: '',
    suite: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        fullName: editingAddress.fullName,
        phone: editingAddress.phone,
        country: editingAddress.country,
        state: editingAddress.state,
        city: editingAddress.city,
        postalCode: editingAddress.postalCode,
        streetAddress: editingAddress.streetAddress,
        suite: editingAddress.suite || '',
        isDefault: editingAddress.isDefault,
      });
    } else {
      setFormData({
        fullName: '',
        phone: '',
        country: currentCountry || 'Pakistan',
        state: '',
        city: '',
        postalCode: '',
        streetAddress: '',
        suite: '',
        isDefault: false,
      });
    }
    setErrors({});
  }, [editingAddress, currentCountry, isAddressModalOpen]);

  if (!isAddressModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.country.trim()) errs.country = 'Country is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.streetAddress.trim()) errs.streetAddress = 'Street address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
    } else {
      addAddress(formData);
    }

    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h3>
          </div>

          <button
            onClick={() => {
              setIsAddressModalOpen(false);
              setEditingAddress(null);
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Zain Ahmed"
                className={`w-full text-xs p-2.5 rounded-xl border bg-neutral-50 ${
                  errors.fullName ? 'border-rose-500' : 'border-neutral-200'
                } focus:outline-none focus:bg-white`}
              />
              {errors.fullName && <p className="text-[10px] text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +92 300 1234567"
                className={`w-full text-xs p-2.5 rounded-xl border bg-neutral-50 ${
                  errors.phone ? 'border-rose-500' : 'border-neutral-200'
                } focus:outline-none focus:bg-white`}
              />
              {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Country"
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                State / Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Punjab / CA"
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Lahore / Karachi"
                className={`w-full text-xs p-2.5 rounded-xl border bg-neutral-50 ${
                  errors.city ? 'border-rose-500' : 'border-neutral-200'
                } focus:outline-none focus:bg-white`}
              />
              {errors.city && <p className="text-[10px] text-rose-500 mt-1">{errors.city}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              placeholder="e.g. House 42, Street 7, Block C"
              className={`w-full text-xs p-2.5 rounded-xl border bg-neutral-50 ${
                errors.streetAddress ? 'border-rose-500' : 'border-neutral-200'
              } focus:outline-none focus:bg-white`}
            />
            {errors.streetAddress && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.streetAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Apartment, Suite, Unit (Optional)
              </label>
              <input
                type="text"
                value={formData.suite}
                onChange={(e) => setFormData({ ...formData, suite: e.target.value })}
                placeholder="e.g. Apt 4B, 2nd Floor"
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Postal / Zip Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="e.g. 54000"
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <span>Set as default delivery address</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => {
                setIsAddressModalOpen(false);
                setEditingAddress(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {editingAddress ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
