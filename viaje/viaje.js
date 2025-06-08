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
const conductor = "María";
const vehiculo = { modelo: "Toyota Corolla", color: "rosa", placa: "ABC-123" };
const tiempoEstimadoMinutos = 7;
const origen =
  localStorage.getItem("origen") || "UNIVERSIDAD MESOAMERICANA DE SAN AGUSTIN";
const destino =
  localStorage.getItem("destino") || "Parque Zoológico del Centenario";
const costo = localStorage.getItem("costo") || "0.00";
const metodoPago = localStorage.getItem("metodoPago") || "Efectivo";
const ultimos4Tarjeta = localStorage.getItem("ultimos4Tarjeta") || "N/A";

localStorage.setItem("nombreConductora", conductor);
localStorage.setItem("modeloVehiculo", vehiculo.modelo);
localStorage.setItem("colorVehiculo", vehiculo.color);
localStorage.setItem("placaVehiculo", vehiculo.placa);
localStorage.setItem("duracionViaje", tiempoEstimadoMinutos);

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
  const metodoPagoElemento = document.getElementById("detalle-metodo-pago");
  if (metodoPagoElemento) {
    metodoPagoElemento.textContent =
      metodoPago === "Tarjeta"
        ? `Tarjeta terminación ${ultimos4Tarjeta}`
        : metodoPago;
  }

  if (costoElemento) {
    costoElemento.textContent = costo;
  }

  if (nombreConductor && vehiculoElement && tiempoLlegada) {
    nombreConductor.textContent = conductor;
    vehiculoElement.textContent = `${vehiculo.modelo} (${vehiculo.color}) - Placa: ${vehiculo.placa}`;
    tiempoLlegada.textContent = `Llegará a tu ubicación en aproximadamente ${tiempoEstimadoMinutos} minutos.`;
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
          // Obtener coordenadas de origen y destino desde la respuesta
          const route = result.routes[0].legs[0];
          const startLocation = route.start_location;
          const endLocation = route.end_location;

          // Agregar marcador de origen
          new google.maps.Marker({
            position: startLocation,
            map: map,
            label: "🟢",
            title: "Origen",
          });

          // Agregar marcador de destino
          new google.maps.Marker({
            position: endLocation,
            map: map,
            label: "🏁",
            title: "Destino",
          });
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
  const confirmarCancelarBtn = document.getElementById(
    "confirmar-cancelar-btn"
  );
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

  confirmarCancelarBtn?.addEventListener("click", () => {
    modalCancelar.classList.remove("confirmacion-visible");

    // Mostrar mensaje de cancelación con estilo consistente
    simulacionViajeSection.innerHTML = `
    <div class="mensaje-confirmacion" style="text-align: center;">
      <h2 style="color: #d81b60;">Viaje cancelado</h2>
      <div class="spinner" style="border-left-color: #f48fb1;"></div>
      <p style="color: #880e4f; margin-top: 20px;">Redirigiendo a la pantalla principal...</p>
    </div>
  `;

    // Mostrar toast de confirmación
    showToast("Viaje cancelado con éxito", "success");

    // Redirigir después de un tiempo adecuado
    setTimeout(() => {
      window.location.href = "../solicitudViaje/solicitudViaje.html";
    }, 3000); // 3 segundos para que el usuario pueda leer el mensaje
  });
  // --- Mostrar/Ocultar detalles del viaje ---
  const btnDetalles = document.getElementById("btn-detalles");
  const labelDetalles = document.getElementById("label-detalles");
  const btnCerrarLabel = document.getElementById("cerrar-label");
  const btnCompartir = document.getElementById("compartir-label");

  btnDetalles?.addEventListener("click", () => {
    labelDetalles.classList.remove("oculto"); // Mostrar detalles
  });

  btnCerrarLabel?.addEventListener("click", () => {
    labelDetalles.classList.add("oculto"); // Ocultar detalles
  });

  btnCompartir?.addEventListener("click", async () => {
    const texto =
      document.getElementById("mensaje-viaje").textContent +
      "\n" +
      document.getElementById("vehiculo").parentElement.textContent +
      "\n" +
      document.getElementById("tiempo-llegada").textContent +
      "\n" +
      "Costo estimado: $" +
      document.getElementById("costo-viaje").textContent +
      "\n" +
      "Método de pago: " +
      (metodoPago === "Tarjeta"
        ? `Tarjeta terminación ${ultimos4Tarjeta}`
        : metodoPago);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Detalles del viaje",
          text: texto,
        });
      } catch (err) {
        showToast("No se pudo compartir: " + err.message, "error");
      }
    } else {
      showToast(
        "La función de compartir no está disponible en este dispositivo",
        "warning"
      );
    }
  });

  // --- Finalizar viaje ---
  const finalizarBtn = document.getElementById("finalizar-btn");
  const modalFinalizar = document.getElementById("modal-finalizar");
  const continuarViajeBtn = document.getElementById("continuar-viaje-btn");
  const confirmarFinalizarBtn = document.getElementById(
    "confirmar-finalizar-btn"
  );

  // Mostrar modal al presionar finalizar
  finalizarBtn?.addEventListener("click", () => {
    modalFinalizar.classList.add("confirmacion-visible");
  });

  // Ocultar modal si se decide continuar
  continuarViajeBtn?.addEventListener("click", () => {
    modalFinalizar.classList.remove("confirmacion-visible");
    showToast("Continúa tu viaje con seguridad", "info");
  });

  // Confirmar finalización: mostrar pantalla de resumen
  confirmarFinalizarBtn?.addEventListener("click", () => {
    modalFinalizar.classList.remove("confirmacion-visible");

    // Mostrar resumen antes de redirigir
    simulacionViajeSection.innerHTML = `
    <div class="mensaje-confirmacion">
      <h2>¡Viaje completado!</h2>
      <p>Preparando resumen de tu viaje...</p>
      <div class="spinner"></div>
    </div>
  `;

    // Redirigir después de 2 segundos
    setTimeout(() => {
      window.location.href = "../viajeFinalizado/viajeFinalizado.html";
    }, 2000);
  });
});
