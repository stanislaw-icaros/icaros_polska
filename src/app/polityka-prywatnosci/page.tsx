import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "@/components/LegalPageLayout";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_NAME,
  DISCLAIMER_MEDICAL_DEVICES,
  KRS,
  LAST_UPDATED,
  NIP,
  REGON,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Polityka prywatności | ICAROS Polska",
  description:
    "Zasady przetwarzania danych osobowych w serwisie ICAROS Polska prowadzonym przez PCStore Sp. z o.o.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Polityka prywatności"
      title="Jak przetwarzamy dane osobowe w ICAROS Polska"
      summary="Ten dokument opisuje, kto jest administratorem danych, w jakich celach przetwarzamy informacje przekazywane przez formularze i pliki cookies oraz jakie prawa przysługują użytkownikom serwisu."
    >
      <section>
        <p>
          <strong>Data ostatniej aktualizacji:</strong> {LAST_UPDATED}
        </p>
        <p>
          <strong>Informacja o wyrobach medycznych:</strong> {DISCLAIMER_MEDICAL_DEVICES}
        </p>
      </section>

      <section>
        <h2>1. Administrator danych</h2>
        <p>
          Administratorem danych osobowych jest <strong>{COMPANY_NAME}</strong>, {COMPANY_ADDRESS}, wpisana do
          Krajowego Rejestru Sądowego pod numerem <strong>{KRS}</strong>, NIP <strong>{NIP}</strong>, REGON{" "}
          <strong>{REGON}</strong>.
        </p>
        <p>
          We wszystkich sprawach związanych z ochroną danych można skontaktować się z nami pod adresem{" "}
          <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>2. Zakres danych, które możemy przetwarzać</h2>
        <p>W zależności od sposobu korzystania z serwisu możemy przetwarzać w szczególności:</p>
        <ul>
          <li>dane identyfikacyjne i kontaktowe, takie jak imię i nazwisko, adres e-mail, numer telefonu;</li>
          <li>dane firmowe, takie jak nazwa placówki, firma, NIP, stanowisko lub rola zawodowa;</li>
          <li>treść wiadomości przesyłanych przez formularze kontaktowe;</li>
          <li>
            dane dotyczące zapytania ofertowego lub kalkulacji, np. typ placówki, liczba godzin pracy, liczba dni,
            przyjęte parametry ROI i informacje przekazane w formularzu;
          </li>
          <li>
            dane techniczne i analityczne, takie jak adres IP, identyfikatory online, dane o urządzeniu, dane o
            przeglądarce, przybliżona lokalizacja, źródło wejścia, parametry UTM, odsłony i zdarzenia w serwisie;
          </li>
          <li>informacje zapisywane w plikach cookies lub podobnych technologiach.</li>
        </ul>
      </section>

      <section>
        <h2>3. Cele i podstawy prawne przetwarzania</h2>
        <p>Dane osobowe mogą być przetwarzane w następujących celach:</p>
        <ul>
          <li>
            <strong>obsługa zapytań i kontaktu handlowego</strong> - na podstawie art. 6 ust. 1 lit. b lub f RODO,
            gdy odpowiadamy na wiadomości, umawiamy prezentację, przedstawiamy ofertę albo prowadzimy rozmowy
            dotyczące wdrożenia rozwiązań ICAROS;
          </li>
          <li>
            <strong>prowadzenie i rozwijanie relacji biznesowych w CRM</strong> - na podstawie art. 6 ust. 1 lit. f
            RODO, czyli naszego prawnie uzasadnionego interesu polegającego na organizacji procesu sprzedaży,
            obsłudze leadów i dokumentowaniu historii kontaktu;
          </li>
          <li>
            <strong>przesyłanie materiałów edukacyjnych, informacji handlowych lub newslettera</strong> - na
            podstawie zgody, art. 6 ust. 1 lit. a RODO, jeśli użytkownik wyrazi odrębną zgodę marketingową;
          </li>
          <li>
            <strong>analityka, statystyka i rozwój serwisu</strong> - na podstawie zgody lub naszego prawnie
            uzasadnionego interesu, zależnie od rodzaju narzędzia i zakresu danych, w celu mierzenia ruchu, jakości
            kampanii oraz poprawy treści i działania strony;
          </li>
          <li>
            <strong>marketing i remarketing</strong> - na podstawie zgody, jeśli korzystamy z narzędzi reklamowych
            lub pikseli marketingowych;
          </li>
          <li>
            <strong>ustalenie, dochodzenie lub obrona roszczeń</strong> - na podstawie art. 6 ust. 1 lit. f RODO;
          </li>
          <li>
            <strong>wykonanie obowiązków prawnych</strong> - na podstawie art. 6 ust. 1 lit. c RODO, jeżeli wynika to
            z przepisów prawa.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Formularze kontaktowe i kalkulator ROI</h2>
        <p>
          Dane przesłane przez formularze na stronie głównej oraz na landing page kalkulatora ROI są wykorzystywane do
          kontaktu zwrotnego, przygotowania prezentacji, omówienia oferty oraz zapisania historii zgłoszenia w
          systemach sprzedażowych i komunikacyjnych.
        </p>
        <p>
          W przypadku kalkulatora ROI możemy dodatkowo zapisać parametry wpisane lub wybrane przez użytkownika, a także
          wynik kalkulacji, aby lepiej przygotować rozmowę i dopasować odpowiedź do realiów danej placówki.
        </p>
      </section>

      <section>
        <h2>5. Cookies, technologie podobne i narzędzia analityczne</h2>
        <p>
          Serwis wykorzystuje pliki cookies oraz technologie podobne do zapewnienia działania strony, zapamiętywania
          wyborów użytkownika, prowadzenia pomiaru statystycznego, obsługi osadzonych treści oraz wsparcia działań
          marketingowych.
        </p>
        <p>
          Szczegółowe informacje o rodzajach cookies, czasie przechowywania oraz sposobie zarządzania zgodami znajdują
          się w dokumencie <Link href="/polityka-cookies">Polityka cookies</Link>.
        </p>
      </section>

      <section>
        <h2>6. Odbiorcy danych i wykorzystywane narzędzia</h2>
        <p>
          Dane mogą być powierzane podmiotom, które wspierają nas w prowadzeniu serwisu, komunikacji, marketingu,
          analizie lub obsłudze sprzedaży. Na dzień publikacji polityki mogą to być w szczególności:
        </p>
        <ul>
          <li>
            <strong>Pipedrive</strong> - system CRM do obsługi leadów, historii kontaktu, szans sprzedażowych i
            organizacji procesu handlowego;
          </li>
          <li>
            <strong>MailerLite</strong> - narzędzie do wysyłki wiadomości e-mail, newsletterów oraz treści edukacyjnych,
            jeżeli użytkownik wyrazi zgodę na taki kontakt;
          </li>
          <li>
            <strong>Resend</strong> - infrastruktura wysyłki wiadomości transakcyjnych i potwierdzeń e-mail;
          </li>
          <li>
            <strong>Google Analytics</strong> - narzędzie analityczne do badania ruchu i zachowań użytkowników;
          </li>
          <li>
            <strong>Meta Pixel</strong> - narzędzie marketingowe służące do pomiaru skuteczności kampanii reklamowych,
            remarketingu i atrybucji konwersji;
          </li>
          <li>
            <strong>Vercel Analytics</strong> - rozwiązanie do analizy ruchu i wydajności serwisu;
          </li>
          <li>
            <strong>YouTube</strong> - dostawca osadzonych materiałów wideo;
          </li>
          <li>
            dostawcy hostingu, usług IT, wsparcia technicznego, bezpieczeństwa oraz kancelarie lub podmioty doradcze,
            jeśli będzie to niezbędne do realizacji celu przetwarzania.
          </li>
        </ul>
        <p>
          Zakres przekazywanych danych zależy od funkcji danego narzędzia, roli odbiorcy oraz ustawień zgody
          użytkownika.
        </p>
      </section>

      <section>
        <h2>7. Przekazywanie danych poza Europejski Obszar Gospodarczy</h2>
        <p>
          Niektórzy dostawcy usług mogą przetwarzać dane poza EOG, w szczególności w Stanach Zjednoczonych. W takim
          przypadku dokładamy starań, aby przekazanie odbywało się zgodnie z prawem, w oparciu o odpowiednie mechanizmy
          legalizujące, takie jak decyzja stwierdzająca odpowiedni stopień ochrony, standardowe klauzule umowne lub
          inne instrumenty dopuszczone przez RODO.
        </p>
      </section>

      <section>
        <h2>8. Okres przechowywania danych</h2>
        <ul>
          <li>dane kontaktowe i handlowe przechowujemy przez czas obsługi zapytania i dalszej relacji biznesowej;</li>
          <li>
            dane w CRM możemy przechowywać przez okres niezbędny do prowadzenia działań sprzedażowych oraz przez czas
            przedawnienia ewentualnych roszczeń;
          </li>
          <li>
            dane przetwarzane na podstawie zgody przechowujemy do czasu jej wycofania lub utraty przydatności celu;
          </li>
          <li>
            dane statystyczne i cookies przechowujemy przez okres właściwy dla danego narzędzia lub do czasu usunięcia
            cookies przez użytkownika;
          </li>
          <li>dane wymagane przez przepisy prawa przechowujemy przez okres wskazany w tych przepisach.</li>
        </ul>
      </section>

      <section>
        <h2>9. Prawa osoby, której dane dotyczą</h2>
        <p>Każdej osobie przysługuje prawo do:</p>
        <ul>
          <li>dostępu do danych;</li>
          <li>sprostowania danych;</li>
          <li>usunięcia danych;</li>
          <li>ograniczenia przetwarzania;</li>
          <li>przenoszenia danych, jeżeli podstawą jest zgoda lub umowa;</li>
          <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie;</li>
          <li>wycofania zgody w dowolnym momencie, bez wpływu na zgodność z prawem wcześniejszego przetwarzania;</li>
          <li>
            wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, jeśli użytkownik uzna, że dane są
            przetwarzane niezgodnie z prawem.
          </li>
        </ul>
      </section>

      <section>
        <h2>10. Dobrowolność podania danych</h2>
        <p>
          Podanie danych jest co do zasady dobrowolne, ale w niektórych przypadkach niezbędne do udzielenia odpowiedzi,
          umówienia prezentacji, przesłania materiałów, przygotowania oferty lub skorzystania z wybranych funkcji
          serwisu.
        </p>
      </section>

      <section>
        <h2>11. Zautomatyzowane podejmowanie decyzji</h2>
        <p>
          Co do zasady nie podejmujemy wobec użytkowników decyzji wywołujących skutki prawne wyłącznie w sposób
          zautomatyzowany. Możemy natomiast korzystać z narzędzi analitycznych lub marketingowych wspierających ocenę
          skuteczności kampanii, segmentację odbiorców lub pomiar konwersji.
        </p>
      </section>

      <section>
        <h2>12. Zmiany polityki prywatności</h2>
        <p>
          Polityka prywatności może być aktualizowana w razie zmiany przepisów, sposobu działania serwisu albo
          wykorzystywanych narzędzi. Aktualna wersja jest zawsze publikowana na tej stronie wraz z datą ostatniej
          aktualizacji.
        </p>
      </section>
    </LegalPageLayout>
  );
}
