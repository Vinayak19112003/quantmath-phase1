"use client";

import { useMemo, useState } from "react";
import { MarketReturnLab } from "@/components/math-labs";
import { clamp } from "@/lib/math/core";

function NumberInput({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
    {label}
    <input aria-label={label} type="number" step={step} value={Number.isFinite(value) ? value : ""} onChange={(event) => onChange(Number(event.target.value))} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-base outline-none ring-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950" />
  </label>;
}

function MiniCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h3 className="text-lg font-black tracking-tight">{title}</h3>
    <div className="mt-4">{children}</div>
  </section>;
}

export function QuantLab() {
  return <div className="space-y-6">
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Why does a quant need this?</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Turn foundations into market intuition.</h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">These are small, safe simulations. They teach the arithmetic underneath trading language—not trading advice.</p>
    </div>
    <MarketReturnLab />
    <div className="grid gap-6 xl:grid-cols-2">
      <RiskRewardLab />
      <WinRateLab />
      <CompoundingLab />
      <TradeSequenceLab />
    </div>
  </div>;
}

function RiskRewardLab() {
  const [side, setSide] = useState<"long" | "short">("long");
  const [entry, setEntry] = useState(100);
  const [stop, setStop] = useState(98);
  const [target, setTarget] = useState(106);
  const validNumbers = [entry, stop, target].every(Number.isFinite);
  const validDirection = side === "long" ? stop < entry && target > entry : stop > entry && target < entry;
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  const ratio = risk > 0 ? reward / risk : null;
  const high = Math.max(entry, stop, target);
  const low = Math.min(entry, stop, target);
  const y = (n: number) => `${16 + ((high - n) / Math.max(high - low, 1)) * 164}%`;

  return <MiniCard title="Risk / Reward visualizer">
    <div className="mb-4 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {(["long", "short"] as const).map((option) => <button key={option} onClick={() => setSide(option)} className={`min-h-10 flex-1 rounded-lg text-sm font-bold capitalize ${side === option ? "bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-indigo-200" : "text-slate-500"}`}>{option}</button>)}
    </div>
    <div className="grid grid-cols-3 gap-3">
      <NumberInput label="Entry" value={entry} onChange={setEntry} />
      <NumberInput label="Stop" value={stop} onChange={setStop} />
      <NumberInput label="Target" value={target} onChange={setTarget} />
    </div>
    {!validNumbers || !validDirection ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">For a {side}, the stop must be on the loss side of entry and the target on the profit side.</p> : <>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric label="Risk" value={risk.toFixed(2)} />
        <Metric label="Reward" value={reward.toFixed(2)} />
        <Metric label="Reward : Risk" value={ratio ? `${ratio.toFixed(2)} : 1` : "—"} />
      </div>
      <div className="relative mt-5 h-52 overflow-hidden rounded-2xl bg-slate-950 p-4 text-xs font-bold text-white">
        {[{ label: "Target", value: target, color: "bg-emerald-400" }, { label: "Entry", value: entry, color: "bg-indigo-300" }, { label: "Stop", value: stop, color: "bg-rose-400" }].map((level) => <div key={level.label} className="absolute left-4 right-4 flex items-center gap-2" style={{ top: y(level.value) }}><span className={`h-2.5 w-2.5 rounded-full ${level.color}`} /><span>{level.label} · {level.value}</span><div className="h-px flex-1 bg-white/20" /></div>)}
      </div>
    </>}
  </MiniCard>;
}

function WinRateLab() {
  const [wins, setWins] = useState(30);
  const [losses, setLosses] = useState(20);
  const total = Math.max(0, wins) + Math.max(0, losses);
  const winRate = total ? (Math.max(0, wins) / total) * 100 : null;
  return <MiniCard title="Win rate calculator">
    <div className="grid grid-cols-2 gap-3"><NumberInput label="Wins" value={wins} onChange={setWins} /><NumberInput label="Losses" value={losses} onChange={setLosses} /></div>
    {total === 0 ? <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">Add at least one trade to calculate a rate.</p> : <>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center"><Metric label="Trades" value={String(total)} /><Metric label="Win rate" value={`${winRate?.toFixed(1)}%`} /><Metric label="Loss rate" value={`${(100 - (winRate ?? 0)).toFixed(1)}%`} /></div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300"><strong>Win/loss ratio:</strong> {wins}:{losses}. This compares counts. <strong>Win rate</strong> is wins divided by all trades.</p>
    </>}
  </MiniCard>;
}

function CompoundingLab() {
  const [capital, setCapital] = useState(100);
  const [returnPct, setReturnPct] = useState(10);
  const [periods, setPeriods] = useState(3);
  const points = useMemo(() => {
    const safePeriods = clamp(Math.round(Number.isFinite(periods) ? periods : 0), 0, 30);
    return Array.from({ length: safePeriods + 1 }, (_, i) => capital * Math.pow(1 + returnPct / 100, i));
  }, [capital, returnPct, periods]);
  const final = points.at(-1) ?? capital;
  const max = Math.max(...points.map(Math.abs), 1);
  return <MiniCard title="Compounding calculator">
    <div className="grid grid-cols-3 gap-3"><NumberInput label="Starting capital" value={capital} onChange={setCapital} step={10} /><NumberInput label="Return / period (%)" value={returnPct} onChange={setReturnPct} step={0.5} /><NumberInput label="Periods" value={periods} onChange={setPeriods} /></div>
    <div className="mt-4 grid grid-cols-2 gap-2 text-center"><Metric label="Final capital" value={Number.isFinite(final) ? final.toFixed(2) : "—"} /><Metric label="Growth" value={capital !== 0 && Number.isFinite(final) ? `${(((final - capital) / Math.abs(capital)) * 100).toFixed(1)}%` : "—"} /></div>
    <div className="mt-5 flex h-28 items-end gap-1 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950" aria-label="Compounding growth chart">
      {points.map((point, index) => <div key={index} title={`Period ${index}: ${point.toFixed(2)}`} className="min-w-1 flex-1 rounded-t bg-indigo-500" style={{ height: `${Math.max(4, (Math.abs(point) / max) * 100)}%`, opacity: 0.45 + (index / Math.max(points.length, 1)) * 0.55 }} />)}
    </div>
    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Each period uses the new balance, so growth is multiplicative: starting capital × (1 + return)<sup>periods</sup>.</p>
  </MiniCard>;
}

function TradeSequenceLab() {
  const [raw, setRaw] = useState("+2\n-1\n+0.5\n-2\n+3");
  const trades = raw.split(/[\n,\s]+/).map(Number).filter(Number.isFinite).slice(0, 50);
  const cumulative = trades.reduce<number[]>((values, trade) => [...values, (values.at(-1) ?? 0) + trade], [0]);
  const wins = trades.filter((trade) => trade > 0).length;
  const losses = trades.filter((trade) => trade < 0).length;
  const max = Math.max(...cumulative.map(Math.abs), 1);
  return <MiniCard title="Simple trade sequence">
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">One R result per line
      <textarea value={raw} onChange={(event) => setRaw(event.target.value)} rows={5} className="rounded-xl border border-slate-200 bg-white p-3 font-mono text-base outline-none ring-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950" aria-label="Trade results in R" />
    </label>
    {!trades.length ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-100">Enter values such as +2, -1, or 0.5.</p> : <>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center"><Metric label="Cumulative R" value={`${(cumulative.at(-1) ?? 0).toFixed(1)}R`} /><Metric label="Wins / losses" value={`${wins} / ${losses}`} /><Metric label="Win %" value={`${((wins / trades.length) * 100).toFixed(0)}%`} /></div>
      <div className="mt-5 flex h-28 items-center gap-1 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950" aria-label="Cumulative R chart">
        {cumulative.slice(1).map((value, index) => <div key={index} className="flex flex-1 flex-col justify-center"><div className={`rounded ${value >= 0 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ height: `${Math.max(4, (Math.abs(value) / max) * 88)}px` }} title={`After trade ${index + 1}: ${value.toFixed(1)}R`} /></div>)}
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Positive R is profit, negative R is loss. The bars show the running total after each trade.</p>
    </>}
  </MiniCard>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-base font-black tabular-nums">{value}</p></div>;
}
