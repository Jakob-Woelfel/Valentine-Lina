import { qs } from "../utils/dom.js";
import { shuffle } from "../utils/shuffle.js";

/**
 * images: [{ key: string, src: string, alt?: string }]
 */
export function initMemoryStage({ images, onComplete }) {
  const gridEl = qs("#grid");
  const pairsDoneEl = qs("#pairsDone");
  const pairsTotalEl = qs("#pairsTotal");
  const movesEl = qs("#moves");
  const resetBtn = qs("#resetMemory");

  const TOTAL_PAIRS = images.length;

  let deck = [];
  let first = null;
  let second = null;
  let lock = false;
  let moves = 0;
  let pairsDone = 0;

  function buildDeck() {
    const cards = [];
    images.forEach((img) => {
      cards.push({ id: img.key + "_a", key: img.key, src: img.src, alt: img.alt ?? "", matched: false });
      cards.push({ id: img.key + "_b", key: img.key, src: img.src, alt: img.alt ?? "", matched: false });
    });
    return shuffle(cards);
  }

  function updateHUD() {
    pairsTotalEl.textContent = String(TOTAL_PAIRS);
    pairsDoneEl.textContent = String(pairsDone);
    movesEl.textContent = String(moves);
  }

  function render() {
    gridEl.innerHTML = "";

    deck.forEach((card, i) => {
      const tile = document.createElement("button");
      tile.className = "tile face-down";
      tile.dataset.index = String(i);
      tile.setAttribute("aria-label", "Memory-Karte");

      // Bild als <img> einfügen (wird per CSS bei face-down unsichtbar)
      const img = document.createElement("img");
      img.className = "tile-img";
      img.src = new URL(`../${card.src}`, import.meta.url).toString();
      img.alt = card.alt;
      img.loading = "eager";
      img.decoding = "async";

      tile.appendChild(img);
      tile.addEventListener("click", onFlip);

      gridEl.appendChild(tile);
    });
  }

  function tileAt(i) {
    return gridEl.querySelector(`[data-index="${i}"]`);
  }

  function reveal(i) {
    const tile = tileAt(i);
    if (tile) tile.classList.remove("face-down");
  }

  function conceal(i) {
    const tile = tileAt(i);
    if (tile) tile.classList.add("face-down");
  }

  function markMatched(i) {
    const tile = tileAt(i);
    if (!tile) return;
    tile.classList.add("matched");
    tile.classList.remove("face-down");
    tile.disabled = true;
  }

  function onFlip(e) {
    if (lock) return;

    const idx = Number(e.currentTarget.dataset.index);
    const card = deck[idx];
    if (card.matched) return;
    if (first && first.idx === idx) return;

    reveal(idx);

    if (!first) {
      first = { idx, key: card.key };
      return;
    }

    second = { idx, key: card.key };
    moves++;
    updateHUD();

    if (first.key === second.key) {
      deck[first.idx].matched = true;
      deck[second.idx].matched = true;

      markMatched(first.idx);
      markMatched(second.idx);

      pairsDone++;
      updateHUD();

      first = null;
      second = null;

      if (pairsDone === TOTAL_PAIRS) {
        setTimeout(() => onComplete?.(), 600);
      }
    } else {
      lock = true;
      setTimeout(() => {
        conceal(first.idx);
        conceal(second.idx);
        first = null;
        second = null;
        lock = false;
      }, 650);
    }
  }

  function start() {
    deck = buildDeck();
    first = null;
    second = null;
    lock = false;
    moves = 0;
    pairsDone = 0;
    updateHUD();
    render();
  }

  resetBtn.addEventListener("click", start);

  return { start };
}
