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
  const body = await req.json();

  try {
    const updated = await prisma.produk.update({
      where: { id },
      data: {
        nama: body.nama,
        harga: Number(body.harga),
        stok: Number(body.stok),
        description: body.description,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err: "Gagal update" }, { status: 500 });
  }
}


// DELETE produk
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    // Cek apakah produk digunakan dalam PesananDetail
    const sedangDipakai = await prisma.pesananDetail.findFirst({
      where: { produk_id: id },
    });

    if (sedangDipakai) {
      return NextResponse.json({ error: "Produk tidak bisa dihapus karena sudah digunakan dalam pesanan." }, { status: 400 });
    }

    await prisma.produk.delete({ where: { id } });
    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus produk" }, { status: 500 });
  }
}

