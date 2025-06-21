"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProdukInput } from "@/lib/validators/produk";

export default function UpdateProductDialog({ produk }: { produk: ProdukInput }) {
  const [nama, setNama] = useState(produk.nama);
  const [harga, setHarga] = useState(produk.harga);
  const [stok, setStok] = useState(produk.stok);
  const [gambarUrl, setGambarUrl] = useState(produk.gambar_url);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/produk/${produk.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, harga, stok, gambar_url: gambarUrl }),
      });

      if (!res.ok) throw new Error("Gagal update produk");

      alert("Produk berhasil diupdate!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="bg-[#1c2126] text-white">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input className="bg-[#293038] text-white" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama produk" />
          <Input className="bg-[#293038] text-white" type="number" value={harga} onChange={(e) => setHarga(Number(e.target.value))} placeholder="Harga" />
          <Input className="bg-[#293038] text-white" type="number" value={stok} onChange={(e) => setStok(Number(e.target.value))} placeholder="Stok" />
          <Input className="bg-[#293038] text-white" value={gambarUrl} onChange={(e) => setGambarUrl(e.target.value)} placeholder="URL Gambar" />
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading} className="bg-[#1980e6] text-white">
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
