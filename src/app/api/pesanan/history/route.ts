import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("order_id") || "";

  const data = await prisma.pesanan.findMany({
    where: {
      status: "lunas",
      order_id: {
        contains: search,
      },
    },
    include: {
      Detail: {
        include: {
          Produk: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return NextResponse.json({ data });
}
