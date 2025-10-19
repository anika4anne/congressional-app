// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapClient() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [hazards, setHazards] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [0, 20],
      zoom: 2,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl());

    return () => map.remove();
  }, []);

  useEffect(() => {
    fetch("https://data.undrr.org/api/json/hips/hazards/1.0.0/?limit=50&page=1")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data?.data || data?.results || [];
        setHazards(items);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || hazards.length === 0) return;

    const addHazardsToMap = () => {
      if (!map.isStyleLoaded()) {
        map.on("styledata", addHazardsToMap);
        return;
      }

      const points = hazards.map((hazard, i) => {
        const lng = ((i * 53.7) % 360) - 180;
        const lat = ((i * 17.3) % 140) - 70;
        return {
          type: "Feature",
          properties: {
            title: hazard.short_name || hazard.name || `Hazard ${i + 1}`,
            description: hazard.description || "",
          },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      });

      if (map.getSource("hazards")) {
        map.getSource("hazards").setData({
          type: "FeatureCollection",
          features: points,
        });
      } else {
        map.addSource("hazards", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: points,
          },
        });

        map.addLayer({
          id: "hazards-layer",
          type: "circle",
          source: "hazards",
          paint: {
            "circle-radius": 6,
            "circle-color": "#ff4444",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        const popup = new maplibregl.Popup();

        map.on("mousemove", "hazards-layer", (e) => {
          const feature = e.features[0];
          if (feature) {
            popup
              .setLngLat(e.lngLat)
              .setHTML(
                `
                <div style="
                  background: linear-gradient(135deg, #1f2937, #374151);
                  color: white;
                  padding: 8px 12px;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 14px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                  border: 1px solid rgba(255,255,255,0.2);
                ">
                  ${feature.properties.title}
                </div>
              `,
              )
              .addTo(map);
          }
        });

        map.on("mouseleave", "hazards-layer", () => {
          popup.remove();
        });

        map.on("click", "hazards-layer", (e) => {
          const feature = e.features[0];
          if (feature) {
            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `
                <div style="
                  background: linear-gradient(135deg, #1f2937, #374151);
                  color: white;
                  padding: 16px;
                  border-radius: 12px;
                  min-width: 280px;
                  max-width: 320px;
                  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                  border: 1px solid rgba(255,255,255,0.2);
                  font-family: system-ui, -apple-system, sans-serif;
                ">
                  <h3 style="
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    font-weight: 700;
                    color: #fbbf24;
                    border-bottom: 2px solid #fbbf24;
                    padding-bottom: 8px;
                  ">
                    ${feature.properties.title}
                  </h3>
                  <p style="
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #e5e7eb;
                  ">
                    ${feature.properties.description}
                  </p>
                </div>
              `,
              )
              .addTo(map);
          }
        });
      }
    };

    addHazardsToMap();
  }, [hazards]);

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

  return (
    <div
      className={`rounded-lg border border-white/20 ${fullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}
    >
      <div className="relative">
        <div
          ref={containerRef}
          className={`w-full ${fullscreen ? "h-screen" : "h-[60vh]"}`}
        />

        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-10 rounded bg-black/50 p-2 text-white hover:bg-black/70"
        >
          {fullscreen ? "✕" : "⛶"}
        </button>
      </div>

      {!fullscreen && (
        <div className="bg-black/40 p-3 text-sm text-gray-200">
          Red dots show hazard locations. Hover for names, click for details.
        </div>
      )}
    </div>
  );
}
