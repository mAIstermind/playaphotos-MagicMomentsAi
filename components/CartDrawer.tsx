import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Lock, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, toggleCart, removeFromCart, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    // Simulate API Call to Cloud Function for Stripe Session
    setTimeout(() => {
        setIsCheckingOut(false);
        toggleCart(); // Close drawer
        navigate('/checkout/success');
        clearCart(); // In real app, clear only after webhook confirmation
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">Your Cart ({items.length})</h2>
          </div>
          <button onClick={toggleCart} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
               <ShoppingBag className="w-16 h-16 opacity-20" />
               <p>Your cart is empty</p>
               <button onClick={toggleCart} className="text-brand-600 font-medium hover:underline">
                 Browse Gallery
               </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.thumbnailUrl} alt="Item" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800 line-clamp-1">Event Photo</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-100 text-brand-700 capitalize">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500">Total</span>
              <span className="text-2xl font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isCheckingOut ? <Loader2 className="animate-spin" /> : <Lock className="w-4 h-4" />}
              {isCheckingOut ? 'Processing...' : 'Secure Checkout'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Payments processed securely via Stripe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};