const smileyPath = "M122.63.47l9.09,1.4c1.24,0,2.56-.31,3.96-.93,1.4-.62,2.8-.93,4.2-.93,29.22,0,53.74,12.2,73.55,36.6,19.82,24.4,29.73,51.52,29.73,81.36s-11.46,51.87-34.39,69.82c-22.93,17.95-50.01,26.93-81.25,26.93-36.53,0-66.91-9.75-91.16-29.26C12.12,165.96,0,139.26,0,105.38c0-28.75,12.59-53.42,37.77-74.02C62.95,10.76,91.23.47,122.63.47ZM147.11,40.57c-2.64,2.18-5.98,3.26-10.02,3.26-4.98,0-9.09-1.55-12.36-4.66-56.11,4.35-84.16,27.59-84.16,69.71,0,22.38,7.73,39.44,23.2,51.17,15.46,11.74,37.49,17.6,66.09,17.6,20.98,0,38.43-5.13,52.34-15.39,13.91-10.26,20.87-25.02,20.87-44.3s-5.4-36.29-16.2-52.46c-10.8-16.16-24.05-24.48-39.75-24.95ZM107.48,86.73c0,5.29-1.63,9.87-4.9,13.75-3.26,3.89-7.38,5.83-12.36,5.83-5.29,0-9.95-2.21-13.99-6.64-4.04-4.43-6.06-8.74-6.06-12.94,0-4.97,1.82-9.29,5.48-12.94s8.2-5.48,13.64-5.48c12.12,0,18.18,6.14,18.18,18.42ZM79.27,131.25c0-8.86,4.43-13.29,13.29-13.29,2.33,0,4.27.78,5.83,2.33,8.55,8.55,16.86,12.82,24.95,12.82,7.15,0,15.7-5.67,25.65-17.02,1.87-2.02,3.96-3.03,6.29-3.03,10.41,0,15.62,4.59,15.62,13.75s-4.7,16.71-14.1,24.01c-9.41,7.31-19.78,10.96-31.12,10.96-10.72,0-21.14-2.95-31.24-8.86-10.1-5.91-15.15-13.13-15.15-21.68ZM169.96,83.93c0,5.29-1.6,9.87-4.78,13.75-3.19,3.89-7.27,5.83-12.24,5.83s-9.76-2.13-13.87-6.41c-4.12-4.27-6.18-8.66-6.18-13.17,0-4.82,1.79-9.13,5.36-12.94,3.57-3.81,8.08-5.71,13.52-5.71,12.12,0,18.18,6.22,18.18,18.65Z";

const bio = {
  es: {
    etiqueta: "SOBRE MÍ",
    saludo: "Hola :D",
    parrafos: [
      "Soy Sandra, diseñadora gráfica actualmente estudio en la Escuela Superior de Diseño de Madrid.",
      "Desde el motion hasta el branding, la ilustración, el editorial y el diseño web, creo visuales expresivos, reflexivos y llenos de intención.",
      "Mi trabajo busca conectar concepto y emoción a través de un diseño que es a la vez funcional y memorable.",
    ],
  },
  en: {
    etiqueta: "ABOUT ME",
    saludo: "Hello :D",
    parrafos: [
      "I'm Sandra, a graphic designer currently studying at the Escuela Superior de Diseño de Madrid.",
      "From motion to branding, illustration, editorial and web design, I create visuals that are expressive, thoughtful and full of intention.",
      "My work aims to connect concept and emotion through design that is both functional and memorable.",
    ],
  },
};

function renderHero() {
  const hero = document.getElementById("heroAbout");
  if (!hero) return;

  hero.innerHTML = `
    <div class="heroAboutFila">
      <svg class="smileyAbout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 243.16 214.72" aria-label="Smiley rosa">
        <path d="${smileyPath}"/>
      </svg>
      <h1 class="tituloAboutNegro">¿QUIEN</h1>
    </div>
    <h1 class="tituloAboutRosa">SOY*?</h1>
  `;
}

function renderColumna(datos) {
  return `
    <div class="bioColumna">
      <small class="bioEtiqueta">${datos.etiqueta}</small>
      <h3 class="bioSaludo">${datos.saludo}</h3>
      ${datos.parrafos.map(p => `<p>${p}</p>`).join("")}
    </div>
  `;
}

function renderBio() {
  const seccion = document.getElementById("bioAbout");
  if (!seccion) return;

  seccion.innerHTML = `
    <div class="fotoColumna">
      <p class="etiquetaYo">YO!</p>
      <img class="fotoYo" src="./assets/images/about/yoo.webp" alt="Foto de Sandra" />
    </div>
    ${renderColumna(bio.es)}
    ${renderColumna(bio.en)}
  `;
}

renderHero();
renderBio();



