import React from 'react';

function SolicitudViaje({ direccion, setDireccion, onSolicitar }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSolicitar();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>¿A dónde deseas ir?</h2>
      <input
        type="text"
        placeholder="Ingresa la dirección de destino"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />
      <br />
      <button type="submit">Solicitar Viaje</button>
    </form>
  );
}

export default SolicitudViaje;