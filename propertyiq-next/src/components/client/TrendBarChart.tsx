
interface TrendBarChartProps {
    title: string;
    data: number[];
    legends: string[];
    srLabel?: string;
}


export default function TrendBarChart({ title, data, legends, srLabel }: TrendBarChartProps) {
    
    let updatedData: any[] = [];
    if (data.every((value) => Number(value) >= 100)) {
       const maxVal = Math.max(...data);
       updatedData.push(...data.map((h) => Math.round((((h / maxVal) * 100) * 100) / 100)));

    }

    console.log(updatedData);
    
    return (
        <section
                            className="rounded-xl border-2 border-slate-600 bg-slate-800 p-6 lg:col-span-2"
                            aria-labelledby="trend"
                        >
                            <h2 id="trend" className="text-xl font-bold">
                                {title}
                            </h2>
                            {data.length === 0 && (
                                <p className="text-sm text-yellow-300">No data available</p>
                            )}

                            <div
                                className="mt-6"
                                
                            >
                                <div role="img" aria-label={srLabel} className="flex h-64 items-end gap-2 border-b-2 border-l-2 border-slate-500 px-3">
                                    {updatedData.length > 0 && updatedData.map((s) => (
                                        <div key={s} style={{ height: `${s}%` }} className={`h-[${s}%] flex-1 rounded-t bg-yellow-300`}></div>
                                    ))}
                                    {updatedData.length === 0 && (
                                        Array(5).fill(null).map((_, index) => (
                                            <div key={index} className="h-5 flex-1 rounded-t bg-yellow-300"></div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-2 flex justify-between text-xs text-slate-400" aria-hidden="true">
                                    {legends.map((legend) => (
                                        <span key={legend}>{legend}</span>
                                    ))}

                                    {legends.length === 0 && (
                                        Array(5).fill(null).map((_, index) => (
                                            <span key={index}>N/A</span>
                                        ))
                                    )}
                                </div>
                            </div>
                        </section>
    );
}