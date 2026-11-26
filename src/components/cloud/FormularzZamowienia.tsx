"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useTryb } from "@/components/cloud/Tryb";
import { useSpamGuard } from "@/hooks/useSpamGuard";
import { odczytajUtm } from "@/lib/analytics/utm";
import { trackMetaEvent } from "@/lib/meta/track";
import { DALEJ_ETYKIETA, WARIANTY, ZAMOWIENIE, zl, type Wariant } from "@/lib/cloud/tresc";

type Pole = "ilosc" | "firma" | "imie" | "telefon" | "email" | "adres" | "zgoda";
type Bledy = Partial<Record<Pole, string>>;

const KOLEJNOSC: Pole[] = ["ilosc", "firma", "imie", "telefon", "email", "adres", "zgoda"];
const KLUCZE = Object.keys(WARIANTY) as Wariant[];

/**
 * Formularz zamówienia. Nie bierze płatności: zbiera dane do proformy
 * i zakłada deal w Pipedrive ze źródłem „Cloud", UTM i adresem wejścia.
 *
 * Każdy wariant ma własny licznik sztuk, bo siłownia może chcieć kilka
 * platform. Pola tekstowe są niekontrolowane, wartości czytamy
 * przy wysyłce. Błędy stoją przy polach, a po nieudanej próbie kursor wraca
 * do pierwszego błędnego pola.
 */
export default function FormularzZamowienia() {
  const { tryb } = useTryb();
  const [sztuki, ustawSztuki] = useState<Record<Wariant, number>>({ pakiet: 1, miesiac: 0 });
  const [bledy, ustawBledy] = useState<Bledy>({});
  const [bladWysylki, ustawBladWysylki] = useState("");
  const [wysylam, ustawWysylam] = useState(false);
  const [sukces, ustawSukces] = useState(false);
  const formularz = useRef<HTMLFormElement>(null);
  const { spamFields, getSpamSignals } = useSpamGuard();

  const razemSztuk = sztuki.pakiet + sztuki.miesiac;
  const razemNetto = KLUCZE.reduce((suma, klucz) => suma + sztuki[klucz] * WARIANTY[klucz].netto, 0);
  const razemBrutto = KLUCZE.reduce((suma, klucz) => suma + sztuki[klucz] * WARIANTY[klucz].brutto, 0);
  const razem = tryb === "netto" ? razemNetto : razemBrutto;

  function zmien(klucz: Wariant, o: number) {
    ustawSztuki((stan) => ({
      ...stan,
      [klucz]: Math.max(0, Math.min(ZAMOWIENIE.maksSztuk, stan[klucz] + o)),
    }));
  }

  async function wyslij(zdarzenie: React.FormEvent<HTMLFormElement>) {
    zdarzenie.preventDefault();
    if (wysylam) return;

    const dane = new FormData(zdarzenie.currentTarget);
    const tekst = (nazwa: string) => String(dane.get(nazwa) ?? "").trim();
    const firma = tekst("organization");
    const nip = tekst("nip");
    const imie = tekst("name");
    const telefon = tekst("tel");
    const email = tekst("email");
    const adres = tekst("address");
    const zgoda = dane.get("zgoda") === "on";

    const nowe: Bledy = {};
    if (razemSztuk < 1) nowe.ilosc = "Wybierz co najmniej jedną sztukę.";
    if (!firma) nowe.firma = "Podaj nazwę firmy albo gabinetu.";
    if (!imie) nowe.imie = "Podaj imię i nazwisko.";
    if (telefon.replace(/\D/g, "").length < 9) nowe.telefon = "Podaj numer telefonu, co najmniej 9 cyfr.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nowe.email = "Podaj adres e-mail, na który wyślemy proformę.";
    if (!adres) nowe.adres = "Podaj adres dostawy.";
    if (!zgoda) nowe.zgoda = "Zaznacz zgodę, żebyśmy mogli się skontaktować.";

    ustawBledy(nowe);
    ustawBladWysylki("");

    const pierwszy = KOLEJNOSC.find((pole) => nowe[pole]);
    if (pierwszy) {
      formularz.current?.querySelector<HTMLElement>(`[data-pole="${pierwszy}"]`)?.focus();
      return;
    }

    ustawWysylam(true);
    const { utm, wejscie } = odczytajUtm();

    try {
      const odpowiedz = await fetch("/api/pipedrive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...getSpamSignals(),
          name: imie,
          email,
          phone: telefon,
          company: firma,
          nip: nip || undefined,
          role: "Zamówienie ICAROS Cloud",
          page: wejscie ?? "/cloud",
          formSource: "cloud-zamowienie",
          leadSource: "Cloud",
          marketingConsent: false,
          utm,
          message: [
            "[ZAMÓWIENIE ICAROS CLOUD]",
            ...KLUCZE.filter((klucz) => sztuki[klucz] > 0).map(
              (klucz) => `${WARIANTY[klucz].nazwa}: ${sztuki[klucz]} szt.`
            ),
            `Razem: ${zl(razemNetto)} netto, ${zl(razemBrutto)} brutto`,
            `NIP: ${nip || "nie podano"}`,
            `Adres dostawy: ${adres}`,
          ].join("\n"),
        }),
      });

      if (!odpowiedz.ok) {
        const tresc = (await odpowiedz.json().catch(() => null)) as { error?: string } | null;
        throw new Error(tresc?.error ?? "Nie udało się wysłać zamówienia.");
      }

      trackMetaEvent("Lead", { email, phone: telefon });
      ustawSukces(true);
    } catch (wyjatek) {
      ustawBladWysylki(
        wyjatek instanceof Error
          ? `${wyjatek.message} Spróbuj jeszcze raz albo zadzwoń.`
          : "Nie udało się wysłać zamówienia. Spróbuj jeszcze raz albo zadzwoń."
      );
    } finally {
      ustawWysylam(false);
    }
  }

  if (sukces) {
    return (
      <p className="cl-sukces" role="status">
        {ZAMOWIENIE.sukces}
      </p>
    );
  }

  const opisBledu = (pole: Pole) =>
    bledy[pole] ? (
      <span className="cl-blad" id={`cl-blad-${pole}`}>
        {bledy[pole]}
      </span>
    ) : null;

  const atrybuty = (pole: Pole) => ({
    "data-pole": pole,
    "aria-invalid": bledy[pole] ? true : undefined,
    "aria-describedby": bledy[pole] ? `cl-blad-${pole}` : undefined,
  });

  return (
    <form className="cl-form" ref={formularz} onSubmit={wyslij} noValidate>
      {spamFields}

      <fieldset>
        <legend>{ZAMOWIENIE.ileNaglowek}</legend>
        <div className="cl-wariant">
          {KLUCZE.map((klucz, i) => {
            const wariant = WARIANTY[klucz];
            const ile = sztuki[klucz];
            return (
              <div className="cl-wariant__rzad" key={klucz} data-wybrany={ile > 0}>
                <div>
                  <strong>{wariant.nazwa}</strong>
                  <small>
                    {wariant.opis}
                    {wariant.dalej
                      ? `. ${DALEJ_ETYKIETA} ${zl(tryb === "netto" ? wariant.dalej.netto : wariant.dalej.brutto)} ${tryb}.`
                      : null}
                  </small>
                  <em>
                    {zl(tryb === "netto" ? wariant.netto : wariant.brutto)} {tryb}
                  </em>
                </div>
                <div className="cl-licznik" role="group" aria-label={`${wariant.nazwa}, liczba sztuk`}>
                  <button
                    type="button"
                    aria-label={`Mniej: ${wariant.nazwa}`}
                    disabled={ile <= 0}
                    onClick={() => zmien(klucz, -1)}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                  <output aria-live="polite">{ile}</output>
                  <button
                    type="button"
                    aria-label={`Więcej: ${wariant.nazwa}`}
                    disabled={ile >= ZAMOWIENIE.maksSztuk}
                    onClick={() => zmien(klucz, 1)}
                    {...(i === 0 ? atrybuty("ilosc") : {})}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {opisBledu("ilosc")}
        <p className="cl-form__razem">
          <span>
            Razem, {razemSztuk} szt.
          </span>
          <strong>
            {zl(razem)} {tryb}
          </strong>
        </p>
        <p className="cl-maly cl-form__pomoc">{ZAMOWIENIE.pomocIlosc}</p>
      </fieldset>

      <div className="cl-form__siatka">
        <label className="cl-pole">
          <span>Firma</span>
          <input name="organization" autoComplete="organization" {...atrybuty("firma")} />
          {opisBledu("firma")}
        </label>
        <label className="cl-pole">
          <span>NIP (jeśli masz)</span>
          <input name="nip" inputMode="numeric" autoComplete="off" spellCheck={false} />
        </label>
        <label className="cl-pole">
          <span>Imię i nazwisko</span>
          <input name="name" autoComplete="name" {...atrybuty("imie")} />
          {opisBledu("imie")}
        </label>
        <label className="cl-pole">
          <span>Telefon</span>
          <input name="tel" type="tel" inputMode="tel" autoComplete="tel" {...atrybuty("telefon")} />
          {opisBledu("telefon")}
        </label>
        <label className="cl-pole cl-pole--szer">
          <span>E-mail do proformy</span>
          <input name="email" type="email" autoComplete="email" spellCheck={false} {...atrybuty("email")} />
          {opisBledu("email")}
        </label>
        <label className="cl-pole cl-pole--szer">
          <span>Adres dostawy</span>
          <input name="address" autoComplete="street-address" {...atrybuty("adres")} />
          {opisBledu("adres")}
        </label>
      </div>

      <label className="cl-zgoda">
        <input type="checkbox" name="zgoda" {...atrybuty("zgoda")} />
        <span>
          {ZAMOWIENIE.zgoda}
          {opisBledu("zgoda")}
        </span>
      </label>

      {bladWysylki ? (
        <p className="cl-blad" role="alert" style={{ marginTop: 18 }}>
          {bladWysylki}
        </p>
      ) : null}

      <button type="submit" className="cl-btn cl-btn--duzy" disabled={wysylam}>
        {wysylam ? <span className="cl-kolko" aria-hidden="true" /> : null}
        Zamawiam za {zl(razem)} {tryb}
      </button>

      <p className="cl-maly cl-form__stopka">
        {ZAMOWIENIE.wstep} Administratorem danych jest LILAZEN sp. z o.o.{" "}
        <Link href="/polityka-prywatnosci">Polityka prywatności</Link>.
      </p>
    </form>
  );
}
