import { NextRequest, NextResponse } from "next/server";
import { Snap } from "midtrans-client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const { pesanan_id } = await req.json();

    if (!pesanan_id) {
      return NextResponse.json({ error: "ID pesanan tidak dikirim" }, { status: 400 });
    }

    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pesanan_id },
      include: { Detail: { include: { Produk: true } } },
    });

    if (!pesanan) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const snap = new Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: `ORDER-${pesanan.id}-${Date.now()}`,
        gross_amount: pesanan.total_harga,
      },
      item_details: pesanan.Detail.map((item) => ({
        id: item.produk_id.toString(),
        name: item.Produk.nama,
        quantity: item.jumlah,
        price: item.Produk.harga,
      })),
      credit_card: {
        secure: true,
      },
    });

    return NextResponse.json({ redirect_url: transaction.redirect_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat transaksi" }, { status: 500 });
  }
}
