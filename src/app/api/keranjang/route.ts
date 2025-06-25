export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const { searchParams } = new URL(req.url);
    // const session_id = searchParams.get("session_id");

    const body = await req.json();
    const { produk_id, jumlah, session_id } = body;

    if (!session_id || !produk_id || !jumlah) {
      return NextResponse.json({ error: "session_id, produk_id, dan jumlah wajib diisi" }, { status: 400 });
    }

    const produk = await prisma.produk.findUnique({
      where: { id: produk_id },
    });

    if (!produk) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const existing = await prisma.keranjang.findFirst({
      where: { session_id, produk_id },
    });

    const jumlah_sekarang = existing?.jumlah ?? 0;
    const jumlah_total = jumlah_sekarang + jumlah;

    if (jumlah_total > produk.stok) {
      return NextResponse.json(
        {
          error: `Stok tidak mencukupi. Stok tersedia hanya ${produk.stok}, kamu sudah punya ${jumlah_sekarang} di keranjang.`,
        },
        { status: 400 }
      );
    }

    if (existing) {
      await prisma.keranjang.update({
        where: { id: existing.id },
        data: { jumlah: jumlah_total },
      });
    } else {
      await prisma.keranjang.create({
        data: { session_id, produk_id, jumlah },
      });
    }

    return NextResponse.json({ message: "Berhasil menambahkan ke keranjang" });
  } catch (error) {
    console.error("❌ Error POST:", error);
    return NextResponse.json({ error: "Gagal menambahkan ke keranjang" }, { status: 500 });
  }
}

/**
 * Ambil isi keranjang berdasarkan session_id (GET)
 */
export async function GET(req: NextRequest) {
  try {
    const session_id = req.nextUrl.searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json({ error: "session_id wajib dikirim di URL" }, { status: 400 });
    }

    const keranjang = await prisma.keranjang.findMany({
      where: { session_id },
      include: {
        Produk: true,
      },
    });

    const data = keranjang.map((item) => ({
      id: item.id,
      name: item.Produk.nama,
      price: item.Produk.harga,
      quantity: item.jumlah,
      image: item.Produk.gambar_url,
      stok: item.Produk.stok,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("❌ Error GET:", error);
    return NextResponse.json({ error: "Gagal mengambil data keranjang" }, { status: 500 });
  }
}

/**
 * Update jumlah item di keranjang (PUT)
 */
export async function PUT(req: NextRequest) {
  try {
    const { session_id, keranjang_id, jumlah } = await req.json();

    if (!session_id || !keranjang_id || !jumlah) {
      return NextResponse.json({ error: "session_id, keranjang_id, dan jumlah wajib diisi" }, { status: 400 });
    }

    // Ambil data produk yang terkait
    const item = await prisma.keranjang.findUnique({
      where: { id: keranjang_id },
      include: { Produk: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
    }

    // Cek stok
    if (jumlah > item.Produk.stok) {
      return NextResponse.json({ error: `Jumlah melebihi stok (${item.Produk.stok})` }, { status: 400 });
    }

    await prisma.keranjang.update({
      where: { id: keranjang_id },
      data: { jumlah },
    });

    return NextResponse.json({ message: "Jumlah berhasil diperbarui" });
  } catch (error) {
    console.error("❌ Error PUT keranjang:", error);
    return NextResponse.json({ error: "Gagal update jumlah" }, { status: 500 });
  }
}

/**
 * Hapus item dari keranjang (DELETE)
 */
export async function DELETE(req: NextRequest) {
  try {
    const { session_id, keranjang_id } = await req.json();

    if (!session_id || !keranjang_id) {
      return NextResponse.json({ error: "session_id dan keranjang_id wajib diisi" }, { status: 400 });
    }

    await prisma.keranjang.delete({
      where: { id: keranjang_id },
    });

    return NextResponse.json({ message: "Item berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error DELETE:", error);
    return NextResponse.json({ error: "Gagal menghapus item" }, { status: 500 });
  }
}
