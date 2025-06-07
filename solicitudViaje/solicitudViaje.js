console.log("solicitudViaje.js cargado");

let origen = "";
let destino = "";
let metodoPago = "";
let tarjetaConfirmada = false;

// Elementos del formulario de tarjeta
const radioTarjeta = document.getElementById("metodo-pago-tarjeta");
const radioEfectivo = document.getElementById("metodo-pago-efectivo");
const formularioTarjeta = document.getElementById("formulario-tarjeta");
const btnCancelarTarjeta = document.getElementById("cancelar-tarjeta");
const btnConfirmarTarjeta = document.getElementById("confirmar-tarjeta");
const btnSolicitar = document.getElementById("btn-solicitar");
const numeroTarjeta = document.getElementById("numero-tarjeta");
const fechaTarjeta = document.getElementById("fecha-tarjeta");
const cvvTarjeta = document.getElementById("cvv-tarjeta");
const nombreTarjeta = document.getElementById("nombre-tarjeta");

// Mostrar formulario de tarjeta cuando se selecciona
radioTarjeta.addEventListener("change", () => {
  if (radioTarjeta.checked) {
    formularioTarjeta.classList.remove("oculto");
    setTimeout(() => {
      formularioTarjeta.classList.add("activo");
    }, 10);

    btnSolicitar.disabled = true;
    tarjetaConfirmada = false;
    // Limpiar campos al mostrar
    numeroTarjeta.value = "";
    fechaTarjeta.value = "";
    cvvTarjeta.value = "";
    nombreTarjeta.value = "";
    // Limpiar errores
    document.querySelectorAll(".mensaje-error").forEach((el) => {
      el.style.display = "none";
      el.previousElementSibling?.classList.remove("input-error");
    });
  }
});

// Habilitar botón si se elige efectivo
radioEfectivo.addEventListener("change", () => {
  if (radioEfectivo.checked) {
    formularioTarjeta.classList.remove("activo");
    setTimeout(() => formularioTarjeta.classList.add("oculto"), 300);
    btnSolicitar.disabled = false;
    tarjetaConfirmada = false;
  }
});

// Cancelar pago con tarjeta
btnCancelarTarjeta.addEventListener("click", () => {
  formularioTarjeta.classList.remove("activo");
  setTimeout(() => formularioTarjeta.classList.add("oculto"), 300);
  radioTarjeta.checked = false;
  tarjetaConfirmada = false;

  const metodoSeleccionado = document.querySelector(
    'input[name="metodo-pago"]:checked'
  );

  if (!metodoSeleccionado) {
    btnSolicitar.disabled = true;
    showToast("Por favor selecciona un método de pago.");
  } else if (metodoSeleccionado.value === "efectivo") {
    btnSolicitar.disabled = false;
  } else {
    btnSolicitar.disabled = true;
  }
});

// Máscara para número de tarjeta (formato 0000 0000 0000 0000)
numeroTarjeta.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  let formatted = "";

  for (let i = 0; i < value.length && i < 16; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += " ";
    }
    formatted += value[i];
  }

  e.target.value = formatted;
  validarNumeroTarjeta();
});

// Máscara para fecha (MM/AA)
fechaTarjeta.addEventListener("input", (e) => {
  let value = e.target.value.replace(/[^0-9]/g, "");

  if (value.length > 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  }

  e.target.value = value;
  validarFechaTarjeta();
});

// Validación avanzada del número de tarjeta (algoritmo de Luhn)
function validarNumeroTarjeta() {
  const errorElement = document.getElementById("error-numero");
  const value = numeroTarjeta.value.replace(/\s+/g, "");

  if (value.length !== 16) {
    mostrarError(errorElement, "El número debe tener 16 dígitos");
    return false;
  }

  // Algoritmo de Luhn
  let sum = 0;
  for (let i = 0; i < value.length; i++) {
    let digit = parseInt(value[i]);

    if ((value.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  if (sum % 10 !== 0) {
    mostrarError(errorElement, "Número de tarjeta inválido");
    return false;
  }

  ocultarError(errorElement);
  return true;
}

// Validación avanzada de fecha (MM/AA)
function validarFechaTarjeta() {
  const errorElement = document.getElementById("error-fecha");
  const value = fechaTarjeta.value;

  if (!value.includes("/") || value.length !== 5) {
    mostrarError(errorElement, "Formato debe ser MM/AA");
    return false;
  }

  const [mm, aa] = value.split("/").map(Number);
  const ahora = new Date();
  const añoActual = ahora.getFullYear() % 100;
  const mesActual = ahora.getMonth() + 1;

  if (mm < 1 || mm > 12) {
    mostrarError(errorElement, "Mes inválido (1-12)");
    return false;
  }

  if (aa < añoActual || (aa === añoActual && mm < mesActual)) {
    mostrarError(errorElement, "La tarjeta está expirada");
    return false;
  }

  ocultarError(errorElement);
  return true;
}

// Validación de CVV (3 o 4 dígitos)
function validarCVV() {
  const errorElement = document.getElementById("error-cvv");
  const value = cvvTarjeta.value;

  if (value.length < 3 || value.length > 4 || !/^\d+$/.test(value)) {
    mostrarError(errorElement, "CVV debe tener 3 o 4 dígitos");
    return false;
  }

  ocultarError(errorElement);
  return true;
}

// Validación nombre (solo letras y espacios)
function validarNombreTarjeta() {
  const errorElement = document.getElementById("error-nombre");
  const value = nombreTarjeta.value.trim();

  if (value.length < 3 || !/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(value)) {
    mostrarError(errorElement, "Nombre inválido (solo letras)");
    return false;
  }

  ocultarError(errorElement);
  return true;
}

// Funciones auxiliares para mostrar/ocultar errores
function mostrarError(elemento, mensaje) {
  if (!elemento) return;
  elemento.textContent = mensaje;
  elemento.style.display = "block";
  elemento.previousElementSibling.classList.add("input-error");
}

function ocultarError(elemento) {
  if (!elemento) return;
  elemento.style.display = "none";
  elemento.previousElementSibling.classList.remove("input-error");
}

// Confirmar datos de tarjeta con validación mejorada
btnConfirmarTarjeta.addEventListener("click", () => {
  const valido =
    validarNumeroTarjeta() &&
    validarFechaTarjeta() &&
    validarCVV() &&
    validarNombreTarjeta();

  if (!valido) {
    showToast("Por favor corrige los errores en los datos de la tarjeta");
    return;
  }

  tarjetaConfirmada = true;
  formularioTarjeta.classList.remove("activo");
  setTimeout(() => formularioTarjeta.classList.add("oculto"), 300);
  btnSolicitar.disabled = false;
  showToast("Tarjeta confirmada correctamente");
});

// --- Toast ---
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// --- Referencias a secciones ---
const buscarViajeSection = document.getElementById("buscar-viaje");
const modal = document.getElementById("confirmacion-modal");
const salirModal = document.getElementById("salir-modal");

// --- Botones y elementos del formulario ---
const form = document.getElementById("viaje-form");
const salirBtn = document.getElementById("salir");
const modalMessage = document.getElementById("modal-message");
const infoPago = document.getElementById("info-pago");
const btnConfirmar = document.getElementById("btn-confirmar");
const btnModificar = document.getElementById("btn-modificar");
const btnConfirmarSalir = document.getElementById("btn-confirmar-salir");
const btnCancelarSalir = document.getElementById("btn-cancelar-salir");

// Función para mostrar/ocultar modales
function toggleModal(modalElement, show) {
  if (show) {
    modalElement.classList.remove("oculto");
    modalElement.classList.add("show");
  } else {
    modalElement.classList.remove("show");
    setTimeout(() => modalElement.classList.add("oculto"), 300);
  }
}

// --- EVENTOS: Fase 1 - Buscar viaje ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  origen = document.getElementById("origen").value.trim();
  destino = document.getElementById("destino").value.trim();
  metodoPago = document.querySelector(
    'input[name="metodo-pago"]:checked'
  )?.value;

  if (!origen || !destino) {
    showToast("Por favor completa ambos campos de ubicación.");
    return;
  }

  if (!metodoPago) {
    showToast("Por favor selecciona un método de pago.");
    return;
  }

  if (metodoPago === "tarjeta" && !tarjetaConfirmada) {
    showToast("Por favor confirma los datos de tu tarjeta.");
    radioTarjeta.checked = true;
    formularioTarjeta.classList.remove("oculto");
    btnSolicitar.disabled = true;
    return;
  }

  // Mostrar información en el modal
  modalMessage.textContent = `¿Confirmas tu viaje de "${origen}" a "${destino}"?`;

  // Mostrar método de pago seleccionado
  const metodoTexto =
    metodoPago === "efectivo"
      ? "Efectivo"
      : "Tarjeta de crédito/débito (****" + numeroTarjeta.value.slice(-4) + ")";

  infoPago.textContent = `Método de pago: ${metodoTexto}`;

  toggleModal(modal, true);
});

// Evento para el botón de salir
salirBtn.addEventListener("click", () => {
  toggleModal(salirModal, true);
});

btnConfirmar.addEventListener("click", () => {
  toggleModal(modal, false);
  // Guardar datos en localStorage
  localStorage.setItem("origen", origen);
  localStorage.setItem("destino", destino);
  localStorage.setItem("metodoPago", metodoPago);
  // Redirigir a la página de viaje en curso
  window.location.href = "/viaje/viaje.html";
});

btnModificar.addEventListener("click", () => {
  toggleModal(modal, false);
});

btnConfirmarSalir.addEventListener("click", () => {
  toggleModal(salirModal, false);
  window.location.href = "../index.html";
});

btnCancelarSalir.addEventListener("click", () => {
  toggleModal(salirModal, false);
});
