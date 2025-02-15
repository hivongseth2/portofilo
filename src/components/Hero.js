"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroCombined = () => {
  const canvasRef = useRef(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let cloth;
    let boundsx, boundsy;

    const physics_accuracy = 5;
    const gravity = 180;
    const cloth_height = 65; // Reduced from 130
    const cloth_width = 30; // Reduced from 60
    const start_y = 20;
    const spacing = 8; // Increased from 4
    const tear_distance = 1600;
    const restore_distance = 50;

    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.px = x;
        this.py = y;
        this.vx = 0;
        this.vy = 0;
        this.pin_x = null;
        this.pin_y = null;
        this.constraints = [];
        this.originalConstraints = [];
        this.torn = false;
      }

      update(delta) {
        if (this.pin_x !== null && this.pin_y !== null) {
          this.x = this.pin_x;
          this.y = this.pin_y;
          return;
        }

        const diff_x = this.x - this.px;
        const diff_y = this.y - this.py;

        this.vx = diff_x / delta;
        this.vy = diff_y / delta;

        this.px = this.x;
        this.py = this.y;

        this.vy += gravity * delta;

        this.x += this.vx * delta;
        this.y += this.vy * delta;

        if (this.x > boundsx) {
          this.x = 2 * boundsx - this.x;
        } else if (this.x < 1) {
          this.x = 2 - this.x;
        }

        if (this.y > boundsy) {
          this.y = 2 * boundsy - this.y;
        } else if (this.y < 1) {
          this.y = 2 - this.y;
        }
      }

      draw() {
        this.constraints.forEach((constraint) => constraint.draw());
      }

      resolve_constraints() {
        this.constraints.forEach((constraint) => constraint.resolve());
      }

      attach(point) {
        const constraint = new Constraint(this, point);
        this.constraints.push(constraint);
        this.originalConstraints.push(constraint);
      }

      remove_constraint(constraint) {
        this.constraints.splice(this.constraints.indexOf(constraint), 1);
      }

      add_force(x, y) {
        this.vx += x;
        this.vy += y;
      }

      pin(pinx, piny) {
        this.pin_x = pinx;
        this.pin_y = piny;
      }

      unpin() {
        this.pin_x = null;
        this.pin_y = null;
      }

      restore(factor) {
        if (this.torn) {
          this.x += (this.initialX - this.x) * factor;
          this.y += (this.initialY - this.y) * factor;

          if (
            Math.abs(this.x - this.initialX) < 1 &&
            Math.abs(this.y - this.initialY) < 1
          ) {
            this.torn = false;
            this.constraints = [...this.originalConstraints];
          }
        }
      }
    }

    class Constraint {
      constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = spacing;
      }

      resolve() {
        const diff_x = this.p1.x - this.p2.x;
        const diff_y = this.p1.y - this.p2.y;
        const dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
        const diff = (this.length - dist) / dist;

        if (dist > tear_distance) {
          this.p1.remove_constraint(this);
          this.p2.remove_constraint(this);
          this.p1.torn = true;
          this.p2.torn = true;
        }

        const px = diff_x * diff * 0.5;
        const py = diff_y * diff * 0.5;

        this.p1.x += px;
        this.p1.y += py;
        this.p2.x -= px;
        this.p2.y -= py;
      }

      draw() {
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
      }
    }

    class Cloth {
      constructor() {
        this.points = [];
        const start_x = canvas.width / 2 - (cloth_width * spacing) / 2;

        for (let y = 0; y <= cloth_height; y++) {
          for (let x = 0; x <= cloth_width; x++) {
            const p = new Point(start_x + x * spacing, start_y + y * spacing);
            if (x !== 0) p.attach(this.points[this.points.length - 1]);
            if (y === 0) p.pin(p.x, p.y);
            if (y !== 0) p.attach(this.points[x + (y - 1) * (cloth_width + 1)]);
            this.points.push(p);
          }
        }
      }

      update() {
        let i = physics_accuracy;
        while (i--) {
          this.points.forEach((point) => {
            point.resolve_constraints();
          });
        }

        this.points.forEach((point) => {
          point.update(0.016);
        });
      }

      draw() {
        ctx.beginPath();
        this.points.forEach((point) => {
          point.draw();
        });
        ctx.stroke();
      }

      tear(mouseX, mouseY, radius) {
        this.points.forEach((point) => {
          if (
            Math.abs(point.x - mouseX) < radius &&
            Math.abs(point.y - mouseY) < radius
          ) {
            if (Math.random() > 0.5) {
              point.constraints = [];
              point.torn = true;
            }
          }
        });
      }

      restore(factor) {
        this.points.forEach((point) => {
          point.restore(factor);
        });
      }

      applyWind(wind) {
        this.points.forEach((point) => {
          point.add_force(wind.x, wind.y);
        });
      }
    }

    // Function to draw the symbol and NTL text
    function drawSymbol(progress) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = 100;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Áp dụng hiệu ứng glow cho đường viền của biểu tượng
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 15;

      // Tạo đường path cho biểu tượng (gồm hình tròn, tam giác và vuông)
      ctx.beginPath();
      // Hình tròn
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      // Tam giác
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.closePath();
      // Vuông
      ctx.rect(-size / 3, -size / 3, (size * 2) / 3, (size * 2) / 3);

      // Thiết lập style cho stroke
      ctx.strokeStyle = "#eee";
      ctx.lineWidth = 2;

      // Vì canvas không hỗ trợ getTotalLength, ta dùng fallback
      const totalLength = 1500;
      ctx.setLineDash([totalLength]);
      ctx.lineDashOffset = totalLength * (1 - progress);

      // Vẽ đường path của biểu tượng (với hiệu ứng glow)
      ctx.stroke();

      // Loại bỏ shadow trước khi vẽ chữ để chữ không bị mờ
      ctx.shadowBlur = 0;

      // Vẽ chữ "NTL" ở giữa biểu tượng
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(255, 255, 255, ${progress})`;
      ctx.fillText("NTL", 0, 0);

      ctx.restore();
    }

    let animationId;

    function update(progress) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cloth.update();
      cloth.draw();
      drawSymbol(progress);
    }

    function startAnimation(progress) {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      update(progress);
      animationId = requestAnimationFrame(() => startAnimation(progress));
    }

    function start() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.strokeStyle = "#56021F";
      cloth = new Cloth();
      boundsx = canvas.width - 1;
      boundsy = canvas.height - 1;
      startAnimation(0);
    }

    window.addEventListener("resize", start);
    start();

    let lastScrollTop = 0;
    let scrollDirection = 0;
    let scrollSpeed = 0;

    // ScrollTrigger setup
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollDirection = scrollTop > lastScrollTop ? 1 : -1;
        scrollSpeed = Math.abs(scrollTop - lastScrollTop);
        lastScrollTop = scrollTop;

        const progress = self.progress;
        const tearRadius = 30 + progress * 50;
        const restoreFactor = 1 - progress;
        const windForce = {
          x: scrollDirection + scrollSpeed * 0.04,
          y: scrollDirection + scrollSpeed * 0.04,
        };

        if (scrollDirection === 1) {
          // Scrolling down: apply tearing effect
          const clothYMin = start_y;
          const clothYMax = start_y + cloth_height * spacing;
          const mappedY = clothYMin + progress * (clothYMax - clothYMin);
          const tearX = canvas.width / 2;

          cloth.tear(tearX, mappedY, tearRadius);
          cloth.applyWind({ x: windForce.x, y: windForce.y });
        } else {
          // Scrolling up: apply restore effect
          cloth.restore(restoreFactor);
          // cloth.applyWind({ x: -windForce.x, y: -windForce.y });
        }

        // Update symbol opacity based on scroll progress
        startAnimation(progress);
      },
    });

    return () => {
      window.removeEventListener("resize", start);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className="fixed top-0 w-full h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 text-white text-center">
        {/* <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to My Portfolio
        </h1>
        <p className="text-xl md:text-2xl">Scroll down to explore</p> */}
      </div>
    </section>
  );
};

export default HeroCombined;
