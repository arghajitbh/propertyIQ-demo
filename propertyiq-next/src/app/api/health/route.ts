
export const dynamic = "force-dynamic";
type Status = "healthy" | "degraded" | "down";

interface Service {
  name: string;
  status: Status;
}
const targets = [
  {
    name: "Market API",
    url: process.env.NEXT_MARKET_SERVICE_URL ?? "http://localhost:8081",
    healthEndpointPath: "/actuator/health"
  },
  {
    name: "Estimator API",
    url: process.env.NEXT_ESTIMATOR_SERVICE_URL ?? "http://localhost:8002",
    healthEndpointPath: "/api/estimator/health"
  },
  {
    name: "Prediction LLM",
    url: process.env.NEXT_PREDICTION_SERVICE_URL ?? "http://localhost:8001",
    healthEndpointPath: "/api/health"
  },
];

async function check(url: string, healthEndpointPath: string = "/health"): Promise<"healthy" | "degraded" | "down"> {
  let callingUrl = `${url}${healthEndpointPath}`;
  try {
    
    const res = await fetch(callingUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    console.log(`${callingUrl} => ${res.status}`);
    return (res.status >= 200 && res.status <= 202) 
      ? "healthy"
      : (res.status >= 500
        ? "degraded"
        : "down");
  } catch(err) {
    console.log(`${callingUrl} => ${err}`);
    return "down";
  }
}

export async function GET() {
  console.log("Checking health of services...");
  const services = await Promise.all(
    targets.map(async (t) => ({ name: t.name, status: await check(t.url, t.healthEndpointPath) }))
  );
  console.log("Health check results:", services);
  return new Response(JSON.stringify(services), {
    headers: { "Content-Type": "application/json" },
  });
}