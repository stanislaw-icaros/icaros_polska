import Image from "next/image";
import Link from "next/link";
import FilmOkno from "@/components/cloud/FilmOkno";
import Zrodlo from "@/components/cloud/Zrodlo";
import { Kwota, KwotaDruga, NazwaTrybu, PrzelacznikTrybu } from "@/components/cloud/Tryb";
import { COMPANY_NAME } from "@/lib/legal";
import {
  BADANIA,
  CENY,
  CTA,
  CTA_DRUGIE,
  DALEJ_ETYKIETA,
  DANE,
  GRY,
  PAKIET,
  PYTANIA,
  SESJA,
  WARIANTY,
  WARUNKI,
} from "@/lib/cloud/tresc";

export function Gry() {
  return (
    <section className="cl-sek" aria-labelledby="cl-gry">
      <div className="cl-w">
        <h2 className="cl-h2" id="cl-gry">
          {GRY.naglowek}
        </h2>
        <p className="cl-lead">{GRY.tekst}</p>
        <ul className="cl-gry__rzad">
          {GRY.lista.map((gra) => (
            <li key={gra.src}>
              <Image src={gra.src} alt={gra.alt} width={1000} height={850} sizes="(max-width: 900px) 64vw, 24vw" />
              <p translate="no">{gra.nazwa}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Sesja() {
  return (
    <section className="cl-sek" aria-labelledby="cl-sesja">
      <div className="cl-w">
        <h2 className="cl-h2" id="cl-sesja">
          {SESJA.naglowek}
        </h2>
        <div className="cl-sesja__uklad">
          <FilmOkno />
          <ol className="cl-kroki">
            {SESJA.kroki.map((krok) => (
              <li key={krok.tytul}>
                <h3 className="cl-h3">{krok.tytul}</h3>
                <p>{krok.tekst}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * Pakiet: co w nim jest, co dokładamy, cena. Każda pozycja to nazwa i jedno
 * zdanie szczegółu. Dodatki stoją w osobnym panelu ze znakiem plus, żeby było
 * widać, że to coś ponad zestaw ze zdjęcia. Wariant z aplikacją na miesiąc
 * stoi osobno na samym końcu, pod ceną, żeby dodatki nie wyglądały na jego
 * część. Pod nim jest opłata za kolejne miesiące: po niej widać, ile daje
 * licencja dożywotnia z pakietu.
 */
export function Pakiet() {
  return (
    <section className="cl-sek" id="pakiet" aria-labelledby="cl-pakiet">
      <div className="cl-w">
        <h2 className="cl-h2" id="cl-pakiet">
          {PAKIET.naglowek}
        </h2>

        <div className="cl-pakiet__uklad">
          <Image
            className="cl-pakiet__zdjecie"
            src={PAKIET.zdjecie.src}
            alt={PAKIET.zdjecie.alt}
            width={2000}
            height={1600}
            sizes="(max-width: 900px) 100vw, 56vw"
          />
          <div>
            <ul className="cl-poz">
              {PAKIET.lista.map((pozycja) => (
                <li key={pozycja.nazwa}>
                  <strong>{pozycja.nazwa}</strong>
                  <span>{pozycja.opis}</span>
                </li>
              ))}
            </ul>
            <div className="cl-bonus">
              <h3 className="cl-h3">{PAKIET.dodatkiNaglowek}</h3>
              <ul className="cl-poz cl-poz--plus">
                {PAKIET.dodatki.map((pozycja) => (
                  <li key={pozycja.nazwa}>
                    <strong>{pozycja.nazwa}</strong>
                    <span>{pozycja.opis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="cl-cena">
          <div>
            <p className="cl-cena__kwota">
              <Kwota netto={CENY.pakietNetto} brutto={CENY.pakietBrutto} />
              <small>
                <NazwaTrybu />
              </small>
            </p>
            <p className="cl-cena__druga">
              <KwotaDruga netto={CENY.pakietNetto} brutto={CENY.pakietBrutto} />
            </p>
          </div>
          <div className="cl-cena__akcje">
            <PrzelacznikTrybu etykieta="Cena pakietu netto albo brutto" />
            {/* Po tym atrybucie dok poznaje, że na ekranie jest już przycisk zamówienia. */}
            <a className="cl-btn cl-btn--duzy" href="#zamowienie" data-cl-cena>
              {CTA}
            </a>
            <a className="cl-link" href="#kalendarz">
              {CTA_DRUGIE}
            </a>
          </div>
        </div>

        <p className="cl-pakiet__sam">
          <strong>{WARIANTY.miesiac.nazwa}</strong>
          <em>
            <Kwota netto={CENY.cloudMiesiacNetto} brutto={CENY.cloudMiesiacBrutto} /> <NazwaTrybu />
          </em>
          <span>
            {WARIANTY.miesiac.opis}. {DALEJ_ETYKIETA}{" "}
            <Kwota netto={CENY.appMiesiacNetto} brutto={CENY.appMiesiacBrutto} /> <NazwaTrybu />.
          </span>
        </p>
      </div>
    </section>
  );
}

/** Wykres z kropek: każda kropka to jedna osoba z badania. */
function Osoby({ wszystkich, wyroznionych, podpis }: { wszystkich: number; wyroznionych: number; podpis: string }) {
  return (
    <div className="cl-osoby">
      <div className="cl-osoby__kropki" role="img" aria-label={podpis}>
        {Array.from({ length: wszystkich }, (_, i) => (
          <span key={i} data-tak={i < wyroznionych} />
        ))}
      </div>
      <p aria-hidden="true">{podpis}</p>
    </div>
  );
}

/** Dwa słupki w tej samej skali: przed i po. */
function Slupki({
  przed,
  po,
  etykietaPrzed,
  etykietaPo,
}: {
  przed: number;
  po: number;
  etykietaPrzed: string;
  etykietaPo: string;
}) {
  const najwiecej = Math.max(przed, po);
  return (
    <div className="cl-slupki" role="img" aria-label={`${etykietaPrzed} i ${etykietaPo.toLowerCase()}: słupek dłuższy o 15,85%`}>
      <p>
        <span>{etykietaPrzed}</span>
        <i style={{ width: `${(przed / najwiecej) * 100}%` }} />
      </p>
      <p data-po="true">
        <span>{etykietaPo}</span>
        <i style={{ width: `${(po / najwiecej) * 100}%` }} />
      </p>
    </div>
  );
}

/**
 * Dwa wyniki jako dwa panele: liczba, jedno zdanie i wykres, po którym widać,
 * jak mała była próba. Źródło jest pod przyciskiem, żeby nie robiło szumu.
 */
export function Badania() {
  return (
    <section className="cl-sek" aria-labelledby="cl-badania">
      <div className="cl-w">
        <h2 className="cl-h2" id="cl-badania">
          {BADANIA.naglowek}
        </h2>
        <div className="cl-bad__siatka">
          {BADANIA.wyniki.map((wynik) => (
            <article className="cl-bad__panel" key={wynik.liczba}>
              <div className="cl-bad__gora">
                <p className="cl-bad__liczba">{wynik.liczba}</p>
                <Zrodlo instytucja={wynik.instytucja} szczegoly={wynik.szczegoly} />
              </div>
              <p className="cl-bad__opis">{wynik.opis}</p>
              {wynik.wykres.typ === "osoby" ? (
                <Osoby
                  wszystkich={wynik.wykres.wszystkich}
                  wyroznionych={wynik.wykres.wyroznionych}
                  podpis={wynik.wykres.podpis}
                />
              ) : (
                <Slupki
                  przed={wynik.wykres.przed}
                  po={wynik.wykres.po}
                  etykietaPrzed={wynik.wykres.etykietaPrzed}
                  etykietaPo={wynik.wykres.etykietaPo}
                />
              )}
            </article>
          ))}
        </div>
        <ul className="cl-bad__wyr">
          {BADANIA.wyroznienia.map((pozycja) => (
            <li key={pozycja.nazwa}>
              <strong>{pozycja.nazwa}</strong> {pozycja.szczegol}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Rzut z góry i z boku z liniami wymiarowymi, tabela danych, a pod nimi
 * na całą szerokość Cloud oparty o ścianę. Zdjęcia Clouda stojącego pionowo
 * producent nie ma, więc to ten sam wycinek co rzut z góry, postawiony
 * na linii podłogi: tak wygląda platforma oparta o ścianę dłuższym bokiem.
 */
export function Dane() {
  return (
    <section className="cl-sek" aria-labelledby="cl-dane">
      <div className="cl-w">
        <h2 className="cl-h2" id="cl-dane">
          {DANE.naglowek}
        </h2>
        <div className="cl-dane__uklad">
          <div>
            <figure className="cl-rys">
              <Image
                src="/cloud/platforma-plan.webp"
                alt={`Platforma ICAROS Cloud z góry: długość ${DANE.wymiary.dlugosc}, szerokość ${DANE.wymiary.szerokosc}`}
                width={1600}
                height={1220}
                sizes="(max-width: 900px) 86vw, 48vw"
              />
              <div className="cl-wymiar cl-wymiar--poziom" aria-hidden="true">
                <span>{DANE.wymiary.dlugosc}</span>
              </div>
              <div className="cl-wymiar cl-wymiar--pion" aria-hidden="true">
                <span>{DANE.wymiary.szerokosc}</span>
              </div>
            </figure>
            <figure className="cl-rys cl-rys--bok">
              <Image
                src="/cloud/platforma-bok.webp"
                alt={`Platforma ICAROS Cloud z boku: wysokość ${DANE.wymiary.wysokosc}`}
                width={2000}
                height={406}
                sizes="(max-width: 900px) 86vw, 48vw"
              />
              <div className="cl-wymiar cl-wymiar--pion" aria-hidden="true">
                <span>{DANE.wymiary.wysokosc}</span>
              </div>
            </figure>
          </div>

          {/* Role są jawne, bo na telefonie wiersze dostają display: flex,
              a część przeglądarek gubi wtedy strukturę tabeli. */}
          <table className="cl-tabela" role="table">
            <tbody role="rowgroup">
              {DANE.tabela.map((wiersz) => (
                <tr key={wiersz.etykieta} role="row">
                  <th scope="row" role="rowheader">
                    {wiersz.etykieta}
                  </th>
                  <td role="cell">{wiersz.wartosc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <figure className="cl-stoi">
            <div className="cl-stoi__scena">
              <div className="cl-stoi__sciana">
                <Image
                  src="/cloud/platforma-plan.webp"
                  alt={DANE.przySciane.alt}
                  width={1600}
                  height={1220}
                  sizes="(max-width: 900px) 58vw, 30vw"
                />
                {/* Odbicie w podłodze, jak na pierwszym ekranie: po nim widać, że platforma stoi. */}
                <div className="cl-stoi__odbicie" aria-hidden="true">
                  <Image
                    src="/cloud/platforma-plan.webp"
                    alt=""
                    width={1600}
                    height={1220}
                    sizes="(max-width: 900px) 58vw, 30vw"
                  />
                </div>
              </div>
              <figcaption>{DANE.przySciane.podpis}</figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

/**
 * Zwrot jako główny argument: trzy kroki na osi czasu, warunki pod rozwijaną
 * listą, a dostawa, licencja i montaż niżej jako zwykłe fakty.
 */
export function Warunki() {
  return (
    <section className="cl-gw" aria-labelledby="cl-warunki">
      <div className="cl-w">
        <h2 className="cl-h2" id="cl-warunki">
          {WARUNKI.naglowek} <span className="cl-akcent">{WARUNKI.naglowekAkcent}</span>
        </h2>
        <p className="cl-lead">{WARUNKI.tekst}</p>

        <ol className="cl-gw__os">
          {WARUNKI.kroki.map((krok) => (
            <li key={krok.kiedy}>
              <strong>{krok.kiedy}</strong>
              <span>{krok.co}</span>
            </li>
          ))}
        </ol>

        <details className="cl-gw__warunki">
          <summary>{WARUNKI.warunkiNaglowek}</summary>
          <ul>
            {WARUNKI.warunki.map((warunek) => (
              <li key={warunek}>{warunek}</li>
            ))}
          </ul>
        </details>

        <div className="cl-war__siatka">
          {WARUNKI.bloki.map((blok) => (
            <div className="cl-war__blok" key={blok.tytul}>
              <h3 className="cl-h3">{blok.tytul}</h3>
              <ul>
                {blok.punkty.map((punkt) => (
                  <li key={punkt}>{punkt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pytania() {
  return (
    <section className="cl-sek cl-pyt" aria-labelledby="cl-pytania">
      <div className="cl-w cl-pyt__uklad">
        <h2 className="cl-h2" id="cl-pytania">
          {PYTANIA.naglowek}
        </h2>
        <div>
          {PYTANIA.lista.map((pozycja) => (
            <details key={pozycja.pytanie}>
              <summary>{pozycja.pytanie}</summary>
              <p>{pozycja.odpowiedz}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stopka() {
  return (
    <footer className="cl-stopka">
      <div className="cl-w cl-stopka__w">
        <p>
          {COMPANY_NAME}, oficjalny dystrybutor ICAROS w Polsce. ICAROS Cloud to sprzęt treningowy.
        </p>
        <nav aria-label="Stopka">
          <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
          <a href="https://www.icaros.com.pl">icaros.com.pl</a>
        </nav>
      </div>
    </footer>
  );
}
