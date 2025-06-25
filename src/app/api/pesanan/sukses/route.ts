export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const order_id = req.nextUrl.searchParams.get("order_id");
    const session_id = req.nextUrl.searchParams.get("session_id");

    if (!order_id || !session_id) {
      return NextResponse.json({ error: "order_id atau session_id hilang" }, { status: 400 });
    }

    const pesanan = await prisma.pesanan.findFirst({
      where: {
        order_id,
        session_id,
      },
      include: {
        Detail: {
          include: {
            Produk: true,
          },
        },
      },
    });

    if (!pesanan) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const items = pesanan.Detail.map((d) => ({
      id: d.id,
      nama: d.Produk.nama,
      harga: d.Produk.harga,
      jumlah: d.jumlah,
    }));

    return NextResponse.json({
      order_id: pesanan.order_id,
      status: pesanan.status,
      total: pesanan.total_harga,
      items,
    });
  } catch (err) {
    console.error("❌ Gagal ambil data sukses:", err);
    return NextResponse.json({ error: "Gagal ambil data sukses" }, { status: 500 });
  }
}
