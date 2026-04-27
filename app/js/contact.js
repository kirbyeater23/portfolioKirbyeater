// ── Configuración EmailJS ────────────────────────────────────────
// Reemplaza estos tres valores con los de tu cuenta en emailjs.com
const EMAILJS_PUBLIC_KEY  = "vKBniLW7ARL_A5bNo";
const EMAILJS_SERVICE_ID  = "service_jc4yk3b";
const EMAILJS_TEMPLATE_ID = "template_cqungre";

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ── Formulario ───────────────────────────────────────────────────
const formulario = document.getElementById("formularioContact");
const mensaje    = document.getElementById("mensajeFormulario");
const boton      = formulario.querySelector(".botonEnviar");

function mostrarMensaje(texto, exito) {
  mensaje.textContent = texto;
  mensaje.style.color = exito ? "#000" : "#f0c";
  mensaje.style.display = "block";
}

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre    = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const correo    = document.getElementById("correo").value.trim();
  const servicio  = document.getElementById("servicio").value;
  const descripcion = document.getElementById("descripcion").value.trim();

  if (!nombre || !apellidos || !correo) {
    mostrarMensaje("Por favor, rellena los campos obligatorios.", false);
    return;
  }

  boton.disabled = true;
  boton.textContent = "ENVIANDO...";

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:  `${nombre} ${apellidos}`,
    from_email: correo,
    servicio:   servicio || "No especificado",
    mensaje:    descripcion || "Sin descripción",
    to_email:   "sandra.morcillo1@esdmadrid.es",
  })
  .then(() => {
    mostrarMensaje("¡Mensaje enviado! Te respondo pronto.", true);
    formulario.reset();
  })
  .catch(() => {
    mostrarMensaje("Algo ha fallado. Escríbeme directamente a samavillac@gmail.com", false);
  })
  .finally(() => {
    boton.disabled = false;
    boton.textContent = "TRABAJEMOS JUNTOS!";
  });
});