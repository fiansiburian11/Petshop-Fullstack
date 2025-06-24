"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/lib/axios"; // pastikan path sesuai

const navbar = [
  {
    id: 1,
    name: "Katalog",
    href: "/katalog",
  },
  {
    id: 2,
    name: "Tentang",
    href: "/#tentang",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [jumlahKeranjang, setJumlahKeranjang] = useState(0);

  useEffect(() => {
    const fetchJumlahKeranjang = async () => {
      const session_id = localStorage.getItem("session_id");
      if (!session_id) return;

      try {
        const res = await axiosInstance.get("/keranjang", {
          params: { session_id },
        });

        // jumlah jenis produk unik
        const jumlahJenisProduk = res.data.data.length;
        setJumlahKeranjang(jumlahJenisProduk);
      } catch (error) {
        console.error("Gagal fetch data keranjang:", error);
      }
    };

    fetchJumlahKeranjang();
  }, []);

  return (
    <div>
      <div className="absolute top-5 right-5 z-20 flex gap-4 items-center">
        {navbar.map((item) => (
          <Link key={item.id} href={item.href} className={clsx("hover:opacity-50 transition-opacity px-3 py-2 cursor-pointer", pathname === item.href ? "text-[#FFA733] text-sm font-extrabold" : "text-xs font-semibold text-black")}>
            {item.name}
          </Link>
        ))}

        <Link href="/keranjang" className="relative cursor-pointer hover:opacity-80 transition-opacity">
          <Image className="mt-1" src="/images/Cart.png" alt="Keranjang" width={30} height={30} />
          {jumlahKeranjang > 0 && (
            <Badge variant="default" className="absolute top-0 right-0 text-[8px] rounded-full px-1">
              {jumlahKeranjang}
            </Badge>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
