import EstimatorApiClient, {
    EstimatorRequest,
    EstimatorResponse,
    HistoryEntry,
} from "@/lib/api/estimator";

type SearchParams = Record<string, string | string[] | undefined>;

interface EstimatorPageProps {
    searchParams: Promise<SearchParams>;
}

type FieldKey = keyof EstimatorRequest;

const fields: {
    key: FieldKey;
    label: string;
    min?: number;
    max?: number;
    step?: number;
    placeholder: string;
}[] = [
    { key: "square_footage", label: "Area (sq ft)", min: 100, step: 1, placeholder: "2000" },
    { key: "lot_size", label: "Lot size (sq ft)", min: 0, step: 1, placeholder: "5000" },
    { key: "bedrooms", label: "Bedrooms", min: 0, step: 1, placeholder: "3" },
    { key: "bathrooms", label: "Bathrooms", min: 0, step: 0.5, placeholder: "2" },
    { key: "year_built", label: "Year built", min: 1800, max: 2026, step: 1, placeholder: "1990" },
    { key: "distance_to_city_center", label: "Distance to city center (mi)", min: 0, step: 0.1, placeholder: "10" },
    { key: "school_rating", label: "School rating (0-10)", min: 0, max: 10, step: 0.1, placeholder: "8" },
];

const inputClassName =
    "mt-2 block w-full rounded-md border-2 border-slate-500 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-400 focus:border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300/30";

function toNumber(value: string | string[] | undefined): number | undefined {
    const raw = Array.isArray(value) ? value[0] : value;
    if (raw === undefined || raw.trim() === "") return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseRequest(params: SearchParams): EstimatorRequest {
    return Object.fromEntries(
        fields.map(({ key }) => [key, toNumber(params[key])]),
    ) as EstimatorRequest;
}

function describe(request: EstimatorRequest): string {
    return `${request.square_footage ?? "-"} sq ft, ${request.bedrooms ?? "-"} bd, ${request.bathrooms ?? "-"} ba`;
}

export default async function EstimatorPage({ searchParams }: EstimatorPageProps) {
    const params = await searchParams;
    const request = parseRequest(params);
    const submitted = fields.some(({ key }) => request[key] !== undefined);

    const client = new EstimatorApiClient();
    let estimate: EstimatorResponse | undefined;
    let history: HistoryEntry[] | [] = [];
    let error: string | undefined;

    if (submitted) {
        const missing = fields.filter(({ key }) => request[key] === undefined);
        if (missing.length > 0) {
            error = `Please provide: ${missing.map((f) => f.label).join(", ")}.`;
        } else {
            try {
                estimate = await client.estimate(request);
                history = estimate?.history ?? client.getHistory();
            } catch (e) {
                error =
                    e instanceof Error
                        ? `Unable to get an estimate. ${e.message}`
                        : "Unable to get an estimate.";
            }
        }
    }
    const formValues = submitted ? request : history[0]?.request ?? {};
    const pricePerSqFt =
        estimate && request.square_footage
            ? Math.round(estimate.predicted_price / request.square_footage)
            : undefined;
    const metrics = estimate?.model_info?.metrics;

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider text-yellow-300">
                    Property Value Estimator
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Estimate a property&apos;s market value
                </h1>
                <p className="mt-3 text-slate-300">
                    Enter property details below to get an estimated market
                    value from the prediction model.
                </p>
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                <form
                    id="estimator-form"
                    method="get"
                    action="/estimator"
                    className="rounded-xl border-2 border-slate-600 bg-slate-800 p-6 shadow-lg"
                >
                    <fieldset>
                        <legend className="text-xl font-bold">
                            Property details
                        </legend>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            {fields.map(({ key, label, min, max, step, placeholder }) => (
                                <div key={key}>
                                    <label
                                        htmlFor={key}
                                        className="block text-sm font-semibold"
                                    >
                                        {label}
                                    </label>
                                    <input
                                        id={key}
                                        name={key}
                                        type="number"
                                        min={min}
                                        max={max}
                                        step={step}
                                        defaultValue={formValues[key]}
                                        placeholder={placeholder}
                                        required
                                        className={inputClassName}
                                    />
                                </div>
                            ))}
                        </div>
                    </fieldset>
                    <button
                        type="submit"
                        className="mt-7 w-full rounded-md bg-yellow-300 px-5 py-3 font-extrabold text-black hover:bg-yellow-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
                    >
                        Estimate property value
                    </button>
                    <p className="mt-3 text-xs text-slate-400">
                        Estimates come from a predictive model and are not a
                        formal valuation.
                    </p>
                </form>
                <aside
                    className="rounded-xl border-2 border-slate-600 bg-slate-950 p-6"
                    aria-live="polite"
                >
                    <p className="text-sm font-bold uppercase tracking-wider text-yellow-300">
                        Estimated value
                    </p>
                    <p id="estimate" className="mt-3 text-4xl font-black">
                        {estimate?.predicted_price_usd ?? "$XXX,XXX"}
                    </p>
                        <div className="mt-6 space-y-4 rounded-lg border-2 border-slate-700 bg-slate-900 p-4">
                            <p className="text-sm font-bold text-white">
                                Performance Metrics
                            </p>
                            <div className="flex justify-between border-b border-slate-700 pb-3 text-sm">
                                <span className="text-slate-300">R2 Score</span>
                                <strong>{metrics?.r2_score ?? "#.#########"}</strong>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-3 text-sm">
                                <span className="text-slate-300">
                                    Mean squared error
                                </span>
                                <strong>
                                    {metrics?.mean_squared_error?.toLocaleString("en-US") ?? "########.##"}
                                </strong>
                            </div>
                        </div>
                    
                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-lg border-2 border-red-500 bg-red-500 opacity-75 p-4 text-sm"
                        >
                            <p className="font-bold text-red-300">Error</p>
                            <p className="mt-1 text-red-200">{error}</p>
                        </div>
                    )}
                    <div className="mt-6 space-y-4">
                        <h2 className="my-2 font-bold">Previous Estimates</h2>
                        {history.length === 0 && (
                            <p className="text-sm text-slate-400 italic">
                                No previous estimates yet.
                            </p>
                        )}
                        {history.slice(0, 5).map((entry, index) => (
                            <div
                                key={index}
                                className="flex justify-between gap-3 border-b border-slate-700 pb-2 text-sm"
                            >
                                <span className="text-slate-300">
                                    {describe(entry.request)}
                                </span>
                                <strong>{entry.response.predicted_price_usd}</strong>
                            </div>
                        ))}
                        {history.length > 5 && (
                            <p className="text-sm text-slate-400 italic">
                                {history.length - 5} more estimates hidden..
                            </p>
                        )}
                    </div>
                </aside>
            </div>
        </section>
    );
}
