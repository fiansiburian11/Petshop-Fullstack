"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import { Product } from "../../types/products";
import Image from "next/image";
import { useEffect, useState } from "react";

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const BestProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/produk?limit=3");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="relative w-full min-h-[400px] ">
      <h1 className="font-bold text-lg text-center pt-3">Produk Terbaik Kami</h1>
      <Image src="/images/Jejak.png" alt="Jejak" fill className="object-cover z-0" />

      <div className="absolute inset-0 z-10 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-1">
          {products.map((item) => (
            <Card key={item.id} className="bg-white  shadow-lg rounded-[45px]  overflow-hidden">
              <CardContent >
                <Image src={item.gambar_url} alt={item.nama} width={208} height={208} className="object-cover" />
              </CardContent>
              <CardFooter className="justify-between  bg-[#D9D9D9] px-4 py-2 text-xs font-bold w-">
                <p className="truncate w-full block ">{item.nama}</p>
                <p className="truncate text-[9px]">{formatRupiah(item.harga)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestProducts;
