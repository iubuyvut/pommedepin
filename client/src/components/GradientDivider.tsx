/**
 * GradientDivider - Smooth transition between sections
 * Creates a subtle gradient to blend sections seamlessly
 */

interface GradientDividerProps {
  fromColor?: string;
  toColor?: string;
  height?: number;
}

export default function GradientDivider({
  fromColor = "from-background",
  toColor = "to-background",
  height = 40,
}: GradientDividerProps) {
  return (
    <div
      className={`w-full bg-gradient-to-b ${fromColor} ${toColor}`}
      style={{ height: `${height}px` }}
    />
  );
}
