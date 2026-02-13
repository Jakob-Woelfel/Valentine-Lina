export function qs(sel, root = document){
  const el = root.querySelector(sel);
  if(!el) throw new Error(`Missing element: ${sel}`);
  return el;
}

export function qsa(sel, root = document){
  return Array.from(root.querySelectorAll(sel));
}

export function show(el){ el.classList.remove("hidden"); }
export function hide(el){ el.classList.add("hidden"); }