"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

type Pesanan = {
  id: number;
  order_id: string;
  status: "pending" | "lunas" | "gagal";
  total_harga: number;
  created_at: string;
  Detail: {
    id: number;
    jumlah: number;
    subtotal: number;
    Produk: {
      nama: string;
    };
  }[];
};

export default function HistoryPage() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async (q = "") => {
    try {
      const res = await axiosInstance.get("/pesanan/history", {
        params: { order_id: q },
      });
      setPesanan(res.data.data);
    } catch (err) {
      console.error("❌ Gagal ambil data history:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">History Pesanan</h1>
      <Input
        placeholder="Cari berdasarkan Order ID..."
        value={search}
        onChange={(e) => {
          const q = e.target.value;
          setSearch(q);
          fetchData(q);
        }}
        className="mb-4 max-w-md"
      />

      <div className="space-y-4">
        {pesanan.length === 0 ? (
          <p className="text-muted-foreground">Belum ada pesanan lunas.</p>
        ) : (
          pesanan.map((p) => (
            <div key={p.id} className="border rounded-md p-4 shadow-sm bg-white">
              <div className="flex justify-between">
                <p className="text-sm">
                  Order ID: <strong>{p.order_id}</strong>
                </p>
                <p className="text-[8px] text-gray-500">{format(new Date(p.created_at), "dd MMM yyyy HH:mm")}</p>
              </div>
              <ul className="text-sm mt-2">
                {p.Detail.map((d) => (
                  <li key={d.id}>
                    {d.jumlah}x {d.Produk.nama} - Rp{d.subtotal.toLocaleString("id-ID")}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-semibold text-right">Status: {p.status}</p>
              <p className="mt-2 font-semibold text-right">Total: Rp{p.total_harga.toLocaleString("id-ID")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
