import { memo } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { formatSAR } from "@/lib/format";

const SCENARIO_KEYS = ["base"];

function RoomPricingTable({ t, roomPricing, scenario }) {
  return (
    <GlassCard tilt={false} className="p-5 sm:p-6 h-full text-right">
      <h3 className="text-sm font-black mb-1" style={{ color: "#233D29" }}>
        {t.widgets.roomPricing}
      </h3>
      <p className="text-xs mb-5" style={{ color: "#647064" }}>
        {t.widgets.roomPricingSubtitle}
      </p>

      <div className="overflow-x-auto">
        {roomPricing.length === 0 ? (
          <p className="py-8 text-right text-xs" style={{ color: "#647064" }}>{t.widgets.roomPricingUnavailable}</p>
        ) : <table className="w-full text-xs text-right" style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}>
          <thead>
            <tr style={{ color: "#647064" }}>
              <th className="text-right font-semibold pb-1 px-2">{t.units.unit}</th>
              {SCENARIO_KEYS.map((key) => (
                <th
                  key={key}
                  className="text-right font-semibold pb-1 px-2"
                  style={{ color: key === scenario ? "#426449" : "#647064" }}
                >
                  {t.scenarios[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roomPricing.map((room) => (
              <tr key={room.unit} style={{ backgroundColor: "rgba(66,100,73,0.06)" }}>
                <td className="px-2 py-2 rounded-s-lg font-semibold text-right" style={{ color: "#233D29" }}>
                  {t.roomTypes[room.type]}
                </td>
                {SCENARIO_KEYS.map((key, index) => (
                  <td
                    key={key}
                    className={`px-2 py-2 text-right font-bold ${index === SCENARIO_KEYS.length - 1 ? "rounded-e-lg" : ""}`}
                    style={{ color: key === scenario ? "#426449" : "#647064", direction: "ltr" }}
                  >
                    {formatSAR(room[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </GlassCard>
  );
}

export default memo(RoomPricingTable);
