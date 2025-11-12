import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

app.get("/api/geocode", async (req, res) => {
  try {
    const address = req.query.q;
    if (!address) {
      return res.status(400).json({ error: "Endereço não informado" });
    }

    const UserAgent = "MeuTeste/1.0 (meuTeste@meuTeste.com)";

    // 🔧 Normaliza o endereço
    let query = address
      .replace(/\s+/g, " ") // Remove espaços duplicados
      .trim();

    // Tenta primeiro com o endereço completo + Brasil
    let url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(
      query + ", Brasil"
    )}`;
    console.log(url);
    
    console.log("🔍 Tentativa 1:", query + ", Brasil");
    
    let response = await fetch(url, {
      headers: { "User-Agent": UserAgent, Accept: "application/json" },
    });

    let data = await response.json();

    // ⚙️ Fallback 1: tenta sem número
    if (!data || data.length === 0) {
      console.log("⚠️ Tentando sem número...");
      const querySemNumero = query.replace(/\d+/g, "").replace(/\s+/g, " ").trim();
      
      url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(
        querySemNumero + ", Brasil"
      )}`;

      console.log("🔍 Tentativa 2:", querySemNumero + ", Brasil");

      response = await fetch(url, {
        headers: { "User-Agent": UserAgent, Accept: "application/json" },
      });
      data = await response.json();
    }

    // ⚙️ Fallback 2: tenta só com cidade + Brasil
    if (!data || data.length === 0) {
      console.log("⚠️ Tentando só com a cidade...");
      const partes = query.split(",");
      if (partes.length > 1) {
        const cidade = partes[partes.length - 1].trim();
        
        url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(
          cidade + ", Brasil"
        )}`;

        console.log("🔍 Tentativa 3:", cidade + ", Brasil");

        response = await fetch(url, {
          headers: { "User-Agent": UserAgent, Accept: "application/json" },
        });
        data = await response.json();
      }
    }

    if (!data || data.length === 0) {
      console.log("❌ Nenhum resultado encontrado");
      return res.status(404).json({ error: "Endereço não encontrado" });
    }

    console.log("✅ Encontrado:", data[0].display_name);
    res.json(data);
  } catch (error) {
    console.error("❌ Erro:", error);
    res.status(500).json({ error: "Erro ao buscar geolocalização" });
  }
});

app.listen(3001, () => console.log("Proxy rodando na porta 3001 🚀"));
