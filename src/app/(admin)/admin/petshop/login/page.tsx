"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Login Admin</h1>
        <input type="text" placeholder="Email" className="border p-2 w-full mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="bg-blue-600 text-white py-2 px-4 rounded w-full">
          Login
        </button>
      </div>
    </div>
  );
}
