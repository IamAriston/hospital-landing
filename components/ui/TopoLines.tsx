import { siteConfig } from "@/config/site";

type TopoSize = "small" | "medium" | "large";

interface TopoLinesProps {
  size?: TopoSize;
  className?: string;
}

export default function TopoLines({
  size = "small",
  className,
}: TopoLinesProps) {
  const { color, sizes } = siteConfig.topoLines;
  const cfg = sizes[size] ?? sizes.small;
  const { wave, mask } = cfg;

  const maskValue = mask
    ? `linear-gradient(to right, transparent ${mask.fadeStart}%, black ${mask.fadeEnd}%)`
    : undefined;

  return (
    <svg
      aria-hidden
      className={className ?? cfg.defaultClassName}
      viewBox={cfg.viewBox}
      preserveAspectRatio={cfg.preserveAspectRatio}
      style={{
        opacity: cfg.opacity,
        maskImage: maskValue,
        WebkitMaskImage: maskValue,
      }}
    >
      {Array.from({ length: cfg.count }, (_, i) => {
        const y = (base: number) => base + i * wave.ySpacing;
        return (
          <path
            key={i}
            d={`M ${wave.startX} ${y(wave.yStart)} Q ${wave.cp1x} ${y(wave.cp1y)} ${wave.cp2x} ${y(wave.cp2y)} T ${wave.endX} ${y(wave.endY)}`}
            stroke={color}
            fill="none"
            strokeWidth={cfg.strokeWidth}
          />
        );
      })}
    </svg>
  );
}
