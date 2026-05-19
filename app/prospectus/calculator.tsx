"use client";

import { useMemo, useState } from "react";

/* ---------- model ---------- */

type Inputs = {
  // Lease
  includeMainFloor: boolean;
  includePool: boolean;
  includeBack2nd: boolean;
  includeFrontOffice: boolean;
  includeGarage: boolean;
  subleaseFrontOffice: boolean;
  subleaseGarage: boolean;
  subleasePool: boolean;
  rentMainFloor: number;
  rentPool: number;
  rentBack2nd: number;
  rentFrontOffice: number;
  rentGarage: number;
  subleaseFrontOfficeRent: number;
  subleaseGarageRent: number;
  subleasePoolRent: number;

  // Membership
  members: number;
  monthlyDues: number;
  initiationFee: number;
  annualChurn: number;

  // Activity
  visitsPerMember: number;
  dayPassesPerMonth: number;
  dayPassPrice: number;

  // F&B
  fbSpendPerVisit: number;
  ourShareOfFB: number;
  burgerWindowDaily: number;

  // Events
  eventsPerMonth: number;
  avgEventPrice: number;
  eventFbShare: number;

  // Aquatic partners
  aquaticHoursPerMonth: number;
  aquaticRatePerHour: number;

  // Operating costs
  staffMonthly: number;
  utilitiesMonthly: number;
  insuranceMonthly: number;
  marketingMonthly: number;
  softwareMonthly: number;
};

const DEFAULTS: Inputs = {
  // The "$15k for the remaining space" bundle from the landlord, split
  // proportionally by sq ft (2000 + 1500 + 725 = 4225 → $3.55/sq ft).
  includeMainFloor: true,
  includePool: true,
  includeBack2nd: true,
  includeFrontOffice: true,
  includeGarage: true,
  subleaseFrontOffice: true,
  subleaseGarage: true,
  subleasePool: true,
  rentMainFloor: 7100,
  rentPool: 5325,
  rentBack2nd: 2575,
  rentFrontOffice: 2500,
  rentGarage: 2500,
  subleaseFrontOfficeRent: 2500,
  subleaseGarageRent: 2500,
  subleasePoolRent: 2200,

  members: 250,
  monthlyDues: 450,
  initiationFee: 1000,
  annualChurn: 0.25,

  visitsPerMember: 8,
  dayPassesPerMonth: 30,
  dayPassPrice: 75,

  fbSpendPerVisit: 25,
  ourShareOfFB: 0,
  burgerWindowDaily: 600,

  eventsPerMonth: 1.5,
  avgEventPrice: 8000,
  eventFbShare: 0.55,

  aquaticHoursPerMonth: 40,
  aquaticRatePerHour: 80,

  staffMonthly: 35000,
  utilitiesMonthly: 5500,
  insuranceMonthly: 2500,
  marketingMonthly: 3000,
  softwareMonthly: 1500,
};

type Output = ReturnType<typeof compute>;

function compute(i: Inputs) {
  // --- Rent ---
  const grossRent =
    (i.includeMainFloor ? i.rentMainFloor : 0) +
    (i.includePool ? i.rentPool : 0) +
    (i.includeBack2nd ? i.rentBack2nd : 0) +
    (i.includeFrontOffice ? i.rentFrontOffice : 0) +
    (i.includeGarage ? i.rentGarage : 0);

  const subleaseIncome =
    (i.includeFrontOffice && i.subleaseFrontOffice
      ? i.subleaseFrontOfficeRent
      : 0) +
    (i.includeGarage && i.subleaseGarage ? i.subleaseGarageRent : 0) +
    (i.subleasePool ? i.subleasePoolRent : 0);

  const netRent = grossRent - subleaseIncome;

  // --- Revenue (operator's share) ---
  const dues = i.members * i.monthlyDues;
  const initiationsPerYear = i.members * i.annualChurn;
  const initiationMonthly = (initiationsPerYear * i.initiationFee) / 12;
  const dayPassRev = i.dayPassesPerMonth * i.dayPassPrice;

  // F&B gross merchandise volume (flows through the space; partner takes most)
  const memberVisits = i.members * i.visitsPerMember;
  const memberFbGmv = memberVisits * i.fbSpendPerVisit;
  const eventFbGmv = i.eventsPerMonth * i.avgEventPrice * i.eventFbShare;
  const burgerWindowGmv = i.burgerWindowDaily * 30;
  const fbGmvMonthly = memberFbGmv + eventFbGmv + burgerWindowGmv;
  const fbGmvAnnual = fbGmvMonthly * 12;

  // Operator's share of F&B (default 0 if break-even partnership)
  const ourFbRev = fbGmvMonthly * i.ourShareOfFB;

  // Event revenue we keep (the non-F&B portion: room fee, bar, service)
  const eventRevRetained =
    i.eventsPerMonth * i.avgEventPrice * (1 - i.eventFbShare);

  const aquaticRev = i.aquaticHoursPerMonth * i.aquaticRatePerHour;

  const revenueLines: Array<[string, number]> = [
    ["Membership dues", dues],
    ["Initiation fees (amortised)", initiationMonthly],
    ["Day passes & guest fees", dayPassRev],
    ["Events (room + service, ex-F&B)", eventRevRetained],
    ["Aquatic partners (off-peak)", aquaticRev],
    ["F&B revenue share", ourFbRev],
  ];
  const revenueMonthly = revenueLines.reduce((a, [, v]) => a + v, 0);
  const revenueAnnual = revenueMonthly * 12;

  // --- Costs (excluding rent, shown separately) ---
  const costLines: Array<[string, number]> = [
    ["Staff & payroll", i.staffMonthly],
    ["Utilities & pool ops", i.utilitiesMonthly],
    ["Insurance & maintenance", i.insuranceMonthly],
    ["Marketing", i.marketingMonthly],
    ["Software & tech", i.softwareMonthly],
  ];
  const opexMonthly = costLines.reduce((a, [, v]) => a + v, 0);

  const totalCostMonthly = opexMonthly + netRent;
  const netMonthly = revenueMonthly - totalCostMonthly;
  const netAnnual = netMonthly * 12;

  const rentToRevenue = revenueMonthly > 0 ? netRent / revenueMonthly : 0;

  // Break-even member count: how many members are required to cover total
  // costs given the current non-member revenue and per-member contribution.
  // Independent of the current member input — answers "how lean can we go?"
  const nonMemberRev =
    dayPassRev +
    eventRevRetained +
    aquaticRev +
    (eventFbGmv + burgerWindowGmv) * i.ourShareOfFB;

  const memberContributionPerMember =
    i.monthlyDues +
    (i.annualChurn * i.initiationFee) / 12 +
    i.visitsPerMember * i.fbSpendPerVisit * i.ourShareOfFB;

  const breakEvenMembers =
    memberContributionPerMember > 0
      ? Math.max(
          0,
          Math.ceil(
            (totalCostMonthly - nonMemberRev) / memberContributionPerMember,
          ),
        )
      : 0;

  return {
    grossRent,
    subleaseIncome,
    netRent,
    revenueLines,
    revenueMonthly,
    revenueAnnual,
    costLines,
    opexMonthly,
    totalCostMonthly,
    netMonthly,
    netAnnual,
    rentToRevenue,
    breakEvenMembers,
    memberVisits,
    memberFbGmv,
    eventFbGmv,
    burgerWindowGmv,
    fbGmvMonthly,
    fbGmvAnnual,
  };
}

/* ---------- formatting ---------- */

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const usd = (n: number) => usd0.format(Math.round(n));
const pct = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(n);
const num = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.round(n),
  );

/* ---------- presets ---------- */

const SCENARIOS = {
  A: {
    name: "A — Whole building, keep both subs",
    patch: {
      includeMainFloor: true,
      includePool: true,
      includeBack2nd: true,
      includeFrontOffice: true,
      includeGarage: true,
      subleaseFrontOffice: true,
      subleaseGarage: true,
      subleasePool: false,
    } satisfies Partial<Inputs>,
  },
  B: {
    name: "B — Whole building + pool sublease (off-peak)",
    patch: {
      includeMainFloor: true,
      includePool: true,
      includeBack2nd: true,
      includeFrontOffice: true,
      includeGarage: true,
      subleaseFrontOffice: true,
      subleaseGarage: true,
      subleasePool: true,
    } satisfies Partial<Inputs>,
  },
  C: {
    name: "C — Whole building, full operational control",
    patch: {
      includeMainFloor: true,
      includePool: true,
      includeBack2nd: true,
      includeFrontOffice: true,
      includeGarage: true,
      subleaseFrontOffice: false,
      subleaseGarage: false,
      subleasePool: false,
    } satisfies Partial<Inputs>,
  },
  D: {
    name: "D — Skip garage",
    patch: {
      includeMainFloor: true,
      includePool: true,
      includeBack2nd: true,
      includeFrontOffice: true,
      includeGarage: false,
      subleaseFrontOffice: true,
      subleaseGarage: false,
      subleasePool: false,
    } satisfies Partial<Inputs>,
  },
  E: {
    name: "E — Core only (skip front office + garage)",
    patch: {
      includeMainFloor: true,
      includePool: true,
      includeBack2nd: true,
      includeFrontOffice: false,
      includeGarage: false,
      subleaseFrontOffice: false,
      subleaseGarage: false,
      subleasePool: false,
    } satisfies Partial<Inputs>,
  },
} as const;

/* ---------- UI ---------- */

export function Calculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const o: Output = useMemo(() => compute(inputs), [inputs]);

  function patch(p: Partial<Inputs>) {
    setInputs((s) => ({ ...s, ...p }));
  }

  return (
    <div className="calc">
      {/* SCENARIO ROW */}
      <section className="calc-section">
        <h2>Lease scenario</h2>
        <div className="presets">
          {(Object.keys(SCENARIOS) as (keyof typeof SCENARIOS)[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => patch(SCENARIOS[k].patch)}
              className="preset-btn"
            >
              <strong>{k}</strong>
              <span>{SCENARIOS[k].name.replace(/^[A-E]\s+—\s+/, "")}</span>
            </button>
          ))}
        </div>

        <div className="grid-2">
          <fieldset>
            <legend>Spaces taken</legend>
            <Toggle
              label="Main floor · 2,000 sq ft"
              checked={inputs.includeMainFloor}
              onChange={(v) => patch({ includeMainFloor: v })}
              note={usd(inputs.rentMainFloor) + "/mo"}
            />
            <Toggle
              label="Pool area · 1,500 sq ft"
              checked={inputs.includePool}
              onChange={(v) => patch({ includePool: v })}
              note={usd(inputs.rentPool) + "/mo"}
            />
            <Toggle
              label="Back 2nd floor · 725 sq ft"
              checked={inputs.includeBack2nd}
              onChange={(v) => patch({ includeBack2nd: v })}
              note={usd(inputs.rentBack2nd) + "/mo"}
            />
            <Toggle
              label="Front 2nd floor office · 625 sq ft"
              checked={inputs.includeFrontOffice}
              onChange={(v) => patch({ includeFrontOffice: v })}
              note={usd(inputs.rentFrontOffice) + "/mo"}
            />
            <Toggle
              label="Garage · 500 sq ft"
              checked={inputs.includeGarage}
              onChange={(v) => patch({ includeGarage: v })}
              note={usd(inputs.rentGarage) + "/mo"}
            />
          </fieldset>

          <fieldset>
            <legend>Sublease income</legend>
            <Toggle
              label="Front office to existing tenant"
              checked={inputs.subleaseFrontOffice}
              onChange={(v) => patch({ subleaseFrontOffice: v })}
              disabled={!inputs.includeFrontOffice}
              note={"+" + usd(inputs.subleaseFrontOfficeRent) + "/mo"}
            />
            <Toggle
              label="Garage to existing tenant"
              checked={inputs.subleaseGarage}
              onChange={(v) => patch({ subleaseGarage: v })}
              disabled={!inputs.includeGarage}
              note={"+" + usd(inputs.subleaseGarageRent) + "/mo"}
            />
            <Toggle
              label="Pool — scuba off-peak"
              checked={inputs.subleasePool}
              onChange={(v) => patch({ subleasePool: v })}
              note={"+" + usd(inputs.subleasePoolRent) + "/mo"}
            />
          </fieldset>
        </div>

        <div className="rent-summary">
          <Row label="Gross rent" value={usd(o.grossRent) + "/mo"} />
          <Row label="Sublease offsets" value={"−" + usd(o.subleaseIncome) + "/mo"} />
          <Row label="Net rent" value={usd(o.netRent) + "/mo"} emphasis />
        </div>
      </section>

      {/* INPUTS */}
      <section className="calc-section">
        <h2>Membership</h2>
        <div className="grid-3">
          <NumberField
            label="Members"
            value={inputs.members}
            onChange={(v) => patch({ members: v })}
            step={10}
            suffix=""
          />
          <NumberField
            label="Monthly dues"
            value={inputs.monthlyDues}
            onChange={(v) => patch({ monthlyDues: v })}
            step={25}
            prefix="$"
          />
          <NumberField
            label="Initiation fee"
            value={inputs.initiationFee}
            onChange={(v) => patch({ initiationFee: v })}
            step={250}
            prefix="$"
          />
          <NumberField
            label="Annual churn"
            value={Math.round(inputs.annualChurn * 100)}
            onChange={(v) => patch({ annualChurn: v / 100 })}
            step={5}
            suffix="%"
          />
          <NumberField
            label="Visits / member / month"
            value={inputs.visitsPerMember}
            onChange={(v) => patch({ visitsPerMember: v })}
            step={1}
            suffix=""
          />
        </div>
      </section>

      <section className="calc-section">
        <h2>Day passes & guests</h2>
        <div className="grid-3">
          <NumberField
            label="Day passes / month"
            value={inputs.dayPassesPerMonth}
            onChange={(v) => patch({ dayPassesPerMonth: v })}
            step={5}
          />
          <NumberField
            label="Day pass price"
            value={inputs.dayPassPrice}
            onChange={(v) => patch({ dayPassPrice: v })}
            step={5}
            prefix="$"
          />
        </div>
      </section>

      <section className="calc-section">
        <h2>F&amp;B (Marlowe partnership)</h2>
        <p className="section-note">
          F&amp;B flows through the space. The kitchen partner runs operations.
          Our share is configurable — default <strong>0%</strong> (a pure
          partnership where they keep all F&amp;B revenue and run a profitable
          kitchen, and we get the foot traffic + the burger window).
        </p>
        <div className="grid-3">
          <NumberField
            label="Member F&B spend / visit"
            value={inputs.fbSpendPerVisit}
            onChange={(v) => patch({ fbSpendPerVisit: v })}
            step={5}
            prefix="$"
          />
          <NumberField
            label="Our share of F&B"
            value={Math.round(inputs.ourShareOfFB * 100)}
            onChange={(v) => patch({ ourShareOfFB: v / 100 })}
            step={5}
            suffix="%"
          />
          <NumberField
            label="Burger window — daily revenue"
            value={inputs.burgerWindowDaily}
            onChange={(v) => patch({ burgerWindowDaily: v })}
            step={50}
            prefix="$"
          />
        </div>
      </section>

      <section className="calc-section">
        <h2>Events</h2>
        <div className="grid-3">
          <NumberField
            label="Events / month"
            value={inputs.eventsPerMonth}
            onChange={(v) => patch({ eventsPerMonth: v })}
            step={0.5}
          />
          <NumberField
            label="Avg event price"
            value={inputs.avgEventPrice}
            onChange={(v) => patch({ avgEventPrice: v })}
            step={500}
            prefix="$"
          />
          <NumberField
            label="F&B share of event price"
            value={Math.round(inputs.eventFbShare * 100)}
            onChange={(v) => patch({ eventFbShare: v / 100 })}
            step={5}
            suffix="%"
          />
        </div>
      </section>

      <section className="calc-section">
        <h2>Aquatic partners (off-peak)</h2>
        <p className="section-note">
          Swim lessons, aqua-yoga, aquatic PT booking off-peak hours — separate
          from the scuba sublease toggle above.
        </p>
        <div className="grid-3">
          <NumberField
            label="Partner hours / month"
            value={inputs.aquaticHoursPerMonth}
            onChange={(v) => patch({ aquaticHoursPerMonth: v })}
            step={5}
          />
          <NumberField
            label="Rate / hour"
            value={inputs.aquaticRatePerHour}
            onChange={(v) => patch({ aquaticRatePerHour: v })}
            step={5}
            prefix="$"
          />
        </div>
      </section>

      <section className="calc-section">
        <h2>Operating costs (monthly)</h2>
        <div className="grid-3">
          <NumberField
            label="Staff & payroll"
            value={inputs.staffMonthly}
            onChange={(v) => patch({ staffMonthly: v })}
            step={1000}
            prefix="$"
          />
          <NumberField
            label="Utilities & pool ops"
            value={inputs.utilitiesMonthly}
            onChange={(v) => patch({ utilitiesMonthly: v })}
            step={250}
            prefix="$"
          />
          <NumberField
            label="Insurance & maintenance"
            value={inputs.insuranceMonthly}
            onChange={(v) => patch({ insuranceMonthly: v })}
            step={250}
            prefix="$"
          />
          <NumberField
            label="Marketing"
            value={inputs.marketingMonthly}
            onChange={(v) => patch({ marketingMonthly: v })}
            step={250}
            prefix="$"
          />
          <NumberField
            label="Software & tech"
            value={inputs.softwareMonthly}
            onChange={(v) => patch({ softwareMonthly: v })}
            step={100}
            prefix="$"
          />
        </div>
      </section>

      {/* OUTPUTS */}
      <section className="calc-section out">
        <h2>Revenue stack</h2>
        <table className="stack">
          <thead>
            <tr>
              <th>Line</th>
              <th className="r">Monthly</th>
              <th className="r">Annual</th>
              <th className="r">Mix</th>
            </tr>
          </thead>
          <tbody>
            {o.revenueLines.map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td className="r mono">{usd(v)}</td>
                <td className="r mono">{usd(v * 12)}</td>
                <td className="r mono">
                  {o.revenueMonthly > 0 ? pct(v / o.revenueMonthly) : "—"}
                </td>
              </tr>
            ))}
            <tr className="total">
              <td>Total operator revenue</td>
              <td className="r mono">{usd(o.revenueMonthly)}</td>
              <td className="r mono">{usd(o.revenueAnnual)}</td>
              <td className="r mono">100%</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="calc-section out">
        <h2>Cost stack</h2>
        <table className="stack">
          <thead>
            <tr>
              <th>Line</th>
              <th className="r">Monthly</th>
              <th className="r">Annual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Net rent</td>
              <td className="r mono">{usd(o.netRent)}</td>
              <td className="r mono">{usd(o.netRent * 12)}</td>
            </tr>
            {o.costLines.map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td className="r mono">{usd(v)}</td>
                <td className="r mono">{usd(v * 12)}</td>
              </tr>
            ))}
            <tr className="total">
              <td>Total costs</td>
              <td className="r mono">{usd(o.totalCostMonthly)}</td>
              <td className="r mono">{usd(o.totalCostMonthly * 12)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="calc-section pnl">
        <h2>Bottom line</h2>
        <div className="pnl-grid">
          <Stat
            label="Net monthly"
            value={usd(o.netMonthly)}
            positive={o.netMonthly >= 0}
          />
          <Stat
            label="Net annual"
            value={usd(o.netAnnual)}
            positive={o.netAnnual >= 0}
          />
          <Stat label="Rent / revenue" value={pct(o.rentToRevenue)} />
          <Stat label="Break-even members" value={num(o.breakEvenMembers)} />
        </div>
      </section>

      <section className="calc-section marlowe">
        <h2>F&amp;B pass-through — for Marlowe</h2>
        <p className="section-note">
          The total dollar volume of food &amp; drink that flows through the
          space, irrespective of who keeps the margin. This is the number worth
          taking to Marlowe — a kitchen partner needs to see the demand-side
          forecast, not our P&amp;L.
        </p>
        <table className="stack">
          <tbody>
            <tr>
              <td>Member visits / month</td>
              <td className="r mono">{num(o.memberVisits)}</td>
            </tr>
            <tr>
              <td>Member F&B GMV / month</td>
              <td className="r mono">{usd(o.memberFbGmv)}</td>
            </tr>
            <tr>
              <td>Event F&B GMV / month</td>
              <td className="r mono">{usd(o.eventFbGmv)}</td>
            </tr>
            <tr>
              <td>Burger window GMV / month</td>
              <td className="r mono">{usd(o.burgerWindowGmv)}</td>
            </tr>
            <tr className="total">
              <td>Total F&B GMV / month</td>
              <td className="r mono">{usd(o.fbGmvMonthly)}</td>
            </tr>
            <tr className="total">
              <td>Total F&B GMV / year</td>
              <td className="r mono">{usd(o.fbGmvAnnual)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className="reset-row">
        <button
          type="button"
          className="reset-btn"
          onClick={() => setInputs(DEFAULTS)}
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="num-field">
      <span className="num-label">{label}</span>
      <span className="num-input">
        {prefix && <span className="affix">{prefix}</span>}
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) onChange(v);
          }}
        />
        {suffix && <span className="affix">{suffix}</span>}
      </span>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
  note,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <label className={"toggle" + (disabled ? " disabled" : "")}>
      <input
        type="checkbox"
        checked={checked && !disabled}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-label">{label}</span>
      {note && <span className="toggle-note mono">{note}</span>}
    </label>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className={"sumrow" + (emphasis ? " emphasis" : "")}>
      <span>{label}</span>
      <span className="mono">{value}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div
      className={
        "stat" +
        (positive === true ? " ok" : "") +
        (positive === false ? " bad" : "")
      }
    >
      <span className="stat-label">{label}</span>
      <span className="stat-value mono">{value}</span>
    </div>
  );
}
