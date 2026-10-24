import { useId } from "react";

import { cn } from "@/lib/utils";

import { Avatar, Bar, Button, Chip, Label, Panel, Sidebar, Window } from "./kit";

/* ── CRM pipeline board ─────────────────────────────────────────────────── */

const pipeline: { name: string; cards: [number, number][]; highlight?: number }[] = [
  { name: "Lead", cards: [[70, 42], [55, 62], [78, 35]] },
  { name: "Qualified", cards: [[64, 50], [72, 44]] },
  { name: "Proposal", cards: [[58, 70], [76, 38], [50, 56]], highlight: 0 },
  { name: "Closed won", cards: [[68, 46]] },
];

export function CrmPreview() {
  return (
    <Window title="Atlas · Pipeline">
      <div className="flex h-full">
        <Sidebar active={2} />
        <div className="flex min-w-0 flex-1 flex-col gap-[1.4cqw] p-[1.8cqw]">
          <div className="flex items-center gap-[1cqw]">
            <Label className="text-[1.7cqw]">Enterprise pipeline</Label>
            <div className="ml-[1cqw] flex gap-[0.5cqw]">
              <Chip active>Board</Chip>
              <Chip>List</Chip>
              <Chip>Forecast</Chip>
            </div>
            <Button className="ml-auto">New deal</Button>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-4 gap-[1.2cqw]">
            {pipeline.map((column) => (
              <div key={column.name} className="pv-raised flex flex-col gap-[0.8cqw] rounded-[0.8cqw] p-[0.9cqw]">
                <div className="flex items-center justify-between px-[0.2cqw]">
                  <Label className="pv-muted">{column.name}</Label>
                  <span className="pv-panel pv-muted rounded-full px-[0.6cqw] py-[0.2cqw] text-[0.8cqw]">
                    {column.cards.length}
                  </span>
                </div>
                {column.cards.map(([title, detail], index) => (
                  <Panel
                    key={index}
                    className={cn(
                      "flex flex-col gap-[0.7cqw] p-[0.9cqw]",
                      column.highlight === index && "pv-accent-line shadow-[0_0_0_1px_var(--pa)]",
                    )}
                  >
                    <div className="flex items-center gap-[0.6cqw]">
                      <Avatar size={1.8} hue={index * 50} />
                      <Bar w={title} tone="strong" />
                    </div>
                    <Bar w={detail} />
                    <div className="flex items-center justify-between">
                      <span className="pv-soft-bg block h-[1.3cqw] w-[30%] rounded-full" />
                      <Bar w={20} tone="accent" />
                    </div>
                  </Panel>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

/* ── Orders table (business systems) ────────────────────────────────────── */

const statuses = ["Paid", "Pending", "Paid", "Overdue", "Paid", "Draft", "Paid", "Pending"] as const;
const customerWidths = [62, 48, 70, 55, 66, 44, 58, 50];

export function TablePreview() {
  return (
    <Window title="Ledgerline · Orders">
      <div className="flex h-full">
        <div className="flex min-w-0 flex-1 flex-col gap-[1.2cqw] p-[1.8cqw]">
          <div className="flex items-center gap-[0.8cqw]">
            <Label className="text-[1.7cqw]">Sales orders</Label>
            <span className="pv-raised pv-line ml-[1cqw] block h-[2.4cqw] w-[22%] rounded-[0.5cqw] border" />
            <Chip active>Status</Chip>
            <Chip>This month</Chip>
            <Chip>Region</Chip>
            <Button className="ml-auto">Create order</Button>
          </div>
          <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="pv-line pv-muted grid grid-cols-[1fr_2fr_1.2fr_1fr_1fr] gap-[1cqw] border-b px-[1.4cqw] py-[0.9cqw] text-[0.85cqw] font-medium tracking-wide uppercase">
              <span>Order</span>
              <span>Customer</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-right">Total</span>
            </div>
            {statuses.map((status, index) => (
              <div
                key={index}
                className={cn(
                  "pv-line grid grid-cols-[1fr_2fr_1.2fr_1fr_1fr] items-center gap-[1cqw] border-b px-[1.4cqw] py-[0.85cqw] last:border-b-0",
                  index === 2 && "pv-soft-bg",
                )}
              >
                <span className="font-mono text-[0.9cqw]">SO-{1041 + index}</span>
                <span className="flex items-center gap-[0.6cqw]">
                  <Avatar size={1.5} hue={index * 35} />
                  <Bar w={customerWidths[index]} tone="strong" />
                </span>
                <Bar w={60} />
                <span>
                  <span
                    className={cn(
                      "inline-block rounded-full px-[0.7cqw] py-[0.25cqw] text-[0.8cqw] font-medium",
                      status === "Paid" && "pv-soft-bg pv-accent",
                      status === "Pending" && "pv-raised pv-muted",
                      status === "Overdue" && "bg-[rgb(244_114_182/0.16)] text-[rgb(236_72_153)]",
                      status === "Draft" && "pv-muted",
                    )}
                  >
                    {status}
                  </span>
                </span>
                <span className="flex justify-end">
                  <Bar w={52} tone="strong" />
                </span>
              </div>
            ))}
          </Panel>
        </div>
        <div className="pv-line flex w-[27%] shrink-0 flex-col gap-[1.2cqw] border-l p-[1.6cqw]">
          <Label className="font-mono text-[1.2cqw]">SO-1043</Label>
          <Bar w={70} tone="strong" />
          <Bar w={45} />
          <div className="mt-[0.6cqw] flex flex-col gap-[1cqw]">
            {["Created", "Approved", "Picked", "Shipped"].map((step, index) => (
              <div key={step} className="flex items-center gap-[0.8cqw]">
                <span
                  className={cn(
                    "block size-[1.1cqw] rounded-full border",
                    index < 3 ? "pv-accent-bg pv-accent-line" : "pv-line",
                  )}
                />
                <Label className={index < 3 ? "" : "pv-muted"}>{step}</Label>
              </div>
            ))}
          </div>
          <Panel className="mt-auto flex flex-col gap-[0.8cqw] p-[1.1cqw]">
            {[66, 52, 74].map((width) => (
              <div key={width} className="flex items-center justify-between">
                <Bar w={width} />
                <Bar w={14} tone="strong" />
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Window>
  );
}

/* ── Subscription & billing ─────────────────────────────────────────────── */

const plans = [
  { name: "Starter", features: [64, 52, 70] },
  { name: "Growth", features: [70, 58, 66, 48], current: true },
  { name: "Scale", features: [60, 72, 54, 62] },
];

export function BillingPreview() {
  const gradientId = useId();
  return (
    <Window title="Cadence · Plans & usage">
      <div className="flex h-full">
        <Sidebar active={3} />
        <div className="flex min-w-0 flex-1 flex-col gap-[1.4cqw] p-[1.8cqw]">
          <div className="flex items-center gap-[1cqw]">
            <Label className="text-[1.7cqw]">Subscription</Label>
            <div className="ml-auto flex gap-[0.5cqw]">
              <Chip>Monthly</Chip>
              <Chip active>Yearly</Chip>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[1.2cqw]">
            {plans.map((plan) => (
              <Panel
                key={plan.name}
                className={cn("flex flex-col gap-[0.8cqw] p-[1.3cqw]", plan.current && "pv-accent-line shadow-[0_0_0_1px_var(--pa)]")}
              >
                <div className="flex items-center justify-between">
                  <Label>{plan.name}</Label>
                  {plan.current ? <Chip active>Current</Chip> : null}
                </div>
                <Bar w={42} h={1.6} tone={plan.current ? "accent" : "strong"} className="my-[0.4cqw]" />
                {plan.features.map((width, index) => (
                  <div key={index} className="flex items-center gap-[0.6cqw]">
                    <span className="pv-accent-bg block size-[0.7cqw] rounded-full opacity-70" />
                    <Bar w={width} />
                  </div>
                ))}
              </Panel>
            ))}
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[1.7fr_1fr] gap-[1.2cqw]">
            <Panel className="relative flex flex-col p-[1.3cqw]">
              <div className="flex items-center justify-between">
                <Label>Metered usage</Label>
                <Bar w={18} />
              </div>
              <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="mt-[1cqw] w-full flex-1">
                <defs>
                  <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--pa)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="var(--pa)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[25, 50, 75].map((y) => (
                  <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--pv-line)" strokeWidth="1" />
                ))}
                <path d="M0 80 C30 74 50 62 80 64 S130 46 160 50 S210 30 240 34 S280 18 300 14 V100 H0Z" fill={`url(#${gradientId})`} />
                <path d="M0 80 C30 74 50 62 80 64 S130 46 160 50 S210 30 240 34 S280 18 300 14" fill="none" stroke="var(--pa)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </Panel>
            <Panel className="flex flex-col gap-[0.9cqw] p-[1.3cqw]">
              <Label>Invoices</Label>
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="pv-line flex items-center justify-between border-b pb-[0.7cqw] last:border-b-0">
                  <span className="font-mono text-[0.85cqw] opacity-70">INV-0{24 - row}</span>
                  <Bar w={22} tone={row === 0 ? "accent" : "strong"} />
                </div>
              ))}
            </Panel>
          </div>
        </div>
      </div>
    </Window>
  );
}

/* ── Recruiting / ATS ───────────────────────────────────────────────────── */

const stages = ["Applied", "Screen", "Technical", "Onsite", "Offer"];

export function RecruitingPreview() {
  return (
    <Window title="Talentflow · Senior Backend Engineer">
      <div className="flex h-full">
        <div className="pv-line flex w-[28%] shrink-0 flex-col gap-[0.4cqw] border-r p-[1.2cqw]">
          <div className="mb-[0.6cqw] flex items-center justify-between px-[0.4cqw]">
            <Label>Candidates</Label>
            <Chip>24</Chip>
          </div>
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className={cn("flex items-center gap-[0.8cqw] rounded-[0.6cqw] p-[0.7cqw]", row === 1 && "pv-soft-bg")}
            >
              <Avatar size={2.2} hue={row * 45} />
              <div className="flex min-w-0 flex-1 flex-col gap-[0.5cqw]">
                <Bar w={[70, 62, 76, 58, 66, 54][row]} tone="strong" />
                <Bar w={[44, 50, 38, 46, 40, 52][row]} />
              </div>
              <span className={cn("block size-[0.8cqw] rounded-full", row < 3 ? "pv-accent-bg" : "pv-bar-strong-bg")} />
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[1.4cqw] p-[1.8cqw]">
          <div className="flex items-center gap-[1.2cqw]">
            <Avatar size={4.4} hue={45} />
            <div className="flex min-w-0 flex-1 flex-col gap-[0.6cqw]">
              <Bar w={42} h={1.1} tone="strong" />
              <Bar w={30} />
            </div>
            <Button>Advance</Button>
          </div>
          <div className="flex flex-wrap gap-[0.5cqw]">
            {["PHP", "Laravel", "PostgreSQL", "AWS", "Mentoring"].map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
          <Panel className="p-[1.3cqw]">
            <div className="relative flex justify-between">
              <span className="pv-line absolute top-[0.55cqw] right-[4%] left-[4%] border-t" />
              <span className="pv-accent-bg absolute top-[0.5cqw] left-[4%] h-[0.15cqw] w-[46%]" />
              {stages.map((stage, index) => (
                <div key={stage} className="relative flex w-[20%] flex-col items-center gap-[0.6cqw]">
                  <span
                    className={cn(
                      "block size-[1.2cqw] rounded-full border-2",
                      index < 3 ? "pv-accent-bg pv-accent-line" : "pv-panel pv-line",
                    )}
                  />
                  <Label className={cn("text-[0.85cqw]", index >= 3 && "pv-muted")}>{stage}</Label>
                </div>
              ))}
            </div>
          </Panel>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-[1.2cqw]">
            {[0, 1].map((card) => (
              <Panel key={card} className="flex flex-col gap-[0.8cqw] p-[1.2cqw]">
                <div className="flex items-center gap-[0.6cqw]">
                  <Avatar size={1.6} hue={card * 90 + 20} />
                  <Bar w={40} tone="strong" />
                </div>
                <div className="flex gap-[0.3cqw]">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <span key={star} className={cn("block size-[0.8cqw] rounded-[0.2cqw]", star < 4 - card ? "pv-accent-bg" : "pv-bar-strong-bg")} />
                  ))}
                </div>
                <Bar w={90} />
                <Bar w={72} />
                <Bar w={80} />
              </Panel>
            ))}
          </div>
        </div>

        <div className="pv-line flex w-[22%] shrink-0 flex-col gap-[0.9cqw] border-l p-[1.4cqw]">
          <Label>Interviews</Label>
          {["09:30", "11:00", "13:30", "15:00", "16:30"].map((time, index) => (
            <div key={time} className="flex items-stretch gap-[0.7cqw]">
              <span className="pv-muted w-[3.4cqw] shrink-0 font-mono text-[0.8cqw]">{time}</span>
              <span
                className={cn(
                  "flex flex-1 flex-col justify-center gap-[0.4cqw] rounded-[0.5cqw] border-l-2 px-[0.7cqw] py-[0.6cqw]",
                  index === 1 ? "pv-soft-bg pv-accent-line" : "pv-raised pv-line",
                )}
              >
                <Bar w={70} tone={index === 1 ? "accent" : "strong"} />
                <Bar w={45} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}
