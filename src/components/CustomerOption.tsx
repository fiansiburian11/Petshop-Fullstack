import Image from "next/image";
import React from "react";

const CustomerOption = () => {
  return (
    <div>
      <div>
        <h1 className="text-lg font-bold text-center">Opini Kostumer</h1>
        <div className="flex justify-center items-center gap-4 mt-4">
          <Image src="/images/Opini1.png" alt="Jejak" width={120} height={120} />
          <Image src="/images/Opini2.png" alt="Jejak" width={120} height={120} />
          <Image src="/images/Opini3.png" alt="Jejak" width={120} height={120} />
        </div>
      </div>
    </div>
  );
};

export default CustomerOption;
