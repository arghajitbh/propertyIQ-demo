import HealthIndicator from "../client/HealthIndicator";

export default function Nav() {
    return (
        <nav className="border-b-2 border-white bg-slate-950" aria-label="Primary navigation">
            <div className="mx-auto flex flex-col md:flex-row max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <a href="/estimator" className="rounded-md text-lg font-bold tracking-tight text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300">PropertyIQ</a>
                    <HealthIndicator />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <a href="/estimator" className="rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300">Estimator</a>
                    <a href="/market" className="rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300">Market Analysis</a>
                </div>
            </div>
        </nav>
    );
}