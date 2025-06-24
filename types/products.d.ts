export type Product = {
  id: number;
  nama: string;
  description?: string | null;
  harga: number;
  stok: number;
  gambar_url: string;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
};