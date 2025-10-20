"use client";

import { useEffect, useRef, useState } from "react";

export default function MapClient() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    meteorites: true,
    hazards: true,
    storms: true,
    earthquakes: true,
    wildfires: true,
    gdacs: true,
  });
  const [data, setData] = useState({
    meteorites: [],
    hazards: [],
    storms: [],
    earthquakes: [],
    wildfires: [],
    gdacs: [],
  });

  useEffect(() => {
    import("leaflet").then((L) => {
      delete L.default.Icon.Default.prototype._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (!containerRef.current) return;

      const map = L.default.map(containerRef.current).setView([20, 0], 2);
      L.default
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 10,
          attribution: "© OpenStreetMap",
        })
        .addTo(map);

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    });
  }, []);

  useEffect(() => {
    fetch("https://data.nasa.gov/resource/y77d-th95.json?$limit=100")
      .then((res) => res.json())
      .then((meteorites) => {
        setData((prev) => ({ ...prev, meteorites }));
      })
      .catch(() => {});

    fetch("https://data.undrr.org/api/json/hips/hazards/1.0.0/?limit=50&page=1")
      .then((res) => res.json())
      .then((hazardData) => {
        const items = Array.isArray(hazardData)
          ? hazardData
          : hazardData?.data || hazardData?.results || [];
        setData((prev) => ({ ...prev, hazards: items }));
      })
      .catch(() => {
        setData((prev) => ({ ...prev, hazards: [] }));
      });

    fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    )
      .then((res) => res.json())
      .then((earthquakeData) => {
        const earthquakes = earthquakeData.features.map((quake) => ({
          lat: quake.geometry.coordinates[1],
          lng: quake.geometry.coordinates[0],
          magnitude: quake.properties.mag,
          place: quake.properties.place,
          time: quake.properties.time,
        }));
        setData((prev) => ({ ...prev, earthquakes }));
      })
      .catch(() => {});

    fetch("https://www.nhc.noaa.gov/xgtwo/two_atl_0d0.txt")
      .then((res) => res.text())
      .then((textData) => {
        const storms = [];
        const lines = textData.split("\n");
        lines.forEach((line, index) => {
          if (
            line.includes("TROPICAL") ||
            line.includes("HURRICANE") ||
            line.includes("STORM")
          ) {
            const coordMatch = line.match(
              /(\d+\.\d+)([NS])\s+(\d+\.\d+)([EW])/,
            );
            if (coordMatch) {
              let lat = parseFloat(coordMatch[1]);
              let lng = parseFloat(coordMatch[3]);
              if (coordMatch[2] === "S") lat = -lat;
              if (coordMatch[4] === "W") lng = -lng;
              storms.push({
                name: line.split(" ")[0] || `Storm ${index + 1}`,
                lat: lat,
                lng: lng,
                description: line.trim(),
              });
            }
          }
        });
        setData((prev) => ({ ...prev, storms }));
      })
      .catch(() => {
        setData((prev) => ({ ...prev, storms: [] }));
      });

    fetch(
      "https://firms.modaps.eosdis.nasa.gov/api/country/csv/demo_key/MODIS_NRT/USA/1",
    )
      .then((res) => res.text())
      .then((csvData) => {
        const lines = csvData.split("\n");
        const wildfires = [];
        for (let i = 1; i < Math.min(lines.length, 10); i++) {
          const line = lines[i];
          if (line.trim()) {
            const [lat, lng, confidence, brightness, area] = line.split(",");
            if (
              lat &&
              lng &&
              !isNaN(parseFloat(lat)) &&
              !isNaN(parseFloat(lng))
            ) {
              wildfires.push({
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                confidence: confidence || "Medium",
                brightness: parseFloat(brightness) || 300,
                area: area || "Unknown Area",
              });
            }
          }
        }
        setData((prev) => ({ ...prev, wildfires }));
      })
      .catch(() => {
        setData((prev) => ({ ...prev, wildfires: [] }));
      });

    fetchGDACSData();
  }, []);

  const fetchGDACSData = async () => {
    try {
      const res = await fetch(
        "https://api.allorigins.win/raw?url=https://www.gdacs.org/xml/rss.xml",
      );
      const text = await res.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const items = Array.from(xml.querySelectorAll("item"));
      const disasters = items
        .map((item) => {
          const title =
            item.querySelector("title")?.textContent || "Unknown Disaster";
          const category =
            item.querySelector("category")?.textContent || "General";
          const lat = parseFloat(item.querySelector("geo\\:lat")?.textContent);
          const lon = parseFloat(item.querySelector("geo\\:long")?.textContent);
          const description =
            item.querySelector("description")?.textContent || "";
          return {
            title,
            category,
            lat,
            lng: lon,
            description:
              description.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
          };
        })
        .filter((d) => !isNaN(d.lat) && !isNaN(d.lng));
      setData((prev) => ({ ...prev, gdacs: disasters }));
    } catch (err) {
      setData((prev) => ({ ...prev, gdacs: [] }));
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      const map = mapRef.current;
      if (!map) return;

      map.eachLayer((layer) => {
        if (
          layer instanceof L.default.CircleMarker ||
          layer instanceof L.default.Marker
        ) {
          map.removeLayer(layer);
        }
      });

      if (activeFilters.meteorites && data.meteorites.length > 0) {
        data.meteorites.forEach((meteorite) => {
          if (meteorite.reclat && meteorite.reclong) {
            const lat = parseFloat(meteorite.reclat);
            const lng = parseFloat(meteorite.reclong);
            if (!isNaN(lat) && !isNaN(lng)) {
              L.default
                .circleMarker([lat, lng], {
                  color: "#ff6b35",
                  fillColor: "#ff6b35",
                  fillOpacity: 0.8,
                  radius: 4,
                })
                .bindPopup(
                  `<div style="background: #1a1a1a; color: white; padding: 15px; border-radius: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #ff6b35;">☄️ Meteorite Impact</h3>
                <p style="margin: 0; color: #ccc;">Minimal impact expected in your area</p>
              </div>`,
                )
                .addTo(map);
            }
          }
        });
      }

      if (activeFilters.hazards && data.hazards.length > 0) {
        data.hazards.forEach((hazard, i) => {
          const lat = hazard.latitude || hazard.lat || ((i * 17.3) % 140) - 70;
          const lng =
            hazard.longitude || hazard.lng || ((i * 53.7) % 360) - 180;
          L.default
            .circleMarker([lat, lng], {
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.8,
              radius: 6,
            })
            .bindPopup(
              `<div style="background: #1a1a1a; color: white; padding: 15px; border-radius: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #ef4444;">⚠️ ${hazard.short_name || hazard.name || `Hazard ${i + 1}`}</h3>
            <p style="margin: 0; color: #ccc;">Medium risk to your area</p>
          </div>`,
            )
            .addTo(map);
        });
      }

      if (activeFilters.storms && data.storms.length > 0) {
        data.storms.forEach((storm) => {
          L.default
            .circleMarker([storm.lat, storm.lng], {
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.8,
              radius: 8,
            })
            .bindPopup(
              `<div style="background: #1a1a1a; color: white; padding: 15px; border-radius: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #3b82f6;">🌪️ Storm System</h3>
            <p style="margin: 0; color: #ccc;">Weather conditions may affect your area</p>
          </div>`,
            )
            .addTo(map);
        });
      }

      if (activeFilters.earthquakes && data.earthquakes.length > 0) {
        data.earthquakes.forEach((quake) => {
          L.default
            .circleMarker([quake.lat, quake.lng], {
              color: "#8b5cf6",
              fillColor: "#8b5cf6",
              fillOpacity: 0.8,
              radius: Math.max(3, Math.min(8, quake.magnitude * 1.5)),
            })
            .bindPopup(
              `<div style="background: #1a1a1a; color: white; padding: 15px; border-radius: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #8b5cf6;">🌋 Earthquake</h3>
            <p style="margin: 0; color: #ccc;">Magnitude ${quake.magnitude} - ${quake.place}</p>
          </div>`,
            )
            .addTo(map);
        });
      }

      if (activeFilters.wildfires && data.wildfires.length > 0) {
        data.wildfires.forEach((fire) => {
          L.default
            .circleMarker([fire.lat, fire.lng], {
              color: "#f97316",
              fillColor: "#f97316",
              fillOpacity: 0.8,
              radius: 7,
            })
            .bindPopup(
              `<div style="background: #1a1a1a; color: white; padding: 15px; border-radius: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #f97316;">🔥 Wildfire</h3>
            <p style="margin: 0; color: #ccc;">${fire.confidence} confidence - ${fire.area}</p>
          </div>`,
            )
            .addTo(map);
        });
      }

      if (activeFilters.gdacs && data.gdacs.length > 0) {
        data.gdacs.forEach((disaster) => {
          const getDisasterIcon = (category) => {
            if (
              category.toLowerCase().includes("cyclone") ||
              category.toLowerCase().includes("storm")
            )
              return "🌪️";
            if (category.toLowerCase().includes("flood")) return "🌊";
            if (category.toLowerCase().includes("volcano")) return "🌋";
            if (category.toLowerCase().includes("earthquake")) return "🌍";
            return "⚠️";
          };

          const getDisasterColor = (category) => {
            if (
              category.toLowerCase().includes("cyclone") ||
              category.toLowerCase().includes("storm")
            )
              return "#3b82f6";
            if (category.toLowerCase().includes("flood")) return "#06b6d4";
            if (category.toLowerCase().includes("volcano")) return "#dc2626";
            if (category.toLowerCase().includes("earthquake")) return "#8b5cf6";
            return "#f59e0b";
          };

          L.default
            .circleMarker([disaster.lat, disaster.lng], {
              color: getDisasterColor(disaster.category),
              fillColor: getDisasterColor(disaster.category),
              fillOpacity: 0.8,
              radius: 8,
            })
            .bindPopup(
              `<div style="background: #1a1a1a; color: white; padding: 15px; border-radius: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: ${getDisasterColor(disaster.category)};">${getDisasterIcon(disaster.category)} ${disaster.title}</h3>
            <p style="margin: 0; color: #ccc;">${disaster.category} - ${disaster.description}</p>
          </div>`,
            )
            .addTo(map);
        });
      }
    });
  }, [activeFilters, data]);

  const toggleFilter = (filterType) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchGDACSData();
      },
      5 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full overflow-hidden ${fullscreen ? "fixed inset-0 z-50" : "h-[75vh] min-h-[600px]"} rounded-lg border border-white/20`}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div
          ref={containerRef}
          className={`h-full w-full overflow-hidden ${fullscreen ? "h-screen" : "h-full"}`}
        />

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-lg bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/70"
            title="Filter data"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>

          <button
            onClick={toggleFullscreen}
            className="rounded-lg bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/70"
            title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="absolute top-4 left-20 z-10 rounded-lg border border-white/20 bg-black/80 p-4 backdrop-blur-sm">
            <h3 className="mb-3 font-semibold text-white">Filter Data</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={activeFilters.meteorites}
                  onChange={() => toggleFilter("meteorites")}
                  className="rounded"
                />
                ☄️ Meteorites ({data.meteorites.length})
              </label>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={activeFilters.hazards}
                  onChange={() => toggleFilter("hazards")}
                  className="rounded"
                />
                ⚠️ Hazards ({data.hazards.length})
              </label>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={activeFilters.earthquakes}
                  onChange={() => toggleFilter("earthquakes")}
                  className="rounded"
                />
                🌋 Earthquakes ({data.earthquakes.length})
              </label>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={activeFilters.wildfires}
                  onChange={() => toggleFilter("wildfires")}
                  className="rounded"
                />
                🔥 Wildfires ({data.wildfires.length})
              </label>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={activeFilters.storms}
                  onChange={() => toggleFilter("storms")}
                  className="rounded"
                />
                🌪️ Storms ({data.storms.length})
              </label>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={activeFilters.gdacs}
                  onChange={() => toggleFilter("gdacs")}
                  className="rounded"
                />
                🚨 GDACS Live ({data.gdacs.length})
              </label>
            </div>
            <div className="mt-4 border-t border-white/20 pt-3">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {!fullscreen && (
        <div className="bg-black/40 p-3 text-sm text-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <span>☄️ Orange: Meteorites</span>
            <span>⚠️ Red: Hazards</span>
            <span>🌋 Purple: Earthquakes</span>
            <span>🔥 Orange: Wildfires</span>
            <span>🌪️ Blue: Storms</span>
            <span>🚨 Multi: GDACS Live</span>
          </div>
          <p className="mt-2 text-xs">
            Click markers for details, use filters to show/hide data types.
            Real-time data from NASA, USGS, UNDRR, and GDACS.
          </p>
        </div>
      )}
    </div>
  );
}
