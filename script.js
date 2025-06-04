console.log('Script cargado'); // Verifica que se cargue el archivo

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const goRegister = document.getElementById('go-register');
const goLogin = document.getElementById('go-login');

// Cambiar entre formularios
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

// Función para mostrar toast
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

// Validar nombre completo (solo letras y espacios)
function validarNombre(nombre) {
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!nombre) {
    return "El nombre es obligatorio.";
  }
  if (!regexNombre.test(nombre)) {
    return "El nombre solo puede contener letras y espacios.";
  }
  return "";
}

// Validar teléfono (exactamente 10 dígitos)
function validarTelefono(telefono) {
  const regexTelefono = /^\d{10}$/;
  if (!telefono) {
    return "El teléfono es obligatorio.";
  }
  if (!regexTelefono.test(telefono)) {
    return "El teléfono debe tener 10 dígitos numéricos.";
  }
  return "";
}

// Validación avanzada del formulario de registro
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Registro submit');

  const name = document.getElementById('register-name').value.trim();
  const phone = document.getElementById('register-phone').value.trim();
  const password = document.getElementById('register-password').value.trim();

  const errores = [];

  const errorNombre = validarNombre(name);
  if (errorNombre) errores.push(errorNombre);

  const errorTelefono = validarTelefono(phone);
  if (errorTelefono) errores.push(errorTelefono);

  if (!password) {
    errores.push("La contraseña es obligatoria.");
  }

  if (errores.length > 0) {
    showToast(errores.join(' '));
  } else {
    showToast('Cuenta creada correctamente');
    setTimeout(() => {
      registerForm.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.reset();
    }, 2000);
  }
});

// Validación avanzada del formulario de login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Login submit');

  const phone = document.getElementById('login-phone').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const errores = [];

  const errorTelefono = validarTelefono(phone);
  if (errorTelefono) errores.push(errorTelefono);

  if (!password) {
    errores.push("La contraseña es obligatoria.");
  }

  if (errores.length > 0) {
    showToast(errores.join(' '));
  } else {
    showToast('Has iniciado sesión correctamente');
    setTimeout(() => {
      window.location.href = 'viaje.html';
    }, 1500);
  }
});
