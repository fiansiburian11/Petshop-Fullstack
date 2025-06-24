"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

const SessionInitializer = () => {
  useEffect(() => {
    let sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);
    }

    // Simpan juga di cookie (agar bisa dibaca dari API route di server)
    if (!Cookies.get("session_id")) {
      Cookies.set("session_id", sessionId, { expires: 7 }); // expires 7 hari
    }
  }, []);

  return null;
};

export default SessionInitializer;
