import { useEffect, useState } from "react";

// Thin strip for the very top of the page — Lagos local time + live weather.
// No API key needed (Open-Meteo is free/keyless). Matches the Danfo Signal
// mono-label styling used in the Ticker/nav area.

const LAGOS_LAT = 6.5244;
const LAGOS_LON = 3.3792;

// Minimal Open-Meteo weather code -> short label
const WEATHER_LABELS = {
  0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Fog", 51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 80: "Showers",
  81: "Showers", 82: "Heavy showers", 95: "Thunderstorm",
};

export default function StatusStrip() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState(null);

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

  return (
    <div className="w-full bg-[#14120E] text-[#F7F4EC] font-mono text-[11px] tracking-wide py-1.5 px-4 flex items-center justify-center gap-3">
      <span>LAGOS · {time || "--:--"}</span>
      <span className="opacity-40">|</span>
      <span>
        {weather ? `${weather.temp}°C · ${weather.label}` : "WEATHER LOADING…"}
      </span>
    </div>
  );
}
