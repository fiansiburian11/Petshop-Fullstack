import { z } from "zod";

export const produkSchema = z.object({
  id: z.number().optional(),
  nama: z.string().min(1, "Nama tidak boleh kosong"),
  harga: z.number().positive("Harga harus lebih dari 0"),
  stok: z.number().nonnegative("Stok tidak boleh negatif"),
  gambar_url: z.string().url("URL gambar tidak valid").optional(),
});

export type ProdukInput = z.infer<typeof produkSchema>;
