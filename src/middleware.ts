import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;

    const isLoginPage = path === "/admin/petshop/login";

    // Jika user belum login atau bukan admin → redirect
    if (path.startsWith("/admin") && !isLoginPage) {
      const user = req.nextauth.token;

      if (!user || user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.redirect(new URL("/admin/petshop/login", req.url));
      }
    }

    // Selain itu lanjutkan biasa
    return NextResponse.next();
  },
  {
    callbacks: {
      // Middleware hanya aktif jika user login (token tersedia)
      authorized: () => true,
    },
  }
);

// Jalankan middleware hanya untuk route admin
export const config = {
  matcher: ["/admin/:path*"],
};
