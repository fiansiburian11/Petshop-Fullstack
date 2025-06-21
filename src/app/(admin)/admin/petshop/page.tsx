"use client";

import { useState } from "react";

export default function TambahProdukPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/produk", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert("Gagal: " + json?.error || "Unknown error");
    } else {
      alert("Produk berhasil ditambahkan!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="nama" type="text" placeholder="Nama Produk" required className="border p-2" />
      <input name="harga" type="number" placeholder="Harga" required className="border p-2" />
      <input name="stok" type="number" placeholder="Stok" required className="border p-2" />
      <input name="gambar" type="file" accept="image/*" required className="border p-2" />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2">
        {loading ? "Mengunggah..." : "Tambah Produk"}
      </button>
    </form>
  );
}
