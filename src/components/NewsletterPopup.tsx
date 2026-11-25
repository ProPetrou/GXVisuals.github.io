import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const FORM_ID = "bqxzo7";

// Sender renders its form as a bordered card inside a same-origin iframe.
// The dialog is already the card, so strip Sender's own frame to avoid a
// "window within a window" look.
const IFRAME_CSS = `
  .sender-form-box {
    border: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
`;

const styleSenderIframe = (iframe: HTMLIFrameElement) => {
  const doc = iframe.contentDocument;
  if (!doc?.head || doc.getElementById("gx-sender-overrides")) return;
  const style = doc.createElement("style");
  style.id = "gx-sender-overrides";
  style.textContent = IFRAME_CSS;
  doc.head.appendChild(style);
};

// Sender owns the contents of the empty form container.
const NewsletterForm = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const senderWindow = window as Window & {
      senderFormsLoaded?: boolean;
      senderForms?: { render: (id: string) => void; destroy: (id: string) => void };
    };
    const render = () => senderWindow.senderForms?.render(FORM_ID);
    window.addEventListener("onSenderFormsLoaded", render);
    if (senderWindow.senderFormsLoaded) render();

    // Restyle the iframe whenever Sender (re)creates or reloads it.
    const container = containerRef.current;
    const applyStyles = () => {
      container?.querySelectorAll("iframe").forEach((iframe) => {
        styleSenderIframe(iframe);
        iframe.addEventListener("load", () => styleSenderIframe(iframe));
      });
    };
    const observer = new MutationObserver(applyStyles);
    if (container) observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("onSenderFormsLoaded", render);
      senderWindow.senderForms?.destroy(FORM_ID);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        style={{ textAlign: "left" }}
        className="sender-form-field flex w-full justify-center"
        data-sender-form-id={FORM_ID}
      />
      <a
        href={`https://stats.sender.net/forms/${FORM_ID}/view`}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-5 text-xs text-gray-500 underline underline-offset-4 hover:text-gray-800"
      >
        Form not loading? Open it in a new tab
      </a>
    </div>
  );
};

// Mounted above the routes: closing persists during client-side navigation.
const NewsletterPopup = () => {
  const { pathname, search } = useLocation();
  const isQuotePage = ["/free-quote", "/cyprus", "/uk"].includes(pathname.replace(/\/$/, ""));
  const params = new URLSearchParams(search);
  const isPaidVisit = ["gclid", "gbraid", "wbraid"].some((key) => params.has(key)) ||
    ["cpc", "ppc", "paid", "paid_search"].includes(params.get("utm_medium")?.toLowerCase() || "");
  const [open, setOpen] = useState(() => !isQuotePage && !isPaidVisit);
  useEffect(() => {
    if (isQuotePage || isPaidVisit) setOpen(false);
  }, [isQuotePage, isPaidVisit]);
  if (isQuotePage || isPaidVisit) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="block w-[calc(100%-2rem)] max-w-[424px] overflow-hidden rounded-xl border-0 bg-white p-0 text-black shadow-2xl [&>button]:right-3 [&>button]:top-3 [&>button]:flex [&>button]:h-8 [&>button]:w-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:text-gray-500 [&>button:hover]:bg-gray-100 [&>button:hover]:text-black"
      >
        <DialogTitle className="sr-only">Subscribe to the GX Visuals newsletter</DialogTitle>
        <div className="max-h-[90dvh] overflow-y-auto overscroll-contain">
          <NewsletterForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;
