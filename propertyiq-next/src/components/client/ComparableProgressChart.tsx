
interface ComparableProgressChartProps {
    title: string;
    subtext?: string;
    data: Record<string, number>;
    srLabel?: string;
}

export default function ComparableProgressChart({ title, subtext, data, srLabel }: ComparableProgressChartProps) {
    
    console.log("Original Data:", data);
    let updatedData: Record<string, number> = {};
    if (Object.values(data).every((value) => Number(value) >= 100)) {
       const maxVal = Math.max(...Object.values(data));
       Object.entries(data).forEach(([key, value]) => {
           updatedData[key] = Math.round((((value / maxVal) * 100) * 100) / 100);
       });

    } else {
        updatedData = { ...data };
    }

    console.log("Updated Data:", updatedData);
    
    return (
        <section className="rounded-xl border-2 border-slate-600 bg-slate-800 p-6" aria-label={srLabel}>
                            <h2 className="text-xl font-bold">
                                {title}
                            </h2>
                            {subtext && <p className="text-sm text-slate-400">{subtext}</p>}
                            {Object.keys(updatedData).length === 0 && (
                                <p className="text-sm text-yellow-300">No data available</p>
                            )}
                            <div className="mt-5 space-y-5">
                                {Object.entries(updatedData).map(([key, value]) => (
                                    <div key={key} role="region" aria-label={`Progress for ${key} is ${value}%`}>
                                        <div className="flex justify-between text-sm">
                                            <span>{key}</span>
                                            <strong>{value}%</strong>
                                        </div>
                                        <div className="mt-2 h-3 rounded bg-slate-950">
                                            <div style={{ width: `${value}%` }} className={`h-3 rounded bg-yellow-300`}></div>
                                        </div>
                                    </div>
                                ))}

                                {Object.keys(updatedData).length === 0 && (
                                    Array(5).fill(null).map((_, index) => (
                                       <div key={index}>
                                        <div className="flex justify-between text-sm">
                                            <span>N/A</span>
                                            <strong>0%</strong>
                                        </div>
                                        <div className="mt-2 h-3 rounded bg-slate-950">
                                            <div className={`h-3 w-[5%] rounded bg-yellow-300`}></div>
                                        </div>
                                    </div>
                                    ))
                                )}
                            </div>
                        </section>
    )
}