const formulario = document.getElementById("formularioContact");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if (!nombre || !apellidos || !correo) {
    alert("Por favor, rellena los campos obligatorios.");
    return;
  }

 
  console.log("Formulario enviado", { nombre, apellidos, correo });
  formulario.reset();
});



