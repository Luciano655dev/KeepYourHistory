"use client";

const PAPER_COUNT = 110;
const tones = ["#f3e1c8", "#e6c29a", "#d9b186", "#f7efe4"];

const papers = Array.from({ length: PAPER_COUNT }, (_, index) => ({
  id: index,
  left: `${-12 + ((index * 83) % 124)}%`,
  delay: `${-((index * 0.57) % 8.5)}s`,
  duration: `${7 + (index % 7) * 0.75}s`,
  drift: `${((index % 13) - 6) * 28}px`,
  rotateStart: `${((index * 29) % 120) - 60}deg`,
  rotateEnd: `${((index * 41) % 180) - 90}deg`,
  scale: 0.42 + (index % 6) * 0.08,
  opacity: 0.28 + (index % 4) * 0.08,
  width: `${8 + (index % 4) * 4}px`,
  height: `${12 + (index % 5) * 3}px`,
  radius: `${1 + (index % 3)}px`,
  color: tones[index % tones.length],
}));

export function FallingPapers() {
  return (
    <div className="falling-papers" aria-hidden="true">
      {papers.map((paper) => (
        <span
          key={paper.id}
          className="falling-paper"
          style={
            {
              left: paper.left,
              animationDelay: paper.delay,
              animationDuration: paper.duration,
              opacity: paper.opacity,
              "--paper-scale": paper.scale,
              "--paper-drift": paper.drift,
              "--paper-rotate-start": paper.rotateStart,
              "--paper-rotate-end": paper.rotateEnd,
              width: paper.width,
              height: paper.height,
              borderRadius: paper.radius,
              background: paper.color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
