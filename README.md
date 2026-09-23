# Startup Discovery Sprint — wireframe landing page

Wireframe landing page'a dla **MD Fellowship** (Startup Discovery Sprint, 12–13 listopada 2026, Google for Startups Campus Warsaw).

**To jest wireframe, nie projekt graficzny.** Greyscale, fonty systemowe, zero decyzji wizualnych. Warstwę wizualną robi brand designer — wejdzie później przez podmianę zmiennych CSS, nie przez przepisywanie pliku.

## Co oceniamy na tym pliku

1. Czy historia czyta się w jednym scrollu: problem → czego się nauczysz → jak to działa → dowód → dla kogo → obiekcje → CTA.
2. Czy hero da się zrozumieć w kilka sekund.
3. Czy na mobile CTA jest zawsze pod ręką (większość ruchu przyjdzie z reelsów na Instagramie).

Nie oceniamy wyglądu.

## Jak otworzyć

Jeden plik, zero zewnętrznych zasobów — działa po otwarciu z dysku i na dowolnym serwerze.

```bash
open index.html
```

## Do uzupełnienia przez klienta

Wszystko w nawiasach kwadratowych czeka na dane: `[DATA]`, `[TEMATY PRELEKCJI]`, `[Imię Nazwisko]`, `[PROCES REKRUTACJI]`, `[DATA ODPOWIEDZI]` i dalej.

## Interakcje

| Sekcja | Zachowanie |
|---|---|
| Jak to działa | Zdjęcie przyklejone z boku, podmienia się, gdy kolejny krok wchodzi w środek ekranu. Bez przechwytywania scrolla. |
| Tak to wygląda w praktyce | Karuzela reelsów: aktywny większy na środku, strzałki + drag/swipe. |
| Wśród prelegentów i mentorów | Karuzela przesuwa się sama; hover zatrzymuje ją, powiększa kafel i odsłania bio. |
| FAQ | Accordion, jedno pytanie otwarte naraz, działa z klawiatury. |
| Mobile | Sticky CTA na dole; chowa się przy sekcjach, które mają własne CTA, i w stopce. |

Wszystkie animacje wyłączają się przy `prefers-reduced-motion`.

## Tokeny

Kolory wyłącznie przez zmienne na `:root` — po zamknięciu palety podmieniamy zmienne, nie plik. `--accent` w wireframie = kolor tekstu.

## Poza zakresem

Formularz aplikacyjny (CTA prowadzą do `#aplikuj`), kolor, typografia brandowa, key visual, motion, analityka i meta tagi SEO/OG.
