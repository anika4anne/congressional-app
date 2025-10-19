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
    if (!map || hazards.length === 0 || !map.isStyleLoaded()) return;

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
            .setHTML(`<strong>${feature.properties.title}</strong>`)
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
              <div style="min-width: 200px;">
                <h3>${feature.properties.title}</h3>
                <p>${feature.properties.description}</p>
              </div>
            `,
            )
            .addTo(map);
        }
      });
    }
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
