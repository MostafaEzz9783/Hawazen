import { memo } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { formatSAR, formatPercent } from "@/lib/format";

function OwnerEconomicsCard({ t, row }) {
  const marginPercent = row.revenue > 0 ? (row.netRevenue / row.revenue) * 100 : 0;

  return (
    <GlassCard tilt={false} className="p-6 text-start h-full">
      <h3 className="text-sm font-black mb-1" style={{ color: "#233D29" }}>
        {t.widgets.ownerEconomics}
      </h3>
      <p className="text-xs mb-5" style={{ color: "#647064" }}>
        {t.widgets.ownerEconomicsSubtitle}
      </p>
      <div className="grid grid-cols-2 divide-x divide-x-reverse" style={{ borderColor: "rgba(35, 61, 41, 0.12)" }}>
        <div className="pr-4">
          <p className="text-[11px] font-semibold mb-1" style={{ color: "#647064" }}>
            {t.widgets.ownerMargin}
          </p>
          <p className="text-2xl font-black" style={{ color: "#426449", direction: "ltr", textAlign: "right" }}>
            {formatPercent(marginPercent, 1)}%
          </p>
        </div>
        <div className="pr-4">
          <p className="text-[11px] font-semibold mb-1" style={{ color: "#647064" }}>
            {t.widgets.netPerUnitPerMonth}
          </p>
          <p className="text-2xl font-black" style={{ color: "#426449", direction: "ltr", textAlign: "right" }}>
            SAR {formatSAR(row.monthlyPerUnit)}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

export default memo(OwnerEconomicsCard);
