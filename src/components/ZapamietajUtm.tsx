"use client";

import { useEffect } from "react";
import { zapamietajUtm } from "@/lib/analytics/utm";

/** Zapisuje UTM z adresu wejścia, żeby dotarły do formularza na innej podstronie. */
export default function ZapamietajUtm() {
  useEffect(() => {
    zapamietajUtm();
  }, []);
  return null;
}
