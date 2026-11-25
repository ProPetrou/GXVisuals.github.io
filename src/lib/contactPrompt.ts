export const CONTACT_PROMPT_EVENT = "open-mobile-contact-prompt";

export const isMobileViewport = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

export const openMobileContactPrompt = () => {
  window.dispatchEvent(new Event(CONTACT_PROMPT_EVENT));
};

export const scrollToContactForm = () => {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
};

// The contact form only lives on the homepage. From other pages (e.g.
// /portfolio), go to the homepage's contact section instead; ContactForm
// scrolls itself into view when the URL hash is #contact.
const goToHomepageContact = () => {
  const { pathname } = window.location;
  const home = pathname === "/el" || pathname.startsWith("/el/") ? "/el" : "/";
  window.history.pushState(null, "", `${home}#contact`);
  // React Router's BrowserRouter listens for popstate and renders the new URL.
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const openContactFromCta = () => {
  if (isMobileViewport()) {
    openMobileContactPrompt();
    return;
  }

  if (document.getElementById("contact")) {
    scrollToContactForm();
  } else {
    goToHomepageContact();
  }
};
