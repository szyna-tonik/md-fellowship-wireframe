# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Jedyny odbiorca, pod którego projektujemy: **kandydat_ka na Startup Discovery Sprint**. Osoba w wieku 18–24 lata, która chce zbudować własną firmę. Najczęściej trafia na stronę z reelsa na Instagramie i ogląda ją na telefonie. Często nie ma pomysłu, zespołu ani umiejętności programowania; część ma już startup i chce sprawdzić, czy rozwiązuje prawdziwy problem. Aplikuje solo albo w parze.

Jej zadanie na stronie: w kilka sekund zrozumieć, co to za program i czy jest dla niej, rozwiać obiekcje („nie mam pomysłu”, „nie umiem kodować”, „nie mam zespołu”, „nie mam doświadczenia”) i kliknąć **Aplikuj**.

Inni czytelnicy (rodzice, partnerzy, mentorzy, ruch z polecenia) nie są brani pod uwagę przy decyzjach.

## Product Purpose

Landing page programu **Startup Discovery Sprint** prowadzonego przez MD Fellowship. Program uczy customer discovery: jak prowadzić rozmowy z klientami, odróżniać „lekarstwo” od „witaminy”, pisać wiadomości, na które ktoś odpisze, i stawiać MVP w kilka godzin.

Przebieg:
- 12–13 listopada 2026: dwa dni stacjonarnie na Google for Startups Campus Warsaw (prelekcje founderów, praca własna, konsultacje z mentorami),
- kolejne 4 tygodnie: rozmowy z klientami w terenie, grupa na WhatsAppie, kilka spotkań online (min. 10 godzin tygodniowo),
- 13 grudnia: zakończenie; każdy, kto ukończy program, trafia od razu do 2. etapu rekrutacji do MD Fellowship.

**Sukces = jak najwięcej zgłoszeń, jak najwcześniej.** Nabór w trzech rundach: early bird do 19.10, regular do 26.10, last call do 3.11.2026 (od 2026-10-07; przy przyciskach Aplikuj „Deadline early bird: 19.10”), miejsc jest 120, więc strona ma skłaniać do aplikowania od razu.

## Positioning

Program robi MD Fellowship: społeczność osób 18–24, które już budują firmy, z mentoringiem 1:1 od przedsiębiorców, którzy przeszli drogę od pomysłu do globalnego sukcesu. Hasło: „Nie robimy konkursów. Pomagamy serio budować firmy.”

Czym różni się od innych inicjatyw startupowych: to miesiąc praktyki w terenie (dzwonisz do prawdziwych ludzi), a nie konkurs, hackathon ani kurs. Prowadzą go ludzie, którzy sami budowali firmy. Jest bezpłatny, a ukończenie daje fast-track do MD Fellowship.

## Operating Context

- Ruch: kampania reelsów na Instagramie. Te same reelsy są na stronie (sekcja „Zobacz, jak robili to inni”), żeby osoba z reelsa zobaczyła te same twarze. Większość wejść z telefonu.
- Copy jest zaakceptowane przez klienta i pochodzi z jego dokumentu (`../materials/MD Discovery Sprint.md`). Zmian w treści nie wprowadzamy na własną rękę.
- Klient ocenia stronę przez link GitHub Pages (tonik.github.io/md-fellowship-wireframe/design.html). `index.html` (wireframe) zostaje pod dotychczasowym adresem.
- Publikacja: gałąź + PR w obu repo (`origin` osobiste, `tonik`); w orgu tonik main tylko przez PR, merge na wyraźną zgodę.

## Capabilities and Constraints

- Strona statyczna: `design.html` z CSS/JS inline i modułami w `design-assets/js/`; działa tylko przez serwer (`python3 -m http.server 4173`).
- Język: wyłącznie polski (`lang="pl"`).
- **Aplikuj** prowadzi do zewnętrznego formularza (Typeform/Tally/Google Forms itp.). Link jeszcze nieznany; do tego czasu CTA to kotwice.
- Fakty programu: bezpłatny; 120 miejsc; nabór w trzech rundach (early bird 19.10, regular 26.10, last call 3.11; przy każdym przycisku Aplikuj „Deadline early bird: 19.10”); dojazd i nocleg po stronie uczestnika; decyzja przychodzi mailem na adres ze zgłoszenia.
- Nie komunikujemy wymogu „80% obecności” (decyzja klienta): każdy, kto ukończy, idzie do 2. etapu rekrutacji.
- Otwarte decyzje: czy można uczestniczyć tylko online; tematy prelekcji; lista prelegentów; los sekcji finałowego CTA (obecnie dubluje CTA z „Dla kogo”).

## Brand Commitments

- Nazwy: **MD Fellowship** (organizator), **Startup Discovery Sprint** (program), uczestnicy MD to „Fellows”.
- Głos: luźny, konkretny, jak rozmowa z founderem, nie jak regulamin instytucji startupowej. Klient odcina się od sztywnego, korporacyjnego tonu.
- Zwroty do czytelnika wielką literą: „Ci / Cię / Twój” (decyzja klienta z 2026-10-02, zastępuje wcześniejszą zasadę małej litery).
- Formy neutralne płciowo (bez „byłeś”, „obecny”, „sam”).
- Logo MD: `design-assets/logo-md.svg`. Partner miejsca: Google for Startups Campus.
- Warstwa wizualna pochodzi z projektu użytkownika w Figmie (plik `HX7qKidu3aL6L8eCcJutMS`); to ona jest wiążąca dla wyglądu.

## Evidence on Hand

- Liczby MD Fellowship (od klienta): 1400+ aplikacji do MD Fellowship, 54 Fellows, 2× nabór w roku, mentoring 1:1 topowych przedsiębiorców.
- 10 reelsów Fellows od klienta: `design-assets/reels/` (tytuł = hook z nazwy pliku, podpis = imię i nazwisko).
- Lista mentorów z arkusza klienta (30 osób) i zdjęcia `design-assets/mentors/m01–m11`. Przypisanie zdjęć do nazwisk pewne tylko dla części osób; reszta do weryfikacji.
- Zdjęcia z wydarzeń MD: `design-assets/how-photo-*.jpg`, `about-collage.png`, `design-assets/who/f1–f3.webp`.

Brakuje (nie wymyślać, zostawiać placeholder w `[...]`): prelegenci (8 miejsc), bio mentorów, role części mentorów, tematy prelekcji, startupy pod nazwiskami w reelsach, odpowiedź o udziale online, link do formularza, polityka prywatności. Żadnych zmyślonych liczb, nazwisk, firm, cytatów ani opinii.

## Product Principles

1. **Każdy ekran przybliża do Aplikuj.** Sukces to liczba zgłoszeń, więc CTA jest zawsze pod ręką, zwłaszcza na telefonie, a rundy naboru (early bird) i limit miejsc zachęcają, żeby aplikować teraz.
2. **Najpierw problem, potem obietnica.** Strona zaczyna od tego, dlaczego startupy upadają, i dopiero potem mówi, czego się nauczysz.
3. **Zbijamy obiekcje, zanim padną.** Brak pomysłu, zespołu, kodu czy doświadczenia to nie przeszkoda, i strona mówi to wprost, w kilku miejscach.
4. **Prawdziwi ludzie zamiast deklaracji.** Wiarygodność dają twarze Fellows i mentorów oraz prawdziwe liczby, nie przymiotniki. Brakujący dowód zostaje placeholderem, nie zmyśleniem.
5. **Ciągłość z reelsem.** Osoba z Instagrama ma rozpoznać na stronie te same twarze i ten sam ton.

## Accessibility & Inclusion

- Semantyczny HTML (`header`, `nav`, `section`, `footer`), jeden `<h1>`, widoczny focus, kontrast min. 4.5:1.
- FAQ działa myszą i klawiaturą (`button aria-expanded` + panel).
- Wszystkie animacje i smooth scroll wyłączają się przy `prefers-reduced-motion`; treść musi być w pełni dostępna bez nich.
- Poprawny układ na 1440, 1024, 768, 390 i 360 px, bez poziomego scrolla strony (poza karuzelami).
- Cel z briefu: Lighthouse Accessibility ≥ 95.
- Język inkluzywny: formy neutralne płciowo.
