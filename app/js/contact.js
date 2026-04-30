
const emailJsPublicKey = "vKBniLW7ARL_A5bNo";
const emailJsServiceId  = "service_jc4yk3b";
const emailJsTemplateId = "template_cqungre";

emailjs.init({ publicKey: emailJsPublicKey });

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

  emailjs.send(emailJsServiceId, emailJsTemplateId, {
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
