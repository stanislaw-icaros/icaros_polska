"use client";

/**
 * Dojazd do kalendarza po wejściu z linku `…/kontakt#kalendarz`.
 *
 * Przy przejściu wewnątrz strony kotwica działa sama. Przy wejściu z zewnątrz,
 * czyli z SMS-a albo z maila do leada, przeglądarka skacze do kotwicy, zanim
 * mapka i zdjęcia nad nią zdążą się ułożyć. Strona jest wtedy jeszcze krótka,
 * skok ląduje na samej górze, a po doczytaniu treści kalendarz jest już daleko
 * niżej. Dlatego poprawiamy pozycję jeszcze kilka razy, w miarę jak układ
 * się ustala.
 *
 * Poprawiamy tylko dopóki strona stoi tam, gdzie ją zostawiliśmy. Pierwsze
 * samodzielne przewinięcie oddaje sterowanie odwiedzającemu. Sprawdzamy to po
 * pozycji, a nie po zdarzeniach myszy i dotyku, bo na telefonie potrafią one
 * polecieć same i wtedy kotwica przestawała działać.
 */

import { useEffect } from "react";

/** Po ilu pikselach różnicy uznajemy, że to odwiedzający przewinął stronę. */
const TOLERANCJA = 80;

export default function KotwicaKalendarza({ id }: { id: string }) {
  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    const cel = document.getElementById(id);
    if (!cel) return;

    let gdzieZostawiono = -1;

    // `scroll-margin-top` na sekcji odsuwa ją spod przyklejonej nawigacji.
    const dojedz = () => {
      if (gdzieZostawiono >= 0 && Math.abs(window.scrollY - gdzieZostawiono) > TOLERANCJA) {
        return;
      }
      cel.scrollIntoView({ behavior: "auto", block: "start" });
      gdzieZostawiono = window.scrollY;
    };

    dojedz();
    const liczniki = [120, 400, 1000, 2000, 3500].map((zwloka) =>
      window.setTimeout(dojedz, zwloka)
    );
    window.addEventListener("load", dojedz);

    return () => {
      liczniki.forEach((licznik) => window.clearTimeout(licznik));
      window.removeEventListener("load", dojedz);
    };
  }, [id]);

  return null;
}
