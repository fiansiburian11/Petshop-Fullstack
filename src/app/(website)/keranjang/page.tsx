"use client";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stok?: number;
}

type SnapResult = {
  order_id: string;
  transaction_id?: string;
  transaction_status?: string;
  gross_amount?: string;
  payment_type?: string;
  [key: string]: unknown; // opsional untuk fleksibilitas
};

const Keranjang: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getSessionId = () => {
    let sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);
    }
    // Set juga ke cookie agar backend bisa baca
    Cookies.set("session_id", sessionId, { expires: 7, path: "/" });
    return sessionId;
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (item.stok && newQuantity > item.stok) {
      toast(`Stok tidak mencukupi. Maksimal hanya ${item.stok}`);
      return;
    }

    const session_id = getSessionId();

    try {
      await axiosInstance.put("/keranjang", {
        session_id,
        keranjang_id: id,
        jumlah: newQuantity,
      });

      setCartItems((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      );
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast(err?.response?.data?.error || "Gagal update jumlah");
    }
  };

  const removeItem = async (id: number) => {
    const session_id = getSessionId();
    try {
      await axiosInstance.delete("/keranjang", {
        data: { session_id, keranjang_id: id },
      });

      setCartItems((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus item:", error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const session_id = getSessionId();
      try {
        const response = await axiosInstance.get("/keranjang", {
          params: { session_id },
        });
        setCartItems(response.data.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCheckout = async () => {
    try {
      // 1. Buat pesanan
      const checkoutRes = await axiosInstance.post("/keranjang/checkout");
      const pesanan = checkoutRes.data.pesanan;

      if (!pesanan || !pesanan.id) {
        toast("Gagal membuat pesanan");
        return;
      }

      // 2. Buat pembayaran Midtrans (ambil token)
      const pembayaranRes = await axiosInstance.post("/pembayaran", {
        pesanan_id: pesanan.id,
      });

      const { token } = pembayaranRes.data;
      if (!token) {
        toast("Gagal mendapatkan token pembayaran");
        return;
      }

      // 3. Panggil Snap modal
      if (typeof window.snap === "undefined") {
        toast("Midtrans Snap belum dimuat");
        return;
      }

      window.snap.pay(token, {
        onSuccess: (result) => {
          const snapResult = result as SnapResult;
          console.log("✅ Pembayaran sukses:", snapResult);
          toast("Pembayaran berhasil!");

          window.location.href = `/keranjang/pembayaran/sukses?order_id=${snapResult.order_id}`;
        },
        onPending: (result) => {
          const snapResult = result as SnapResult;
          console.log("⏳ Pembayaran pending:", snapResult);
          toast("Menunggu pembayaran...");
          window.location.href = `/keranjang/pembayaran/sukses?order_id=${snapResult.order_id}`;
        },
        onError: (result) => {
          console.error("❌ Pembayaran gagal:", result);
          toast("Terjadi kesalahan saat pembayaran.");
        },
        onClose: () => {
          toast("Kamu menutup popup tanpa menyelesaikan pembayaran.");
        },
      });
    } catch (err) {
      console.error("❌ Checkout error:", err);
      toast("Gagal memproses checkout");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <ArrowLeft onClick={() => window.history.back()} className="w-6 h-6 text-gray-700 hover:cursor-pointer" />
        <h1 className="ml-4 text-lg font-semibold text-gray-900">Keranjang Kamu</h1>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Keranjang masih kosong</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div className="w-16 h-16 flex items-center justify-center border rounded-lg overflow-hidden">
                <Image src={item.image || "/images/placeholder.png"} alt={item.name} width={60} height={60} className="object-contain" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>

                <div className="flex items-center mt-2 space-x-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
                <span className="font-semibold text-gray-900">{formatRupiah(item.price * item.quantity)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ringkasan */}
      {cartItems.length > 0 && (
        <div className="px-5 pb-4 rounded-lg bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
          </div>

          <button onClick={handleCheckout} className="w-full mt-6 bg-[#FFA733] text-black py-4 rounded-full font-semibold hover:bg-[#FFA733]/90 transition-colors">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Keranjang;
