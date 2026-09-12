import { ScanCard } from "@/components/ScanCard";
import { HomeSearch } from "@/components/HomeSearch";
import { getAllPublishableArticles, getCatalog, getScans } from "@/lib/data";
import { formatScanDate } from "@/lib/format";

export default function HomePage() {
  const scans = getScans();
  const catalog = getCatalog();
  const articleTotal = catalog.articles.length;
  const latestScan = scans[0];
  const articles = getAllPublishableArticles();

  return (
    <main>
      <section className="bg-marrs text-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-display text-xs tracking-[0.28em] text-white/70 uppercase">
            Track Scan
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight tracking-tight sm:text-5xl">
            赛道扫描
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">
            从微信读书等来源扫出一条赛道。按日期归档，用链接记住正在读的那一篇。
          </p>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/20 pt-8 text-sm">
            <div>
              <dt className="text-white/65">已归档扫描</dt>
              <dd className="mt-1 text-white">{scans.length} 次</dd>
            </div>
            <div>
              <dt className="text-white/65">可打开原文</dt>
              <dd className="mt-1 text-white">{articleTotal} 篇</dd>
            </div>
            {latestScan ? (
              <div>
                <dt className="text-white/65">最近更新</dt>
                <dd className="mt-1 text-white">
                  {formatScanDate(latestScan.date)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <HomeSearch articles={articles} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.14em] text-marrs">归档</p>
            <h2 className="mt-2 text-2xl tracking-tight text-ink">最近扫描</h2>
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
