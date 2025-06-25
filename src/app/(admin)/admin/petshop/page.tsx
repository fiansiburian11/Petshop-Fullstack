"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

type Produk = {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  description?: string;
  gambar_url: string;
  createdAt: string;
};

export default function ProdukList() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const fetchProduk = async () => {
    try {
      const res = await axios.get("/produk");
      const result = Array.isArray(res.data) ? res.data : res.data.data;
      setProduk(result || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat produk");
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const handleDelete = async (id: number) => {
    const konfirmasi = confirm("Yakin ingin menghapus produk ini?");
    if (!konfirmasi) return;

    try {
      await axios.delete(`/produk/${id}`);
      toast.success("Produk berhasil dihapus");
      fetchProduk(); // pastikan ini fungsi yang benar
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus produk");
    }
  };
  

  const filteredProduk = produk
    .filter((item) => item.nama.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortDesc ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-orange-900">Manajemen Produk</h1>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Input type="text" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-48" />
          <Button variant="outline" onClick={() => setSortDesc(!sortDesc)} className="gap-1">
            Sortir <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Link href="/admin/petshop/add-product">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
              <Plus className="w-4 h-4 mr-1" /> Tambah Produk
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-6 font-semibold border-b pb-2 mb-3 text-gray-600 text-sm">
        <div>Gambar</div>
        <div>Nama</div>
        <div>Harga</div>
        <div>Stok</div>
        <div>Deskripsi</div>
        <div className="text-right">Aksi</div>
      </div>

      {/* List Produk */}
      <div className="space-y-4">
        {filteredProduk.map((item) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center bg-white rounded-lg shadow-sm px-3 py-4 border">
            <div className="flex justify-center md:justify-start">
              <Image src={item.gambar_url} alt={item.nama} width={60} height={60} className="rounded-md object-cover" />
            </div>
            <div className="font-medium text-gray-800">{item.nama}</div>
            <div className="text-gray-700">Rp {item.harga.toLocaleString()}</div>
            <div className="text-gray-700">{item.stok}</div>
            <div className="text-sm text-gray-600 line-clamp-2">{item.description || "-"}</div>
            <div className="flex justify-end gap-2">
              <Link href={`/admin/petshop/edit-product/${item.id}`}>
                <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
