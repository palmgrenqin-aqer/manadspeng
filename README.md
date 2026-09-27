# Månadspeng 💰 (AQER)

En webbapp för familjens månadspengsystem. Utbetalning sker i slutet av varje månad till **R (åk 6)** och **G (åk 8)**, baserat på hur många to-dos som missats under månaden.

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

## Kom igång

```bash
npm install
npm run dev      # utvecklingsserver på http://localhost:3000
npm run build    # produktionsbygge i dist/
npm run preview  # förhandsvisa produktionsbygget
```

Byggd med React + TypeScript + Vite + Tailwind CSS.
