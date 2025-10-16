"use client";

import { Star } from "lucide-react";

interface RatingDisplayProps {
  value?: number; // Optional rating value
  max?: number; // Total stars
  size?: number; // Star icon size
}

export default function RatingDisplay({
  value = 0,
  max = 5,
  size = 24,
}: RatingDisplayProps) {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), max);

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${safeValue} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const full = safeValue >= i + 1;
        const half = safeValue >= i + 0.5 && safeValue < i + 1;

        return (
          <div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
          >
            {/* Base star (gray outline) */}
            <Star size={size} className="text-gray-300" />

            {/* Filled star (yellow) */}
            {(full || half) && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{
                  width: full ? "100%" : "50%", // half star fill width
                  height: "100%",
                }}
              >
                <Star size={size} className="fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </div>
        );
      })}

      <span className="ml-2 text-sm text-gray-500">
        {safeValue.toFixed(1)} / {max} {" Ratings"}
      </span>
    </div>
  );
}
