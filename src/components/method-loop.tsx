import { methodSteps } from "@/lib/method";
export function MethodLoop({ compact = false }: { compact?: boolean }) {
  return <ol className={`grid list-none gap-2 p-0 ${compact ? "sm:grid-cols-6" : "md:grid-cols-6"}`} aria-label="The Fresco Method">{methodSteps.map((step, index) => <li key={step} className="relative border border-[var(--line)] bg-[rgb(251_250_245/.72)] p-4"><span className="eyebrow">0{index + 1}</span><strong className="mt-4 block text-sm">{step}</strong>{index < methodSteps.length - 1 ? <span className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--ink)] text-[9px] text-white md:flex" aria-hidden>→</span> : null}</li>)}</ol>;
}
