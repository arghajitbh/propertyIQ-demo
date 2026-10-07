"use client";
import { useId, useMemo, useState } from "react";

type SupportedAction = "checkbox";

interface ActionTableProps {
    title: string;
    tableCaption?: string;
    columns: string[];
    data: string[][];
    actionColumn: string;
    actionType?: SupportedAction;
    maxSelectable?: number;
    pagination?: boolean;
    pageSize?: number;
    search?: boolean;
    searchColumn?: string;
    onSubmitUrl?: string;
    srLabel?: string;
}

export default function ActionTable({
    title,
    tableCaption,
    columns,
    data,
    actionColumn,
    actionType = "checkbox",
    maxSelectable,
    pagination = false,
    pageSize = 5,
    search = false,
    searchColumn,
    onSubmitUrl,
    srLabel,
}: ActionTableProps) {
    const id = useId();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<number[]>([]);

    const filteredRows = useMemo(() => {
        const term = query.trim().toLowerCase();
        const columnIndex = searchColumn ? columns.indexOf(searchColumn) : -1;
        return data
            .map((row, index) => ({ row, index }))
            .filter(({ row }) => {
                if (!search || !term) return true;
                const haystack =
                    columnIndex >= 0 ? [row[columnIndex] ?? ""] : row;
                return haystack.some((cell) =>
                    cell.toLowerCase().includes(term),
                );
            });
    }, [data, columns, query, search, searchColumn]);

    const size = Math.max(1, pageSize);
    const totalPages = pagination
        ? Math.max(1, Math.ceil(filteredRows.length / size))
        : 1;
    const currentPage = Math.min(page, totalPages);
    const visibleRows = pagination
        ? filteredRows.slice((currentPage - 1) * size, currentPage * size)
        : filteredRows;

    const limitReached =
        maxSelectable !== undefined && selected.length >= maxSelectable;

    function toggleRow(index: number) {
        setSelected((current) =>
            current.includes(index)
                ? current.filter((value) => value !== index)
                : limitReached
                  ? current
                  : [...current, index],
        );
    }

    const buttonClassName =
        "rounded-md border-2 px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-yellow-300/30 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <section
            className="mt-8 overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-800"
            aria-labelledby={`${id}-title`}
        >
            <div className="flex flex-col gap-4 border-b-2 border-slate-600 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
                <h2 id={`${id}-title`} className="text-xl font-bold">
                    {title}
                </h2>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {search && (
                        <input
                            type="search"
                            aria-label={`Search ${title}`}
                            placeholder={
                                searchColumn
                                    ? `Search by ${searchColumn}`
                                    : "Search"
                            }
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setPage(1);
                            }}
                            className="w-full rounded-md border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300/30 sm:w-64"
                        />
                    )}
                    <form 
                    action={onSubmitUrl || "/market"}
                    method="get"
                    >
                        <input type="hidden" name="whatIfIds" value={selected.join(',')} />
                        <button type="submit" className={`${buttonClassName} border-yellow-300 bg-yellow-300 text-slate-950 hover:bg-yellow-200`}>
                            Apply{selected.length > 0 && ` (${selected.length})`}
                        </button>
                    </form>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-center text-sm">
                    <caption className="sr-only">
                        {tableCaption ?? title}
                    </caption>
                    <thead className="bg-slate-950">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    scope="col"
                                    className="px-4 py-4 sm:px-6"
                                >
                                    {column}
                                </th>
                            ))}
                            <th scope="col" className="px-4 py-4 sm:px-6">
                                {actionColumn}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {visibleRows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-6 py-6 text-slate-300"
                                >
                                    No results found.
                                </td>
                            </tr>
                        )}
                        {visibleRows.map(({ row, index }) => {
                            const checked = selected.includes(index);
                            return (
                                <tr
                                    key={index}
                                    className={checked ? "bg-slate-700/50" : ""}
                                >
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-4 py-4 sm:px-6"
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                    <td className="px-4 py-4 sm:px-6">
                                        {actionType === "checkbox" && (
                                            <input
                                                type="checkbox"
                                                aria-label={`Select row ${index + 1}`}
                                                checked={checked}
                                                disabled={!checked && limitReached}
                                                onChange={() => toggleRow(index)}
                                                className="h-5 w-5 accent-yellow-300"
                                            />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {pagination && (
                <nav
                    aria-label={`${title} pagination`}
                    className="flex flex-col items-center justify-between gap-3 border-t-2 border-slate-600 px-4 py-4 text-sm sm:flex-row sm:px-6"
                >
                    <p className="text-slate-300">
                        Page {currentPage} of {totalPages} ·{" "}
                        {filteredRows.length} result
                        {filteredRows.length === 1 ? "" : "s"}
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => setPage(currentPage - 1)}
                            className={`${buttonClassName} border-slate-500 text-slate-200 hover:border-slate-300 hover:bg-slate-700`}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => setPage(currentPage + 1)}
                            className={`${buttonClassName} border-slate-500 text-slate-200 hover:border-slate-300 hover:bg-slate-700`}
                        >
                            Next
                        </button>
                    </div>
                </nav>
            )}
        </section>
    );
}
