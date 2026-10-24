"use client";

import { m } from "motion/react";

import { ease, viewportOnce } from "@/components/motion/motion-variants";

interface DiagramNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  accent?: boolean;
}

const NODE_W = 136;

const nodes: DiagramNode[] = [
  { id: "clients", x: 150, y: 12, w: 180, h: 44, label: "Clients", sub: "web · mobile · partners" },
  { id: "lb", x: 165, y: 100, w: 150, h: 44, label: "Load balancer", sub: "nginx · tls" },
  { id: "app-1", x: 18, y: 192, w: NODE_W, h: 50, label: "App node 01", sub: "laravel · stateless", accent: true },
  { id: "app-2", x: 172, y: 192, w: NODE_W, h: 50, label: "App node 02", sub: "laravel · stateless", accent: true },
  { id: "app-3", x: 326, y: 192, w: NODE_W, h: 50, label: "App node 03", sub: "laravel · stateless", accent: true },
  { id: "cache", x: 18, y: 296, w: NODE_W, h: 44, label: "Cache", sub: "redis" },
  { id: "queue", x: 172, y: 296, w: NODE_W, h: 44, label: "Queue", sub: "redis · horizon" },
  { id: "search", x: 326, y: 296, w: NODE_W, h: 44, label: "Search", sub: "full-text index" },
  { id: "db", x: 18, y: 392, w: NODE_W, h: 44, label: "Primary DB", sub: "mysql · postgres" },
  { id: "workers", x: 172, y: 392, w: NODE_W, h: 44, label: "Workers", sub: "jobs · events" },
  { id: "apis", x: 326, y: 392, w: NODE_W, h: 44, label: "Integrations", sub: "payments · mail · apis" },
  { id: "replica", x: 18, y: 470, w: NODE_W, h: 40, label: "Read replica", sub: "reporting" },
];

const edges = [
  "M240 56V100",
  "M240 144V168H86V192",
  "M240 168V192",
  "M240 168H394V192",
  "M86 242V296",
  "M240 242V296",
  "M394 242V296",
  "M240 340V392",
  "M172 414H154",
  "M308 414H326",
  "M18 217H8V414H18",
];

/** The primary request path, overlaid with slowly moving data dashes. */
const flows = ["M240 56V100", "M240 144V168H86V192", "M240 168H394V192", "M240 242V296", "M240 340V392", "M308 414H326"];

export function ArchitectureDiagram() {
  return (
    <m.svg
      viewBox="0 0 480 520"
      className="h-auto w-full"
      aria-hidden
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <g fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth={1}>
        {edges.map((d, index) => (
          <m.path
            key={d}
            d={d}
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.9, ease: ease.inOutQuart, delay: 0.3 + index * 0.05 },
              },
            }}
          />
        ))}
        <path d="M86 436V470" strokeDasharray="3 4" />
      </g>

      <g fill="none" stroke="#9b7bff" strokeWidth={1.25} strokeLinecap="round">
        {flows.map((d) => (
          <path key={d} d={d} className="flow-line" opacity={0.85} />
        ))}
      </g>

      <text x={96} y={457} className="fill-fg-subtle font-mono" fontSize={8.5} letterSpacing={1}>
        REPLICATION
      </text>

      {nodes.map((node, index) => (
        <m.g
          key={node.id}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6, delay: 0.1 + index * 0.06 } },
          }}
        >
          <rect
            x={node.x + 0.5}
            y={node.y + 0.5}
            width={node.w}
            height={node.h}
            rx={5}
            fill={node.accent ? "rgb(155 123 255 / 0.08)" : "#0b0b10"}
            stroke={node.accent ? "rgb(155 123 255 / 0.55)" : "rgb(255 255 255 / 0.14)"}
          />
          <text
            x={node.x + 12}
            y={node.y + 19}
            className="fill-fg font-mono"
            fontSize={10}
            letterSpacing={1.1}
          >
            {node.label.toUpperCase()}
          </text>
          <text x={node.x + 12} y={node.y + 33} className="fill-fg-subtle font-mono" fontSize={9}>
            {node.sub}
          </text>
          {node.accent ? <circle cx={node.x + node.w - 12} cy={node.y + 15} r={2.5} fill="#4ade80" /> : null}
        </m.g>
      ))}
    </m.svg>
  );
}
