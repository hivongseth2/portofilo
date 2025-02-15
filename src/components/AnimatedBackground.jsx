"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import anime from "animejs";

const DOTS_COUNT = 50;

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  // Đánh dấu component đã được mount (chỉ chạy trên client)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Tạo danh sách dots chỉ khi mounted = true (vì window chỉ có trên client)
  const dots = useMemo(() => {
    if (typeof window === "undefined") return [];
    return Array.from({ length: DOTS_COUNT }, (_, i) => ({
      id: i,
      x: anime.random(-window.innerWidth / 2, window.innerWidth / 2),
      y: anime.random(-window.innerHeight / 2, window.innerHeight / 2),
      scale: anime.random(0.2, 1),
      opacity: anime.random(0.2, 0.5),
    }));
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    anime({
      targets: ".dot",
      translateX: () =>
        anime.random(-window.innerWidth / 2, window.innerWidth / 2),
      translateY: () =>
        anime.random(-window.innerHeight / 2, window.innerHeight / 2),
      scale: () => anime.random(0.2, 1),
      opacity: () => anime.random(0.2, 0.5),
      duration: () => anime.random(2000, 4000),
      delay: () => anime.random(0, 1000),
      loop: true,
      direction: "alternate",
      easing: "easeInOutQuad",
    });
  }, [mounted]);

  // Thay vì trả về null khi chưa mount, ta render một container trống để HTML server và client giống nhau
  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="dot absolute bg-white rounded-full"
          style={{
            width: "8px",
            height: "8px",
            top: "50%",
            left: "50%",
            transform: `translate(${dot.x}px, ${dot.y}px) scale(${dot.scale})`,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
