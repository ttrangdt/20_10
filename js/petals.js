/**
 * petals.js – Floating petals & soft ambient sparkles canvas
 */

export function initPetals() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const PETAL_COUNT = 24;
  const petals = [];

  const COLORS = [
    'rgba(244, 166, 175, 0.45)', // pastel pink
    'rgba(232, 120, 135, 0.35)', // rose pink
    'rgba(255, 209, 220, 0.50)', // blush
    'rgba(248, 187, 208, 0.40)', // soft tulip pink
    'rgba(255, 240, 245, 0.60)', // light white-pink
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : -20;
      this.size = 8 + Math.random() * 12;
      this.speedY = 0.6 + Math.random() * 1.2;
      this.speedX = Math.sin(Math.random() * 2) * 0.8;
      this.angle = Math.random() * 360;
      this.angularSpeed = (Math.random() - 0.5) * 1.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.swing = Math.random() * 2;
      this.swingCount = Math.random() * 100;
    }

    update() {
      this.swingCount += 0.02;
      this.x += Math.sin(this.swingCount) * this.swing + this.speedX;
      this.y += this.speedY;
      this.angle += this.angularSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.fillStyle = this.color;

      // Soft tulip petal shape (curved path)
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.3, this.size * 0.4, this.size * 0.8);
      ctx.quadraticCurveTo(0, this.size, -this.size * 0.4, this.size * 0.8);
      ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.3, 0, -this.size);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(loop);
  }

  loop();
}
