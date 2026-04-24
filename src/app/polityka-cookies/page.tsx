import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY_EMAIL, COMPANY_NAME, DISCLAIMER_COOKIES, LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Polityka cookies | ICAROS Polska",
  description:
    "Informacje o plikach cookies, pikselach, narzędziach analitycznych i zarządzaniu zgodą w serwisie ICAROS Polska.",
};

export default function CookiesPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Polityka cookies"
      title="Jak wykorzystujemy cookies i podobne technologie"
      summary="Na tej stronie opisujemy, jakie rodzaje cookies i innych technologii śledzących mogą być używane w serwisie ICAROS Polska, do jakich celów służą oraz jak można zarządzać zgodą."
    >
      <section>
        <p>
          <strong>Data ostatniej aktualizacji:</strong> {LAST_UPDATED}
        </p>
        <p>
          Serwis prowadzony przez <strong>{COMPANY_NAME}</strong> może używać plików cookies, local storage,
          identyfikatorów urządzeń, pikseli pomiarowych oraz skryptów analitycznych i marketingowych.
        </p>
        <p>
          <strong>Ważne:</strong> {DISCLAIMER_COOKIES}
        </p>
      </section>

      <section>
        <h2>1. Czym są cookies</h2>
        <p>
          Cookies to niewielkie informacje tekstowe zapisywane na urządzeniu użytkownika podczas korzystania ze strony.
          Mogą być odczytywane przez nasz serwis lub przez dostawców technologii, z których korzystamy. Podobną funkcję
          mogą pełnić także local storage, znaczniki pikselowe, skrypty i identyfikatory reklamowe.
        </p>
      </section>

      <section>
        <h2>2. Kategorie stosowanych technologii</h2>
        <h3>Niezbędne</h3>
        <p>
          Są konieczne do prawidłowego działania strony, bezpieczeństwa, zapamiętania podstawowych ustawień oraz
          obsługi zgody cookies. Tych technologii nie da się wyłączyć bez utraty podstawowych funkcji serwisu.
        </p>

        <h3>Analityczne</h3>
        <p>
          Umożliwiają mierzenie ruchu, źródeł odwiedzin, zachowań użytkowników, jakości treści oraz wydajności strony.
          Do tej kategorii mogą należeć m.in. <strong>Google Analytics</strong> oraz{" "}
          <strong>Vercel Analytics</strong>.
        </p>

        <h3>Marketingowe</h3>
        <p>
          Służą do mierzenia skuteczności kampanii reklamowych, remarketingu, budowania grup odbiorców i śledzenia
          konwersji. Do tej kategorii może należeć m.in. <strong>Meta Pixel</strong>.
        </p>

        <h3>Treści zewnętrzne</h3>
        <p>
          Są wykorzystywane do wyświetlania materiałów dostarczanych przez podmioty trzecie, np. osadzonych filmów,
          widgetów lub innych zasobów zewnętrznych. W naszym serwisie dotyczy to w szczególności materiałów
          wideo z <strong>YouTube</strong>.
        </p>
      </section>

      <section>
        <h2>3. Do czego wykorzystujemy cookies i podobne technologie</h2>
        <ul>
          <li>zapamiętanie ustawień zgody użytkownika;</li>
          <li>utrzymanie bezpieczeństwa i integralności serwisu;</li>
          <li>analizę ruchu i skuteczności treści lub kampanii;</li>
          <li>mierzenie konwersji formularzy i kontaktów handlowych;</li>
          <li>obsługę materiałów wideo lub innych treści pochodzących od podmiotów trzecich;</li>
          <li>rozwój funkcjonalności strony i optymalizację doświadczenia użytkownika.</li>
        </ul>
      </section>

      <section>
        <h2>4. Narzędzia, które mogą zapisywać lub odczytywać dane</h2>
        <ul>
          <li>
            <strong>Google Analytics</strong> - analiza ruchu, statystyk odwiedzin, źródeł wejścia i zachowań na
            stronie;
          </li>
          <li>
            <strong>Meta Pixel</strong> - pomiar konwersji, remarketing, analiza skuteczności działań reklamowych w
            ekosystemie Meta;
          </li>
          <li>
            <strong>Vercel Analytics</strong> - agregowane statystyki ruchu i wydajności serwisu;
          </li>
          <li>
            <strong>YouTube</strong> - odtwarzanie osadzonych materiałów wideo, co może wiązać się z zapisem cookies
            przez dostawcę;
          </li>
          <li>
            mechanizmy własne serwisu, w tym zapis ustawień bannera cookies i preferencji użytkownika.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Cookies a formularze i CRM</h2>
        <p>
          Gdy użytkownik przesyła formularz, możemy połączyć dane z formularza z informacjami o źródle wizyty, kampanii
          lub parametrach UTM. Dane te mogą następnie trafić do systemu CRM <strong>Pipedrive</strong>, aby umożliwić
          obsługę zapytania i ocenę skuteczności działań marketingowych.
        </p>
        <p>
          Jeżeli użytkownik wyrazi zgodę marketingową, dane kontaktowe mogą zostać wykorzystane również w systemach do
          komunikacji e-mail, takich jak <strong>MailerLite</strong>, a wiadomości techniczne lub potwierdzające mogą
          być wysyłane z wykorzystaniem <strong>Resend</strong>.
        </p>
      </section>

      <section>
        <h2>6. Zarządzanie zgodą</h2>
        <p>
          Przy pierwszej wizycie wyświetlamy baner cookies, który pozwala zaakceptować wszystkie kategorie albo zapisać
          wybrane preferencje. Do czasu podjęcia decyzji dostęp do treści serwisu jest ograniczony przez warstwę
          informacyjną.
        </p>
        <p>
          Zgodę można również zmienić lub wycofać później, usuwając cookies z przeglądarki lub kontaktując się z nami
          pod adresem <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>. W przyszłości możemy także udostępnić
          bezpośredni przycisk ponownego otwarcia ustawień zgody.
        </p>
      </section>

      <section>
        <h2>7. Jak wyłączyć cookies w przeglądarce</h2>
        <p>
          Użytkownik może zarządzać cookies także z poziomu ustawień swojej przeglądarki. W zależności od używanego
          urządzenia można ograniczyć zapisywanie cookies, usunąć dotychczasowe pliki lub zablokować wybrane
          technologie. Należy jednak pamiętać, że wyłączenie części cookies może wpłynąć na poprawne działanie strony.
        </p>
      </section>

      <section>
        <h2>8. Okres przechowywania</h2>
        <p>
          Czas przechowywania cookies zależy od ich rodzaju i dostawcy. Część cookies działa wyłącznie podczas sesji,
          a część pozostaje na urządzeniu do momentu wygaśnięcia lub usunięcia przez użytkownika. Ustawienia zgody mogą
          być przechowywane przez okres niezbędny do respektowania wyboru użytkownika i zapewnienia zgodności serwisu.
        </p>
      </section>

      <section>
        <h2>9. Zmiany polityki cookies</h2>
        <p>
          Niniejsza polityka może być aktualizowana, jeśli zmieni się sposób działania strony, dostawcy narzędzi lub
          przepisy prawa. Aktualna wersja jest zawsze dostępna na tej stronie.
        </p>
      </section>
    </LegalPageLayout>
  );
}
