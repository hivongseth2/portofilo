"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimation } from "../components/AnimationProvider";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import AnimatedBackground from "../components/AnimatedBackground";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);
  const { prefersReducedMotion } = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Smooth scroll animation
      gsap.utils.toArray('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = this.getAttribute("href");
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            gsap.to(window, {
              duration: 1,
              scrollTo: {
                y: targetElement,
                offsetY: 50,
              },
              ease: "power3.inOut",
            });
          }
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <main ref={mainRef} className="overflow-hidden">
      <AnimatedBackground />
      {/* <Hero /> */}
      <About />

      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
