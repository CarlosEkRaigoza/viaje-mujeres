// Configuración inicial
const origen =
  localStorage.getItem("origen") || "UNIVERSIDAD MESOAMERICANA DE SAN AGUSTIN";
const destino =
  localStorage.getItem("destino") || "Parque Zoológico del Centenario";

const conductor = "María";
const vehiculo = {
  modelo: "Toyota Corolla",
  color: "rosa",
};
const tiempoEstimadoMinutos = 7;

// Función para inicializar elementos DOM
function initDOM() {
  console.log("Inicializando elementos DOM...");

  // Verificar que los elementos existen antes de manipularlos
  const nombreConductor = document.getElementById("nombre-conductor");
  const vehiculoElement = document.getElementById("vehiculo");
  const tiempoLlegada = document.getElementById("tiempo-llegada");

  if (nombreConductor && vehiculoElement && tiempoLlegada) {
    nombreConductor.textContent = conductor;
    vehiculoElement.textContent = `${vehiculo.modelo} (${vehiculo.color})`;
    tiempoLlegada.textContent = `Llegará en aproximadamente ${tiempoEstimadoMinutos} minutos`;
  } else {
    console.error("No se encontraron algunos elementos del DOM");
  }
}

// Función para inicializar el mapa
function initMap() {
  console.log("Inicializando mapa...");

  try {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    // Crear el mapa
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: 21.1619, lng: -86.8515 },
    });

    directionsRenderer.setMap(map);

    // Calcular y mostrar la ruta
    directionsService.route(
      {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Error al calcular la ruta:", status);
          showMapError(`Error al cargar el mapa: ${status}`);
        }
      }
    );
  } catch (error) {
    console.error("Error al inicializar el mapa:", error);
    showMapError("Error crítico al cargar el mapa");
  }
}

// Función para mostrar errores en el mapa
function showMapError(message) {
  const mapElement = document.getElementById("map");
  if (mapElement) {
    mapElement.innerHTML = `
      <div style="height:100%; display:flex; justify-content:center; align-items:center; color:red;">
        ${message}
      </div>`;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  initDOM();

  // Asignar initMap al ámbito global
  window.initMap = initMap;

  // Verificar si el mapa no se carga después de un tiempo
  setTimeout(() => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps no se cargó correctamente");
      showMapError(
        "No se pudo cargar Google Maps. Verifica tu conexión a internet."
      );
    }
  }, 5000);
});

document.addEventListener("DOMContentLoaded", () => {
  initDOM();

  // Asignar initMap al ámbito global
  window.initMap = initMap;

  // Verificar carga de Google Maps
  setTimeout(() => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps no se cargó correctamente");
      showMapError(
        "No se pudo cargar Google Maps. Verifica tu conexión a internet."
      );
    }
  }, 5000);

  // --- Lógica de cancelación ---
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
      window.location.href = "buscar_viaje.html";
    });
  }
});
