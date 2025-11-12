import React, { useEffect, useState } from "react";
import { getGeoCode } from "../services/mapCreation";
import locaisData from "../utils/data.json";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige ícones do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const GeoMap = () => {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeocodes = async () => { 
      try {
        const locaisComGeo = await Promise.all(
          locaisData.map(async (local) => {
            const enderecoCompleto = `${local.nome} ${local.numero}, ${local.cidade}`;
            const geo = await getGeoCode(enderecoCompleto);
            return {
              ...local,
              lat: parseFloat(geo.lat),
              lon: parseFloat(geo.lon),
            };
          })
        );
        setLocais(locaisComGeo);
      } catch (error) {
        console.error("Erro ao buscar geocodificações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeocodes();
  }, []);

  if (loading) return <p>Carregando mapa...</p>;
  if (locais.length === 0) return <p>Nenhum local encontrado.</p>;

  const center = [locais[0].lat, locais[0].lon];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locais.map((local, index) => (
        <Marker key={index} position={[local.lat, local.lon]}>
          <Popup>
            <h3>{local.nome}</h3>
            <p><b>Cidade:</b> {local.cidade}</p>
            <p><b>Casos de dengue:</b> {local.casos}</p>
            <p><b>Numero:</b> {local.numero}</p>
            <p><b>Tipo de trabalho:</b> {local.tipoTrabalho}</p>
            <p><b>Nível de risco:</b> {local.nivelRisco}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GeoMap;
