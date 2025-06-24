import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const order_id = searchParams.get("order_id");
  const session_id = searchParams.get("session_id");

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

  return NextResponse.json({
    order_id: pesanan.order_id,
    status: pesanan.status,
    total: pesanan.total_harga,
    items: pesanan.Detail.map((d) => ({
      id: d.id,
      nama: d.Produk.nama,
      harga: d.Produk.harga,
      jumlah: d.jumlah,
    })),
  });
}
