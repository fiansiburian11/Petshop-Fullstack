"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Searching from "@/components/ui/searching";
import axiosInstance from "@/lib/axios";
import { ApiResponse, Product } from "../../../../types/products";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
// import { useSnapMidtrans } from "@/lib/useSnapMidtrans";

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const KatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [jumlahDiKeranjang, setJumlahDiKeranjang] = useState(0);
  // const [isCheckoutAvailable, setIsCheckoutAvailable] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse<Product[]>>("/produk?limit=10");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handlePlus = () => {
    if (selectedProduct && quantity < selectedProduct.stok - jumlahDiKeranjang) {
      setQuantity(quantity + 1);
    }
  };

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async (produk_id: number, jumlah: number) => {
    const session_id = localStorage.getItem("session_id");
    if (!session_id) return toast("Session tidak ditemukan");
    if (!selectedProduct) return toast("Produk tidak valid");

    const totalInCart = jumlah + jumlahDiKeranjang;
    if (totalInCart > selectedProduct.stok) {
      return toast(`Stok tidak cukup. Maksimal ${selectedProduct.stok}`);
    }

    try {
      await axiosInstance.post("/keranjang", {
        session_id,
        produk_id,
        jumlah,
      });

      toast.success("Produk berhasil ditambahkan ke keranjang!");
      setJumlahDiKeranjang(totalInCart);
      // setIsCheckoutAvailable(true);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Gagal menambahkan ke keranjang");
    }
  };

  // const { payWithSnap } = useSnapMidtrans();
  //   const handleCheckout = async () => {
  //   if (!isCheckoutAvailable) {
  //     return toast("Tambahkan produk ke keranjang terlebih dahulu.");
  //   }

  //   try {
  //     // Tutup dialog dulu

  //     const checkoutRes = await axiosInstance.post("/keranjang/checkout");
  //     const pesanan = checkoutRes.data.pesanan;
  //     if (!pesanan?.id) return toast("Gagal membuat pesanan");

  //     const bayarRes = await axiosInstance.post("/pembayaran", {
  //       pesanan_id: pesanan.id,
  //     });

  //     const { token } = bayarRes.data;
  //     if (!token) return toast("Token Midtrans tidak ditemukan");

  //     // Tunggu animasi backdrop selesai (wajib delay)
  //     setTimeout(() => {
  //       payWithSnap(token);
  //     }, 400);
  //   } catch (err) {
  //     console.error("❌ Checkout error:", err);
  //     toast.error("Terjadi kesalahan saat checkout");
  //   }
  // };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image src="/images/bg.png" alt="Background" fill className="z-0" priority />
      <div className="relative z-10 overflow-hidden">
        <Link href="/" className="absolute top-5 left-5 z-20">
          <Image src="/images/logo.png" alt="logo" width={125} height={125} />
        </Link>
        <Navbar />
        <Searching onSearchResult={setProducts} />
        {products.length === 0 ? (
          <div className="flex justify-center items-center h-[400px]">
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-5 px-6 pb-5">
              {products.map((item) => (
                <Dialog key={item.id}>
                  <DialogTrigger
                    asChild
                    className="bg-white"
                    onClick={async () => {
                      setSelectedProduct(item);
                      setQuantity(1);

                      const session_id = localStorage.getItem("session_id");
                      if (!session_id) return;

                      try {
                        const res = await axiosInstance.get("/keranjang", {
                          params: { session_id },
                        });

                        const cartItem = res.data.data.find((prod: Product) => prod.nama === item.nama);
                        const jumlah = cartItem?.quantity || 0;
                        setJumlahDiKeranjang(jumlah);
                        // setIsCheckoutAvailable(jumlah > 0);
                      } catch (err) {
                        console.error("❌ Gagal ambil data keranjang", err);
                      }
                    }}
                  >
                    <div className="cursor-pointer rounded-xl border shadow-lg">
                      <Image src={item.gambar_url} alt="Kucing" width={208} height={160} className="object-contain h-36 border-b w-full" />
                      <div className="px-4 py-2">
                        <p className="text-sm font-semibold truncate mt-1">{item.nama}</p>
                        <p className="text-xs text-black">{formatRupiah(item.harga)}</p>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-sm rounded-2xl p-3">
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-52 relative rounded-xl overflow-hidden">
                        <Image src={item.gambar_url} alt="Kucing" fill className="object-contain" />
                      </div>

                      <div className="flex items-start justify-between">
                        <div className="w-[240px]">
                          {" "}
                          {/* batasi lebar agar truncate bisa jalan */}
                          <h2 className="font-bold text-lg truncate block">{selectedProduct?.nama}</h2>
                          <p className="text-sm text-black">{formatRupiah(selectedProduct?.harga || 0)}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold">Stok</h3>
                        <p className="text-xs text-black">{selectedProduct?.stok} Tersedia</p>
                      </div>

                      <div>
                        <h3 className="font-semibold">Deskripsi</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Jumlah</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button className="rounded-full" variant="outline" size="icon" onClick={handleMinus}>
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-6 text-center">{quantity}</span>
                            <Button className="rounded-full" variant="outline" size="icon" onClick={handlePlus}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="font-medium">{formatRupiah((selectedProduct?.harga ?? 0) * quantity)}</p>
                        </div>
                      </div>

                      <div className="flex mt-4 border border-black rounded-md">
                        <Button onClick={() => handleAddToCart(item.id, quantity)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black border-none rounded-md">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Keranjang
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default KatalogPage;
