import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Dog's meal",
    price: 24000,
    image: "/images/dogsmeal.png",
  },
  {
    id: 2,
    name: "Mr Carrot",
    price: 30,
    image: "/images/carrot.png",
  },
  {
    id: 3,
    name: "White Octopus",
    price: 56,
    image: "/images/octopus.png",
  },
  {
    id: 4,
    name: "Octopus 2",
    price: 56,
    image: "/images/octopus.png",
  },
  {
    id: 5,
    name: "Octopus 3",
    price: 56,
    image: "/images/octopus.png",
  },
  {
    id: 6,
    name: "Octopus 4",
    price: 56,
    image: "/images/octopus.png",
  },
  {
    id: 7,
    name: "Octopus 4",
    price: 56,
    image: "/images/octopus.png",
  },
  {
    id: 8,
    name: "Octopus 4",
    price: 56000,
    image: "/images/octopus.png",
  },
  {
    id: 9,
    name: "Octopus 4",
    price: 56,
    image: "/images/octopus.png",
  },
  {
    id: 10,
    name: "Octopus 4",
    price: 56,
    image: "/images/octopus.png",
  },
];
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const KatalogPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image src="/images/bg.png" alt="Background" fill className="z-0" priority />

      {/* Konten di atas background */}
      <div className="relative z-10 overflow-hidden">
        <div className="absolute top-5 left-5 z-20">
          <Image src="/images/logo.png" alt="logo" width={125} height={125} />
        </div>
        <Navbar />
        <div className="relative flex items-center pt-10 m-14">
          <Input className=" rounded-2xl p-4" placeholder="Cari" />
          <Button className="absolute right-[3px] bg-[#FFA733] hover:bg-[#FFA733]/80 rounded-2xl p-4">
            <Search />
          </Button>
        </div>
        <div className="px-6 pb-5">
          <div className="grid grid-cols-2  gap-5 place-items-center">
            {products.map((item) => (
              <Card key={item.id} className="w-52 bg-white shadow-lg rounded-2xl overflow-hidden transition hover:cursor-pointer">
                <CardContent className="p-0">
                  <Image src={item.image} alt={item.name} width={208} height={160} className="object-contain w-full h-36 border-b" />
                </CardContent>
                <CardFooter className="justify-between bg-white px-4 py-2 text-xs font-bold rounded-b-2xl">
                  <p className="truncate">{item.name}</p>
                  <p>{formatRupiah(item.price)}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer harus berada di luar konten yang absolute */}
      <Footer />
    </div>
  );
};

export default KatalogPage;
