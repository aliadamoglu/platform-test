import './style.css';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = (canvas.width = innerWidth);
const height = (canvas.height = innerHeight);
const objects = [];

class Box {
  constructor(x, y, w, h, color = '#666') {
    this.x = x;
    this.y = y;
    this.w = w;
    (this.h = h), (this.color = color);
    objects.push(this);
  }

  update() {}

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Player extends Box {
  constructor() {
    super(180, 100, 20, 40, 'salmon');
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    this.vy += 0.3;

    for (let o of objects) {
      if (o == this) continue;

      if (this.y + this.h + this.vy >= o.y)  {
        this.vy = 0;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}

new Box(150, 300, 100, 10);
new Box(250, 400, 100, 10);
new Box(200, 500, 100, 10);
const player = new Player();

addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 37:
      player.vx -= 5;
      break;
    case 39:
      player.vx += 5;
      break;
  }
});

addEventListener('keyup', (e) => {
  switch (e.keyCode) {
    case 37:
      player.vx = 0;
      break;
    case 39:
      player.vx = 0;
      break;
  }
});

(function animate() {
  context.clearRect(0, 0, width, height);
  objects.forEach((o) => {
    o.update();
    o.draw();
  });
  requestAnimationFrame(animate);
})();
