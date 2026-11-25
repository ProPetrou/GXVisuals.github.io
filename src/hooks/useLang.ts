import { useLocation } from "react-router-dom";
import { Lang, langFromPath, localizePath, stripLang } from "@/lib/lang";

// Current language plus helpers for building links that stay in that language.
export const useLang = () => {
  const { pathname } = useLocation();
  const lang: Lang = langFromPath(pathname);
  const basePath = stripLang(pathname);
  return {
    lang,
    basePath,
    isHome: basePath === "/",
    lp: (path: string) => localizePath(path, lang),
  };
};
