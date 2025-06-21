import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Helper: generate session_id kalau belum ada
function getOrCreateSessionId() {
  const cookieStore = cookies();
  const session = cookieStore.get("session_id");

  if (session?.value) return session.value;

  const newSessionId = crypto.randomUUID();
  cookieStore.set("session_id", newSessionId, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  return newSessionId;
}

// POST /api/keranjang
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { produk_id, jumlah } = body;

    if (!produk_id || !jumlah) {
      return NextResponse.json({ error: "produk_id dan jumlah wajib diisi" }, { status: 400 });
    }

    const session_id = getOrCreateSessionId();

    // Cek apakah produk sudah ada di keranjang
    const existing = await prisma.keranjang.findFirst({
      where: {
        session_id,
        produk_id,
      },
    });

    if (existing) {
      await prisma.keranjang.update({
        where: { id: existing.id },
        data: { jumlah: existing.jumlah + jumlah },
      });
    } else {
      await prisma.keranjang.create({
        data: {
          session_id,
          produk_id,
          jumlah,
        },
      });
    }

    return NextResponse.json({ message: "Berhasil menambahkan ke keranjang" });
  } catch (error) {
    console.error("❌ Error saat tambah ke keranjang:", error); // 👈 log di console
    return NextResponse.json({ error: "Gagal memproses keranjang", detail: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
