import Image from "next/image";
import React from "react";

const FeaturesSection = () => {
  return (
    <div className="w-full py-16 px-8 bg-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Feature 1 - Lingkungan Aman & Bersih */}
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <div className="relative">
            <div className="w-32 h-36 bg-gradient-to-br from-orange-400 to-orange-500 rounded-l-[50px] rounded-r-[50px] relative " />
            <Image src="/images/oyon.png" alt="Kitten" width={110} height={110} className="absolute -bottom-1 left-3" />
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-800">Lingkungan Aman & Bersih</h2>
            <p className="text-gray-600 text-[10px] leading-relaxed">
              Di Miu Petshop, Kami Percaya Bahwa Setiap Hewan Peliharaan Berhak Tumbuh Di Tempat Yang Nyaman Dan Higienis. Kami Bantu Jaga Rutinitas Mereka Dengan Aktivitas Fisik & Mental Agar Hidup Mereka Lebih Sehat, Aktif, Dan Bahagia
              Setiap Hari.
            </p>
          </div>
        </div>

        {/* Feature 2 - Pelatihan & Sosialisasi */}
        <div className="grid grid-cols-[2fr_1fr] gap-4 items-center">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Pelatihan & Sosialisasi</h2>
            <p className="text-gray-600 text-[10px] leading-relaxed mt-2">
              Pelatihan Yang Tepat Bikin Hewan Peliharaan Lebih Tenang Dan Mudah Diajak Komunikasi. Kami Bantu Ajarkan Perintah Dasar Seperti “Duduk,” “Diam”, “Kemari”, Dan “Jangan”—Semuanya Untuk Menciptakan Ikatan Yang Kuat Antara Kamu
              Dan Peliharaanmu, Sekaligus Menjaga Keselamatan Mereka.
            </p>
          </div>
          <div className="relative w-full h-[200px]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-36 bg-orange-400 rounded-l-[50px] rounded-r-[50px] z-0" />
            <div className="absolute -right-8 -bottom-6 w-[220px] h-[220px] z-10">
              <Image src="/images/oyen.png" alt="Cat Training" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Feature 3 - Keseimbangan Fisik & Mental */}
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <div className="relative">
            <div className="w-32 h-36 bg-gradient-to-br from-orange-400 to-orange-500 rounded-l-[50px] rounded-r-[50px] relative " />
            <Image src="/images/oyan.png" alt="Kitten" width={200} height={200} className="absolute -bottom-0 -left-8" />
          </div>
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-800">Keseimbangan Fisik & Mental</h2>
            <p className="text-gray-600 text-[10px] leading-relaxed">
              Kami Tidak Hanya Fokus Pada Makanan Dan Mainan. Kami Juga Peduli Pada Keseimbangan Mental Dan Fisik Hewan. Dengan Rutinitas Yang Tepat, Hewanmu Akan Tumbuh Jadi Lebih Sehat, Ceria, Dan Siap Diajak Berpetualang Setiap Hari.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
