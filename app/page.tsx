import { ScanCard } from "@/components/ScanCard";
import { getCatalog, getScans } from "@/lib/data";
import { formatScanDate } from "@/lib/format";

export default function HomePage() {
  const scans = getScans();
  const catalog = getCatalog();
  const articleTotal = catalog.articles.length;
  const directLinkTotal = catalog.articles.filter(
    (article) => article.hasDirectLink,
  ).length;
  const latestScan = scans[0];

  return (
    <main>
      <section className="mx-auto w-full max-w-6xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-12">
        <div className="max-w-2xl border-b border-line pb-10">
          <h1 className="text-4xl tracking-tight text-ink sm:text-5xl">
            赛道扫描
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            微信读书等来源的关键词扫描归档。按日期浏览，用链接打开正在读的那一篇。
          </p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <div>
              <dt className="text-marrs">已归档扫描</dt>
              <dd className="mt-1 text-ink">{scans.length} 次</dd>
            </div>
            <div>
              <dt className="text-marrs">文章条目</dt>
              <dd className="mt-1 text-ink">{articleTotal} 篇</dd>
            </div>
            <div>
              <dt className="text-marrs">可打开原文</dt>
              <dd className="mt-1 text-ink">{directLinkTotal} 篇</dd>
            </div>
            {latestScan ? (
              <div>
                <dt className="text-marrs">最近更新</dt>
                <dd className="mt-1 text-ink">
                  {formatScanDate(latestScan.date)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
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
