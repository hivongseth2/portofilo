"use client";

import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const canvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !textCanvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const textCanvas = textCanvasRef.current;
    const textCtx = textCanvas.getContext("2d");

    let cloth;
    let boundsx;
    let boundsy;
    const mouse = {
      down: false,
      button: 1,
      x: 0,
      y: 0,
      px: 0,
      py: 0,
    };

    const physics_accuracy = 3;
    const mouse_influence = 20;
    const mouse_cut = 5;
    const gravity = 700;
    const cloth_height = 120;
    const cloth_width = 439;
    const start_y = 0;
    const spacing = 6;
    const tear_distance = 60;

    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.px = x;
        this.py = y;
        this.vx = 0;
        this.vy = 0;
        this.pin_x = null;
        this.pin_y = null;
        this.constraints = [];
      }

      update(delta) {
        if (mouse.down) {
          const diff_x = this.x - mouse.x;
          const diff_y = this.y - mouse.y;
          const dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

          if (mouse.button === 1) {
            if (dist < mouse_influence) {
              this.px = this.x - (mouse.x - mouse.px) * 1.8;
              this.py = this.y - (mouse.y - mouse.py) * 1.8;
            }
          } else if (dist < mouse_cut) {
            this.constraints = [];
          }
        }

        this.add_force(0, gravity);

        delta *= delta;
        const nx = this.x + (this.x - this.px) * 0.99 + (this.vx / 2) * delta;
        const ny = this.y + (this.y - this.py) * 0.99 + (this.vy / 2) * delta;

        this.px = this.x;
        this.py = this.y;

        this.x = nx;
        this.y = ny;

        this.vy = this.vx = 0;
      }

      draw() {
        if (!this.constraints.length) return;

        let i = this.constraints.length;
        while (i--) this.constraints[i].draw();
      }

      resolve_constraints() {
        if (this.pin_x != null && this.pin_y != null) {
          this.x = this.pin_x;
          this.y = this.pin_y;
          return;
        }

        let i = this.constraints.length;
        while (i--) this.constraints[i].resolve();

        if (this.x > boundsx) {
          this.x = 2 * boundsx - this.x;
        } else if (1 > this.x) {
          this.x = 2 - this.x;
        }
        if (this.y < 1) {
          this.y = 2 - this.y;
        } else if (this.y > boundsy) {
          this.y = 2 * boundsy - this.y;
        }
      }

      attach(point) {
        this.constraints.push(new Constraint(this, point));
      }

      remove_constraint(constraint) {
        this.constraints.splice(this.constraints.indexOf(constraint), 1);
      }

      add_force(x, y) {
        this.vx += x;
        this.vy += y;

        const round = 400;
        this.vx = ~~(this.vx * round) / round;
        this.vy = ~~(this.vy * round) / round;
      }

      pin(pinx, piny) {
        this.pin_x = pinx;
        this.pin_y = piny;
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

        if (dist > tear_distance) this.p1.remove_constraint(this);

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

            x !== 0 && p.attach(this.points[this.points.length - 1]);
            y === 0 && p.pin(p.x, p.y);
            y !== 0 && p.attach(this.points[x + (y - 1) * (cloth_width + 1)]);

            this.points.push(p);
          }
        }
      }

      update() {
        let i = physics_accuracy;

        while (i--) {
          let p = this.points.length;
          while (p--) this.points[p].resolve_constraints();
        }

        i = this.points.length;
        while (i--) this.points[i].update(0.016);
      }

      draw() {
        ctx.beginPath();

        let i = this.points.length;
        while (i--) this.points[i].draw();

        ctx.stroke();
      }

      tearPercentage() {
        const totalPoints = this.points.length;
        const tornPoints = this.points.filter(
          (p) => p.constraints.length === 0
        ).length;
        return (tornPoints / totalPoints) * 100;
      }
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cloth.update();
      cloth.draw();

      const tearPercentage = cloth.tearPercentage();
      if (tearPercentage > 50 && !showText) {
        setShowText(true);
      }

      requestAnimationFrame(update);
    }

    function start() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      textCanvas.width = window.innerWidth;
      textCanvas.height = window.innerHeight;

      ctx.strokeStyle = "#56021F";

      cloth = new Cloth();

      boundsx = canvas.width - 1;
      boundsy = canvas.height - 1;

      update();
    }

    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      textCanvas.width = window.innerWidth;
      textCanvas.height = window.innerHeight;
      boundsx = canvas.width - 1;
      boundsy = canvas.height - 1;
      start();
    }

    window.addEventListener("resize", handleResize);

    canvas.onmousedown = (e) => {
      mouse.button = e.which;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.down = true;
      e.preventDefault();
    };

    canvas.onmouseup = (e) => {
      mouse.down = false;
      e.preventDefault();
    };

    canvas.onmousemove = (e) => {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      e.preventDefault();
    };

    canvas.oncontextmenu = (e) => {
      e.preventDefault();
    };

    textCanvas.onmousemove = (e) => {
      if (showText) {
        const rect = textCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        drawText(x, y);
      }
    };

    function drawText(mouseX, mouseY) {
      const text = "NguyenThanhLuan";
      textCtx.font = "bold 72px Arial";
      textCtx.fillStyle = "#ff3366";

      const textWidth = textCtx.measureText(text).width;
      const textHeight = 72;
      const x = (textCanvas.width - textWidth) / 2;
      const y = (textCanvas.height + textHeight) / 2;

      for (let i = 0; i < text.length; i++) {
        const charWidth = textCtx.measureText(text[i]).width;
        const charX = x + textCtx.measureText(text.substring(0, i)).width;
        const charY = y;

        const dx = mouseX - (charX + charWidth / 2);
        const dy = mouseY - charY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;

        if (distance < maxDistance) {
          const angle = Math.atan2(dy, dx);
          const displacement = (1 - distance / maxDistance) * 20;
          const newX = charX + Math.cos(angle) * displacement;
          const newY = charY + Math.sin(angle) * displacement;
          textCtx.fillText(text[i], newX, newY);
        } else {
          textCtx.fillText(text[i], charX, charY);
        }
      }
    }

    start();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showText]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <canvas
        ref={textCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: showText ? "block" : "none" }}
      />
    </section>
  );
};

export default Hero;
