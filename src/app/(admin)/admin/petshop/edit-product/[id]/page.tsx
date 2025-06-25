"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function EditProductPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    nama: "",
    harga: 0,
    stok: 0,
    description: "",
    gambar_url: "",
  });

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/produk/${id}`);
        setProduct(res.data);
      } catch (err) {
        const error = err as Error;
        console.error(error);
        toast.error("Gagal memuat data produk");
        router.push("/admin/petshop");
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`/produk/${id}`, product);
      toast.success("Produk berhasil diperbarui!");
      router.push("/admin/petshop");
    } catch (err) {
      const error = err as Error;
      console.error(error);
      toast.error("Gagal memperbarui produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 flex justify-center items-start">
      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6 bg-white rounded-xl shadow p-6 border">
        <h1 className="text-2xl font-bold text-orange-800">Edit Produk</h1>

        <div className="space-y-2">
          <Label htmlFor="nama">Nama Produk</Label>
          <Input name="nama" value={product.nama} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="harga">Harga</Label>
          <Input name="harga" type="number" value={product.harga} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stok">Stok</Label>
          <Input name="stok" type="number" value={product.stok} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea name="description" value={product.description || ""} onChange={handleChange} required />
        </div>

        {/* Gambar tidak bisa diubah via form ini (opsional jika ingin diupload ulang) */}
        <div className="text-sm text-gray-500 italic">Gambar tidak bisa diedit. Untuk mengganti, silakan hapus dan tambah ulang.</div>

        <Button type="submit" disabled={loading} className="w-full rounded-xl">
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
