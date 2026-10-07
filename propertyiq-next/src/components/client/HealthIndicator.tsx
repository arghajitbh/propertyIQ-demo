"use client";

import { useEffect, useState } from "react";

type Status = "healthy" | "degraded" | "down";

interface Service {
  name: string;
  status: Status;
}

interface HealthIndicatorProps {
  services?: Service[];
}

const defaultServices: Service[] = [
  { name: "Market API", status: "down" },
  { name: "Estimator API", status: "down" },
  { name: "Prediction LLM", status: "down" },
];

const colors: Record<Status, string> = {
  healthy: "#22c55e",
  degraded: "#f59e0b",
  down: "#ef4444",
};

const labels: Record<Status, string> = {
  healthy: "All systems operational",
  degraded: "Partial degradation",
  down: "Service outage",
};

function overall(services: Service[]): Status {

  if (services.every((s) => s.status === "healthy")) return "healthy";
  if (services.every((s) => s.status === "down")) return "down";
  if (services.every((s) => s.status === "degraded")) return "degraded";
  if (services.some((s) => s.status === "healthy" || s.status === "degraded")) return "degraded";
  return "degraded";
}

const POLL_INTERVAL_MS = 10000;

export default function HealthIndicator({
  services: initialServices = defaultServices,
}: HealthIndicatorProps) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>(initialServices);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const data: Service[] = await fetch("/api/health").then((res) => res.json());
        if (!cancelled) setServices(data);
      } catch {
        if (!cancelled)
          setServices((prev) => prev.map((s) => ({ ...s, status: "down" })));
      }
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const status = overall(services);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "default",
          fontSize: 14,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: colors[status],
            display: "inline-block",
          }}
        />
        <span style={{ color: colors[status] }}>{labels[status]}</span>
        <span className={`visible md:hidden`} style={{ color: colors[status] }}>({services.filter((s) => s.status != "healthy").length}/{services.length} unhealthy)</span>
      </div>
      {open && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 6,
            padding: "8px 12px",
            background: "#1f2937",
            color: "#fff",
            borderRadius: 6,
            fontSize: 13,
            minWidth: 180,
            zIndex: 50,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {services.slice(0, 3).map((s) => (
            <div
              key={s.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "2px 0",
              }}
            >
              <span>{s.name}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: colors[s.status],
                    display: "inline-block",
                  }}
                />
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
