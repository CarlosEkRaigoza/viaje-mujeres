function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  if (usuario && password) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("solicitudScreen").style.display = "flex";
  } else {
    alert("Ingresa usuario y contraseña");
  }
}

function confirmarViaje() {
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;

  if (origen && destino) {
    document.getElementById("solicitudScreen").style.display = "none";
    document.getElementById("confirmacionScreen").style.display = "flex";
    document.getElementById("resumenViaje").innerText = `Tu viaje de ${origen} a ${destino} ha sido confirmado.`;
  } else {
    alert("Llena todos los campos");
  }
}

function logout() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("solicitudScreen").style.display = "none";
  document.getElementById("confirmacionScreen").style.display = "none";
  document.getElementById("usuario").value = "";
  document.getElementById("password").value = "";
  document.getElementById("origen").value = "";
  document.getElementById("destino").value = "";
}
