'use strict';

export default class Hanabi {
  constructor(id) {
    this.initCanvas(id);
    this.settings = {
      // 個数
      quantity: 300,
      // スピード
      speed: 3.5,
      // 重力
      gravity: 0.9,
      // 減衰力
      damping: 0.98,
      // パーティクルのサイズ
      particleSize: 3,
      // 色
      color: '#DA5019'
    };
    this.fire();
  }

  initCanvas(id) {
    this.canvas = document.getElementById(id);
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  initParticles() {
    let x = Math.random() * this.canvas.width;
    let y = Math.random() * this.canvas.height;
    let radian = Math.PI * 2;

    for (let i = 0; i <= this.settings.quantity; i++) {
      var angle = Math.random() * radian;
      let vx = Math.cos(angle);
      let vy = Math.sin(angle);
      let speed = Math.random() * this.settings.speed;

      vx *= speed;
      vy *= speed;

      this.particles.push({x: x, y: y, vx: vx, vy: - vy});
      this.particles.push({x: x, y: y, vx: - vx, vy: - vy});
    }
  }

  update() {
    for (let particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy + this.settings.gravity;
      particle.vx *= this.settings.damping;
      particle.vy *= this.settings.damping;
      this.draw(particle);
    }
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.particleSize *= 0.97;
    requestAnimationFrame(this.update.bind(this));
  }

  fire() {
    this.particleSize = this.settings.particleSize;
    this.particles = [];
    this.initParticles();
    requestAnimationFrame(this.update.bind(this));
  }

  draw(particle) {
    this.ctx.fillStyle = this.settings.color;
    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, this.particleSize, 0, Math.PI * 2, true);
    this.ctx.fill();
  }
}
