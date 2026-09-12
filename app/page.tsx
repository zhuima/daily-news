import { ScanCard } from "@/components/ScanCard";
import { getScans } from "@/lib/data";

export default function HomePage() {
  const scans = getScans();

  return (
    <main>
      <section className="bg-marrs text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="font-display text-xs tracking-[0.28em] text-white/70 uppercase">
              Track Scan
            </p>
            <h1 className="mt-4 text-5xl leading-tight tracking-tight sm:text-6xl">
              赛道扫描
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">
              从微信读书等来源扫出一条赛道。按日期归档，用链接记住正在读的那一篇。
            </p>
          </div>
          <div className="h-36 w-36 shrink-0 border border-white/70 bg-marrs p-4 text-white">
            <p className="font-display text-[11px] tracking-[0.14em]">
              #01847E
            </p>
            <p className="mt-1 text-[11px] text-white/70">84, 38, 55, 0</p>
            <p className="mt-8 text-xs leading-5 text-white/80">
              Marrs
              <br />
              Green
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
              Archive
            </p>
            <h2 className="mt-2 text-2xl tracking-tight">最近扫描</h2>
          </div>
          <p className="text-sm text-muted">{scans.length} 次</p>
        </div>
        <div className="mt-8 space-y-5">
          {scans.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      </section>
    </main>
  );
}
