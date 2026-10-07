"use client";

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
    url: process.env.NEXT_ESTIMATOR_SERVICE_URL ?? "http://localhost:8000",
    healthEndpointPath: "/health"
  },
  {
    name: "Prediction LLM",
    url: process.env.NEXT_PREDICTION_SERVICE_URL ?? "http://localhost:8001",
    healthEndpointPath: "/health"
  },
];

async function check(url: string, healthEndpointPath: string = "/health"): Promise<"healthy" | "degraded" | "down"> {
  try {
    const res = await fetch(`${url}${healthEndpointPath}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    // Any non-5xx response means the service is reachable.
    return res.status >= 500 ? "degraded" : "healthy";
  } catch {
    return "down";
  }
}

export async function GET() {
  console.log("Checking health of services...");
  const services = await Promise.all(
    targets.map(async (t) => ({ name: t.name, status: await check(t.url, t.healthEndpointPath) }))
  );
  const formatted_services: Service[] = services.map((s) => ({
    name: s.name,
    status: s.status,
  }));
  console.log("Health check results:", formatted_services);
  return formatted_services;
}
