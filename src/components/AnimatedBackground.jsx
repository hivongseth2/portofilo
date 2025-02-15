"use client";

import { useEffect, useRef, useMemo } from "react";
import anime from "animejs";
import Hero from "./Hero";

const DOTS_COUNT = 50;

const AnimatedBackground = () => {
  const containerRef = useRef(null);

  // Tạo danh sách dots trước để tránh thêm phần tử vào DOM sau này
  const dots = useMemo(() => {
    return Array.from({ length: DOTS_COUNT }, (_, i) => ({
      id: i,
      x: anime.random(-window.innerWidth / 2, window.innerWidth / 2),
      y: anime.random(-window.innerHeight / 2, window.innerHeight / 2),
      scale: anime.random(0.2, 1),
      opacity: anime.random(0.2, 0.5),
    }));
  }, []);

  useEffect(() => {
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* <Hero></Hero> */}

      {dots.map((dot) => (
        <div
          key={dot.id}
          className="dot absolute bg-white rounded-full"
          style={{
            width: "8px",
            height: "8px",
            top: `50%`,
            left: `50%`,
            transform: `translate(${dot.x}px, ${dot.y}px) scale(${dot.scale})`,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
