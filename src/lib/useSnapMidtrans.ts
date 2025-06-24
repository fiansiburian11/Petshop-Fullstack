// import { toast } from "sonner";

// export const useSnapMidtrans = () => {
//   const payWithSnap = (token: string) => {
//     const snapWindow = window.snap || (window as any).snap;
//     if (!snapWindow) return toast.error("Snap belum dimuat");

//     setTimeout(() => {
//       snapWindow.pay(token, {
//         onSuccess: (result: any) => {
//           toast.success("Pembayaran berhasil!");
//           window.location.href = `/keranjang/pembayaran/sukses?order_id=${result.order_id}`;
//         },
//         onPending: (result: any) => {
//           toast("Menunggu pembayaran...");
//           window.location.href = `/keranjang/pembayaran/sukses?order_id=${result.order_id}`;
//         },
//         onError: () => toast.error("Pembayaran gagal"),
//         onClose: () => toast("Kamu menutup popup tanpa membayar."),
//       });
//     }, 100);
//   };

//   return { payWithSnap };
// };

import { toast } from "sonner";

// Definisikan tipe hasil pembayaran Midtrans Snap
type SnapResult = {
  order_id: string;
  [key: string]: unknown;
};

// Definisikan tipe Snap jika belum ada di global
type SnapType = {
  pay: (
    token: string,
    callbacks: {
      onSuccess?: (result: SnapResult) => void;
      onPending?: (result: SnapResult) => void;
      onError?: () => void;
      onClose?: () => void;
    }
  ) => void;
};

export const useSnapMidtrans = () => {
  const payWithSnap = (token: string) => {
    // Hilangkan 'any' dengan type assertion SnapType
    const snapWindow = (window as { snap?: SnapType }).snap;

    if (!snapWindow) return toast.error("Snap belum dimuat");

    setTimeout(() => {
      snapWindow.pay(token, {
        onSuccess: (result) => {
          toast.success("Pembayaran berhasil!");
          window.location.href = `/keranjang/pembayaran/sukses?order_id=${result.order_id}`;
        },
        onPending: (result) => {
          toast("Menunggu pembayaran...");
          window.location.href = `/keranjang/pembayaran/sukses?order_id=${result.order_id}`;
        },
        onError: () => toast.error("Pembayaran gagal"),
        onClose: () => toast("Kamu menutup popup tanpa membayar."),
      });
    }, 100);
  };

  return { payWithSnap };
};
