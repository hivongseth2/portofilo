"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Physics2DPlugin } from "gsap/all";
import { FaJs, FaReact, FaVuejs, FaNodeJs, FaGit } from "react-icons/fa";
import { SiNextdotjs, SiCss3, SiHtml5 } from "react-icons/si";
import { IconContext } from "react-icons";

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin);

const About = () => {
  const aboutRef = useRef(null);
  const contentRef = useRef(null);
  const skillsRef = useRef(null);
  const avatarRef = useRef(null);
  const skillIcons = {
    JavaScript: FaJs,
    React: FaReact,
    "Vue.js": FaVuejs,
    "Next.js": SiNextdotjs,
    CSS: SiCss3,
    HTML: SiHtml5,
    "Node.js": FaNodeJs,
    Git: FaGit,
  };

  useEffect(() => {
    const skills = skillsRef.current.querySelectorAll(".skill");

    skills.forEach((skill) => {
      gsap.set(skill, {
        y: gsap.utils.random(50, 250),
        x: gsap.utils.random(-100, 300),
        opacity: 3,
        scale: gsap.utils.random(0.8, 1.2),
      });

      // Hiệu ứng di chuyển chậm như đom đóm
      setInterval(() => {
        gsap.to(skill, {
          y: gsap.utils.random(50, 250),
          x: gsap.utils.random(-100, 300),
          scale: gsap.utils.random(0.8, 1.2),
          duration: gsap.utils.random(3, 6),
          ease: "sine.inOut",
        });
      }, gsap.utils.random(3000, 6000));
    });
  }, []);
  useEffect(() => {
    if (
      !aboutRef.current ||
      !contentRef.current ||
      !skillsRef.current ||
      !avatarRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // Content animation
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Avatar follows mouse
      const moveAvatar = (event) => {
        const { clientX, clientY } = event;
        const { left, top, width, height } =
          avatarRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = (clientX - centerX) * 0.05;
        const deltaY = (clientY - centerY) * 0.05;

        gsap.to(avatarRef.current, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: "power2.out",
        });
      };
      window.addEventListener("mousemove", moveAvatar);

      // Skills animation with physics
      const skills = skillsRef.current.querySelectorAll(".skill");

      skills.forEach((skill, index) => {
        gsap.set(skill, {
          y: gsap.utils.random(50, 500),
          x: gsap.utils.random(-100, 300),
          opacity: 1,
          rotation: gsap.utils.random(-15, 15),
        });

        gsap.to(skill, {
          opacity: 1,
          y: gsap.utils.random(-200, 500),
          x: gsap.utils.random(-500, 500),
          rotation: gsap.utils.random(-5, 5),
          duration: 3.5, // Tăng thời gian để di chuyển mượt hơn
          ease: "elastic.out(1, 0.5)",
          delay: index * 0.2,
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top center",
          },
        });

        // Tạo chuyển động tự động bằng setInterval
        setInterval(() => {
          gsap.to(skill, {
            y: gsap.utils.random(-500, 800),
            x: gsap.utils.random(-700, 800),
            // rotation: gsap.utils.random(-10, 10),
            duration: 7, // Thời gian dài hơn để bay chậm chậm
            ease: "sine.inOut",
          });
        }, gsap.utils.random(3000, 6000)); // Lặp lại sau 3-6 giây ngẫu nhiên

        // Hover effect
        skill.addEventListener("mouseenter", () => {
          gsap.to(skill, {
            duration: 3,
            scale: 1.2,
            y: "-=20",
            ease: "power2.out",
          });
        });

        skill.addEventListener("mouseleave", () => {
          gsap.to(skill, {
            scale: 1,
            y: "+=20",
            duration: 2,
            ease: "power2.out",
          });
        });

        skill.addEventListener("click", () => {
          gsap.to(skill, {
            duration: 0.5,
            physics2D: {
              velocity: 300,
              angle: gsap.utils.random(-600, 600),
              gravity: gsap.utils.random(300, 500),
            },
          });
        });
      });

      return () => window.removeEventListener("mousemove", moveAvatar);
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!avatarRef.current) return;

    gsap.to(avatarRef.current, {
      boxShadow: "0px 0px 70px 60px rgba(255, 255, 255, 0.19)",
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <section
      ref={aboutRef}
      id="about"
      className="py-20 relative overflow-hidden min-h-screen flex items-center  bg-gradient from-black to-gray-900"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div ref={contentRef} className="about-content">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              About Me
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Hello! I'm Luan, a passionate Web3 Developer with a knack for
                creating engaging and innovative web applications.
              </p>
              <p>
                With expertise in blockchain technologies, smart contracts, and
                decentralized applications (dApps), I bring ideas to life
                through clean, efficient code and intuitive user interfaces.
              </p>
              <p>
                I thrive on challenges and am always eager to embrace new
                technologies and methodologies in this exciting field.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-block mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Let's Connect
            </a>
          </div>
          <div className="relative">
            <div
              ref={avatarRef}
              className="w-64 h-64 mx-auto mb-8 overflow-hidden rounded-full shadow-lg border-4 border-purple-500 p-1 bg-gradient-to-br from-purple-400 to-pink-600"
            >
              <img
                src="https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
                alt="Nguyen Thanh Luan"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div
              ref={skillsRef}
              className="skills-container relative h-[300px]"
            >
              <IconContext.Provider value={{ size: "24px" }}>
                {[
                  "JavaScript",
                  "React",
                  "Vue.js",
                  "Next.js",
                  "CSS",
                  "HTML",
                  "Node.js",
                  "Git",
                ].map((skill) => {
                  const IconComponent = skillIcons[skill];
                  return (
                    <div
                      key={skill}
                      className="skill absolute bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl px-2 py-2 text-white font-semibold cursor-pointer"
                    >
                      <IconComponent />
                    </div>
                  );
                })}
              </IconContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
