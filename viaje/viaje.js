console.log("viaje.js cargado");

// --- TOAST con tipo ---
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  toast.innerHTML = `${icons[type] || "ℹ️"} ${message}`;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// --- Datos del viaje ---
// Variables con datos del conductor, vehículo y tiempo estimado
const conductor = "María";
const vehiculo = {
  modelo: "Toyota Corolla",
  color: "rosa",
};
const tiempoEstimadoMinutos = 7;

// Obtener datos del viaje desde localStorage, con valores por defecto
const origen =
  localStorage.getItem("origen") || "UNIVERSIDAD MESOAMERICANA DE SAN AGUSTIN";
const destino =
  localStorage.getItem("destino") || "Parque Zoológico del Centenario";
const costo = localStorage.getItem("costo") || "0.00";

// --- Inicializar simulación de viaje ---
// Actualiza la interfaz con los datos del viaje y lanza el mapa
function initSimulacionViaje() {
  console.log("Inicializando simulación de viaje...");

  // Actualizar elementos visibles en la página con info del viaje
  const nombreConductor = document.getElementById("nombre-conductor");
  const vehiculoElement = document.getElementById("vehiculo");
  const tiempoLlegada = document.getElementById("tiempo-llegada");
  const mensajeViaje = document.getElementById("mensaje-viaje");
  const costoElemento = document.getElementById("costo-viaje");
  if (costoElemento) {
    costoElemento.textContent = costo;
  }

  if (nombreConductor && vehiculoElement && tiempoLlegada) {
    nombreConductor.textContent = conductor;
    vehiculoElement.textContent = `${vehiculo.modelo} (${vehiculo.color})`;
    tiempoLlegada.textContent = `Llegará en aproximadamente ${tiempoEstimadoMinutos} minutos.`;
  }

  if (mensajeViaje) {
    mensajeViaje.textContent = `Ahora viajarás de "${origen}" hacia "${destino}".`;
  }

  showToast("Conectando con la conductora...", "info");

  // Iniciar mapa con rutas
  initMap();
}

// --- Inicializar Mapa ---
// Función global que Google Maps API llama para mostrar el mapa
window.initMap = function () {
  console.log("Inicializando mapa...");

  try {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: 21.1619, lng: -86.8515 }, // Centro en Mérida, Yucatán
    });

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: origen,
        destination: destino,
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
};

// Función para mostrar mensaje de error dentro del div del mapa
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
// Controla la interacción con los botones y modal de cancelar viaje
document.addEventListener("DOMContentLoaded", () => {
  const cancelarBtn = document.getElementById("cancelar-btn");
  const continuarBtn = document.getElementById("continuar-btn");
  const confirmarCancelarBtn = document.getElementById("confirmar-cancelar-btn");
  const modalCancelar = document.getElementById("modal-cancelar");
  const simulacionViajeSection = document.getElementById("simulacion-viaje");

  // Iniciar simulación al cargar la página, solo si está la sección de simulación
  if (simulacionViajeSection) {
    initSimulacionViaje();
  }

  // Mostrar modal al presionar cancelar
  cancelarBtn?.addEventListener("click", () => {
    modalCancelar.classList.add("confirmacion-visible"); // mostrar
  });

  // Ocultar modal si se decide continuar el viaje
  continuarBtn?.addEventListener("click", () => {
    modalCancelar.classList.remove("confirmacion-visible");
    showToast("Gracias por continuar tu viaje", "success");
  });

  // Confirmar cancelación: ocultar modal, sección y redirigir
  confirmarCancelarBtn?.addEventListener("click", () => {
    modalCancelar.classList.remove("confirmacion-visible");
    simulacionViajeSection.classList.add("oculto");

    showToast("Has cancelado el viaje.", "warning");

    setTimeout(() => {
      window.location.href = "../solicitudViaje/solicitudViaje.html";
    }, 1500);
  });
});
