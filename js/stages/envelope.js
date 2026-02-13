import { qs } from "../utils/dom.js";

export function initEnvelopeStage({ onOpened }){
  const envelopeWrap = qs("#envelopeWrap");

  envelopeWrap.addEventListener("click", () => {
    envelopeWrap.classList.add("open");
    setTimeout(() => onOpened?.(), 1750);
  });
}