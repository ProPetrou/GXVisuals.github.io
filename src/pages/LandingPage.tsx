import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Send, ArrowDown } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { z } from "zod";
import { Link } from "react-router-dom";
import LanguageToggle from "@/components/LanguageToggle";
import { useLang } from "@/hooks/useLang";
import { setPageMeta } from "@/lib/seo";

import hero1 from "@/assets/portfolio-1.webp";
import hero2 from "@/assets/portfolio-2.webp";
import hero3 from "@/assets/portfolio-3.webp";
import hero4 from "@/assets/portfolio-7.webp";
import hero5 from "@/assets/portfolio-8.webp";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Page copy for /free-quote (English) and /el/free-quote (Greek).
const copy = {
  en: {
    metaTitle: "Free 3D Rendering Quote | GX Visuals Cyprus",
    metaDescription: "Request a free quote for photorealistic interior and exterior 3D renders in Cyprus. €200 per view, €250 3D modelling per project. Reply within 24 hours.",
    pricing: [
      { service: "Exterior Renders", price: "€200 / view", desc: "Photorealistic exterior views of your home, villa, or building." },
      { service: "Interior Renders", price: "€200 / view", desc: "Stunning interior visuals showcasing materials, lighting, and layout." },
      { service: "3D Modeling", price: "€250 / project", desc: "Full 3D model of your project ready for renders and walkthroughs." },
    ],
    errName: "Name is required",
    errEmail: "Invalid email",
    errMessage: "Please describe your project",
    toastCaptcha: "Please complete the captcha",
    toastSuccessTitle: "Message sent!",
    toastSuccessDesc: "We'll get back to you within 24 hours.",
    toastErrorTitle: "Something went wrong",
    toastErrorDesc: "Please try again.",
    eyebrow: "3D Rendering for Cyprus Projects",
    titleLine1: "Present Your Project",
    titleLine2: "Before It's Built",
    intro: "Interior and exterior renders for developers, architects and property professionals in Cyprus. Show your design clearly for client presentations and property marketing.",
    quoteCta: "Request a project quote",
    portfolioCta: "View portfolio",
    badges: ["Interior & Exterior Renders", "Free Quote in 24h", "Up to 3 Revisions"],
    pricingLabel: "💡 Our Pricing",
    pricingNote: "€250 modeling per project + €200 per view, plus 19% VAT. Your personalised quote confirms the scope and total before work begins.",
    formHint: "Fill the form below to get your free quote",
    formTitle: "Get a Free Quote Today",
    formSub: "Fill in 3 fields — we'll get back to you within 24 hours.",
    labelName: "Full Name *",
    labelEmail: "Email Address *",
    labelMessage: "Tell us about your project *",
    labelPhone: "Phone",
    optional: "(optional)",
    placeholderName: "John Doe",
    placeholderEmail: "john@example.com",
    placeholderMessage: "e.g. I need exterior renders for a 3-bedroom villa in Limassol...",
    sending: "Sending...",
    submit: "Get My Free Quote",
    note: "No spam. No commitment. Just a free, personalised quote.",
    recent: "Recent Projects",
    projectAlt: "GX Visuals project",
    browsing: "Still browsing? View our full portfolio first.",
    fullPortfolio: "View Full Portfolio →",
    rights: "All rights reserved.",
  },
  el: {
    metaTitle: "Δωρεάν Προσφορά για 3D Renders | GX Visuals Κύπρος",
    metaDescription: "Ζητήστε δωρεάν προσφορά για φωτορεαλιστικά εσωτερικά και εξωτερικά 3D renders στην Κύπρο. €200 ανά λήψη, €250 3D μοντελοποίηση ανά έργο. Απάντηση εντός 24 ωρών.",
    pricing: [
      { service: "Εξωτερικά Renders", price: "€200 / λήψη", desc: "Φωτορεαλιστικές εξωτερικές λήψεις για το σπίτι, τη βίλα ή το κτίριό σας." },
      { service: "Εσωτερικά Renders", price: "€200 / λήψη", desc: "Εντυπωσιακές εσωτερικές εικόνες που αναδεικνύουν υλικά, φωτισμό και διάταξη." },
      { service: "3D Μοντελοποίηση", price: "€250 / έργο", desc: "Πλήρες 3D μοντέλο του έργου σας, έτοιμο για renders και walkthroughs." },
    ],
    errName: "Το ονοματεπώνυμο είναι υποχρεωτικό",
    errEmail: "Μη έγκυρη διεύθυνση email",
    errMessage: "Παρακαλώ περιγράψτε το έργο σας",
    toastCaptcha: "Παρακαλώ συμπληρώστε το captcha",
    toastSuccessTitle: "Το μήνυμα στάλθηκε!",
    toastSuccessDesc: "Θα επικοινωνήσουμε μαζί σας εντός 24 ωρών.",
    toastErrorTitle: "Κάτι πήγε στραβά",
    toastErrorDesc: "Παρακαλώ δοκιμάστε ξανά.",
    eyebrow: "3D Renders για Έργα στην Κύπρο",
    titleLine1: "Παρουσιάστε το Έργο σας",
    titleLine2: "Πριν Χτιστεί",
    intro: "Εσωτερικά και εξωτερικά renders για developers, αρχιτέκτονες και επαγγελματίες ακινήτων στην Κύπρο. Παρουσιάστε τον σχεδιασμό σας με σαφήνεια σε πελάτες και στην προώθηση ακινήτων.",
    quoteCta: "Ζητήστε προσφορά",
    portfolioCta: "Δείτε τα έργα μας",
    badges: ["Εσωτερικά & Εξωτερικά Renders", "Δωρεάν Προσφορά σε 24 ώρες", "Έως 3 Διορθώσεις"],
    pricingLabel: "💡 Οι Τιμές μας",
    pricingNote: "€250 μοντελοποίηση ανά έργο + €200 ανά λήψη, πλέον 19% ΦΠΑ. Η εξατομικευμένη προσφορά σας επιβεβαιώνει το εύρος και το σύνολο πριν ξεκινήσει η εργασία.",
    formHint: "Συμπληρώστε τη φόρμα παρακάτω για δωρεάν προσφορά",
    formTitle: "Δωρεάν Προσφορά Σήμερα",
    formSub: "Συμπληρώστε 3 πεδία — θα σας απαντήσουμε εντός 24 ωρών.",
    labelName: "Ονοματεπώνυμο *",
    labelEmail: "Διεύθυνση Email *",
    labelMessage: "Πείτε μας για το έργο σας *",
    labelPhone: "Τηλέφωνο",
    optional: "(προαιρετικό)",
    placeholderName: "Γιώργος Παπαδόπουλος",
    placeholderEmail: "giorgos@example.com",
    placeholderMessage: "π.χ. Χρειάζομαι εξωτερικά renders για μια βίλα τριών υπνοδωματίων στη Λεμεσό...",
    sending: "Αποστολή...",
    submit: "Λήψη Δωρεάν Προσφοράς",
    note: "Χωρίς spam. Χωρίς δέσμευση. Μόνο μια δωρεάν, προσωποποιημένη προσφορά.",
    recent: "Πρόσφατα Έργα",
    projectAlt: "Έργο GX Visuals",
    browsing: "Ακόμα ψάχνετε; Δείτε πρώτα όλα μας τα έργα.",
    fullPortfolio: "Δείτε Όλα τα Έργα →",
    rights: "Όλα τα δικαιώματα διατηρούνται.",
  },
};

const LandingPage = () => {
  const { lang, lp } = useLang();
  const text = copy[lang];
  const pricing = text.pricing;

  useEffect(() => {
    setPageMeta({ title: text.metaTitle, description: text.metaDescription, path: "/free-quote", lang });
  }, [lang, text]);

  const { toast } = useToast();
  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schema = z.object({
    name: z.string().trim().min(1, text.errName),
    email: z.string().trim().email(text.errEmail),
    phone: z.string().trim().optional(),
    message: z.string().trim().min(1, text.errMessage),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!captchaToken) {
      toast({ title: text.toastCaptcha, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "dad3212c-5a89-4f2c-9d9c-ca8234e156f5",
          ...formData,
          "h-captcha-response": captchaToken,
          subject: lang === "el" ? "New Lead from Landing Page (Greek page)" : "New Lead from Landing Page",
        }),
      });

      const submission = await response.json();
      if (response.ok && submission.success === true) {
        if (typeof window.gtag === "function") {
          window.gtag("event", "conversion", {
            send_to: "AW-17899630675/vebnCKHztusbENPgmtdC",
            value: 1.0,
            currency: "EUR",
          });
        }
        toast({ title: text.toastSuccessTitle, description: text.toastSuccessDesc });
        setFormData({ name: "", email: "", phone: "", message: "" });
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast({ title: text.toastErrorTitle, description: text.toastErrorDesc, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to={lp("/")} className="font-display text-xl font-semibold">
            GX<span className="text-[#00bad3]">VISUALS</span>
          </Link>
          <div className="flex items-center gap-4">
          <LanguageToggle />
          <a
            href="tel:+35795115014"
            className="text-[#00bad3] font-body text-sm font-semibold tracking-wide hover:text-white transition-colors"
          >
            📞 +357 95 115014
          </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left */}
            <div>
              <span className="text-[#00bad3] font-body text-xs tracking-[0.3em] uppercase block mb-4">
                {text.eyebrow}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-medium leading-tight mb-4">
                {text.titleLine1}<br />
                <span className="text-[#00bad3]">{text.titleLine2}</span>
              </h1>
              <p className="text-gray-400 font-body text-base leading-relaxed mb-6">
                {text.intro}
              </p>

              <a href="#quote-form" className="inline-flex rounded-full bg-[#00bad3] px-6 py-3 mb-6 font-semibold text-white">{text.quoteCta}</a>
              <Link to={lp("/portfolio")} className="inline-flex px-4 py-3 text-[#00bad3] underline">{text.portfolioCta}</Link>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {text.badges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                    <CheckCircle2 size={14} className="text-[#00bad3]" />
                    <span className="font-body text-xs text-white">{badge}</span>
                  </div>
                ))}
              </div>

              {/* Pricing table */}
              <div className="border border-white/10 rounded-xl overflow-hidden mb-6">
                <div className="bg-white/[0.03] px-5 py-3 border-b border-white/10">
                  <p className="text-[#00bad3] font-body text-xs font-semibold tracking-widest uppercase">{text.pricingLabel}</p>
                </div>
                {pricing.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-5 py-4 ${
                      i !== pricing.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    <div>
                      <p className="text-white font-body text-sm font-semibold">{item.service}</p>
                      <p className="text-gray-500 font-body text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-[#00bad3] font-display text-base font-semibold ml-4 whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                ))}
                <div className="bg-white/[0.02] px-5 py-3 border-t border-white/10">
                  <p className="text-gray-500 font-body text-xs">
                    {text.pricingNote}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500 font-body text-xs lg:hidden">
                <ArrowDown size={14} />
                <span>{text.formHint}</span>
              </div>
            </div>

            {/* Right — Form */}
            <div id="quote-form" className="min-w-0 scroll-mt-24 bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-8">
              <p className="font-display text-xl italic text-white mb-1">{text.formTitle}</p>
              <p className="text-gray-400 font-body text-xs mb-6">{text.formSub}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="quote-name" className="block text-xs font-body text-gray-400 mb-2">{text.labelName}</label>
                  <Input id="quote-name" autoComplete="name" required name="name" value={formData.name} onChange={handleChange} placeholder={text.placeholderName} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="quote-email" className="block text-xs font-body text-gray-400 mb-2">{text.labelEmail}</label>
                  <Input id="quote-email" autoComplete="email" required name="email" type="email" value={formData.email} onChange={handleChange} placeholder={text.placeholderEmail} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="quote-message" className="block text-xs font-body text-gray-400 mb-2">{text.labelMessage}</label>
                  <Textarea id="quote-message" required name="message" value={formData.message} onChange={handleChange} placeholder={text.placeholderMessage} rows={3} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>
                <div>
                  <label htmlFor="quote-phone" className="block text-xs font-body text-gray-400 mb-2">{text.labelPhone} <span className="text-gray-600">{text.optional}</span></label>
                  <Input id="quote-phone" type="tel" autoComplete="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+357 99 123456" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>

                <div className="flex justify-center py-1">
                  <HCaptcha
                    size="compact"
                    sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                    ref={captchaRef}
                    onVerify={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken(null)}
                    languageOverride={lang}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00bad3] hover:bg-[#00bad3]/90 text-white py-6 text-sm tracking-widest uppercase font-bold flex items-center gap-2">
                  <Send size={16} />
                  {isSubmitting ? text.sending : text.submit}
                </Button>

                <p className="text-center text-gray-500 font-body text-xs">
                  {text.note}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO STRIP */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-gray-400 font-body text-xs tracking-widest uppercase mb-6">{text.recent}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[hero1, hero2, hero3, hero4, hero5].map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden">
                <img src={img} alt={`${text.projectAlt} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-gray-400 font-body text-sm mb-2">{text.browsing}</p>
        <Link to={lp("/portfolio")} className="text-[#00bad3] font-body text-sm underline hover:text-white transition-colors">
          {text.fullPortfolio}
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-6 border-t border-white/5 text-center">
        <p className="text-gray-600 font-body text-xs">© 2026 GXVisuals. {text.rights}</p>
      </footer>

    </div>
  );
};

export default LandingPage;
