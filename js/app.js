import { qs, show, hide } from "./utils/dom.js";
import { initPathStage } from "./stages/path.js";
import { initQuizStage } from "./stages/quiz.js";
import { initEnvelopeStage } from "./stages/envelope.js";
import { initMemoryStage } from "./stages/memory.js";
import { initValentineStage } from "./stages/valentine.js";
import { initFinalStage } from "./stages/final.js";
import { confetti } from "./effects/confetti.js";

const stagePath     = qs("#stagePath");
const stageQuiz     = qs("#stageQuiz");
const stageEnvelope = qs("#stageEnvelope");
const stageMemory   = qs("#stageMemory");
const stageVal      = qs("#stageValentine");
const stageFinal    = qs("#stageFinal");

function goTo(stageName){
  hide(stagePath);
  hide(stageQuiz);
  hide(stageEnvelope);
  hide(stageMemory);
  hide(stageVal);
  hide(stageFinal);

  if(stageName === "path")      show(stagePath);
  if(stageName === "quiz")      show(stageQuiz);
  if(stageName === "envelope")  show(stageEnvelope);
  if(stageName === "memory")    show(stageMemory);
  if(stageName === "valentine") show(stageVal);
  if(stageName === "final")     show(stageFinal);
}

function resetToStart(quizApi){
  confetti.stop();
  qs("#envelopeWrap").classList.remove("open");
  quizApi?.clear?.();
  goTo("path");
}

function main(){
  goTo("path");

  initPathStage({
    onNext: () => goTo("quiz")
  });

  const quizApi = initQuizStage({
    onPass: () => goTo("envelope"),
    onFail: () => resetToStart(quizApi),
    onBack: () => goTo("path"),
  });

  initEnvelopeStage({
    onOpened: () => {
      goTo("memory");
      memory.start();
    }
  });

  const imgUrl = (name) => new URL(`../img/${name}`, import.meta.url).href;

  const memory = initMemoryStage({
    images: [
      { key: "p1", src: imgUrl("Bild1.JPG"), alt: "Bild 1" },
      { key: "p2", src: imgUrl("Bild2.JPG"), alt: "Bild 2" },
      { key: "p3", src: imgUrl("Bild3.jpeg"), alt: "Bild 3" },
    ],
    onComplete: () => {
      goTo("valentine");
      valentine.start();
    }
  });

  const valentine = initValentineStage({
    seconds: 10,
    onYes: () => {
      confetti.launch(1800);
      goTo("final");
    }
  });

  initFinalStage({
    onReplay: () => resetToStart(quizApi)
  });
}

main();
