import './style.css';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = (canvas.width = innerWidth);
const height = (canvas.height = innerHeight);
const objects = [];

const camera = {
  x: 0,
  y: 0,
  isShake: false,
  shakeAmount: 10,

  follow(target) {
    this.x =
      target.x +
      target.w / 2 -
      width / 2 +
      (this.isShake ? (Math.random() - 0.5) * this.shakeAmount : 0);
    this.y =
      target.y +
      target.h / 2 -
      height / 2 +
      (this.isShake ? (Math.random() - 0.5) * this.shakeAmount : 0);
  },

  shake() {
    this.isShake = true;
    setTimeout(() => (this.isShake = false), 100);
  },
};

class Box {
  constructor(x, y, w, h, color = '#666') {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.type = 'platform';
    this.active = true;
    objects.push(this);
  }

  update() {}

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x - camera.x, this.y - camera.y, this.w, this.h);
  }
}

class Player extends Box {
  constructor() {
    super(160, 100, 20, 40, 'salmon');
    this.vx = 0;
    this.vy = 0;
    this.type = 'player';
    this.isGround = false;
  }

  update() {
    this.vy += 0.3;

    for (let o of objects) {
      if (o.type !== 'platform') continue;

      if (
        !(
          this.x > o.x + o.w ||
          this.y + this.vy > o.y + o.h ||
          this.x + this.w < o.x ||
          this.y + this.h + this.vy < o.y
        )
      ) {
        this.vy = 0;
        this.isGround = true;
        camera.shake();
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}

for (let i = 1; i <= 25; i++)
  new Box(Math.random() * width, i * 100 - height / 2, 100, 10);

const player = new Player();

addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 37:
      player.vx = -5;
      break;
    case 39:
      player.vx = 5;
      break;
    case 38:
      if (player.isGround) {
        player.isGround = false;
        player.vy -= 10;
      }
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
    case 32:
      camera.shake();
      break;
  }
});

(function animate() {
  context.clearRect(0, 0, width, height);
  camera.follow(player);
  objects.forEach((o) => {
    if (o.active) {
      o.update();
      o.draw();
    }
  });
  requestAnimationFrame(animate);
})();
