import { Lang, SITE_URL, hasGreekVersion, localizePath, stripLang } from "@/lib/lang";

type PageMeta = {
  title: string;
  description: string;
  // Path without the language prefix, e.g. "/portfolio".
  path: string;
  lang: Lang;
};

const setMeta = (selector: string, value: string) => {
  document.querySelector(selector)?.setAttribute("content", value);
};

const absolute = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

// Keeps <head> in step with the current page and language so Google sees the
// right title, canonical URL and hreflang alternates for /, /el, etc.
export const setPageMeta = ({ title, description, path, lang }: PageMeta) => {
  const basePath = stripLang(path);
  const canonical = absolute(localizePath(basePath, lang));

  document.title = title;
  document.documentElement.lang = lang;
  setMeta("meta[name='description']", description);
  setMeta("meta[property='og:title']", title);
  setMeta("meta[property='og:description']", description);
  setMeta("meta[property='og:url']", canonical);
  setMeta("meta[property='og:locale']", lang === "el" ? "el_GR" : "en_GB");
  setMeta("meta[name='twitter:title']", title);
  setMeta("meta[name='twitter:description']", description);
  document.querySelector("link[rel='canonical']")?.setAttribute("href", canonical);

  document.querySelectorAll("link[rel='alternate'][hreflang]").forEach((link) => link.remove());
  const alternates: [string, string][] = [["en", absolute(basePath)]];
  if (hasGreekVersion(basePath)) alternates.push(["el", absolute(localizePath(basePath, "el"))]);
  alternates.push(["x-default", absolute(basePath)]);
  alternates.forEach(([hreflang, href]) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = hreflang;
    link.href = href;
    document.head.appendChild(link);
  });
};
