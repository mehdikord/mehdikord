import { useId } from "react";

import { cn } from "@/lib/utils";

import { Avatar, Bar, Button, Chip, Label, Panel, Sidebar, Window } from "./kit";

/* ── Commerce storefront ────────────────────────────────────────────────── */

const products = [
  { shape: "rounded-full", rotate: 0 },
  { shape: "rounded-[0.8cqw]", rotate: 12 },
  { shape: "rounded-t-full", rotate: 0 },
  { shape: "rounded-[2cqw]", rotate: -8 },
  { shape: "rounded-full", rotate: 0 },
  { shape: "rounded-[0.6cqw]", rotate: 45 },
];

export function CommercePreview() {
  return (
    <div className="pv-bg pv-text flex size-full flex-col overflow-hidden">
      <div className="pv-line flex h-[5cqw] shrink-0 items-center gap-[2cqw] border-b px-[2.2cqw]">
        <span className="text-[1.5cqw] font-semibold tracking-[0.3em]">MAISON</span>
        <span className="pv-muted flex gap-[1.6cqw] text-[1cqw]">
          <span className="pv-text">New in</span>
          <span>Women</span>
          <span>Men</span>
          <span>Home</span>
          <span>Journal</span>
        </span>
        <span className="ml-auto flex items-center gap-[1cqw]">
          <span className="pv-raised pv-line block h-[2.2cqw] w-[13cqw] rounded-full border" />
          <span className="pv-accent-bg relative block size-[2.2cqw] rounded-full">
            <span className="absolute -top-[0.3cqw] -right-[0.3cqw] block size-[1.1cqw] rounded-full bg-white" />
          </span>
        </span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col gap-[1.4cqw] p-[2cqw]">
          <div className="pv-accent-grad relative flex h-[38%] shrink-0 items-center overflow-hidden rounded-[1cqw] px-[3cqw]">
            <div className="relative z-10 flex flex-col gap-[0.8cqw] text-white">
              <span className="text-[0.9cqw] tracking-[0.3em] uppercase opacity-80">Autumn edit</span>
              <span className="font-serif text-[3cqw] leading-none italic">The quiet season</span>
              <span className="mt-[0.6cqw] inline-flex w-fit rounded-full bg-white px-[1.2cqw] py-[0.6cqw] text-[0.9cqw] font-medium text-black">
                Shop collection
              </span>
            </div>
            <span className="absolute top-1/2 right-[8%] block size-[18cqw] -translate-y-1/2 rounded-full border-[0.2cqw] border-white/40" />
            <span className="absolute top-1/2 right-[14%] block size-[10cqw] -translate-y-1/2 rounded-full bg-white/25 backdrop-blur" />
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-3 gap-[1.2cqw]">
            {products.map((product, index) => (
              <div key={index} className="flex min-h-0 flex-col gap-[0.6cqw]">
                <div className="pv-raised flex min-h-0 flex-1 items-center justify-center rounded-[0.8cqw]">
                  <span
                    className={cn("pv-accent-grad block size-[38%] opacity-80", product.shape)}
                    style={{ transform: `rotate(${product.rotate}deg)`, filter: `hue-rotate(${index * 28}deg)` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Bar w={55} tone="strong" />
                  <Bar w={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pv-line pv-panel flex w-[30%] shrink-0 flex-col gap-[1.2cqw] border-l p-[1.8cqw]">
          <div className="flex items-center justify-between">
            <Label className="text-[1.4cqw]">Your bag</Label>
            <Chip>3 items</Chip>
          </div>
          {[0, 1, 2].map((item) => (
            <div key={item} className="pv-line flex items-center gap-[1cqw] border-b pb-[1cqw]">
              <span className="pv-raised flex size-[4.4cqw] shrink-0 items-center justify-center rounded-[0.6cqw]">
                <span
                  className="pv-accent-grad block size-[50%] rounded-full opacity-80"
                  style={{ filter: `hue-rotate(${item * 40}deg)` }}
                />
              </span>
              <div className="flex flex-1 flex-col gap-[0.5cqw]">
                <Bar w={78} tone="strong" />
                <Bar w={42} />
              </div>
            </div>
          ))}
          <div className="mt-auto flex flex-col gap-[0.7cqw]">
            {[0, 1].map((row) => (
              <div key={row} className="flex justify-between">
                <Bar w={30} />
                <Bar w={16} />
              </div>
            ))}
            <div className="flex justify-between">
              <Bar w={26} tone="strong" />
              <Bar w={20} tone="strong" />
            </div>
            <Button className="mt-[0.8cqw] w-full py-[1cqw]">Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Map search (real estate, dispatch) ─────────────────────────────────── */

const pins = [
  { x: 22, y: 30 },
  { x: 41, y: 22 },
  { x: 58, y: 44, active: true },
  { x: 33, y: 58 },
  { x: 72, y: 28 },
  { x: 66, y: 70 },
  { x: 18, y: 76 },
  { x: 84, y: 54 },
];

export function MapPreview() {
  return (
    <Window title="Keystone · Map search">
      <div className="flex h-full">
        <div className="pv-raised relative min-w-0 flex-1 overflow-hidden">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
            <path d="M-10 210 C60 190 110 240 180 220 S300 150 410 170" fill="none" stroke="var(--ps)" strokeWidth="18" />
            <rect x="250" y="190" width="70" height="55" rx="10" fill="var(--ps)" opacity="0.6" />
            <rect x="40" y="40" width="55" height="40" rx="8" fill="var(--ps)" opacity="0.5" />
            {[40, 95, 150, 205, 260].map((y) => (
              <line key={`h${y}`} x1="0" x2="400" y1={y} y2={y + 8} stroke="var(--pv-bar-strong)" strokeWidth="1.2" />
            ))}
            {[60, 130, 200, 270, 340].map((x) => (
              <line key={`v${x}`} x1={x} x2={x - 14} y1="0" y2="300" stroke="var(--pv-bar-strong)" strokeWidth="1.2" />
            ))}
            <path d="M0 120 L400 60" stroke="var(--pv-bar-strong)" strokeWidth="3" />
            <circle cx="232" cy="132" r="46" fill="var(--pa)" opacity="0.08" stroke="var(--pa)" strokeOpacity="0.5" strokeDasharray="4 4" />
          </svg>
          {pins.map((pin, index) => (
            <span
              key={index}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-full items-center rounded-full px-[0.8cqw] py-[0.35cqw] text-[0.8cqw] font-semibold whitespace-nowrap",
                pin.active ? "pv-accent-grad z-10 text-white shadow-[0_0.4cqw_1.4cqw_var(--ps)]" : "pv-panel pv-line border",
              )}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <span className={cn("block h-[0.5cqw] rounded-full", pin.active ? "w-[3.2cqw] bg-white/90" : "pv-bar-strong-bg w-[2.4cqw]")} />
            </span>
          ))}
          <Panel className="absolute top-[52%] left-[58%] z-10 w-[24%] overflow-hidden shadow-[0_1cqw_3cqw_rgb(0_0_0/0.35)]">
            <span className="pv-accent-grad block h-[6cqw] opacity-80" />
            <div className="flex flex-col gap-[0.6cqw] p-[0.9cqw]">
              <Bar w={80} tone="strong" />
              <Bar w={55} />
            </div>
          </Panel>
          <Panel className="absolute top-[1.4cqw] left-[1.4cqw] flex w-[44%] items-center gap-[0.8cqw] px-[1cqw] py-[0.8cqw]">
            <span className="pv-accent-line block size-[1.2cqw] rounded-full border-2" />
            <Bar w={60} />
          </Panel>
          <div className="absolute right-[1.4cqw] bottom-[1.4cqw] flex flex-col overflow-hidden rounded-[0.5cqw] border pv-line">
            <span className="pv-panel pv-line flex size-[2.4cqw] items-center justify-center border-b text-[1.2cqw]">+</span>
            <span className="pv-panel flex size-[2.4cqw] items-center justify-center text-[1.2cqw]">−</span>
          </div>
        </div>
        <div className="pv-line flex w-[34%] shrink-0 flex-col gap-[1cqw] border-l p-[1.4cqw]">
          <div className="flex flex-wrap gap-[0.5cqw]">
            <Chip active>For sale</Chip>
            <Chip>2+ beds</Chip>
            <Chip>Garden</Chip>
          </div>
          {[0, 1, 2].map((listing) => (
            <Panel key={listing} className={cn("flex gap-[1cqw] p-[0.8cqw]", listing === 0 && "pv-accent-line")}>
              <span
                className="pv-accent-grad block aspect-[4/3] w-[42%] shrink-0 rounded-[0.5cqw] opacity-70"
                style={{ filter: `hue-rotate(${listing * 35}deg)` }}
              />
              <div className="flex flex-1 flex-col justify-center gap-[0.6cqw]">
                <Bar w={52} h={0.9} tone="strong" />
                <Bar w={80} />
                <div className="mt-[0.3cqw] flex gap-[0.4cqw]">
                  {[0, 1, 2].map((feature) => (
                    <span key={feature} className="pv-raised block h-[1.3cqw] w-[2.6cqw] rounded-[0.3cqw]" />
                  ))}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </Window>
  );
}

/* ── Analytics overview ─────────────────────────────────────────────────── */

const heat = [
  3, 5, 2, 6, 8, 4, 1, 4, 7, 9, 5, 2, 6, 3, 2, 5, 7, 8, 6, 3, 1, 5, 8, 9, 7, 4, 2, 4, 1, 3, 6, 7, 9, 6, 3, 2, 4, 6,
  5, 8, 7, 5, 2, 1, 3, 2, 4, 6, 5, 3, 1, 2, 3, 5, 7, 6, 4, 2, 1, 3,
];
const bars = [42, 58, 36, 70, 54, 82, 64, 48, 76, 60];

export function AnalyticsPreview() {
  const areaId = useId();
  return (
    <Window title="Prism · Overview">
      <div className="flex h-full">
        <Sidebar active={0} count={5} />
        <div className="grid min-w-0 flex-1 grid-cols-12 grid-rows-[auto_1fr_1fr] gap-[1.2cqw] p-[1.8cqw]">
          <div className="col-span-12 flex items-center gap-[1cqw]">
            <Label className="text-[1.7cqw]">Operational events</Label>
            <div className="ml-auto flex gap-[0.5cqw]">
              <Chip>24h</Chip>
              <Chip active>7d</Chip>
              <Chip>30d</Chip>
            </div>
          </div>
          <Panel className="col-span-8 flex flex-col p-[1.3cqw]">
            <div className="flex items-center gap-[1.4cqw]">
              <Label>Throughput</Label>
              <span className="flex items-center gap-[0.4cqw]">
                <span className="pv-accent-bg block size-[0.7cqw] rounded-full" />
                <Bar w={40} className="!w-[4cqw]" />
              </span>
              <span className="flex items-center gap-[0.4cqw]">
                <span className="pv-bar-strong-bg block size-[0.7cqw] rounded-full" />
                <Bar w={40} className="!w-[4cqw]" />
              </span>
            </div>
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="mt-[0.8cqw] w-full flex-1">
              <defs>
                <linearGradient id={areaId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--pa)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--pa)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 70 C25 60 40 72 65 55 S110 30 140 42 S190 58 215 34 S265 20 300 26 V100 H0Z" fill={`url(#${areaId})`} />
              <path d="M0 70 C25 60 40 72 65 55 S110 30 140 42 S190 58 215 34 S265 20 300 26" fill="none" stroke="var(--pa)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d="M0 84 C30 80 55 86 80 76 S130 70 160 74 S220 62 250 64 S285 56 300 58" fill="none" stroke="var(--pv-bar-strong)" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            </svg>
          </Panel>
          <Panel className="col-span-4 flex flex-col items-center justify-center gap-[1cqw] p-[1.3cqw]">
            <svg viewBox="0 0 100 100" className="w-[62%]">
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--pv-bar)" strokeWidth="11" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--pa)" strokeWidth="11" strokeDasharray="150 239" strokeLinecap="round" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--pb)" strokeWidth="11" strokeDasharray="44 239" strokeDashoffset="-158" strokeLinecap="round" transform="rotate(-90 50 50)" opacity="0.7" />
            </svg>
            <div className="flex w-full justify-center gap-[1cqw]">
              <Bar w={22} tone="accent" />
              <Bar w={22} />
            </div>
          </Panel>
          <Panel className="col-span-5 flex flex-col gap-[0.8cqw] p-[1.3cqw]">
            <Label>Activity by hour</Label>
            <div className="grid flex-1 grid-cols-12 gap-[0.3cqw]">
              {heat.map((value, index) => (
                <span key={index} className="pv-accent-bg block rounded-[0.2cqw]" style={{ opacity: 0.08 + value * 0.1 }} />
              ))}
            </div>
          </Panel>
          <Panel className="col-span-4 flex flex-col gap-[0.8cqw] p-[1.3cqw]">
            <Label>Segments</Label>
            <div className="flex flex-1 items-end gap-[0.5cqw]">
              {bars.map((height, index) => (
                <span
                  key={index}
                  className={cn("block flex-1 rounded-t-[0.3cqw]", index === 5 ? "pv-accent-grad" : "pv-bar-strong-bg")}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </Panel>
          <Panel className="col-span-3 flex flex-col gap-[0.9cqw] p-[1.3cqw]">
            <Label>Sources</Label>
            {[72, 58, 44, 30].map((width, index) => (
              <div key={width} className="flex flex-col gap-[0.4cqw]">
                <Bar w={50} />
                <span className="pv-raised block h-[0.6cqw] w-full overflow-hidden rounded-full">
                  <span className={cn("block h-full rounded-full", index === 0 ? "pv-accent-bg" : "pv-bar-strong-bg")} style={{ width: `${width}%` }} />
                </span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Window>
  );
}

/* ── Workflow builder (internal tools) ──────────────────────────────────── */

const flowNodes = [
  { x: 6, y: 14, kind: "Trigger", name: "Ticket tagged “refund”" },
  { x: 36, y: 14, kind: "Condition", name: "Amount above limit?" },
  { x: 66, y: 4, kind: "Action", name: "Request approval", active: true },
  { x: 66, y: 40, kind: "Action", name: "Issue refund" },
  { x: 36, y: 62, kind: "Action", name: "Notify customer" },
  { x: 6, y: 62, kind: "Action", name: "Write ledger entry" },
];

export function WorkflowPreview() {
  return (
    <Window title="Relay · Workflows / Refund approval">
      <div className="flex h-full">
        <div
          className="relative min-w-0 flex-1 overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(circle, var(--pv-bar-strong) 0.09cqw, transparent 0.12cqw)",
            backgroundSize: "1.8cqw 1.8cqw",
          }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
            <g fill="none" stroke="var(--pa)" strokeWidth="0.35" vectorEffect="non-scaling-stroke" opacity="0.8">
              <path d="M30 22 C33 22 33 22 36 22" vectorEffect="non-scaling-stroke" />
              <path d="M60 20 C63 20 63 12 66 12" vectorEffect="non-scaling-stroke" />
              <path d="M60 24 C63 24 63 48 66 48" vectorEffect="non-scaling-stroke" />
              <path d="M78 58 C78 66 66 70 60 70" vectorEffect="non-scaling-stroke" strokeDasharray="1.2 1.2" />
              <path d="M36 70 C33 70 33 70 30 70" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          {flowNodes.map((node) => (
            <Panel
              key={node.name}
              className={cn(
                "absolute flex w-[24%] items-center gap-[0.8cqw] overflow-hidden py-[0.9cqw] pr-[0.8cqw] pl-[1cqw]",
                node.active && "pv-accent-line shadow-[0_0_0_1px_var(--pa),0_1cqw_2.4cqw_var(--ps)]",
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <span className={cn("absolute inset-y-0 left-0 w-[0.3cqw]", node.kind === "Trigger" ? "pv-accent-bg" : node.kind === "Condition" ? "pv-bar-strong-bg" : "pv-soft-bg")} />
              <span className="pv-soft-bg flex size-[2.2cqw] shrink-0 items-center justify-center rounded-[0.5cqw]">
                <span className="pv-accent-bg block size-[0.8cqw] rounded-[0.2cqw]" />
              </span>
              <span className="flex min-w-0 flex-col gap-[0.25cqw]">
                <span className="pv-muted font-mono text-[0.7cqw] tracking-wider uppercase">{node.kind}</span>
                <Label className="text-[0.95cqw]">{node.name}</Label>
              </span>
            </Panel>
          ))}
          <div className="absolute bottom-[1.4cqw] left-[1.4cqw] flex gap-[0.5cqw]">
            <Chip active>v14 · live</Chip>
            <Chip>Last run 2m ago</Chip>
          </div>
        </div>
        <div className="pv-line pv-panel flex w-[26%] shrink-0 flex-col gap-[1.1cqw] border-l p-[1.6cqw]">
          <Label className="text-[1.3cqw]">Step settings</Label>
          <span className="pv-muted font-mono text-[0.8cqw] uppercase">Request approval</span>
          {[60, 40, 52].map((width, index) => (
            <div key={index} className="flex flex-col gap-[0.5cqw]">
              <Bar w={width} />
              <span className="pv-raised pv-line block h-[2.4cqw] rounded-[0.5cqw] border" />
            </div>
          ))}
          <div className="flex items-center justify-between">
            <Bar w={48} />
            <span className="pv-accent-bg relative block h-[1.4cqw] w-[2.6cqw] rounded-full">
              <span className="absolute top-1/2 right-[0.2cqw] block size-[1cqw] -translate-y-1/2 rounded-full bg-white" />
            </span>
          </div>
          <div className="mt-auto flex items-center gap-[0.6cqw]">
            <Avatar size={1.8} hue={0} />
            <Avatar size={1.8} hue={60} />
            <Button className="ml-auto">Save</Button>
          </div>
        </div>
      </div>
    </Window>
  );
}
