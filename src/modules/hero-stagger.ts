export function initHeroStagger(rootId = "hero-stagger"): void {
  const block = document.getElementById(rootId);
  if (!block) return;

  const lines = block.querySelectorAll<HTMLElement>(".stagger__line");

  requestAnimationFrame(() => {
    for (const line of lines) {
      line.classList.add("is-shown");
    }
  });
}
