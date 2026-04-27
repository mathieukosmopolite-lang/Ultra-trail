export default async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "Missing city parameter" });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY || "demo";
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Geocoding API error" });
    }

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { lat, lon } = data[0];
    res.status(200).json({ lat, lon });
  } catch (error) {
    res.status(500).json({ error: "Failed to geocode city" });
  }
}
