import Image from "next/image";
import Link from "next/link";
import React from "react";

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
const HubKami = ({ id }: { id: string }) => {
  return (
    <div id={id} className="relative w-full h-[400px] overflow-hidden">
      {/* Background oranye melengkung */}
      <Image src="/images/Rectangle2.png" alt="Background Shape" fill className="object-cover z-0" />

      <div className="absolute top-28 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h1 className="text-lg font-semibold text-black">Hubungi Kami</h1>
      </div>

      {/* WhatsApp Box */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex space-x-2">
        {sosmed.map((item) => (
          <Link href={item.link} target="_blank" rel="noopener noreferrer" key={item.id} className="bg-white hover:bg-gray-200 rounded-2xl shadow-md flex flex-col items-center p-2">
            <Image src={item.icon} alt="WhatsApp Icon" width={50} height={50} />
            <p className="font-semibold text-black text-xs">{item.name}</p>
            {/* <p className="text-black text-[9px]">Zulyendra Yani</p> */}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-56 right-0 z-20">
        <Image src="/images/siitam.png" alt="Kucing" width={100} height={120} />
      </div>
    </div>
  );
};

export default HubKami;
