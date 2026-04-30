window.addEventListener("load", () => {
  const carga = document.querySelector(".carga");
  const cargaMain = document.querySelector(".cargaMain");

  if (!carga || !cargaMain) return;

  const original = cargaMain.querySelector("img");
  if (!original) return;

  const contenidoOriginal = cargaMain.innerHTML;

  for (let i = 0; i < 83; i++) {
    cargaMain.innerHTML += contenidoOriginal;
  }

  const imgs = cargaMain.querySelectorAll("img");
  const imagenesInicio = gsap.utils.toArray(".cargaMain > img:nth-child(-n + 11)");
  const tl = gsap.timeline();

  gsap.set("body", { autoAlpha: 1 });
  gsap.set(cargaMain, {
    transformOrigin: "50% 50%",
  });
  gsap.set(imgs, {
    opacity: 0,
    xPercent: -50,
    yPercent: -50,
  });
  gsap.set(imagenesInicio, {
    x: function (i) {
      return i * 10 - 50;
    },
  });

  tl.set(imgs, { opacity: 0 });

  tl.to(imgs, {
    opacity: 1,
    x: function (i) {
      return (i / 2 + 10) * Math.cos(i * 5);
    },
    y: function (i) {
      return (i / 2 + 10) * Math.sin(i * 5);
    },
    scale: function (i) {
      return 0.5 + i / 500;
    },
    ease: "elastic.out(1.2, 0.5)",
    duration: 3,
    stagger: 0.005,
  });

  tl.to(
    cargaMain,
    {
      rotation: 360,
      duration: 4,
      ease: "none",
    },
    "<",
  );

  tl.to(carga, {
    opacity: 0,
    duration: 1.2,
    pointerEvents: "none",
    onComplete: () => {
      carga.remove();
    },
  }, "<2.4");
});

(function activarRecargaDeslizando() {
  if (!window.matchMedia("(pointer: coarse)").matches) return;

  let inicioY = 0;
  let puedeRecargar = false;

  function hayCapaAbierta() {
    return (
      document.querySelector(".modalSuperposicion.modalVisible") ||
      document.querySelector(".menuMovilOverlay.menuMovilVisible")
    );
  }

  function estaEscribiendo(elemento) {
    return elemento.closest("input, textarea, select");
  }

  window.addEventListener(
    "touchstart",
    (e) => {
      puedeRecargar =
        window.scrollY === 0 &&
        !hayCapaAbierta() &&
        !estaEscribiendo(e.target);

      if (puedeRecargar) inicioY = e.touches[0].clientY;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!puedeRecargar || window.scrollY !== 0) return;

      const distancia = e.touches[0].clientY - inicioY;

      if (distancia > 120) {
        puedeRecargar = false;
        window.location.reload();
      }
    },
    { passive: true },
  );

  window.addEventListener("touchend", () => {
    puedeRecargar = false;
  });
})();

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
new MutationObserver(aplicar).observe(document.body, {
  childList: true,
  subtree: true,
});

(function aplicarScramble() {
  document.querySelectorAll("h1").forEach((el) => {
    const htmlOriginal = el.innerHTML;
    const textoFinal = el.textContent.trim();

    gsap.to(el, {
      duration: 1.2,
      scrambleText: {
        text: textoFinal,
        chars: "upperCase",
        speed: 0.4,
        revealDelay: 0.2,
      },
      ease: "none",
      onComplete: () => {
        el.innerHTML = htmlOriginal;
      },
    });

    el.addEventListener("mouseenter", () => {
      gsap.killTweensOf(el);
      gsap.to(el, {
        duration: 0.7,
        scrambleText: { text: textoFinal, chars: "upperCase", speed: 0.5 },
        ease: "none",
        onComplete: () => {
          el.innerHTML = htmlOriginal;
        },
      });
    });
  });
})();

let modalScrollTriggers = [];

const selectoresModal = [
  ".modalInfoBasica",
  ".modalSeccion",
  ".modalImagenCompleta",
  ".modalConceptoRejilla",
  ".modalCita",
  ".modalProceso",
  ".modalGaleriaRejilla",
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

const innerObserver = new MutationObserver(() => {
  const modal = document.querySelector(".modalSuperposicion.modalVisible");
  if (modal)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => animarModal(modal)),
    );
});

new MutationObserver(() => {
  const modal = document.querySelector(".modalSuperposicion.modalVisible");

  if (modal && !modal.dataset.animadoModal) {
    modal.dataset.animadoModal = "1";
    gsap.from(modal, { opacity: 0, y: 500, duration: 1, ease: "power2.out" });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        animarModal(modal);
        const innerDiv = modal.querySelector(":scope > div");
        if (innerDiv) innerObserver.observe(innerDiv, { childList: true });
      }),
    );
  } else if (!modal) {
    const overlay = document.querySelector(".modalSuperposicion");
    if (overlay) delete overlay.dataset.animadoModal;
    modalScrollTriggers.forEach((st) => st.kill());
    modalScrollTriggers = [];
    innerObserver.disconnect();
  }
}).observe(document.body, {
  attributes: true,
  subtree: true,
  attributeFilter: ["class"],
});
