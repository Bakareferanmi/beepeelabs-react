import { useEffect, useState } from "react";

// Thin strip for the very top of the page — Lagos local time, live weather,
// and the latest GitHub commit for this repo. No API keys needed
// (Open-Meteo + GitHub's public REST API are both keyless for public data).

const LAGOS_LAT = 6.5244;
const LAGOS_LON = 3.3792;
const REPO = "Bakareferanmi/beepeelabs-react";

const WEATHER_LABELS = {
  0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Fog", 51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 80: "Showers",
  81: "Showers", 82: "Heavy showers", 95: "Thunderstorm",
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function StatusStrip() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState(null);
  const [commit, setCommit] = useState(null);
  const [showCommit, setShowCommit] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
      setTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAGOS_LAT}&longitude=${LAGOS_LON}&current=temperature_2m,weather_code&timezone=Africa%2FLagos`
    )
      .then((res) => res.json())
      .then((data) => {
        const temp = Math.round(data?.current?.temperature_2m);
        const code = data?.current?.weather_code;
        if (!Number.isNaN(temp)) {
          setWeather({ temp, label: WEATHER_LABELS[code] || "—" });
        }
      })
      .catch(() => setWeather(null));
  }, []);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/commits/main`)
      .then((res) => res.json())
      .then((data) => {
        const message = data?.commit?.message?.split("\n")[0];
        const date = data?.commit?.author?.date;
        if (message && date) setCommit({ message, date });
      })
      .catch(() => setCommit(null));
  }, []);

  // Rotate between weather and last-commit line every 6s
  useEffect(() => {
    if (!commit) return;
    const rotate = setInterval(() => setShowCommit((v) => !v), 6000);
    return () => clearInterval(rotate);
  }, [commit]);

  return (
    <div className="w-full bg-[#14120E] text-[#F7F4EC] font-mono text-[11px] tracking-wide py-1.5 px-4 flex items-center justify-center gap-3">
      <span>LAGOS · {time || "--:--"}</span>
      <span className="opacity-40">|</span>
      {showCommit && commit ? (
        <span className="truncate max-w-[60vw]">
          LAST SHIP: {commit.message} · {timeAgo(commit.date)}
        </span>
      ) : (
        <span>
          {weather ? `${weather.temp}°C · ${weather.label}` : "WEATHER LOADING…"}
        </span>
      )}
    </div>
  );
}
