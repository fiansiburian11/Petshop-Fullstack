import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { produkSchema } from "@/lib/validators/produk";
import { createClient } from "@supabase/supabase-js";

// ⛔ Wajib karena kita handle file manual
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET semua produk

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const search = searchParams.get("search") || "";

    const limit = limitParam ? parseInt(limitParam) : 10;

    const produk = await prisma.produk.findMany({
      where: {
        nama: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: limit,
    });

    return NextResponse.json(
      {
        message: "Berhasil mengambil produk",
        data: produk,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Gagal mengambil produk",
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 }
    );
  }
}

// POST tambah produk + upload gambar
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const nama = formData.get("nama")?.toString();
    const harga = Number(formData.get("harga"));
    const stok = Number(formData.get("stok"));
    const description = String(formData.get("description"));
    const gambar = formData.get("gambar") as File;

    if (!nama || !harga || !stok || !gambar) {
      return NextResponse.json({ error: "Semua field dan gambar wajib diisi" }, { status: 400 });
    }

    // Validasi pakai produkSchema
    const parsed = produkSchema.safeParse({
      nama,
      harga,
      description,
      stok,
    });

    if (!parsed.success) {
      console.log("Zod error:", parsed.error.errors);
      return NextResponse.json({ error: "Validasi gagal", detail: parsed.error.errors }, { status: 400 });
    }

    // Upload ke Supabase
    const arrayBuffer = await gambar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `produk/${Date.now()}-${gambar.name}`;

    const { error: uploadError } = await supabase.storage.from("produk").upload(filename, buffer, {
      contentType: gambar.type,
    });

    if (uploadError) {
      return NextResponse.json({ error: "Gagal upload gambar", detail: uploadError.message }, { status: 500 });
    }

    const { data: publicURL } = supabase.storage.from("produk").getPublicUrl(filename);

    // Simpan ke database
    const produkBaru = await prisma.produk.create({
      data: {
        nama,
        harga,
        description,
        stok,
        gambar_url: publicURL.publicUrl,
      },
    });

    return NextResponse.json(produkBaru, { status: 201 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Gagal menambahkan produk", detail: errorMessage }, { status: 500 });
  }
}
