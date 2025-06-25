import SuksesPage from "@/components/SuksesPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">⏳ Memuat halaman...</p>}>
      <SuksesPage />
    </Suspense>
  );
}
