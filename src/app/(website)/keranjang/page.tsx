"use client";
import React, { useState } from "react";
import { ArrowLeft, Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Item 1",
      price: 5.99,
      quantity: 1,
      image: "/api/placeholder/60/60",
    },
    {
      id: 2,
      name: "Item 2",
      price: 3.4,
      quantity: 1,
      image: "/api/placeholder/60/60",
    },
    {
      id: 3,
      name: "Item 3",
      price: 7,
      quantity: 2,
      image: "/api/placeholder/60/60",
    },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="ml-4 text-lg font-semibold text-gray-900">Keranjang Kamu</h1>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded"></div>
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.name}</h3>

              {/* Quantity Controls */}
              <div className="flex items-center mt-2 space-x-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-medium">{item.quantity}</span>

                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price and Delete */}
            <div className="flex flex-col items-end space-y-2">
              <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
              <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-5 pb-4 rounded-lg bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button className="w-full mt-6 bg-purple-600 text-white py-4 rounded-full font-semibold hover:bg-purple-700 transition-colors">Checkout</button>
      </div>
    </div>
  );
};

export default ShoppingCart;
