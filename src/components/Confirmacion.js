import React, { useEffect, useState } from 'react';

function Confirmacion({ direccion }) {
  const [distancia, setDistancia] = useState('');
  const [duracion, setDuracion] = useState('');
  const [costo, setCosto] = useState('');
  const [conductora, setConductora] = useState({ nombre: '', vehiculo: '' });
  const [origen, setOrigen] = useState(null);

  const API_KEY = 'AIzaSyCGHcIMjst4HV5SoeYPLLKEoXKx_ArPRzw';

  // Obtener ubicación real del usuario
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocalización no soportada, se usará UMSA por defecto.");
      setOrigen('UMSA');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setOrigen(`${lat},${lng}`);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        setOrigen('Ciudad de México'); // respaldo
      }
    );
  }, []);

  // Asignar conductora aleatoria al cargar el componente
  useEffect(() => {
    const conductoras = [
      { nombre: 'María', vehiculo: 'Nissan March rojo' },
      { nombre: 'Laura', vehiculo: 'Chevrolet Aveo gris' },
      { nombre: 'Sofía', vehiculo: 'Kia Río blanco' },
    ];
    const asignada = conductoras[Math.floor(Math.random() * conductoras.length)];
    setConductora(asignada);
  }, []);

  // Cuando ya tenemos el origen y la dirección, consultamos la distancia y duración
  useEffect(() => {
    if (!origen) return; // Esperar a tener origen

    const fetchDistanciaDuracion = async () => {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(direccion)}&key=${API_KEY}`;

        const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
        const data = await response.json();
      try {
        // Nota: para evitar problemas CORS en desarrollo, usa proxy o backend.
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
        const data = await response.json();
        const element = data?.rows?.[0]?.elements?.[0];

        if (data.routes && data.routes.length > 0) {
      const leg = data.routes[0].legs[0];
      setDistancia(leg.distance.text);
      setDuracion(leg.duration.text);
      const distanciaKm = leg.distance.value / 1000;
      const costoEstimado = 10 + 5 * distanciaKm;
      setCosto(costoEstimado.toFixed(2));
        } else {
          setDistancia("Error");
          setDuracion("Error");
          setCosto("Error");
        }
      } catch (error) {
        console.error("Error con la API de Google Maps:", error);
        setDistancia("Error");
        setDuracion("Error");
        setCosto("Error");
      }
    };

    fetchDistanciaDuracion();
  }, [origen, direccion]);

  return (
    <div className="confirmacion">
      <h2>¡Tu viaje ha sido solicitado! 🚗</h2>
      <p><strong>Origen:</strong> {origen || 'Obteniendo ubicación...'}</p>
      <p><strong>Destino:</strong> {direccion}</p>
      <p><strong>Distancia estimada:</strong> {distancia}</p>
      <p><strong>Duración estimada:</strong> {duracion}</p>
      <p><strong>Costo estimado:</strong> {costo === "Error" ? " No disponible" : ` $${costo} MXN`}</p>
      <p><strong>Tu viaje será atendido por:</strong> {conductora.nombre}, en un {conductora.vehiculo}.</p>

      <div style={{ marginTop: '1rem' }}>
        <h3>Mapa del destino:</h3>
        <iframe
          title="Mapa del viaje"
          width="80%"
          height="400"
          style={{ border: 0, borderRadius: '10px' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(direccion)}`}
        ></iframe>
      </div>
    </div>
  );
}

export default Confirmacion;
