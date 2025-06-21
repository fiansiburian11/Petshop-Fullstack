import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const session_id = cookies().get("session_id")?.value;

    if (!session_id) {
      return NextResponse.json({ error: "Session ID tidak ditemukan" }, { status: 400 });
    }

    // Ambil isi keranjang
    const keranjang = await prisma.keranjang.findMany({
      where: { session_id },
      include: { Produk: true },
    });

    if (!keranjang.length) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }

    // Hitung total
    const total_harga = keranjang.reduce((total, item) => {
      return total + item.jumlah * item.Produk.harga;
    }, 0);

    // Buat pesanan baru
    const pesanan = await prisma.pesanan.create({
      data: {
        session_id,
        total_harga,
        Detail: {
          create: keranjang.map((item) => ({
            produk_id: item.produk_id,
            jumlah: item.jumlah,
            subtotal: item.jumlah * item.Produk.harga,
          })),
        },
      },
      include: {
        Detail: {
          include: { Produk: true },
        },
      },
    });

    // Kosongkan keranjang
    await prisma.keranjang.deleteMany({
      where: { session_id },
    });

    return NextResponse.json({
      message: "Checkout berhasil",
      pesanan,
    });
  } catch (error) {
    console.error("❌ Gagal checkout:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat proses checkout" }, { status: 500 });
  }
}
