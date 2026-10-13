export default function OccupancySlider({ options, value, onChange, expectedOccupancy, t }) {
  const min = options[0];
  const max = options[options.length - 1];
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full min-w-[240px] max-w-sm mx-auto">
      <p className="text-xs font-semibold mb-2 text-center" style={{ color: "#9C99AE" }}>
        {t.selectors.occupancy}
      </p>
      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <input
          type="range"
          min={min}
          max={max}
          step={options[1] - options[0]}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          dir="ltr"
          aria-label={t.selectors.occupancy}
          aria-valuetext={`${value}%`}
          className="w-full h-2 rounded-full appearance-none cursor-pointer arqa-slider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF7C4A]"
          style={{
            background: `linear-gradient(to right, #BF7C4A 0%, #BF7C4A ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-[11px]" style={{ color: "#6f6c82" }} dir="ltr">
          {options.map((option) => (
            <span
              key={option}
              className="rounded-full px-2 py-1 inline-flex flex-col items-center gap-1"
              style={{
                color: option === expectedOccupancy ? "#233D29" : "#6f6c82",
                backgroundColor: option === expectedOccupancy ? "rgba(120,152,121,0.24)" : "transparent",
                border: option === expectedOccupancy ? "1px solid #789879" : "1px solid transparent",
                fontWeight: option === expectedOccupancy ? 700 : 500,
              }}
            >
              {option}%
              {option === expectedOccupancy && <span className="text-[10px]" dir={t.meta.language === 'ar' ? 'rtl' : 'ltr'}>{t.meta.language === 'ar' ? 'الإشغال المتوقع' : 'Expected occupancy'}</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
