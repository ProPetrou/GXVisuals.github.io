// The URL decides the language: English lives at the root, Greek under /el.
export type Lang = "en" | "el";

export const SITE_URL = "https://www.gxvisuals.com";

// Pages that exist in both languages. Anything else (e.g. /uk) is English only.
export const BILINGUAL_PATHS = ["/", "/portfolio", "/free-quote", "/cyprus"];

export const langFromPath = (pathname: string): Lang =>
  pathname === "/el" || pathname.startsWith("/el/") ? "el" : "en";

// "/el/portfolio" -> "/portfolio", "/el" -> "/", "/portfolio" -> "/portfolio"
export const stripLang = (pathname: string): string => {
  if (langFromPath(pathname) === "en") return pathname;
  return pathname.slice(3) || "/";
};

// Adds the /el prefix for Greek. Accepts paths with a hash, e.g. "/#about".
export const localizePath = (path: string, lang: Lang): string => {
  const hashIndex = path.indexOf("#");
  const base = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
  if (lang === "en") return (base || "/") + hash;
  const prefixed = base === "/" || base === "" ? "/el" : `/el${base}`;
  return prefixed + hash;
};

export const hasGreekVersion = (path: string) =>
  BILINGUAL_PATHS.includes(stripLang(path).replace(/(.)\/$/, "$1"));

export const LANG_PREF_KEY = "gx_lang";

export const readLangPref = (): Lang | null => {
  try {
    const value = localStorage.getItem(LANG_PREF_KEY);
    return value === "en" || value === "el" ? value : null;
  } catch {
    return null;
  }
};

export const saveLangPref = (lang: Lang) => {
  try {
    localStorage.setItem(LANG_PREF_KEY, lang);
  } catch {
    // Storage can be blocked; the URL still carries the language.
  }
};
