import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="w-full">
        <Image className="w-full " src="/images/footer.png" alt="rectangle" width={2000} height={2000} />
      </div>
    </div>
  );
};

export default Footer;
