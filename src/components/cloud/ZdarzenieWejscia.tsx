"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta/track";

/**
 * Wejście na landing jako zdarzenie ViewContent (Pixel i CAPI ze wspólnym
 * event_id). Bez zgody marketingowej trackMetaEvent nic nie wysyła.
 */
export default function ZdarzenieWejscia() {
  useEffect(() => {
    trackMetaEvent("ViewContent");
  }, []);
  return null;
}
