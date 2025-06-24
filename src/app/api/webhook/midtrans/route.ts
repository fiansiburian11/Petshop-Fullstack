import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { order_id, transaction_status, fraud_status, signature_key, gross_amount, status_code } = body;

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  console.log("🔔 Webhook diterima:", {
    order_id,
    transaction_status,
    fraud_status,
    signature_key,
    expectedSignature,
  });

  if (expectedSignature !== signature_key) {
    console.warn("❌ Signature tidak valid");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  try {
    // Cek apakah order_id sudah tersimpan
    const pesanan = await prisma.pesanan.findUnique({
      where: { order_id },
    });

    if (!pesanan) {
      console.warn("❌ Pesanan dengan order_id tidak ditemukan:", order_id);
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // Ubah status berdasarkan status pembayaran
    if ((transaction_status === "capture" && fraud_status === "accept") || transaction_status === "settlement") {
      await prisma.pesanan.update({
        where: { order_id },
        data: { status: "lunas" },
      });
      console.log("✅ Status pesanan diupdate jadi 'lunas'");
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      await prisma.pesanan.update({
        where: { order_id },
        data: { status: "gagal" },
      });
      console.log("⚠️ Status pesanan diupdate jadi 'gagal'");
    } else {
      console.log("ℹ️ Status transaksi tidak mengubah status pesanan");
    }

    return NextResponse.json({ message: "Webhook diterima" });
  } catch (err) {
    console.error("❌ Gagal memproses webhook:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
