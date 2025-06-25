import Image from "next/image";
import React from "react";
import Navbar from "./Navbar";
import WelcomeScetion from "./WelcomeSection";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div>
      {" "}
      <div className="relative w-full h-[500px]">
        <Image src="/images/Rectangle.png" alt="rectangle" fill className="z-0" />
        <div className="absolute top-5 left-5 text-white text-lg font-extrabold z-10 ">
          <Link href="/">
          <Image src="/images/logo.png" alt="logo" width={125} height={125} className="text-black" />
          </Link>
        </div>
        <Navbar />
        <WelcomeScetion />
      </div>
    </div>
  );
};

export default HeroSection;
