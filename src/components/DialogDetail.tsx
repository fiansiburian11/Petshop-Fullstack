"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export default function DialogDetail() {
  const [quantity, setQuantity] = useState(1);

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  return (
    <Dialog>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Lihat Produk</Button>
      </DialogTrigger> */}
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <div className="flex flex-col gap-4">
          {/* Gambar */}
          <div className="w-full h-52 relative rounded-xl overflow-hidden">
            <Image
              src="/kucing.png"
              alt="Kucing"
              fill
              className="object-contain"
            />
          </div>

          {/* Nama dan Harga */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-lg">Lorem ipsum</h2>
              <p className="text-sm text-muted-foreground">Rp.123,000</p>
            </div>
            <p className="text-sm text-muted-foreground">Stok 123</p>
          </div>

          {/* Deskripsi */}
          <div>
            <h3 className="font-semibold">Deskripsi</h3>
            <p className="text-sm text-muted-foreground">lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
          </div>

          {/* Jumlah dan Total */}
          <div>
            <h3 className="font-semibold mb-2">Jumlah</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleMinus}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-6 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={handlePlus}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="font-medium">Rp.{(123000 * quantity).toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-2 mt-4">
            <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Keranjang
            </Button>
            <Button variant="outline" className="flex-1">
              Beli
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
