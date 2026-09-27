# Månadspeng 💰 (AQER)

En webbapp för familjens månadspengsystem. Utbetalning sker i slutet av varje månad till **R (åk 6)** och **G (åk 8)**, baserat på hur många to-dos som missats under månaden.

**Live-sida (GitHub Pages):** https://palmgrenqin-aqer.github.io/manadspeng/

## Regler

| Barn | 🥉 Nivå 1 | 🥈 Nivå 2 | 🥇 Nivå 3 |
|------|-----------|-----------|-----------|
| R (åk 6) | 100 kr | 150 kr | 200 kr |
| G (åk 8) | 200 kr | 250 kr | 300 kr |

- 🥇 Gjort alla to-dos → Nivå 3
- 🥈 Missat upp till 3 to-dos → Nivå 2
- 🥉 Missat upp till 5 to-dos → Nivå 1
- 🚫 Missat fler än 5 to-dos → ingen utbetalning den månaden

## Funktioner

- Reglerna visas överst på sidan
- Ett kort per barn: välj månad, ange antal missade to-dos → nivå och belopp räknas ut direkt
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
