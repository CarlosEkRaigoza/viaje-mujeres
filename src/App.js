import React, { useState } from 'react';
import './App.css'; 
import Login from './components/Login';
import SolicitudViaje from './components/SolicitudViaje';
import Confirmacion from './components/Confirmacion';

function App() {
  const [usuario, setUsuario] = useState('');
  const [haIniciadoSesion, setHaIniciadoSesion] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [viajeSolicitado, setViajeSolicitado] = useState(false);

  const handleLogin = () => {
    setHaIniciadoSesion(true);
  };

  const handleSolicitarViaje = () => {
    if (direccion.trim() !== '') {
      setViajeSolicitado(true);
    }
  };

  const handleCancelarViaje = () => {
    setDireccion('');
    setViajeSolicitado(false);
  };

  return (
     <div className="app-container">
      {!haIniciadoSesion ? (
        <div className="formulario">
          <Login usuario={usuario} setUsuario={setUsuario} onLogin={handleLogin} />
        </div>
      ) : !viajeSolicitado ? (
        <div className="formulario">
          <SolicitudViaje direccion={direccion} setDireccion={setDireccion} onSolicitar={handleSolicitarViaje} />
        </div>
      ) : (
        <div className="confirmacion">
          <Confirmacion direccion={direccion} onCancelar={handleCancelarViaje} />
        </div>
      )}
    </div>
  );
}

export default App;
