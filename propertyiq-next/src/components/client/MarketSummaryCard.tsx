
interface MarketSummaryProps {
  title: string;
  value: string;
  subtext?: string;
  srLabel?: string;
}

export default function MarketSummaryCard({ title, value, subtext, srLabel }: MarketSummaryProps) {
    console.log("MarketSummaryCard props:", { title, value, subtext, srLabel });
    return (<article className="rounded-xl border-2 border-slate-600 bg-slate-800 p-5"  aria-label={srLabel}>
                            <p className="text-sm text-slate-300">
                                {title}
                            </p>
                            <p className="mt-2 text-3xl font-black truncate">{value}</p>
                            {subtext && (
                                <p className="mt-2 text-sm font-bold text-yellow-300">
                                    {subtext}
                                </p>
                            )}
                        </article>)
}