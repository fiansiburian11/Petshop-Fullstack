"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const navbar = [
  {
    id: 1,
    name: "Katalog",
    href: "/katalog",
  },
  {
    id: 2,
    name: "Tentang",
    href: "/#Tentang",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div>
      {" "}
      <div className="absolute top-5 right-5 z-20 flex gap-4 items-center">
        {navbar.map((item) => (
          <Link key={item.id} href={item.href} className={clsx("  hover:opacity-50 transition-opacity px-3 py-2 cursor-pointer", pathname === item.href ? "text-[#FFA733] text-sm font-extrabold" : "text-xs font-semibold text-black")}>
            {item.name}
          </Link>
        ))}
        <Link href="/keranjang" className="cursor-pointer hover:opacity-80 transition-opacity">
          <Image className="mt-1" src="/images/Cart.png" alt="Keranjang" width={30} height={30} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
