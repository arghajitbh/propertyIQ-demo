
interface TabularViewProps {
    title: string;
    tableCaption?: string;
    columns: string[];
    data: string[][];
    srLabel?: string;
}

export default function TabularView({ title, tableCaption, columns, data, srLabel }: TabularViewProps) {
    
    console.log('tabular data', data);
    console.log('tabular columns', columns);
    
    return (
        <section
                        className="mt-8 overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-800"
                        aria-labelledby="comps"
                    >
                        <div className="border-b-2 border-slate-600 px-6 py-5">
                            <h2 id="comps" className="text-xl font-bold">
                                {title}
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-center text-sm" aria-label={srLabel}>
                                <caption className="sr-only">
                                    {tableCaption ?? title}
                                </caption>
                                <thead className="bg-slate-950">
                                    <tr>
                                        {columns.map((column) => (
                                            <th key={column} scope="col" className="px-6 py-4">
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {data.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex} className="px-6 py-4">
                                                    {typeof cell === 'number' ? Number(cell).toFixed(2) : cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
    );
}