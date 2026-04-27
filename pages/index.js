import { useState } from "react";
import WeatherDashboard from "./weather";

export default function Home() {
  const [showWeather, setShowWeather] = useState(false);
  const [activities, setActivities] = useState([]);

  const stats = {
    totalKm: activities.reduce((a, b) => a + b.distance, 0),
    totalD: activities.reduce((a, b) => a + b.elevation, 0),
  };

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = {
        distance: Math.random() * 40 + 10,
        elevation: Math.random() * 1500,
        time: Math.random() * 6 + 1,
        avgHr: 140 + Math.random() * 30,
      };
      setActivities((prev) => [...prev, data]);
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>🏔️ Ultra Trail 108km</h1>

      {/* Navigation */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={() => setShowWeather(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: !showWeather ? "#007bff" : "#ddd",
            color: !showWeather ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Training Tracker
        </button>
        <button
          onClick={() => setShowWeather(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: showWeather ? "#007bff" : "#ddd",
            color: showWeather ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Weather Dashboard
        </button>
      </div>

      {/* Content */}
      {!showWeather ? (
        <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
          <h2>📊 Stats</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "4px", border: "2px solid #007bff" }}>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Total Distance</p>
              <p style={{ margin: "10px 0 0 0", fontSize: "28px", fontWeight: "bold", color: "#007bff" }}>{stats.totalKm.toFixed(1)} km</p>
            </div>
            <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "4px", border: "2px solid #28a745" }}>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Total Elevation</p>
              <p style={{ margin: "10px 0 0 0", fontSize: "28px", fontWeight: "bold", color: "#28a745" }}>{stats.totalD.toFixed(0)} m D+</p>
            </div>
          </div>

          <h2>📁 Import Suunto Activity</h2>
          <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "4px", marginBottom: "20px" }}>
            <input 
              type="file" 
              onChange={handleUpload}
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px", width: "100%", boxSizing: "border-box" }}
            />
          </div>

          {activities.length > 0 && (
            <div>
              <h2>📈 Recent Activities</h2>
              <div style={{ display: "grid", gap: "10px" }}>
                {activities.map((a, i) => (
                  <div key={i} style={{ backgroundColor: "white", padding: "15px", borderRadius: "4px", border: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>Activity {i + 1}</span>
                    <span style={{ color: "#666", fontSize: "14px" }}>{a.distance.toFixed(1)} km | {a.elevation.toFixed(0)} m D+ | {a.time.toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <WeatherDashboard />
      )}
    </div>
  );
}
