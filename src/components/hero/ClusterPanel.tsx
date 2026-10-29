"use client";

/*
 * Live topology of a production cluster: edge → load balancer → three
 * stateless app nodes → cache, primary database and read replica. Packets
 * travel the request path, each node carries a heartbeat LED and the app
 * nodes show a breathing CPU gauge. Labels are intentionally English and
 * left-to-right, as a console would be.
 */

interface ClusterNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  /** App nodes: accent border and a CPU gauge. */
  app?: boolean;
  /** Seconds per CPU gauge cycle, so the three nodes never move in step. */
  cycle?: number;
}

const W = 104;

const nodes: ClusterNode[] = [
  { id: "edge", x: 148, y: 10, w: W, h: 30, label: "EDGE", sub: "cdn · waf · tls" },
  { id: "lb", x: 148, y: 60, w: W, h: 30, label: "LOAD BALANCER", sub: "nginx · http/3" },
  { id: "app-1", x: 16, y: 116, w: W, h: 44, label: "APP 01", sub: "laravel · php 8.4", app: true, cycle: 5.2 },
  { id: "app-2", x: 148, y: 116, w: W, h: 44, label: "APP 02", sub: "laravel · php 8.4", app: true, cycle: 6.4 },
  { id: "app-3", x: 280, y: 116, w: W, h: 44, label: "APP 03", sub: "laravel · php 8.4", app: true, cycle: 4.6 },
  { id: "redis", x: 16, y: 190, w: W, h: 32, label: "REDIS", sub: "cache · queue" },
  { id: "db", x: 148, y: 190, w: W, h: 32, label: "MYSQL", sub: "primary · innodb" },
  { id: "replica", x: 280, y: 190, w: W, h: 32, label: "REPLICA", sub: "read · reporting" },
];

const edges = [
  "M200 40V60",
  "M200 90V102H68V116",
  "M200 90V116",
  "M200 90V102H332V116",
  "M68 160V190",
  "M200 160V190",
  "M332 160V190",
];

/** Request path packets: path, duration and start offset in seconds. */
const packets = [
  { d: "M200 40V60", dur: 1.6, begin: 0 },
  { d: "M200 90V102H68V116", dur: 2.2, begin: 0.6 },
  { d: "M200 90V116", dur: 1.8, begin: 1.1 },
  { d: "M200 90V102H332V116", dur: 2.2, begin: 1.5 },
  { d: "M68 160V190", dur: 1.9, begin: 0.9 },
  { d: "M200 160V190", dur: 1.7, begin: 0.2 },
  { d: "M332 160V190", dur: 2.1, begin: 1.3 },
  { d: "M252 206H280", dur: 2.6, begin: 0.4 },
];

export function ClusterPanel({ running }: { running: boolean }) {
  return (
    <div className="glass-card overflow-hidden">
      {/* The latency tile overlaps the top-right corner: keep the header clear of it. */}
      <div className="flex items-center gap-3 border-b border-line ps-4 pe-[4.5rem] py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-tint/15" />
          <span className="size-2 rounded-full bg-tint/15" />
          <span className="size-2 rounded-full bg-accent/70" />
        </span>
        <span className="font-mono text-[0.6875rem] tracking-[0.12em] whitespace-nowrap text-fg-muted uppercase">prod-cluster</span>
        <span className="ms-auto flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.1em] whitespace-nowrap text-fg-subtle uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-signal" />
          3/3 healthy
        </span>
      </div>

      <div className="relative px-4 pt-4 pb-3">
        <div aria-hidden className="hairline-grid absolute inset-0 opacity-50 [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)]" />
        {running ? <div aria-hidden className="hero-scan" /> : null}

        <svg viewBox="0 0 400 232" className="relative h-auto w-full" aria-hidden>
          <g fill="none" style={{ stroke: "var(--color-line-strong)" }} strokeWidth={1}>
            {edges.map((d) => (
              <path key={d} d={d} />
            ))}
            <path d="M252 206H280" strokeDasharray="3 4" />
          </g>

          <g fill="none" style={{ stroke: "var(--color-accent)" }} strokeOpacity={0.5} strokeWidth={1} strokeLinecap="round">
            {edges.map((d) => (
              <path key={d} d={d} className="flow-line" />
            ))}
          </g>

          {running
            ? packets.map((packet) => (
                <g key={packet.d}>
                  <circle r={5} style={{ fill: "var(--color-accent)" }} fillOpacity={0.22}>
                    <animateMotion
                      path={packet.d}
                      dur={`${packet.dur}s`}
                      begin={`${packet.begin}s`}
                      repeatCount="indefinite"
                      calcMode="linear"
                    />
                  </circle>
                  <circle r={2} style={{ fill: "var(--t-spark)" }}>
                    <animateMotion
                      path={packet.d}
                      dur={`${packet.dur}s`}
                      begin={`${packet.begin}s`}
                      repeatCount="indefinite"
                      calcMode="linear"
                    />
                  </circle>
                </g>
              ))
            : null}

          {nodes.map((node, index) => (
            <g key={node.id}>
              <rect
                x={node.x + 0.5}
                y={node.y + 0.5}
                width={node.w}
                height={node.h}
                rx={5}
                style={{
                  fill: node.app ? "var(--color-accent-soft)" : "var(--color-ink-900)",
                  stroke: node.app ? "var(--color-accent)" : "var(--color-line-strong)",
                  strokeOpacity: node.app ? 0.6 : 1,
                }}
              />
              <text x={node.x + 11} y={node.y + 14} className="fill-fg font-mono" fontSize={8.5} letterSpacing={1}>
                {node.label}
              </text>
              <text x={node.x + 11} y={node.y + 25} className="fill-fg-subtle font-mono" fontSize={7.5}>
                {node.sub}
              </text>
              <circle
                cx={node.x + node.w - 11}
                cy={node.y + 11}
                r={2.2}
                className="hero-led"
                style={{ fill: "var(--color-signal)", animationDelay: `${-index * 0.37}s` }}
              />
              {node.app ? (
                <g>
                  <rect x={node.x + 11} y={node.y + 33} width={node.w - 22} height={3} rx={1.5} style={{ fill: "var(--color-line)" }} />
                  <rect
                    x={node.x + 11}
                    y={node.y + 33}
                    width={node.w - 22}
                    height={3}
                    rx={1.5}
                    className="hero-cpu"
                    style={{ fill: "var(--color-accent)", animationDuration: `${node.cycle}s`, animationDelay: `${-index * 1.3}s` }}
                  />
                </g>
              ) : null}
            </g>
          ))}

          <text x={266} y={201} className="fill-fg-subtle font-mono" fontSize={6.5} letterSpacing={1} textAnchor="end">
            REPL
          </text>
        </svg>
      </div>
    </div>
  );
}
