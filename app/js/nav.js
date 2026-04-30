const pagina = window.location.pathname.split('/').pop() || 'index.html';

function esActivo(href) {
  const nombre = href.replace('./', '').split('/').pop();
  const actual = pagina === '' ? 'index.html' : pagina;
  return nombre === actual;
}

const overlay = document.createElement('div');
overlay.className = 'menuMovilOverlay';
overlay.innerHTML = `
  <div class="menuMovilCabecera">
    <a href="index.html"><img class="imagenLogo" src="./assets/images/imagenLogo.webp" alt="Logo"></a>
    <button class="menuMovilCerrar" aria-label="Cerrar menú">×</button>
  </div>
  <hr class="menuMovilSeparador">
  <div class="menuMovilCuerpo">
    
    <nav class="menuMovilNav">
      <a href="index.html" class="menuMovilEnlace${esActivo('index.html') ? ' menuMovilActivo' : ''}">HOME</a>
      <a href="work.html" class="menuMovilEnlace${esActivo('work.html') ? ' menuMovilActivo' : ''}">WORK</a>
      <a href="about.html" class="menuMovilEnlace${esActivo('about.html') ? ' menuMovilActivo' : ''}">ABOUT</a>
      <a href="contact.html" class="menuMovilEnlace menuMovilEnlaceContact${esActivo('contact.html') ? ' menuMovilActivo' : ''}">CONTACT</a>
    </nav>
    <p class="menuMovilAsterisco">*</p>
    <div class="menuMovilServicios">
      <p>Motion · Branding · Ilustración</p>
      <p>Editorial · Diseño Web</p>
    </div>
  </div>
  <div class="menuMovilPie">
    <hr class="menuMovilSeparador">
    <div class="menuMovilPieContenido">
      <div class="menuMovilRedes">
        <a href="https://www.instagram.com/kirbyeater23/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.linkedin.com/in/sandra-martínez-villacorta-61a30a294/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <p class="menuMovilEmailPie">samavillac@gmail.com</p>
    </div>
    <p class="menuMovilCreditos">WEBSITE BY SANDRA MARTÍNEZ VILLACORTA</p>
  </div>
`;
document.body.appendChild(overlay);

const hamburguesa = document.querySelector('.menuHamburguesa');
if (hamburguesa) {
  hamburguesa.addEventListener('click', () => {
    overlay.classList.add('menuMovilVisible');
    document.body.style.overflow = 'hidden';
  });
}

overlay.querySelector('.menuMovilCerrar').addEventListener('click', () => {
  overlay.classList.remove('menuMovilVisible');
  document.body.style.overflow = '';
});







//CURSOOOOr
const cursorPunto = document.querySelector(".cursorPunto");
const colorCursor = "#FF00CC";
const puntoRadio = 4;

if (cursorPunto) {
  gsap.set(cursorPunto, {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: colorCursor,
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 9999,
    pointerEvents: "none"
  });
}

const numSegmentos = 5;
const poolSegmentos = [];
for (let i = 0; i < numSegmentos; i++) {
  const seg = document.createElement("div");
  document.body.appendChild(seg);
  gsap.set(seg, {
    position: "fixed",
    left: 0,
    top: 0,
    height: 2,
    width: 0,
    backgroundColor: colorCursor,
    transformOrigin: "0% 50%",
    opacity: 0,
    zIndex: 9998,
    pointerEvents: "none"
  });
  poolSegmentos.push(seg);
}
let segIdx = 0;
let prevX = null;
let prevY = null;
let segStartX = null;
let segStartY = null;
let acumulado = 0;
const cadaPx = 18;

window.addEventListener("mousemove", (e) => {
  const cx = e.clientX;
  const cy = e.clientY;

  if (cursorPunto) {
    gsap.to(cursorPunto, {
      x: cx - puntoRadio,
      y: cy - puntoRadio,
      duration: 0.06,
      ease: "none"
    });
  }

  if (prevX === null) {
    prevX = cx;
    prevY = cy;
    segStartX = cx;
    segStartY = cy;
    return;
  }

  const dx = cx - prevX;
  const dy = cy - prevY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  acumulado += dist;

  if (acumulado >= cadaPx) {
    const angle = Math.atan2(cy - segStartY, cx - segStartX) * (180 / Math.PI);
    const longitud = Math.sqrt((cx - segStartX) ** 2 + (cy - segStartY) ** 2);
    const seg = poolSegmentos[segIdx % numSegmentos];
    segIdx++;
    gsap.killTweensOf(seg);
    gsap.set(seg, { x: segStartX, y: segStartY - 1, width: longitud, rotation: angle, opacity: 1 });
    gsap.to(seg, { opacity: 0, duration: 0.5, ease: "power1.out" });
    segStartX = cx;
    segStartY = cy;
    acumulado = 0;
  }

  prevX = cx;
  prevY = cy;
});
