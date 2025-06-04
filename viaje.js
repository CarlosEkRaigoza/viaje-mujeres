console.log("viaje.js cargado");

let origen = "";
let destino = "";

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

// --- Cancelar viaje ---
document.addEventListener("DOMContentLoaded", () => {
  const cancelarBtn = document.getElementById("cancelar-btn");
  const confirmacionDiv = document.getElementById("confirmacion-cancelacion");
  const continuarBtn = document.getElementById("continuar-btn");
  const confirmarCancelarBtn = document.getElementById(
    "confirmar-cancelar-btn"
  );

  if (cancelarBtn && confirmacionDiv && continuarBtn && confirmarCancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      confirmacionDiv.classList.remove("confirmacion-oculta");
      confirmacionDiv.classList.add("confirmacion-visible");
      confirmacionDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    continuarBtn.addEventListener("click", () => {
      confirmacionDiv.classList.remove("confirmacion-visible");
      confirmacionDiv.classList.add("confirmacion-oculta");
    });

    confirmarCancelarBtn.addEventListener("click", () => {
      simulacionViajeSection.classList.add("oculto");
      buscarViajeSection.classList.remove("oculto");
      confirmacionDiv.classList.remove("confirmacion-visible");
      confirmacionDiv.classList.add("confirmacion-oculta");
    });
  }
});

// --- Referencias a secciones ---
const buscarViajeSection = document.getElementById("buscar-viaje");
const simulacionViajeSection = document.getElementById("simulacion-viaje");
const modal = document.getElementById("confirmacion-modal");

// --- Botones de la fase buscar viaje ---
const form = document.getElementById("viaje-form");
const salirBtn = document.getElementById("salir");
const modalMessage = document.getElementById("modal-message");
const btnConfirmar = document.getElementById("btn-confirmar");
const btnModificar = document.getElementById("btn-modificar");

// --- EVENTOS: Fase 1 - Buscar viaje ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  origen = document.getElementById("origen").value.trim();
  destino = document.getElementById("destino").value.trim();

  if (!origen || !destino) {
    showToast("Por favor completa ambos campos.");
    return;
  }

  modalMessage.textContent = `¿Confirmas tu viaje de "${origen}" a "${destino}"?`;
  modal.classList.remove("oculto");
  modal.classList.add("show");
});

btnConfirmar.addEventListener("click", () => {
  modal.classList.remove("show");
  buscarViajeSection.classList.add("oculto");
  simulacionViajeSection.classList.remove("oculto");
  initSimulacionViaje();
});

btnModificar.addEventListener("click", () => {
  modal.classList.remove("show");
});

salirBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// --- Fase 2: Simulación del viaje ---
const conductor = "María";
const vehiculo = {
  modelo: "Toyota Corolla",
  color: "rosa",
};
const tiempoEstimadoMinutos = 7;

function initSimulacionViaje() {
  console.log("Inicializando simulación de viaje...");

  // Actualizar info visible
  const nombreConductor = document.getElementById("nombre-conductor");
  const vehiculoElement = document.getElementById("vehiculo");
  const tiempoLlegada = document.getElementById("tiempo-llegada");

  if (nombreConductor && vehiculoElement && tiempoLlegada) {
    nombreConductor.textContent = conductor;
    vehiculoElement.textContent = `${vehiculo.modelo} (${vehiculo.color})`;
    tiempoLlegada.textContent = `Llegará en aproximadamente ${tiempoEstimadoMinutos} minutos.`;
  }

  // Iniciar mapa
  initMap();
}

// --- Inicializar Mapa ---
window.initMap = function () {
  console.log("Inicializando mapa...");

  try {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: 21.1619, lng: -86.8515 }, // Mérida, Yucatán
    });

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: origen || "UNIVERSIDAD MESOAMERICANA DE SAN AGUSTIN",
        destination: destino || "Parque Zoológico del Centenario",
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else if (status === "ZERO_RESULTS") {
          showToast(
            "No se encontró ruta para el origen o destino ingresados. Por favor, verifica las direcciones."
          );
          showMapError("No se encontró ruta para los lugares indicados.");
        } else {
          console.error("Error al calcular la ruta:", status);
          showMapError(`Error al cargar el mapa: ${status}`);
        }
      }
    );
  } catch (error) {
    console.error("Error inicializando el mapa:", error);
  }
}; // <- aquí se cierra directionsService.route correctamente

// Función para mostrar error en el mapa
function showMapError(message) {
  const mapElement = document.getElementById("map");
  if (mapElement) {
    mapElement.innerHTML = `
      <div style="height:100%; display:flex; justify-content:center; align-items:center; color:red;">
        ${message}
      </div>`;
  }
}

// --- Cancelar viaje ---
document.addEventListener("DOMContentLoaded", () => {
  const cancelarBtn = document.getElementById("cancelar-btn");
  const continuarBtn = document.getElementById("continuar-btn");
  const confirmarCancelarBtn = document.getElementById("confirmar-cancelar-btn");
  const modalCancelar = document.getElementById("modal-cancelar");

  cancelarBtn?.addEventListener("click", () => {
    modalCancelar.classList.remove("oculto");
    modalCancelar.classList.add("show");
  });

  continuarBtn?.addEventListener("click", () => {
    modalCancelar.classList.remove("show");
    modalCancelar.classList.add("oculto");
  });

  confirmarCancelarBtn?.addEventListener("click", () => {
    modalCancelar.classList.remove("show");
    modalCancelar.classList.add("oculto");
    simulacionViajeSection.classList.add("oculto");
    buscarViajeSection.classList.remove("oculto");
    showToast("Has cancelado el viaje.");
  });
});
