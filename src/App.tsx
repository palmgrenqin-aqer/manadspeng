import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

type ChildId = "R" | "G";
type Level = 0 | 1 | 2 | 3;

interface Payment {
  child: ChildId;
  monthKey: string; // "2026-01"
  missed: number;
  level: Level;
  amount: number;
  ts: number;
}

interface ChildConfig {
  id: ChildId;
  name: string;
  grade: string;
  accent: string;
  accentSoft: string;
  amounts: Record<1 | 2 | 3, number>;
  avatar: string;
}

const YEAR = 2026;

const CHILDREN: ChildConfig[] = [
  {
    id: "R",
    name: "R",
    grade: "åk 6",
    accent: "#d9533f",
    accentSoft: "#fbe6e1",
    amounts: { 1: 100, 2: 150, 3: 200 },
    avatar: "🦊",
  },
  {
    id: "G",
    name: "G",
    grade: "åk 8",
    accent: "#2f7d4f",
    accentSoft: "#e2f2e7",
    amounts: { 1: 200, 2: 250, 3: 300 },
    avatar: "🐼",
  },
];

const MONTHS_SV = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

const STORAGE_KEY = "manadspeng_v1";

function levelForMissed(missed: number): Level {
  if (missed <= 0) return 3;
  if (missed <= 3) return 2;
  if (missed <= 5) return 1;
  return 0;
}

function loadPayments(): Payment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Payment[]) : [];
  } catch {
    return [];
  }
}

function monthLabel(key: string): string {
  const m = parseInt(key.split("-")[1], 10);
  return MONTHS_SV[m - 1] ?? key;
}

const LEVEL_PRESENTATION: Record<
  Level,
  { label: string; emojis: string; message: string }
> = {
  3: { label: "Nivå 3", emojis: "🥳🏆✨", message: "Gjort alla to-dos! Full pott – supersnyggt jobbat!" },
  2: { label: "Nivå 2", emojis: "🎉😊👍", message: "Max 3 missade to-dos. Bra kämpat!" },
  1: { label: "Nivå 1", emojis: "💪🙂", message: "Upp till 5 missade to-dos. Nästa månad tar vi alla!" },
  0: { label: "Ingen utbetalning", emojis: "😅🙈", message: "Mer än 5 missade to-dos den här månaden – ingen månadspeng. Ny chans nästa månad!" },
};

function ChildCard({
  config,
  payments,
  onRegister,
  onDelete,
}: {
  config: ChildConfig;
  payments: Payment[];
  onRegister: (p: Payment) => void;
  onDelete: (p: Payment) => void;
}) {
  const now = new Date();
  const currentMonthKey = `${YEAR}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [monthKey, setMonthKey] = useState<string>(currentMonthKey);
  const [missed, setMissed] = useState<string>("0");
  const [justSaved, setJustSaved] = useState(false);

  const missedNum = Math.max(0, parseInt(missed || "0", 10) || 0);
  const level = levelForMissed(missedNum);
  const amount = level > 0 ? config.amounts[level as 1 | 2 | 3] : 0;
  const pres = LEVEL_PRESENTATION[level];
  const existing = payments.find((p) => p.child === config.id && p.monthKey === monthKey);

  const yearTotal = useMemo(
    () =>
      payments
        .filter((p) => p.child === config.id && p.monthKey.startsWith(String(YEAR)))
        .reduce((sum, p) => sum + p.amount, 0),
    [payments, config.id]
  );

  const history = useMemo(
    () =>
      payments
        .filter((p) => p.child === config.id && p.monthKey.startsWith(String(YEAR)))
        .sort((a, b) => b.monthKey.localeCompare(a.monthKey)),
    [payments, config.id]
  );

  const register = () => {
    onRegister({
      child: config.id,
      monthKey,
      missed: missedNum,
      level,
      amount,
      ts: Date.now(),
    });
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <section
      className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)]"
      style={{ borderTop: `8px solid ${config.accent}` }}
    >
      <div className="flex items-center gap-4">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: config.accentSoft }}
        >
          {config.avatar}
        </span>
        <div>
          <h3 className="font-display text-2xl font-bold leading-none">
            {config.name}
          </h3>
          <p className="text-sm font-semibold opacity-60">{config.grade}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs font-bold uppercase tracking-wide opacity-50">
            Totalt {YEAR}
          </p>
          <p className="font-display text-3xl font-bold" style={{ color: config.accent }}>
            {yearTotal} kr
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor={`month-${config.id}`}>
              📅 Vilken månad?
            </label>
            <select
              id={`month-${config.id}`}
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
              className="w-full rounded-xl border-2 bg-white px-4 py-2.5 text-base font-semibold outline-none focus:ring-2"
              style={{ borderColor: config.accentSoft }}
            >
              {MONTHS_SV.map((m, i) => {
                const key = `${YEAR}-${String(i + 1).padStart(2, "0")}`;
                return (
                  <option key={key} value={key}>
                    {m} {YEAR}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor={`missed-${config.id}`}>
              ✅✗ Hur många to-dos har {config.name} missat i {monthLabel(monthKey).toLowerCase()}?
            </label>
            <input
              id={`missed-${config.id}`}
              type="number"
              min={0}
              max={99}
              value={missed}
              onChange={(e) => setMissed(e.target.value)}
              className="w-full rounded-xl border-2 bg-white px-4 py-2.5 text-base font-semibold outline-none focus:ring-2"
              style={{ borderColor: config.accentSoft }}
            />
          </div>
        </div>

        {/* Result */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl px-4 py-6 text-center"
          style={{ backgroundColor: config.accentSoft }}
        >
          <p className="text-2xl">{pres.emojis}</p>
          <p className="mt-1 text-sm font-bold uppercase tracking-wide opacity-70">
            {pres.label}
          </p>
          <p className="font-display text-5xl font-bold leading-tight" style={{ color: config.accent }}>
            {amount} kr
          </p>
          <p className="mt-1 max-w-xs text-sm font-semibold opacity-80">{pres.message}</p>
          <button
            onClick={register}
            className="mt-4 rounded-full px-6 py-2.5 font-display text-lg font-bold text-white transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: config.accent }}
          >
            💸 Registrera utbetalning
          </button>
          <p className="mt-2 h-5 text-sm font-bold" style={{ color: config.accent }}>
            {justSaved
              ? existing
                ? `Sparat för ${monthLabel(monthKey)}! 🎊`
                : "Sparat! 🎊"
              : existing
                ? `${monthLabel(monthKey)} är redan registrerad (${existing.amount} kr) – spara igen för att uppdatera`
                : ""}
          </p>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6 border-t-2 border-dashed pt-4" style={{ borderColor: config.accentSoft }}>
          <p className="text-sm font-bold opacity-60">
            🧾 Utbetalningar {YEAR}
          </p>
          <ul className="mt-2 divide-y" style={{ borderColor: config.accentSoft }}>
            {history.map((p) => (
              <li key={p.monthKey} className="flex items-center gap-3 py-2 text-sm font-semibold">
                <span className="w-24">{monthLabel(p.monthKey)}</span>
                <span className="opacity-60">{p.missed} missade</span>
                <span className="opacity-60">{LEVEL_PRESENTATION[p.level].label}</span>
                <span className="ml-auto font-display text-lg font-bold" style={{ color: config.accent }}>
                  {p.amount} kr
                </span>
                <button
                  onClick={() => onDelete(p)}
                  className="rounded-full px-2 opacity-40 transition-opacity hover:opacity-100"
                  title="Ta bort"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [payments, setPayments] = useState<Payment[]>(loadPayments);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  const register = (p: Payment) =>
    setPayments((prev) => [...prev.filter((x) => !(x.child === p.child && x.monthKey === p.monthKey)), p]);

  const remove = (p: Payment) =>
    setPayments((prev) => prev.filter((x) => !(x.child === p.child && x.monthKey === p.monthKey)));

  const totalR = payments.filter((p) => p.child === "R").reduce((s, p) => s + p.amount, 0);
  const totalG = payments.filter((p) => p.child === "G").reduce((s, p) => s + p.amount, 0);

  const exportToExcel = () => {
    const rows = [...payments]
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey) || a.child.localeCompare(b.child))
      .map((p) => ({
        Månad: `${monthLabel(p.monthKey)} ${p.monthKey.split("-")[0]}`,
        Barn: p.child,
        "Missade to-dos": p.missed,
        Nivå: p.level > 0 ? `Nivå ${p.level}` : "Ingen utbetalning",
        Belopp_kr: p.amount,
      }));
    if (rows.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 16 }, { wch: 6 }, { wch: 16 }, { wch: 18 }, { wch: 12 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Månadspeng");
    XLSX.writeFile(wb, "månadspeng.xlsx");
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="mx-auto max-w-3xl px-5 pt-10 sm:pt-14">
        <p className="text-center text-lg font-bold tracking-wide text-[#d9533f]">
          💰 AQER
        </p>
        <h1 className="text-center font-display text-5xl font-extrabold leading-none sm:text-6xl">
          Månadspeng
        </h1>
        <p className="mt-3 text-center text-base font-semibold opacity-60">
          Utbetalas i slutet av varje månad – beroende på hur många to-dos som blivit gjorda 🌟
        </p>
      </header>

      {/* 1. Rules */}
      <section className="mx-auto mt-10 max-w-3xl px-5">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)]">
          <h2 className="font-display text-2xl font-bold">📜 Reglerna</h2>

          <p className="mt-3 text-sm font-bold uppercase tracking-wide opacity-50">
            Så här mycket betalas ut per månad
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[420px] border-separate border-spacing-0 text-center">
              <thead>
                <tr>
                  <th className="rounded-l-xl bg-[#111] px-3 py-2.5 text-sm font-bold text-white">Barn</th>
                  <th className="bg-[#f6c445] px-3 py-2.5 font-display text-base font-bold">🥉 Nivå 1</th>
                  <th className="bg-[#e0e0e0] px-3 py-2.5 font-display text-base font-bold">🥈 Nivå 2</th>
                  <th className="rounded-r-xl bg-[#f6c445] px-3 py-2.5 font-display text-base font-bold">🥇 Nivå 3</th>
                </tr>
              </thead>
              <tbody className="font-display text-xl font-bold">
                <tr>
                  <td className="border-b-2 border-r-2 border-[#fbe6e1] px-3 py-3 text-left text-base">
                    🦊 R <span className="text-sm font-semibold opacity-50">åk 6</span>
                  </td>
                  <td className="border-b-2 border-[#fbe6e1] px-3 py-3">100 kr</td>
                  <td className="border-b-2 border-[#fbe6e1] px-3 py-3">150 kr</td>
                  <td className="border-b-2 border-[#fbe6e1] px-3 py-3">200 kr</td>
                </tr>
                <tr>
                  <td className="border-r-2 border-[#e2f2e7] px-3 py-3 text-left text-base">
                    🐼 G <span className="text-sm font-semibold opacity-50">åk 8</span>
                  </td>
                  <td className="px-3 py-3">200 kr</td>
                  <td className="px-3 py-3">250 kr</td>
                  <td className="px-3 py-3">300 kr</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-wide opacity-50">
            Så här bestäms nivån
          </p>
          <ul className="mt-2 space-y-2 text-base font-semibold">
            <li className="flex items-center gap-3 rounded-xl bg-[#e2f2e7] px-4 py-2.5">
              <span className="text-xl">🥇</span> Gjort alla to-dos → <b>Nivå 3</b>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-[#efefef] px-4 py-2.5">
              <span className="text-xl">🥈</span> Missat upp till 3 to-dos → <b>Nivå 2</b>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-[#fbe6e1] px-4 py-2.5">
              <span className="text-xl">🥉</span> Missat upp till 5 to-dos → <b>Nivå 1</b>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-[#fdeaea] px-4 py-2.5">
              <span className="text-xl">🚫</span> Missat fler än 5 to-dos → ingen utbetalning den månaden
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Cards */}
      <main className="mx-auto mt-8 max-w-3xl space-y-8 px-5">
        {CHILDREN.map((c) => (
          <ChildCard
            key={c.id}
            config={c}
            payments={payments}
            onRegister={register}
            onDelete={remove}
          />
        ))}

        {/* Summary */}
        <div className="rounded-3xl bg-[#111] p-6 text-white sm:p-8">
          <h2 className="font-display text-2xl font-bold">🏦 AQERs sparkonto</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4 text-center">
              <p className="text-3xl">🦊</p>
              <p className="font-display text-2xl font-bold">{totalR} kr</p>
              <p className="text-sm font-semibold opacity-60">R har fått totalt</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-center">
              <p className="text-3xl">🐼</p>
              <p className="font-display text-2xl font-bold">{totalG} kr</p>
              <p className="text-sm font-semibold opacity-60">G har fått totalt</p>
            </div>
          </div>
          <button
            onClick={exportToExcel}
            disabled={payments.length === 0}
            className="mt-5 w-full rounded-full bg-white px-6 py-3 font-display text-lg font-bold text-[#111] transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            📊 Exportera till Excel (månadspeng.xlsx)
          </button>
          <p className="mt-2 text-center text-xs font-semibold opacity-50">
            Filen laddas ner – spara den i mappen Dokument på din dator 💾
          </p>
        </div>
      </main>
    </div>
  );
}
