import { qs } from "../utils/dom.js";

function checkedValues(selector) {
  return Array.from(document.querySelectorAll(selector))
    .filter((el) => el.checked)
    .map((el) => el.value)
    .sort();
}

export function initQuizStage({ onPass, onFail, onBack }) {
  const submit = qs("#quizSubmit");
  const resetBtn = qs("#quizReset");
  const msg = qs("#quizMsg");
  const stage = qs("#stageQuiz");

  // Anforderungen:
  // 1) Q1: §1040 muss ausgewählt sein (andere dürfen zusätzlich ausgewählt sein)
  // 2) Q2: entweder "c" (Unendlich + 1) oder "d" ("Das lässt sich nicht in Zahlen messen.")
  // 3) Q3: egal wie viele, aber mindestens eine Option muss ausgewählt sein
  const REQUIRED_Q1 = "1040";
  const ALLOWED_Q2 = new Set(["c", "d"]);

  // --- ensure CSS for shake is injected (so you don't have to edit main.css) ---
  (function ensureShakeCss() {
    if (document.getElementById("quiz-shake-css")) return;
    const style = document.createElement("style");
    style.id = "quiz-shake-css";
    style.textContent = `
      @keyframes quizShake {
        0%,100% { transform: translateX(0); }
        15% { transform: translateX(-10px); }
        30% { transform: translateX(10px); }
        45% { transform: translateX(-8px); }
        60% { transform: translateX(8px); }
        75% { transform: translateX(-6px); }
        90% { transform: translateX(6px); }
      }
      .quiz-shake {
        animation: quizShake 420ms ease-in-out;
      }
      #quizMsg.quiz-msg-err{
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 14px;
        background: rgba(226,85,138,.10);
        border: 1px solid rgba(226,85,138,.22);
        color: #3a3a3a;
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);
  })();

  function clearInputs() {
    stage.querySelectorAll("input").forEach((i) => (i.checked = false));
  }

  function shakeCard() {
    stage.classList.remove("quiz-shake");
    // force reflow to restart animation reliably
    void stage.offsetWidth;
    stage.classList.add("quiz-shake");
  }

  function showFail(reason) {
    msg.classList.add("quiz-msg-err");
    msg.textContent = `❌ ${reason}`;
    shakeCard();

    // Keep visible for a moment, then reset & go back
    setTimeout(() => {
      clearInputs();
      msg.textContent = "";
      msg.classList.remove("quiz-msg-err");
      onFail?.();
    }, 1200);
  }

  submit.addEventListener("click", () => {
    // clear previous state
    msg.textContent = "";
    msg.classList.remove("quiz-msg-err");

    const q1 = checkedValues('#stageQuiz input[name="q1"]'); // array
    const q2El = stage.querySelector('input[name="q2"]:checked');
    const q2 = q2El ? q2El.value : null; // string or null
    const q3 = checkedValues('#stageQuiz input[name="q3"]'); // array

    // Must answer all three (at least one checkbox for Q1/Q3, and one radio for Q2)
    if (!q2 || q1.length === 0 || q3.length === 0) {
      showFail("Bitte alle 3 Fragen beantworten 🙂");
      return;
    }

    // Checks per your rules
    const ok1 = q1.includes(REQUIRED_Q1); // §1040 muss dabei sein
    const ok2 = ALLOWED_Q2.has(q2);       // c oder d
    const ok3 = q3.length >= 1;           // mindestens eine Auswahl

    if (!ok1) {
      showFail("Frage 1: Bitte §1040 auswählen 🙂");
      return;
    }
    if (!ok2) {
      showFail("Frage 2: Bitte eine der zwei passenden Antworten wählen 🙂");
      return;
    }
    if (!ok3) {
      showFail("Frage 3: Bitte mindestens eine Option wählen 🙂");
      return;
    }

    // Erfolg
    msg.textContent = "✅ Okay… du darfst weiter 😌";
    setTimeout(() => {
      msg.textContent = "";
      onPass?.();
    }, 450);
  });

  resetBtn.addEventListener("click", () => {
    msg.textContent = "";
    msg.classList.remove("quiz-msg-err");
    clearInputs();
    onBack?.();
  });

  return {
    clear: () => {
      msg.textContent = "";
      msg.classList.remove("quiz-msg-err");
      clearInputs();
    },
  };
}