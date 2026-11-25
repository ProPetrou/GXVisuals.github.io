import { Link } from "react-router-dom";
import { useLang } from "@/hooks/useLang";
import { Lang, localizePath, saveLangPref } from "@/lib/lang";

// Compact EN / EL switch for the standalone landing pages (no main header).
const LanguageToggle = ({ className = "" }: { className?: string }) => {
  const { lang, basePath } = useLang();
  return (
    <div className={`flex items-center gap-2 text-[11px] font-bold uppercase ${className}`}>
      {(["en", "el"] as Lang[]).map((lng) => (
        <Link
          key={lng}
          to={localizePath(basePath, lng)}
          onClick={() => saveLangPref(lng)}
          aria-current={lang === lng ? "true" : undefined}
          hrefLang={lng}
          className={lang === lng ? "text-[#00bad3]" : "text-gray-400 hover:text-white"}
        >
          {lng}
        </Link>
      ))}
    </div>
  );
};

export default LanguageToggle;
