import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single product
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const produk = await prisma.produk.findUnique({
    where: { id },
  });

  if (!produk) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(produk);
}

// UPDATE produk
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { nama, harga, stok, gambar_url } = await req.json();

  try {
    const updated = await prisma.produk.update({
      where: { id },
      data: { nama, harga, stok, gambar_url },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update produk" }, { status: 500 });
  }
}

// DELETE produk
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    await prisma.produk.delete({ where: { id } });
    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus produk" }, { status: 500 });
  }
}
