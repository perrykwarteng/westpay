"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
  allowHalf?: boolean;
}

export default function Rating({
  max = 5,
  value = 0,
  onChange,
  size = 28,
  allowHalf = true,
}: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (index: number, isHalf: boolean) => {
    const newValue = isHalf ? index + 0.5 : index + 1;
    onChange?.(newValue);
  };

  const displayValue = hover ?? value;

  return (
    <div className="flex items-center gap-2">
      {[...Array(max)].map((_, i) => {
        const full = displayValue >= i + 1;
        const half =
          allowHalf && displayValue >= i + 0.5 && displayValue < i + 1;

        return (
          <div
            key={i}
            className="relative flex cursor-pointer"
            onMouseLeave={() => setHover(null)}
          >
            {/* Left Half */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full"
              onMouseEnter={() => setHover(i + 0.5)}
              onClick={() => handleClick(i, true)}
            />
            {/* Right Half */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full"
              onMouseEnter={() => setHover(i + 1)}
              onClick={() => handleClick(i, false)}
            />

            <Star
              size={size}
              className={
                full
                  ? "fill-yellow-400 text-yellow-400"
                  : half
                  ? "fill-yellow-400/60 text-yellow-400/60"
                  : "text-gray-400"
              }
            />
          </div>
        );
      })}
    </div>
  );
}
