import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { langFromPath, localizePath, readLangPref, stripLang } from "@/lib/lang";

// Pages where a Greek-speaking first-time visitor is sent to the Greek version.
// Ad landing pages are left alone so the ad's final URL is always respected.
const AUTO_REDIRECT_PATHS = ["/", "/portfolio"];
const PAID_PARAMS = ["gclid", "gbraid", "wbraid"];

// Keeps i18next and <html lang> in step with the URL (/el = Greek) and only
// renders the pages once the language matches, so nothing renders in the
// language of the previous page.
const LanguageSync = ({ children }: { children: ReactNode }) => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const checkedRedirect = useRef(false);
  const lang = langFromPath(pathname);

  useLayoutEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [i18n, lang]);

  // One-time redirect for Greek browsers that land on an English page and have
  // never picked a language. Search crawlers use English, so they are unaffected.
  useEffect(() => {
    if (checkedRedirect.current) return;
    checkedRedirect.current = true;
    if (lang !== "en" || !AUTO_REDIRECT_PATHS.includes(pathname)) return;
    if (readLangPref()) return;
    const params = new URLSearchParams(search);
    if (PAID_PARAMS.some((key) => params.has(key))) return;
    const browserLang = (navigator.languages?.[0] || navigator.language || "").toLowerCase();
    if (!browserLang.startsWith("el")) return;
    navigate(localizePath(stripLang(pathname), "el") + search + hash, { replace: true });
  }, [hash, lang, navigate, pathname, search]);

  return i18n.language === lang ? <>{children}</> : null;
};

export default LanguageSync;
