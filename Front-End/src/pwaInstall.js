import { useEffect, useState } from "react";
import { MdDownload } from "react-icons/md";

function isStandaloneApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function registerServiceWorker() {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
    return;
  }
  window.addEventListener("load", () => {
    const path = `${process.env.PUBLIC_URL || ""}/sw.js`;
    navigator.serviceWorker.register(path).catch(() => {});
  });
}

export function InstallAppButton({ variant = "nav" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandaloneApp()) {
      return undefined;
    }
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  useEffect(() => {
    const onInstalled = () => {
      setDeferredPrompt(null);
      setShow(false);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  const onInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show || !deferredPrompt) {
    return null;
  }

  const className =
    variant === "login" ? "pwa-install-btn pwa-install-btn--login" : "pwa-install-btn";

  return (
    <button type="button" className={className} onClick={onInstall}>
      <MdDownload className="pwa-install-btn__icon" aria-hidden />
      Installer l&apos;application
    </button>
  );
}
