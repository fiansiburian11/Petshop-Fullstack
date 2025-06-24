// import { PrismaClient } from "@prisma/client";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function POST() {
//   try {
//     const session_id = cookies().get("session_id")?.value;

//     if (!session_id) {
//       return NextResponse.json({ error: "Session ID tidak ditemukan" }, { status: 400 });
//     }

//     // Ambil isi keranjang
//     const keranjang = await prisma.keranjang.findMany({
//       where: { session_id },
//       include: { Produk: true },
//     });

//     if (!keranjang.length) {
//       return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
//     }

//     // Hitung total
//     const total_harga = keranjang.reduce((total, item) => {
//       return total + item.jumlah * item.Produk.harga;
//     }, 0);

//     // Buat pesanan baru
//     const pesanan = await prisma.pesanan.create({
//       data: {
//         session_id,
//         total_harga,
//         Detail: {
//           create: keranjang.map((item) => ({
//             produk_id: item.produk_id,
//             jumlah: item.jumlah,
//             subtotal: item.jumlah * item.Produk.harga,
//           })),
//         },
//       },
//       include: {
//         Detail: {
//           include: { Produk: true },
//         },
//       },
//     });

//     // Kosongkan keranjang
//     await prisma.keranjang.deleteMany({
//       where: { session_id },
//     });

//     return NextResponse.json({
//       message: "Checkout berhasil",
//       pesanan,
//     });
//   } catch (error) {
//     console.error("❌ Gagal checkout:", error);
//     return NextResponse.json({ error: "Terjadi kesalahan saat proses checkout" }, { status: 500 });
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { keranjang_id, jumlah } = body;

//     if (!keranjang_id || !jumlah) {
//       return NextResponse.json({ error: "keranjang_id dan jumlah wajib diisi" }, { status: 400 });
//     }

//     await prisma.keranjang.update({
//       where: { id: keranjang_id },
//       data: { jumlah },
//     });

//     return NextResponse.json({ message: "Jumlah berhasil diperbarui" });
//   } catch (error) {
//     console.error("❌ Error PUT keranjang:", error);
//     return NextResponse.json({ error: "Gagal update jumlah", detail: error instanceof Error ? error.message : error }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { keranjang_id } = body;

//     if (!keranjang_id) {
//       return NextResponse.json({ error: "keranjang_id wajib diisi" }, { status: 400 });
//     }

//     await prisma.keranjang.delete({
//       where: { id: keranjang_id },
//     });

//     return NextResponse.json({ message: "Berhasil menghapus item dari keranjang" });
//   } catch (error) {
//     console.error("❌ Error DELETE keranjang:", error);
//     return NextResponse.json({ error: "Gagal menghapus item", detail: error instanceof Error ? error.message : error }, { status: 500 });
//   }
// }

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const session_id = cookies().get("session_id")?.value;

    if (!session_id) {
      return NextResponse.json({ error: "Session ID tidak ditemukan" }, { status: 400 });
    }

    // Ambil isi keranjang + produk
    const keranjang = await prisma.keranjang.findMany({
      where: { session_id },
      include: { Produk: true },
    });

    if (keranjang.length === 0) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }

    // ✅ Validasi stok cukup
    for (const item of keranjang) {
      if (!item.Produk) continue;
      if (item.jumlah > item.Produk.stok) {
        return NextResponse.json(
          {
            error: `Stok produk ${item.Produk.nama} tidak mencukupi`,
          },
          { status: 400 }
        );
      }
    }

    // Hitung total harga
    const total_harga = keranjang.reduce((total, item) => {
      return total + item.jumlah * (item.Produk?.harga || 0);
    }, 0);

    // ✅ Buat pesanan & detail
    const pesanan = await prisma.pesanan.create({
      data: {
        session_id,
        total_harga,
        Detail: {
          create: keranjang.map((item) => ({
            produk_id: item.produk_id,
            jumlah: item.jumlah,
            subtotal: item.jumlah * (item.Produk?.harga || 0),
          })),
        },
      },
      include: {
        Detail: { include: { Produk: true } },
      },
    });

    // ✅ Kurangi stok produk
    for (const item of keranjang) {
      await prisma.produk.update({
        where: { id: item.produk_id },
        data: {
          stok: {
            decrement: item.jumlah,
          },
        },
      });
    }

    // ✅ Kosongkan keranjang
    await prisma.keranjang.deleteMany({ where: { session_id } });

    return NextResponse.json({
      message: "Checkout berhasil",
      pesanan,
    });
  } catch (error) {
    console.error("❌ Gagal checkout:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat proses checkout" }, { status: 500 });
  }
}
