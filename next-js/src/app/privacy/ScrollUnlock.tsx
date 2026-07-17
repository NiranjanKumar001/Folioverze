"use client";

import { useEffect } from "react";

export default function ScrollUnlock() {
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }, []);

  return null;
}
