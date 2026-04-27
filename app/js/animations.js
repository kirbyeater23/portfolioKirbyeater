gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

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

// ── ScrambleText en h1 ──────────────────────────────────────────

(function aplicarScramble() {
  document.querySelectorAll("h1").forEach((el) => {
    const htmlOriginal = el.innerHTML;
    const textoFinal = el.textContent.trim();

    // Entrada al cargar la página
    gsap.to(el, {
      duration: 1.2,
      scrambleText: { text: textoFinal, chars: "upperCase", speed: 0.4, revealDelay: 0.2 },
      ease: "none",
      onComplete: () => { el.innerHTML = htmlOriginal; },
    });

    // Hover
    el.addEventListener("mouseenter", () => {
      gsap.killTweensOf(el);
      gsap.to(el, {
        duration: 0.7,
        scrambleText: { text: textoFinal, chars: "upperCase", speed: 0.5 },
        ease: "none",
        onComplete: () => { el.innerHTML = htmlOriginal; },
      });
    });
  });
})();

// ── Animaciones scroll dentro del modal ─────────────────────────

let modalScrollTriggers = [];

const selectoresModal = [
  ".modalMeta",
  ".modalSeccion",
  ".modalImagenFull",
  ".modalConceptoGrid",
  ".modalCita",
  ".modalProceso",
  ".modalGaleriaGrid",
  ".modalSiguiente",
];

function animarModal(overlay) {
  modalScrollTriggers.forEach((st) => st.kill());
  modalScrollTriggers = [];

  selectoresModal.forEach((s) => {
    overlay.querySelectorAll(s).forEach((el) => {
      gsap.set(el, { opacity: 0, y: 40 });
      const st = ScrollTrigger.create({
        trigger: el,
        scroller: overlay,
        start: "top 90%",
        onEnter: () =>
          gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }),
      });
      modalScrollTriggers.push(st);
    });
  });
}

// Observer para cuando el modal cambia de contenido (siguiente proyecto)
const innerObserver = new MutationObserver(() => {
  const modal = document.querySelector(".modalOverlay.modalVisible");
  if (modal) requestAnimationFrame(() => requestAnimationFrame(() => animarModal(modal)));
});

// Observer para cuando el modal se abre o se cierra
new MutationObserver(() => {
  const modal = document.querySelector(".modalOverlay.modalVisible");

  if (modal && !modal.dataset.animadoModal) {
    modal.dataset.animadoModal = "1";
    gsap.from(modal, { opacity: 0, y: 500, duration: 1, ease: "power2.out" });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        animarModal(modal);
        const innerDiv = modal.querySelector(":scope > div");
        if (innerDiv) innerObserver.observe(innerDiv, { childList: true });
      })
    );
  } else if (!modal) {
    const overlay = document.querySelector(".modalOverlay");
    if (overlay) delete overlay.dataset.animadoModal;
    modalScrollTriggers.forEach((st) => st.kill());
    modalScrollTriggers = [];
    innerObserver.disconnect();
  }
}).observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });