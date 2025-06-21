import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    price: 30000,
    image: "/images/carrot.png",
  },
  {
    id: 3,
    name: "White Octopus",
    price: 56000,
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

const BestProducts = () => {
  return (
    <div className="relative w-full min-h-[400px] ">
      <h1 className="font-bold text-lg text-center pt-3">Produk Terbaik Kami</h1>
      <Image src="/images/Jejak.png" alt="Jejak" fill className="object-cover z-0" />

      <div className="absolute inset-0 z-10 flex justify-center items-center">
        <div className="flex gap-1">
          {products.map((item) => (
            <Card key={item.id} className="w-40 bg-[#FFA733] hover:bg-[#FFA733]/80 shadow-lg rounded-[45px]  overflow-hidden">
              <CardContent className="p-0">
                <Image src={item.image} alt={item.name} width={208} height={208} className="object-contain w-full h-40" />
              </CardContent>
              <CardFooter className="justify-between  bg-[#D9D9D9] px-4 py-3 text-xs font-bold rounded-b-[45px]">
                <p className="truncate">{item.name}</p>
                <p>{formatRupiah(item.price)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestProducts;
