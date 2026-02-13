import { qs } from "../utils/dom.js";

export function initPathStage({ onNext }) {
  const a = qs("#pathA");
  const b = qs("#pathB");
  const c = qs("#pathC");

  function next() {
    onNext?.();
  }

  a.addEventListener("click", next);
  b.addEventListener("click", next);
  c.addEventListener("click", next);
}