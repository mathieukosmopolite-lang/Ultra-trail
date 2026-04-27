import { useState } from "react";
import Link from "next/link";
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
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>🏔️ Ultra Trail 108km</h1>

      {/* Navigation */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button
          onClick={() => setShowWeather(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: !showWeather ? "#007bff" : "#ddd",
            color: !showWeather ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
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
          }}
        >
          Weather Dashboard
        </button>
      </div>

      {/* Content */}
      {!showWeather ? (
        <>
          <h2>Stats</h2>
          <p>Km: {stats.totalKm.toFixed(1)}</p>
          <p>D+: {stats.totalD.toFixed(0)}</p>

          <h2>Import Suunto</h2>
          <input type="file" onChange={handleUpload} />

          <ul>
            {activities.map((a, i) => (
              <li key={i}>
                {a.distance.toFixed(1)} km | {a.elevation.toFixed(0)} m D+
              </li>
            ))}
          </ul>
        </>
      ) : (
        <WeatherDashboard />
      )}
    </div>
  );
}
