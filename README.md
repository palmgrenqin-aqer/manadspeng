# Månadspeng 💰 (AQER)

En webbapp för familjens månadspengsystem. Utbetalning sker i slutet av varje månad till **R (åk 6)** och **G (åk 8)**, baserat på genomsnittet av avklarade to-dos per vecka under månaden.

**Live-sida (GitHub Pages):** https://palmgrenqin-aqer.github.io/manadspeng/

## Regler

| Barn | 🥉 Nivå 1 | 🥈 Nivå 2 | 🥇 Nivå 3 |
|------|-----------|-----------|-----------|
| R (åk 6) | 100 kr | 150 kr | 200 kr |
| G (åk 8) | 200 kr | 250 kr | 300 kr |

Nivån bestäms av **genomsnittet av avklarade to-dos per vecka** under månaden:

- 🥇 Genomsnitt minst 20 per vecka → Nivå 3
- 🥈 Genomsnitt minst 19 per vecka → Nivå 2
- 🥉 Genomsnitt minst 18 per vecka → Nivå 1
- 🚫 Under 18 i genomsnitt → ingen utbetalning den månaden
- ☀️ Augusti 2026: bara 2 veckor → **halverad månadspeng**

## Funktioner

- Reglerna visas överst på sidan
- Ett kort per barn: välj månad, ange genomsnitt avklarade to-dos per vecka → nivå och belopp räknas ut direkt
- Årssumma per barn och utbetalningshistorik (sparad i webbläsarens localStorage)
- Export till Excel (`månadspeng.xlsx`) med varje månads resultat

## Repository-layout

- **`main`** – källkoden (React + TypeScript + Vite + Tailwind CSS)
- **`gh-pages`** – fristående en-filsversion (`index.html`) som drivs av GitHub Pages

## Publicering på GitHub Pages

Sidan publiceras från `gh-pages`-branchen (Settings → Pages → Source: *Deploy from a branch* → `gh-pages` → `/ (root)`).
När du uppdaterar appen: bygg om React-projektet, generera om en-filsversionen och ersätt `index.html` på `gh-pages`-branchen.

## Kom igång (lokal utveckling)

```bash
npm install
npm run dev      # utvecklingsserver på http://localhost:3000
npm run build    # produktionsbygge i dist/
npm run preview  # förhandsvisa produktionsbygget
```
