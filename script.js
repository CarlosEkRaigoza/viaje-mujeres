console.log('Script cargado'); // Verifica que se cargue el archivo

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const goRegister = document.getElementById('go-register');
const goLogin = document.getElementById('go-login');

goRegister.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Ir a registro');
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
});

goLogin.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Ir a login');
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
});

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.error('No se encontró el contenedor de toast');
    return;
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Login submit');

  const phone = document.getElementById('login-phone').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (phone && password) {
    showToast('Has iniciado sesión correctamente');
    setTimeout(() => {
      window.location.href = 'buscar_viaje.html';
    }, 1500);
  } else {
    showToast('Por favor completa todos los campos');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Registro submit');

  const name = document.getElementById('register-name').value.trim();
  const phone = document.getElementById('register-phone').value.trim();
  const password = document.getElementById('register-password').value.trim();

  if (name && phone && password) {
    showToast('Cuenta creada correctamente');
    setTimeout(() => {
      registerForm.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.reset();
    }, 2000);
  } else {
    showToast('Por favor completa todos los campos');
  }
});
