import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Greek <head> for /el pages. Crawlers and link previews that don't run
// JavaScript read this static HTML, so /el needs its own copy.
const GREEK_SEO_BLOCK = `<!-- seo:start (Greek) -->
    <title>GXVISUALS | 3D Αρχιτεκτονική Απεικόνιση Κύπρος</title>
    <meta name="description" content="GXVISUALS – Φωτορεαλιστικά 3D renders για αρχιτέκτονες, developers & interior designers στην Κύπρο, Ελλάδα και Ηνωμένο Βασίλειο. Ζητήστε προσφορά σήμερα." />
    <link rel="canonical" href="https://www.gxvisuals.com/el" />
    <link rel="alternate" hreflang="en" href="https://www.gxvisuals.com/" />
    <link rel="alternate" hreflang="el" href="https://www.gxvisuals.com/el" />
    <link rel="alternate" hreflang="x-default" href="https://www.gxvisuals.com/" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.gxvisuals.com/el" />
    <meta property="og:site_name" content="GX Visuals" />
    <meta property="og:title" content="GXVISUALS | 3D Αρχιτεκτονική Απεικόνιση" />
    <meta property="og:description" content="Φωτορεαλιστικά 3D renders για αρχιτέκτονες, developers και interior designers στην Κύπρο, Ελλάδα και Ηνωμένο Βασίλειο." />
    <meta property="og:image" content="https://www.gxvisuals.com/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="el_GR" />
    <meta property="og:locale:alternate" content="en_GB" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="GXVISUALS | 3D Αρχιτεκτονική Απεικόνιση" />
    <meta name="twitter:description" content="Φωτορεαλιστικά 3D renders για αρχιτέκτονες, developers και interior designers στην Κύπρο, Ελλάδα και Ηνωμένο Βασίλειο." />
    <!-- seo:end -->`;

// After the build, write dist/el/index.html: the same app with a Greek <head>.
// vercel.json serves it for /el and every /el/... route.
const greekHtml = (): Plugin => {
  let outDir = "dist";
  return {
    name: "gx-greek-html",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const source = fs.readFileSync(path.join(outDir, "index.html"), "utf-8");
      const seoBlock = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
      if (!seoBlock.test(source)) throw new Error("gx-greek-html: seo markers missing from index.html");
      const greek = source
        .replace(seoBlock, GREEK_SEO_BLOCK)
        .replace(/<html lang="en">/, '<html lang="el">');
      fs.mkdirSync(path.join(outDir, "el"), { recursive: true });
      fs.writeFileSync(path.join(outDir, "el", "index.html"), greek);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), greekHtml(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
