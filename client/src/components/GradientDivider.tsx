/**
 * GradientDivider - Seamless transition between sections
 * Creates imperceptible gradients so sections blend perfectly
 */

interface GradientDividerProps {
  height?: number;
}

export default function GradientDivider({
  height = 60,
}: GradientDividerProps) {
  return (
    <div
      className="w-full"
      style={{
        height: `${height}px`,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.02) 100%)',
      }}
    />
  );
}
