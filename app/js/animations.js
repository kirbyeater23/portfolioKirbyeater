gsap.registerPlugin(ScrollTrigger);

if (!window.matchMedia("(pointer: coarse)").matches) {
  let scrollTarget = window.scrollY;
  let scrollCurrent = window.scrollY;

  window.addEventListener("wheel", (e) => {
    if (document.documentElement.style.overflow === "hidden") return;
    e.preventDefault();
    scrollTarget += e.deltaY;
    scrollTarget = Math.max(
      0,
      Math.min(scrollTarget, document.documentElement.scrollHeight - window.innerHeight)
    );
  }, { passive: false });

  (function tick() {
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.1;
    if (Math.abs(scrollTarget - scrollCurrent) < 0.5) scrollCurrent = scrollTarget;
    window.scrollTo(0, scrollCurrent);
    requestAnimationFrame(tick);
  })();
}


const SELECTORES_ANIM = [
  ".cardProyecto",
  ".cardWork",
  ".bioColumna",
  ".fotoColumna",
  ".seccionServicios .columnaServicios",
  ".seccionServicios .columnaBio",
  ".tituloContact",
  ".contenidoContact",
  ".footerGeneral .bloqueFooter > *"
];

function animarElemento(el) {
  if (el.dataset.animado) return;
  el.dataset.animado = "1";
  gsap.fromTo(
    el,
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    }
  );
}

function escanearDOM() {
  SELECTORES_ANIM.forEach(sel => {
    document.querySelectorAll(sel).forEach(animarElemento);
  });
  ScrollTrigger.refresh();
}

window.addEventListener("load", escanearDOM);


new MutationObserver(escanearDOM).observe(document.body, {
  childList: true,
  subtree: true
});
