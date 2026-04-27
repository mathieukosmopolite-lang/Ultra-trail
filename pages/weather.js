import { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "demo";
const DEFAULT_LAT = 45.4642; // Alpes
const DEFAULT_LON = 6.8621;

function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
  const [searchInput, setSearchInput] = useState("");

  // Fetch weather data
  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/weather?lat=${lat}&lon=${lon}`
      );
      if (!response.ok) throw new Error("Failed to fetch weather");
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Geocode location by name
  const searchLocation = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/geocode?city=${encodeURIComponent(searchInput)}`
      );
      if (!response.ok) throw new Error("Location not found");
      const data = await response.json();
      setLocation({ lat: data.lat, lon: data.lon });
      setSearchInput("");
      await fetchWeather(data.lat, data.lon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Use geolocation
  const useGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeather(latitude, longitude);
        },
        () => setError("Unable to access your location")
      );
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeather(location.lat, location.lon);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌤️ Weather Dashboard</h2>

      {/* Search Bar */}
      <form onSubmit={searchLocation} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search city..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Search
        </button>
        <button
          type="button"
          onClick={useGeolocation}
          style={{ ...styles.button, marginLeft: 10 }}
        >
          📍 My Location
        </button>
      </form>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Loading */}
      {loading && <div style={styles.loading}>Loading weather data...</div>}

      {/* Weather Data */}
      {weather && !loading && (
        <div style={styles.weatherBox}>
          <div style={styles.header}>
            <h3>{weather.name}, {weather.sys.country}</h3>
            <p style={styles.description}>{weather.weather[0].main} - {weather.weather[0].description}</p>
          </div>

          {/* Current Weather */}
          <div style={styles.currentWeather}>
            <div style={styles.tempSection}>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].main}
                style={styles.weatherIcon}
              />
              <div style={styles.tempInfo}>
                <div style={styles.temp}>{Math.round(weather.main.temp)}°C</div>
                <div style={styles.feelsLike}>Feels like {Math.round(weather.main.feels_like)}°C</div>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.stat}>
                <span style={styles.statLabel}>💧 Humidity</span>
                <span style={styles.statValue}>{weather.main.humidity}%</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>💨 Wind Speed</span>
                <span style={styles.statValue}>{(weather.wind.speed * 3.6).toFixed(1)} km/h</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>🌡️ Pressure</span>
                <span style={styles.statValue}>{weather.main.pressure} hPa</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>👁️ Visibility</span>
                <span style={styles.statValue}>{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>
          </div>

          {/* Trail Conditions */}
          <div style={styles.trailConditions}>
            <h4>Trail Conditions</h4>
            <div style={styles.conditionItem}>
              <span>Temperature:</span>
              <span style={getTemperatureColor(weather.main.temp)}>
                {weather.main.temp > 20 ? "🔥 Hot" : weather.main.temp > 10 ? "🟡 Warm" : "❄️ Cold"}
              </span>
            </div>
            <div style={styles.conditionItem}>
              <span>Wind Condition:</span>
              <span style={getWindColor(weather.wind.speed)}>
                {weather.wind.speed > 10 ? "💨 Windy" : "🌤️ Calm"}
              </span>
            </div>
            <div style={styles.conditionItem}>
              <span>Rain Risk:</span>
              <span style={getRainColor(weather.clouds.all)}>
                {weather.clouds.all > 70 ? "🌧️ High" : weather.clouds.all > 30 ? "🌦️ Medium" : "☀️ Low"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styling
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  searchForm: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "200px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  error: {
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    color: "#666",
  },
  weatherBox: {
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
  },
  header: {
    marginBottom: "20px",
    borderBottom: "2px solid #007bff",
    paddingBottom: "10px",
  },
  description: {
    marginTop: "5px",
    color: "#666",
    textTransform: "capitalize",
  },
  currentWeather: {
    marginBottom: "20px",
  },
  tempSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  weatherIcon: {
    width: "120px",
    height: "120px",
  },
  tempInfo: {
    marginLeft: "20px",
  },
  temp: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#333",
  },
  feelsLike: {
    fontSize: "14px",
    color: "#666",
    marginTop: "5px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  stat: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statLabel: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "5px",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  trailConditions: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  conditionItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
};

// Helper functions for colors
const getTemperatureColor = (temp) => ({
  color: temp > 20 ? "#ff6b6b" : temp > 10 ? "#ffa94d" : "#4dabf7",
  fontWeight: "bold",
});

const getWindColor = (speed) => ({
  color: speed > 10 ? "#ff6b6b" : "#51cf66",
  fontWeight: "bold",
});

const getRainColor = (cloudiness) => ({
  color: cloudiness > 70 ? "#ff6b6b" : cloudiness > 30 ? "#ffa94d" : "#51cf66",
  fontWeight: "bold",
});

export default WeatherDashboard;
