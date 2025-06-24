"use client";

import Script from "next/script";

export default function SnapScript() {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  return <Script id="midtrans-script" src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={clientKey} strategy="afterInteractive" />;
}
