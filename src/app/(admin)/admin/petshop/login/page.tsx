"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) router.push("/admin/petshop");
    else alert("Login gagal!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Image className="relative z-0" src="/images/Rectangle.png" alt="Logo" fill />
      <div className="absolute p-6 rounded shadow-md w-80 bg-slate-200">
        <h1 className="text-xl font-bold mb-4 text-center">Admin</h1>
        <input type="text" placeholder="Email" className=" py-2 w-full mb-2 rounded-full bg-white px-6" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="py-2 w-full mb-4 rounded-full bg-white px-6" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="bg-[#FFA733] hover:bg-[#FFA733]/80 text-black py-2 px-4 rounded-full w-full ">
          Login
        </button>
      </div>
    </div>
  );
}
