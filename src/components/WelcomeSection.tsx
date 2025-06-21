import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';

const WelcomeScetion = () => {
  return (
    <div>
      {" "}
      <div className="absolute inset-0 top-32 justify-center z-10 px-5">
        <div className="grid grid-cols-2 items-center max-w-4xl w-full gap-8 ">
          <div className="text-center">
            <h1 className="font-bold text-left text-lg text-black mb-2">Selamat Datang Di Miu Petshop!</h1>
            <p className="text-sm text-black text-left mb-4">dari hati untuk si anabul dan teman-temannya</p>
            <div className="">
              <Link href="/katalog">
                <Button className="mt-4 bg-[#CFEAF3] text-black font-semibold text-xs rounded-xl px-6 hover:bg-[#CFEAF3]/80 transition-colors duration-200 ">Lihat Barang</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image src="/images/kucing1.png" alt="kucing1" width={180} height={180} className="object-contain" />
          </div>
        </div>
      </div>
      <div className="absolute flex rounded-lg bg-[#CFEAF3] p-2 bottom-16 w-80 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-2">
          <div className="flex items-center">
            <Image src="/images/dog-house.png" alt="scroll" width={40} height={40} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[10px]">Penitipan</span>
            <span className="text-[8px]">Nyaman Buat Si Meong</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center">
            <Image src="/images/pet-shop.png" alt="scroll" width={40} height={40} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[10px]">Belanja</span>
            <span className="text-[8px]">Si Meong Juga Butuh Belanja</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScetion