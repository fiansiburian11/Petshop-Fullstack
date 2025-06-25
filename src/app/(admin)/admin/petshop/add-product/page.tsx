"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";

export default function AddProduct() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Debug formData
    if (!formData.get("description")) {
      toast.error("Deskripsi tidak boleh kosong.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/produk", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error("Gagal: " + (json?.error || "Unknown error"));
    } else {
      toast.success("Produk berhasil ditambahkan!");
      form.reset(); // reset form setelah sukses
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
       <Image className="relative z-0" src="/images/Rectangle.png" alt="Logo" fill />
      <form onSubmit={handleSubmit} className="absolute z-10 space-y-6 max-w-lg mx-auto p-4 border rounded-xl shadow-sm backdrop-blur-lg bg-white/30 ">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Produk</Label>
          <Input id="nama" name="nama" placeholder="Contoh: Makanan Kucing Whiskas" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="harga">Harga</Label>
          <Input id="harga" name="harga" type="number" placeholder="10000" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea id="description" name="description" placeholder="Tulis deskripsi produk..." required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stok">Stok</Label>
          <Input id="stok" name="stok" type="number" placeholder="10" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gambar">Gambar Produk</Label>
          <Input id="gambar" name="gambar" type="file" accept="image/*" required />
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#FFA733] hover:bg-[#FFA733]/80 text-black">
          {loading ? "Mengunggah..." : "Tambah Produk"}
        </Button>
      </form>
    </div>
  );
}
