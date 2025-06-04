console.log('Buscar viaje cargado');

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

document.getElementById('salir').addEventListener('click', () => {
  window.location.href = 'index.html';
});

const form = document.getElementById('viaje-form');
const modal = document.getElementById('confirmacion-modal');
const modalMessage = document.getElementById('modal-message');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnModificar = document.getElementById('btn-modificar');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const origen = document.getElementById('origen').value.trim();
  const destino = document.getElementById('destino').value.trim();

  if (!origen || !destino) {
    showToast('Por favor completa ambos campos.');
    return;
  }

  modalMessage.textContent = `¿Confirmas tu viaje de "${origen}" a "${destino}"?`;
  modal.classList.add('show');
});

btnConfirmar.addEventListener('click', () => {
  window.location.href = 'simulacion_viaje.html';
});

btnModificar.addEventListener('click', () => {
  modal.classList.remove('show');
});
