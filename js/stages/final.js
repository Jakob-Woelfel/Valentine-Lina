import { qs } from "../utils/dom.js";

export function initFinalStage({ onReplay }){
  const replayBtn = qs("#replay");
  replayBtn.addEventListener("click", () => onReplay?.());
}