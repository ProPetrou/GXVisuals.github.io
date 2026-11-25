import { useTranslation } from "react-i18next";

const Process = () => {
  const { t } = useTranslation();
  const steps = [1, 2, 3, 4].map((number) => ({
    number: String(number),
    title: t(`process_${number}_title`),
    description: t(`process_${number}_desc`),
  }));

  return (
    <section className="bg-[#0A0A0A] py-16 text-white">
      <div className="container mx-auto px-6 text-center">
        <span className="text-primary text-xs tracking-[0.3em] font-body uppercase mb-4 block">
          {t("process_eyebrow")}
        </span>
        <h2 className="text-4xl md:text-5xl font-display mb-12 italic">{t("process_title")}</h2>
        <div className="relative">
          {/* Connecting line desktop only */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[1px] bg-primary/20" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border border-primary/40 bg-[#0A0A0A] flex items-center justify-center mb-6 group hover:border-primary transition-colors duration-500">
                  <span className="text-primary font-display text-xl group-hover:scale-110 transition-transform">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-display mb-3 italic">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
