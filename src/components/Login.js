import React from 'react';

function Login({ usuario, setUsuario, onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        required
      />
      <br />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;
