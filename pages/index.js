import { useState, useMemo } from "react";

function parseActivity(fileText) {
  return {
    distance: Math.random() * 40 + 10,
    elevation: Math.random() * 1500,
    time: Math.random() * 6 + 1,
    avgHr: 140 + Math.random() * 30,
  };
}

export default function Home() {
  const [activities, setActivities] = useState([]);

  const stats = useMemo(() => {
    const totalKm = activities.reduce((a, b) => a + b.distance, 0);
    const totalD = activities.reduce((a, b) => a + b.elevation, 0);
    return { totalKm, totalD };
  }, [activities]);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = parseActivity(event.target.result);
      setActivities((prev) => [...prev, data]);
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Ultra Trail 108km</h1>

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
    </div>
  );
}
