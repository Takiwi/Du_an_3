import React from "react";
import banner from "../../public/banner.jpg";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 justify-center items-center text-center">
      <div>{children}</div>

      <div>
        <Image
          src={banner}
          alt="Banner"
          width={500}
          height={500}
          priority
        ></Image>
      </div>
    </div>
  );
}
