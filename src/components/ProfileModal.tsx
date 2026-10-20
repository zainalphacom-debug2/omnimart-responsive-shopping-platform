import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  MapPin,
  Package,
  Heart,
  Wallet,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Globe,
  Coins,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  AlertCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
];

const COUNTRIES = [
  'Pakistan',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Germany',
  'Saudi Arabia',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    updateProfile,
    addVirtualCredits,
    addresses,
    setDefaultAddress,
    deleteAddress,
    setIsAddressModalOpen,
    setEditingAddress,
    orders,
    setSelectedOrderId,
    setActiveView,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    currency,
    resetDemoData,
    showToast,
    openReceipt,
    signUpDemoAccount,
    signInDemoAccount,
    signOutDemoAccount,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'orders' | 'wishlist' | 'wallet' | 'auth'>('info');

  // Auth sub-mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    password: '',
    confirmPassword: '',
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile Edit states
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    country: profile.country,
  });
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        country: profile.country,
      });
      setAuthError(null);
      setEditError(null);
      if (!profile.isSignedIn) {
        setActiveTab('auth');
      }
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Validation helpers
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (formData.name.trim().length < 2) {
      setEditError('Full name must be at least 2 characters.');
      return;
    }
    if (!isValidEmail(formData.email.trim())) {
      setEditError('Please enter a valid email address.');
      return;
    }
    if (formData.phone.trim().length < 6) {
      setEditError('Please enter a valid phone number.');
      return;
    }

    updateProfile(formData);
    setIsEditingInfo(false);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!isValidEmail(authForm.email.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (authForm.password.length < 4) {
      setAuthError('Password must be at least 4 characters for this demo account.');
      return;
    }

    signInDemoAccount(authForm.email.trim());
    setActiveTab('info');
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authForm.name.trim().length < 2) {
      setAuthError('Full name must be at least 2 characters.');
      return;
    }
    if (!isValidEmail(authForm.email.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (authForm.phone.trim().length < 6) {
      setAuthError('Please enter a valid contact phone number.');
      return;
    }
    if (authForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (authForm.password !== authForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    signUpDemoAccount(
      authForm.name.trim(),
      authForm.email.trim(),
      authForm.phone.trim(),
      authForm.country
    );
    setActiveTab('info');
  };

  const handleQuickDemoSignIn = () => {
    signInDemoAccount('zain.alphacom@gmail.com');
    updateProfile({
      name: 'Zain Ahmed',
      email: 'zain.alphacom@gmail.com',
      phone: '+92 300 1234567',
      country: 'Pakistan',
      isSignedIn: true,
    });
    setActiveTab('info');
  };

  const wishlistProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is typeof products[0] => p !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl my-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-neutral-200">
        {/* Left Sidebar Navigation */}
        <div className="md:w-64 p-4 sm:p-5 bg-neutral-50/70 shrink-0 flex flex-col justify-between">
          <div>
            {/* User Avatar & Name Card */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-200">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-300 bg-white shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-neutral-900 truncate">
                  {profile.isSignedIn ? profile.name : 'Guest User'}
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold tabular-nums block">
                  {profile.isSignedIn
                    ? `${formatPrice(profile.virtualCreditsUSD, currency)} Demo Credit`
                    : 'Not Signed In'}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">
                  {profile.isSignedIn ? 'Demo Account Active' : 'Demo Sandbox'}
                </span>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="space-y-1">
              {profile.isSignedIn ? (
                <>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'info'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Personal Info</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'addresses'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4" />
                      <span>Saved Addresses</span>
                    </div>
                    <span className="text-[10px] bg-neutral-200/80 text-neutral-700 px-1.5 py-0.2 rounded-full font-mono">
                      {addresses.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'orders'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </div>
                    <span className="text-[10px] bg-neutral-200/80 text-neutral-700 px-1.5 py-0.2 rounded-full font-mono">
                      {orders.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'wishlist'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4" />
                      <span>Wishlist</span>
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'wallet'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Virtual Wallet</span>
                  </button>

                  <div className="pt-2 border-t border-neutral-200/60 my-1">
                    <button
                      onClick={() => {
                        signOutDemoAccount();
                        setActiveTab('auth');
                        setAuthMode('signin');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('auth');
                      setAuthMode('signin');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'auth' && authMode === 'signin'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('auth');
                      setAuthMode('signup');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'auth' && authMode === 'signup'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-200/60'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Reset Demo Data button */}
          <div className="pt-4 border-t border-neutral-200 mt-6">
            <button
              onClick={() => {
                if (window.confirm('Reset all demo cart, orders, and addresses back to initial state?')) {
                  resetDemoData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-semibold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Top Close Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <h2 className="text-base font-bold text-neutral-900">
                {!profile.isSignedIn && authMode === 'signin' && 'Sign In to Demo Account'}
                {!profile.isSignedIn && authMode === 'signup' && 'Create New Demo Account'}
                {profile.isSignedIn && activeTab === 'info' && 'Personal Information'}
                {profile.isSignedIn && activeTab === 'addresses' && 'Manage Delivery Addresses'}
                {profile.isSignedIn && activeTab === 'orders' && 'My Orders & Real-Time Tracking'}
                {profile.isSignedIn && activeTab === 'wishlist' && 'Saved Wishlist Items'}
                {profile.isSignedIn && activeTab === 'wallet' && 'Virtual Mall Credit Wallet'}
                {profile.isSignedIn && activeTab === 'auth' && 'Account Settings'}
              </h2>

              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB: AUTH (Sign In or Create Account) */}
            {(!profile.isSignedIn || activeTab === 'auth') && (
              <div className="space-y-5 max-w-lg">
                {/* Switch between Sign In and Create Account */}
                <div className="flex p-1 bg-neutral-100 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      authMode === 'signin'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      authMode === 'signup'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Validation / error banner */}
                {authError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* SIGN IN FORM */}
                {authMode === 'signin' ? (
                  <form onSubmit={handleSignInSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-neutral-700">
                          Password <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-neutral-400">Demo: Any password works</span>
                      </div>
                      <input
                        type="password"
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        required
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleQuickDemoSignIn}
                        className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        title="Fast-test sign in with demo preset"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>One-Click Demo Login</span>
                      </button>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-500 flex items-start gap-2">
                      <Lock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Demo Sandbox Privacy:</strong> Accounts are simulated in your local browser storage. No real email is contacted and no plaintext passwords are sent or exposed.
                      </span>
                    </div>
                  </form>
                ) : (
                  /* CREATE ACCOUNT FORM */
                  <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        placeholder="e.g. Zain Ahmed"
                        className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={authForm.email}
                          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                          placeholder="zain@example.com"
                          className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={authForm.phone}
                          onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                          placeholder="+92 300 1234567"
                          className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Country / Region <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={authForm.country}
                        onChange={(e) => setAuthForm({ ...authForm, country: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Create Password <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="password"
                          value={authForm.password}
                          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                          placeholder="Min 6 characters"
                          className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Confirm Password <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="password"
                          value={authForm.confirmPassword}
                          onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                          placeholder="Repeat password"
                          className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Demo Account & Get $500 Credit</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-neutral-400 text-center">
                      By registering, you get $500 free demo shopping credit to test cart and checkout flows.
                    </p>
                  </form>
                )}
              </div>
            )}

            {/* TAB 1: Personal Information */}
            {profile.isSignedIn && activeTab === 'info' && (
              <div className="space-y-6">
                {/* Avatar presets */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                    Profile Avatar Preset
                  </label>
                  <div className="flex items-center gap-3">
                    {AVATAR_PRESETS.map((av, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateProfile({ avatar: av })}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          profile.avatar === av
                            ? 'border-neutral-900 scale-105 shadow-sm'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {editError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{editError}</span>
                  </div>
                )}

                {isEditingInfo ? (
                  <form onSubmit={handleSaveInfo} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingInfo(false);
                          setEditError(null);
                        }}
                        className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Full Name</span>
                        <span className="font-bold text-neutral-800">{profile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Email Address</span>
                        <span className="font-bold text-neutral-800">{profile.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Phone Number</span>
                        <span className="font-bold text-neutral-800">{profile.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Country</span>
                        <span className="font-bold text-neutral-800">{profile.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Member Status</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Verified Demo Member
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingInfo(true)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 hover:bg-neutral-100 rounded-xl text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          signOutDemoAccount();
                          setActiveTab('auth');
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Saved Delivery Addresses */}
            {profile.isSignedIn && activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-500">
                    Saved destinations for fast simulated checkout:
                  </span>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddressModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-2xl border text-xs relative ${
                        addr.isDefault
                          ? 'border-neutral-900 bg-neutral-50/70 shadow-xs'
                          : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-neutral-900 text-sm">
                          {addr.fullName}
                        </span>
                        {addr.isDefault ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[10px] text-neutral-500 hover:text-neutral-900 font-semibold underline cursor-pointer"
                          >
                            Set as default
                          </button>
                        )}
                      </div>

                      <p className="text-neutral-700">{addr.streetAddress}</p>
                      {addr.suite && <p className="text-neutral-500">{addr.suite}</p>}
                      <p className="text-neutral-600">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-neutral-400 text-[11px] mt-1 font-medium">
                        {addr.country} · {addr.phone}
                      </p>

                      <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-neutral-100">
                        <button
                          onClick={() => {
                            setEditingAddress(addr);
                            setIsAddressModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Address"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {addresses.length > 1 && (
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Demo Order History & Tracking & Receipts */}
            {profile.isSignedIn && activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <Package className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
                    <p className="text-xs font-semibold text-neutral-700">No Demo Orders Yet</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Items purchased in the simulated mall will appear here with live 30-second tracking and downloadable receipts.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-100">
                          <div>
                            <span className="font-mono font-bold text-neutral-900">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-neutral-400 ml-2">
                              {new Date(ord.createdAt).toLocaleDateString()} ·{' '}
                              {new Date(ord.createdAt).toLocaleTimeString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 tabular-nums mr-1">
                              {formatPrice(ord.totalUSD, currency)}
                            </span>

                            {/* View Receipt Button */}
                            <button
                              onClick={() => openReceipt(ord)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              title="View & Download official demo receipt slip"
                            >
                              <FileText className="w-3 h-3 text-neutral-600" />
                              <span>Receipt</span>
                            </button>

                            {/* Track Live Button */}
                            <button
                              onClick={() => {
                                setSelectedOrderId(ord.id);
                                setActiveView('tracking');
                                onClose();
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Track Live</span>
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-neutral-600">
                          <span>
                            {ord.items.length} item{ord.items.length > 1 ? 's' : ''} · Ship to:{' '}
                            {ord.deliveryAddress.city}, {ord.deliveryAddress.country}
                          </span>
                          <span className="text-emerald-600 font-semibold">
                            {ord.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Saved Wishlist */}
            {profile.isSignedIn && activeTab === 'wishlist' && (
              <div>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <Heart className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
                    <p className="text-xs font-semibold text-neutral-700">Wishlist is Empty</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Save favorite items while browsing the catalog by clicking the heart icon.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl border border-neutral-200 flex items-center gap-3 bg-white"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                          <ProductImage src={p.image} alt={p.title} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">{p.title}</h4>
                          <p className="text-xs font-bold text-neutral-900 tabular-nums mt-0.5">
                            {formatPrice(p.price, currency)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => addToCart(p, { openDrawer: true })}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-[10px] font-bold cursor-pointer"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => toggleWishlist(p.id)}
                              className="text-[10px] text-neutral-400 hover:text-rose-600 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Virtual Credit Wallet */}
            {profile.isSignedIn && activeTab === 'wallet' && (
              <div className="space-y-6 max-w-md">
                <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-3xl shadow-lg">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                    Virtual Mall Store Credits
                  </span>
                  <div className="text-3xl font-extrabold text-amber-300 tabular-nums mb-3">
                    {formatPrice(profile.virtualCreditsUSD, currency)}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Enjoy spending your free demo credits across all categories without connecting real payment methods.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => addVirtualCredits(100)}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Coins className="w-4 h-4" />
                    <span>+ $100 Demo Credit</span>
                  </button>

                  <button
                    onClick={() => addVirtualCredits(500)}
                    className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Coins className="w-4 h-4" />
                    <span>+ $500 VIP Top-Up</span>
                  </button>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-[11px] text-neutral-500 space-y-1">
                  <p className="font-semibold text-neutral-700">Simulated Credit Notice:</p>
                  <p>
                    Virtual credits cannot be exchanged for fiat currency or withdrawn. They are provided solely for shopping exploration in this demo environment.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Honest Local Storage Label */}
          <div className="pt-4 border-t border-neutral-100 mt-6 flex items-center gap-2 text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Local Demo Account & Storage · Data is stored safely in your browser. No plaintext passwords saved.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
