gsap.registerPlugin(ScrollTrigger);

const selectores = [
  // seccion home
  ".cardProyecto",
  ".seccionServicios .columnaServicios",
  ".seccionServicios .columnaBio",
  // seccion work
  ".cardWork",
  // seccion about
  ".heroAboutFila",
  ".tituloAboutRosa",
  ".fotoColumna",
  ".bioColumna",
  // seccion contact
  ".tituloContact",
  ".textoContact",
  ".formularioContact",
];

function animar(el) {
  if (el.dataset.animado) return;
  el.dataset.animado = "1";
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
  });
}

function aplicar() {
  selectores.forEach((s) => gsap.utils.toArray(s).forEach(animar));
}

aplicar();
new MutationObserver(aplicar).observe(document.body, { childList: true, subtree: true });

new MutationObserver(() => {
  const modal = document.querySelector(".modalOverlay.modalVisible");
  if (modal && !modal.dataset.animadoModal) {
    modal.dataset.animadoModal = "1";
    gsap.from(modal, { opacity: 0, y: 500, duration: 1, ease: "power2.out" });
  } else if (!modal) {
    const overlay = document.querySelector(".modalOverlay");
    if (overlay) delete overlay.dataset.animadoModal;
  }
}).observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });
