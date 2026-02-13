const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

let running = false;
let particles = [];
let raf = null;

function resize(){
  confettiCanvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  confettiCanvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function makeParticle(){
  const w = window.innerWidth;
  const x = Math.random() * w;
  const y = -20 - Math.random() * 200;
  const size = 6 + Math.random() * 6;
  const vx = -1.2 + Math.random() * 2.4;
  const vy = 2.5 + Math.random() * 3.5;
  const rot = Math.random() * Math.PI;
  const vr = -0.18 + Math.random() * 0.36;

  const palette = [
    "rgba(226,85,138,.95)",
    "rgba(255,122,168,.95)",
    "rgba(255,255,255,.95)",
    "rgba(255,205,225,.95)"
  ];
  const color = palette[Math.floor(Math.random() * palette.length)];

  return { x,y,size,vx,vy,rot,vr,color };
}

function draw(){
  if(!running) return;

  ctx.clearRect(0,0, window.innerWidth, window.innerHeight);

  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.vy += 0.03;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.7);
    ctx.restore();
  }

  particles = particles.filter(p => p.y < window.innerHeight + 40);
  raf = requestAnimationFrame(draw);
}

function launch(durationMs = 1500){
  resize();
  confettiCanvas.style.display = "block";
  running = true;
  particles = [];

  const burst = 160;
  for(let i=0;i<burst;i++) particles.push(makeParticle());

  if(raf) cancelAnimationFrame(raf);
  draw();

  setTimeout(() => stop(), durationMs);
}

function stop(){
  running = false;
  if(raf) cancelAnimationFrame(raf);
  raf = null;
  particles = [];
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
  confettiCanvas.style.display = "none";
}

export const confetti = { launch, stop };