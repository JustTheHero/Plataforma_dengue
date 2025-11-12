
export async function getGeoCode(address) {
console.log(`http://localhost:3001/api/geocode?q=${address}`);
  const response = await fetch(
    `http://localhost:3001/api/geocode?q=${address}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar geolocalização");
  }

  const data = await response.json();

  if (data && data.length > 0) {
    return data[0]; // contém lat/lon
  } else {
    throw new Error("Endereço não encontrado");
  }
}
