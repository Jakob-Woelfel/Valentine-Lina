import { qs } from "../utils/dom.js";

export function initValentineStage({ seconds = 10, onYes }){
  const yesBtn   = qs("#yesBtn");
  const noBtn    = qs("#noBtn");
  const btnArea  = qs("#btnArea");
  const teaseEl  = qs("#tease");
  const timeEl   = qs("#timeLeft");

  let timer = null;
  let t = seconds;
  let noDodges = 0;

  function placeButtonsDefault(){
    yesBtn.style.left = "";
    yesBtn.style.top  = "";

    noBtn.style.left  = "";
    noBtn.style.top   = "";
    noBtn.style.right = "";
    noBtn.style.transform = "translateY(-50%)";
  }

  function randomPos(container, element){
    const c = container.getBoundingClientRect();
    const e = element.getBoundingClientRect();
    const pad = 10;
    const maxX = Math.max(pad, c.width - e.width - pad);
    const maxY = Math.max(pad, c.height - e.height - pad);
    const x = pad + Math.random() * (maxX - pad);
    const y = pad + Math.random() * (maxY - pad);
    return { x, y };
  }

  function fleeNo(){
    if(noBtn.disabled) return;
    const { x, y } = randomPos(btnArea, noBtn);
    noBtn.style.left = `${x}px`;
    noBtn.style.top  = `${y}px`;
    noBtn.style.right = "auto";
    noBtn.style.transform = "translate(0,0)";

    noDodges++;
    const lines = [
      "Bist du sicher?",
      "Ganz sicher?",
      "Denk nochmal kurz nach 😌",
      "Komisch… der Button spinnt irgendwie…",
      "Es gibt nur eine richtige Antwort.",
      "Netter Versuch 😅"
    ];
    teaseEl.textContent = lines[Math.min(noDodges, lines.length - 1)];
  }

  function startTimer(){
    clearInterval(timer);
    t = seconds;
    timeEl.textContent = String(t);

    timer = setInterval(() => {
      t--;
      timeEl.textContent = String(t);

      if(t <= 0){
        clearInterval(timer);
        teaseEl.textContent = "Time’s up 😌";
        yesBtn.classList.add("pulse");
        noBtn.disabled = true;
        noBtn.style.display = "none";
      }
    }, 1000);
  }

  function reset(){
    clearInterval(timer);
    noDodges = 0;
    teaseEl.textContent = "Choose wisely.";
    yesBtn.classList.remove("pulse");
    noBtn.disabled = false;
    noBtn.style.display = "inline-block";
    placeButtonsDefault();
  }

  function start(){
    reset();
    startTimer();
  }

  // Events
  noBtn.addEventListener("mouseenter", fleeNo);
  noBtn.addEventListener("click", (e) => { e.preventDefault(); fleeNo(); });
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); fleeNo(); }, { passive:false });

  yesBtn.addEventListener("click", () => {
    clearInterval(timer);
    onYes?.();
  });

  return { start };
}