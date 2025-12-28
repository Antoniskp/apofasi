import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    const handleInternalLinkClick = (event) => {
      const anchor = event.target.closest("a");

      if (!anchor || event.defaultPrevented) return;

      const url = new URL(anchor.href, window.location.origin);
      const isInternal = url.origin === window.location.origin;
      const opensInNewTab = anchor.target && anchor.target !== "_self";
      const isDownload = anchor.hasAttribute("download");

      if (!isInternal || opensInNewTab || isDownload) return;

      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    document.addEventListener("click", handleInternalLinkClick);

    return () => document.removeEventListener("click", handleInternalLinkClick);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash, search]);

  return null;
}
