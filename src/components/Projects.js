"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { useAnimation } from "./AnimationProvider";
import Image from "next/image";
import { useWindowSize } from "react-use";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "AI-Powered Analytics Dashboard",
    description:
      "A cutting-edge analytics platform with AI-driven insights and real-time data visualization.",
    image: "https://source.unsplash.com/random/800x600?analytics",
    github: "https://github.com/yourusername/ai-analytics",
    live: "https://ai-analytics-demo.com",
    tags: ["React", "TensorFlow.js", "D3.js", "Node.js"],
  },
  {
    title: "Blockchain-based Supply Chain",
    description:
      "A decentralized supply chain management system leveraging blockchain technology for transparency and efficiency.",
    image: "https://source.unsplash.com/random/800x600?blockchain",
    github: "https://github.com/yourusername/blockchain-supply-chain",
    live: "https://blockchain-supply-demo.com",
    tags: ["Solidity", "Web3.js", "React", "Node.js"],
  },
  {
    title: "AR Interior Design App",
    description:
      "An augmented reality app that allows users to visualize furniture and decor in their space before purchasing.",
    image: "https://source.unsplash.com/random/800x600?interior-design",
    github: "https://github.com/yourusername/ar-interior-design",
    live: "https://ar-interior-demo.com",
    tags: ["React Native", "ARKit", "ARCore", "Three.js"],
  },
  {
    title: "AI-Powered Chatbot",
    description:
      "An intelligent chatbot using natural language processing to provide customer support and information.",
    image: "https://source.unsplash.com/random/800x600?chatbot",
    github: "https://github.com/yourusername/ai-chatbot",
    live: "https://ai-chatbot-demo.com",
    tags: ["Python", "TensorFlow", "React", "Flask"],
  },
];

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  useEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 1,
      y: 60,
      duration: 0.5,
      delay: index * 0.1, // Thêm độ trễ cho từng thẻ
    });
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      // style={{ y }}
      className="project-card w-[60vw] flex-shrink-0 my-2 overflow-hidden mt-40"
    >
      <div className="bg-white bg-opacity-0 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="relative h-64 md:h-80 mt-20">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            layout="fill"
            objectfit="cover"
            className="transition-transform duration-300 transform hover:scale-110"
          />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 text-white">
            {project.title}
          </h3>
          <p className="text-gray-300 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm   text-purple-200 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-white  px-4 py-2 rounded-full transition-colors duration-300"
            >
              <FaGithub className="mr-2" /> GitHub
            </a>
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-white   px-4 py-2 rounded-full transition-colors duration-300"
            >
              <FaExternalLinkAlt className="mr-2" /> Live Demo
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const projectsRef = useRef(null);
  const { prefersReducedMotion } = useAnimation();
  const [isClient, setIsClient] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!isClient || !projectsRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(projectsRef.current, {
        x: () => -(projectsRef.current.scrollWidth - width),
        ease: "none",
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top top",
          end: () => `+=${projectsRef.current.scrollWidth - width}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, projectsRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isClient, width]);

  return (
    <section className="projects-section min-h-screen relative">
      <div className="absolute top-80 left-0 w-full my-10 z-10">
        <h2 className="projects-title text-5xl font-bold text-center bg-clip-text text-transparent">
          Featured Projects
        </h2>
      </div>
      <div
        ref={projectsRef}
        className="projects-container flex items-start h-full pt-32 pb-20"
      >
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
