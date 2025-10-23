import React from "react";

type MarqueeProps = {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
};

export default function Marquee({
  children,
  speed = 20,
  direction = "left",
}: MarqueeProps) {
  return (
    <div className="relative overflow-hidden py-1">
      <div
        className="flex w-fit gap-2"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationFillMode: "forwards",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = "paused")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
      >
        <div className="flex shrink-0 gap-2">{children}</div>
        <div className="flex shrink-0 gap-2" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
