"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const roleOptions = [
  { value: "owner", label: "Właściciel placówki" },
  { value: "manager", label: "Dyrektor / kierownik" },
  { value: "therapist", label: "Terapeuta / fizjoterapeuta" },
  { value: "investor", label: "Inwestor" },
  { value: "other", label: "Inne" },
];

export default function ContactCTA() {
  const { ref, isVisible } = useScrollAnimation();
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    nip: "",
    email: "",
    phone: "",
    role: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const utm = {
        utm_source: searchParams.get("utm_source") || undefined,
        utm_medium: searchParams.get("utm_medium") || undefined,
        utm_campaign: searchParams.get("utm_campaign") || undefined,
        utm_content: searchParams.get("utm_content") || undefined,
      };

      const response = await fetch("/api/pipedrive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          leadSource: "Formularz WWW",
          formSource: "Strona główna — formularz główny",
          page: window.location.pathname,
          utm,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Nie udało się wysłać formularza.");
      }

      setSubmitted(true);
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : "Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoleLabel = roleOptions.find((o) => o.value === formState.role)?.label;

  return (
    <section id="kontakt" ref={ref} className="py-28 lg:py-40 bg-white relative overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-foreground/30">
              Kontakt
            </p>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.03em] text-foreground leading-[1.1]">
              Porozmawiajmy
              <br />o Twojej placówce
            </h2>
            <p className="mt-5 text-[16px] text-foreground/40 leading-[1.8]">
              Umów bezpłatną prezentację online lub rozmowę konsultacyjną.
              Pokażemy Ci, jak ICAROS może wzmocnić Twoją ofertę terapeutyczną
              i&nbsp;wygenerować nowe źródło przychodów.
            </p>

            <div className="mt-12 space-y-5">
              {[
                "Prezentacja dopasowana do Twojego profilu",
                "Kalkulacja zwrotu z inwestycji",
                "Bez zobowiązań — zerowy koszt",
                "Odpowiedzi na wszystkie pytania techniczne",
              ].map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full" />
                  </div>
                  <span className="text-[14px] text-foreground/40">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 pt-8 border-t border-foreground/[0.06] space-y-4">
              <p className="text-[10px] text-foreground/20 uppercase tracking-[0.2em] font-medium">
                Lub skontaktuj się bezpośrednio
              </p>
              <a href="mailto:kontakt@icaros.com.pl" className="text-[15px] text-foreground font-medium hover:opacity-70 transition-opacity duration-300">
                kontakt@icaros.com.pl
              </a>
              <p className="text-[14px] text-foreground/30">
                ICAROS Polska — Oficjalny dystrybutor
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 border border-foreground/[0.06] bg-surface">
                <div className="w-12 h-12 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-[22px] font-bold text-foreground tracking-[-0.02em]">Dziękujemy</h3>
                <p className="mt-3 text-[14px] text-foreground/35 leading-[1.7]">
                  Otrzymaliśmy Twoje zgłoszenie. Odezwiemy się w ciągu 24 godzin.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 lg:p-12 border border-foreground/[0.06] bg-white"
              >
                <h3 className="text-[20px] font-bold text-foreground tracking-[-0.02em] mb-1">
                  Umów prezentację
                </h3>
                <p className="text-[13px] text-foreground/30 mb-10">
                  Wypełnij formularz, a odezwiemy się w ciągu 24 godzin.
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-medium text-foreground/50 mb-2 tracking-[0.02em]">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-0 py-3 border-0 border-b border-foreground/[0.08] bg-transparent text-[14px] text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-foreground/30 transition-colors duration-500"
                        placeholder="Jan Kowalski"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-foreground/50 mb-2 tracking-[0.02em]">
                        Placówka / firma *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.company}
                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        className="w-full px-0 py-3 border-0 border-b border-foreground/[0.08] bg-transparent text-[14px] text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-foreground/30 transition-colors duration-500"
                        placeholder="Nazwa placówki"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-medium text-foreground/50 mb-2 tracking-[0.02em]">
                        NIP firmy
                      </label>
                      <input
                        type="text"
                        value={formState.nip}
                        onChange={(e) => setFormState({ ...formState, nip: e.target.value })}
                        className="w-full px-0 py-3 border-0 border-b border-foreground/[0.08] bg-transparent text-[14px] text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-foreground/30 transition-colors duration-500"
                        placeholder="000-000-00-00"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-foreground/50 mb-2 tracking-[0.02em]">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-0 py-3 border-0 border-b border-foreground/[0.08] bg-transparent text-[14px] text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-foreground/30 transition-colors duration-500"
                        placeholder="jan@klinika.pl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-medium text-foreground/50 mb-2 tracking-[0.02em]">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-0 py-3 border-0 border-b border-foreground/[0.08] bg-transparent text-[14px] text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-foreground/30 transition-colors duration-500"
                        placeholder="+48 ..."
                      />
                    </div>
                    <div ref={dropdownRef} className="relative">
                      <label className="block text-[12px] font-medium text-foreground/50 mb-2 tracking-[0.02em]">
                        Twoja rola
                      </label>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full px-0 py-3 border-0 border-b border-foreground/[0.08] bg-transparent text-[14px] text-left focus:outline-none focus:border-foreground/30 transition-colors duration-500 flex items-center justify-between"
                      >
                        <span className={selectedRoleLabel ? "text-foreground" : "text-foreground/15"}>
                          {selectedRoleLabel || "Wybierz..."}
                        </span>
                        <svg
                          className={`w-4 h-4 text-foreground/25 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-foreground/[0.08] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)]"
                          >
                            {roleOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormState({ ...formState, role: option.value });
                                  setDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-[14px] transition-colors duration-200 ${
                                  formState.role === option.value
                                    ? "bg-foreground text-white"
                                    : "text-foreground/60 hover:bg-foreground/[0.03] hover:text-foreground"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-foreground/50 mb-2 tracking-[0.02em]">
                      Wiadomość
                    </label>
                    <textarea
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-0 py-3 border-0 border-b border-foreground/[0.08] bg-transparent text-[14px] text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-foreground/30 transition-colors duration-500 resize-none"
                      placeholder="Powiedz nam więcej o swojej placówce i potrzebach..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-white text-[14px] font-semibold hover:opacity-90 transition-all duration-500 mt-4"
                    style={{ background: "linear-gradient(135deg, #ff6600, #ff7b1f)" }}
                  >
                    {isSubmitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
                  </button>

                  {submitError ? (
                    <p className="text-[12px] text-red-600 text-center leading-relaxed">
                      {submitError}
                    </p>
                  ) : null}

                  <p className="text-[11px] text-foreground/20 text-center leading-relaxed">
                    Twoje dane są bezpieczne. Używamy ich wyłącznie w celu kontaktu
                    w&nbsp;sprawie prezentacji ICAROS.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
