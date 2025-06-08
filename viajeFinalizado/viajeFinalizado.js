// Función para obtener los datos del viaje desde localStorage
function obtenerResumenViaje() {
  return {
    origen: localStorage.getItem("origen") || "Origen desconocido",
    destino: localStorage.getItem("destino") || "Destino desconocido",
    duracion: localStorage.getItem("duracionViaje") || "-",
    costo: localStorage.getItem("costo") || "0.00",
    conductor: localStorage.getItem("nombreConductora") || "Conductora desconocida",
    modelo: localStorage.getItem("modeloVehiculo") || "Vehículo",
    color: localStorage.getItem("colorVehiculo") || "Color desconocido",
    placa: localStorage.getItem("placaVehiculo") || "Placa desconocida",
    metodoPago: localStorage.getItem("metodoPago") || "Efectivo",
    ultimos4Tarjeta: localStorage.getItem("ultimos4Tarjeta") || "N/A",
  };
}

// Función para mostrar un mensaje tipo toast
function showToast(mensaje, tipo = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = mensaje;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Ejecutar al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  const datos = obtenerResumenViaje();

  const duracionDoble = Number(datos.duracion) * 2;

  const metodoPagoTexto =
    datos.metodoPago === "Efectivo" ||
    datos.ultimos4Tarjeta === "N/A"
      ? "Efectivo"
      : `Tarjeta de crédito/débito [****-${datos.ultimos4Tarjeta}]`;

  // Insertar los datos en el HTML
  document.getElementById("info-ruta").textContent = `${datos.origen} a ${datos.destino}`;
  document.getElementById("info-tiempo").textContent = `${duracionDoble} minutos`;
  document.getElementById("info-pago").textContent = `$${datos.costo} (${metodoPagoTexto})`;
  document.getElementById("info-conductora").textContent = `${datos.conductor} - ${datos.modelo} (${datos.color}) - Placa: ${datos.placa}`;

  // Calificación con estrellas
  const estrellas = document.querySelectorAll("#estrellas-calificacion span");
  let calificacionSeleccionada = 0;

  estrellas.forEach((estrella) => {
    estrella.addEventListener("mouseover", () => {
      const valor = Number(estrella.getAttribute("data-valor"));
      estrellas.forEach((s) =>
        s.classList.toggle(
          "hover",
          Number(s.getAttribute("data-valor")) <= valor
        )
      );
    });

    estrella.addEventListener("mouseout", () => {
      estrellas.forEach((s) => s.classList.remove("hover"));
      actualizarEstrellas(calificacionSeleccionada);
    });

    estrella.addEventListener("click", () => {
      calificacionSeleccionada = Number(estrella.getAttribute("data-valor"));
      actualizarEstrellas(calificacionSeleccionada);
      showToast(
        `Gracias por calificar con ${calificacionSeleccionada} estrella(s).`,
        "success"
      );
    });
  });

  function actualizarEstrellas(valor) {
    estrellas.forEach((s) =>
      s.classList.toggle(
        "seleccionado",
        Number(s.getAttribute("data-valor")) <= valor
      )
    );
  }

  // Modal personalizado para "volver al inicio"
  const volverInicioBtn = document.getElementById("volver-inicio-btn");
  const modalVolver = document.getElementById("modal-volver-inicio");
  const cancelarVolverBtn = document.getElementById("cancelar-volver-btn");
  const confirmarVolverBtn = document.getElementById("confirmar-volver-btn");

  volverInicioBtn.addEventListener("click", () => {
    modalVolver.style.display = "flex";
  });

  cancelarVolverBtn.addEventListener("click", () => {
    modalVolver.style.display = "none";
  });

  confirmarVolverBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../solicitudViaje/solicitudViaje.html"; // o index.html si es la raíz
  });
});
