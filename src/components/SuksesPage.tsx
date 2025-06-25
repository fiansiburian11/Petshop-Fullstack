"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

// Tipe data dari API
type PesananDetailItem = {
  id: number;
  nama: string;
  harga: number;
  jumlah: number;
};

type PesananResponse = {
  order_id: string;
  status: "pending" | "lunas" | "gagal";
  total: number;
  items: PesananDetailItem[];
};

export default function SuksesPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [detail, setDetail] = useState<PesananResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!orderId) return;

      const sessionId = localStorage.getItem("session_id");
      try {
        const res = await axiosInstance.get<PesananResponse>("/pesanan/sukses", {
          params: { order_id: orderId, session_id: sessionId },
        });
        setDetail(res.data);
      } catch (error) {
        console.error("❌ Gagal ambil detail pesanan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [orderId]);

  if (loading) return <p className="text-center mt-10">⏳ Memuat data pesanan...</p>;
  if (!detail) return <p className="text-center mt-10 text-red-500">❌ Pesanan tidak ditemukan.</p>;

  const formatRupiah = (angka: number) =>
    angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

  const sosmed = [
    {
      id: 1,
      name: "Whatsapp",
      icon: "/images/waicon.png",
      link: "https://wa.me/6289505346929",
    },
    {
      id: 2,
      name: "Facebook",
      icon: "/images/fbicon.png",
      link: "https://www.facebook.com/profile.php?id=100077704359339",
    },
    {
      id: 3,
      name: "Instagram",
      icon: "/images/igicon.png",
      link: "https://www.instagram.com/miuupetshop/",
    },
  ];

  return (
    <div className="max-w-xl mx-auto p-4 mt-10 rounded bg-white shadow-md">
      <h1 className="text-2xl font-bold text-green-600 mb-2">Informasi Pembayaran</h1>
      <p className="mb-2">
        Order ID: <span className="font-medium">{detail.order_id}</span>
      </p>
      <p className="mb-4">
        Status:{" "}
        <span
          className={clsx("px-2 py-1 rounded-full text-sm font-semibold", {
            "bg-green-100 text-green-800": detail.status === "lunas",
            "bg-yellow-100 text-yellow-800": detail.status === "pending",
            "bg-red-100 text-red-800": detail.status === "gagal",
          })}
        >
          {detail.status.toUpperCase()}
        </span>
      </p>

      <ul className="space-y-2">
        {detail.items.map((item) => (
          <li key={item.id} className="flex justify-between border-b py-2 text-sm">
            <span>{item.nama}</span>
            <span>
              {item.jumlah} x {formatRupiah(item.harga)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 font-bold text-right">Total: {formatRupiah(detail.total)}</p>

      {/* Sosial Media */}
      <div className="mt-10">
        <h2 className="text-center font-semibold text-gray-700 mb-2">Hubungi Kami</h2>
        <div className="flex space-x-5 items-center justify-center">
          {sosmed.map((item) => (
            <Link href={item.link} target="_blank" rel="noopener noreferrer" key={item.id} className="hover:bg-gray-100 rounded-2xl shadow-md flex flex-col items-center p-2 border">
              <Image src={item.icon} alt={item.name} width={50} height={50} />
              <p className="font-semibold text-black text-xs mt-1">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
