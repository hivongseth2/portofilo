"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useAnimation } from "../components/AnimationProvider";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    year: "2024",
    title: "DEV FullStack",
    company: "Công ty TNHH An Hòa",
    period: "03/2024 - Present",
    description:
      "Phát triển phần mềm quản lý nhân sự với Vue 3, Vueify và Ruby on Rails.",
  },
  {
    year: "2023",
    title: "Frontend Developer",
    company: "Tech Innovators Inc.",
    period: "06/2023 - 02/2024",
    description:
      "Xây dựng ứng dụng web responsive với React & Next.js, phối hợp chặt chẽ với UI/UX designers.",
  },
  {
    year: "2022",
    title: "Junior Web Developer",
    company: "Digital Solutions Ltd.",
    period: "01/2022 - 05/2023",
    description:
      "Hỗ trợ phát triển website thương mại điện tử với Vue.js và Nuxt.js.",
  },
];

const ExperienceCard = ({ experience, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`relative bg-gray-900/40 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-lg transition-all duration-300 hover:scale-105 ${
        index % 2 === 0 ? "ml-auto text-right" : "mr-auto text-left"
      }`}
      style={{ width: "calc(50% - 2rem)" }}
    >
      <div className="absolute -right-8 -top-8 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl"></div>
      <div className="relative z-10">
        <span className="text-sm font-medium text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
          {experience.year}
        </span>
        <h3 className="text-2xl font-bold text-white mt-2 mb-2">
          {experience.title}
        </h3>
        <p className="text-gray-300 font-medium mb-2 flex items-center">
          {/* Briefcase Icon */}
          {experience.company}
        </p>
        <p className="text-gray-400 text-sm mb-4 flex items-center">
          {/* Calendar Icon */}
          {experience.period}
        </p>
        <p className="text-gray-300 leading-relaxed">
          {experience.description}
        </p>
      </div>
    </div>
  );
};

const Experience = () => {
  const experienceRef = useRef(null);
  const { prefersReducedMotion } = useAnimation();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".timeline", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".experience-section",
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        },
      });

      gsap.utils.toArray(".timeline-circle").forEach((circle) => {
        gsap.fromTo(
          circle,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.75)",
            scrollTrigger: {
              trigger: circle,
              start: "top 90%",
              end: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, experienceRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={experienceRef}
      id="experience"
      className="experience-section py-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Animate tiêu đề bằng Framer Motion */}
        <h2 className="text-5xl font-extrabold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {"Work Experience".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, ease: "backOut", delay: i * 0.02 }}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h2>
        <div className="relative flex items-center">
          <div className="timeline absolute left-1/2 top-0 bottom-0 w-1 bg-purple-500/40"></div>
          <div className="space-y-20 w-full">
            {experiences.map((experience, index) => (
              <div key={index} className="relative">
                <div className="timeline-circle w-6 h-6 rounded-full bg-purple-400 absolute left-1/2 transform -translate-x-1/2"></div>
                <ExperienceCard experience={experience} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
