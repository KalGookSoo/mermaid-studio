"use client";

import { useEffect } from "react";
import { getLogger } from "../logger";

const logger = getLogger("pwa");

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
        .then((registration) => logger.info("service-worker.registered", { scope: registration.scope }))
        .catch((error) => logger.error("service-worker.registration-failed", error));
    };
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
