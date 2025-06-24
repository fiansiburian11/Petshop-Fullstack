// @ts-expect-error: midtrans-client has no types
import { Snap } from "midtrans-client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pesanan_id } = body;

    if (!pesanan_id) {
      return NextResponse.json({ error: "ID pesanan tidak dikirim" }, { status: 400 });
    }

    const pesanan = await prisma.pesanan.findUnique({
      where: { id: pesanan_id },
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

    const snap = new Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const item_details = pesanan.Detail.map((item) => ({
      id: item.produk_id.toString(),
      name: item.Produk?.nama || "Produk Tidak Dikenal",
      quantity: item.jumlah > 0 ? item.jumlah : 1,
      price: Math.round(item.subtotal / item.jumlah),
    }));

    // Jika sudah ada order_id, gunakan ulang
    if (pesanan.order_id) {
      const transaction = await snap.createTransaction({
        transaction_details: {
          order_id: pesanan.order_id,
          gross_amount: pesanan.total_harga,
        },
        item_details,
        credit_card: { secure: true },
      });

      return NextResponse.json({ token: transaction.token });
    }

    const orderId = `ORDER-${pesanan.id}-${Date.now()}`;
    await prisma.pesanan.update({
      where: { id: pesanan.id },
      data: { order_id: orderId },
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: pesanan.total_harga,
      },
      item_details,
      credit_card: { secure: true },
    });

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error("❌ Midtrans transaction error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return NextResponse.json(
      {
        error: "Gagal membuat transaksi",
        detail: message,
      },
      { status: 500 }
    );
  }
}
