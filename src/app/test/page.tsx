"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Map } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { PickingInfo, MapViewState } from "@deck.gl/core";

const MAP_VIEW = new MapView({ repeat: true });
const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -35,
  latitude: 36.7,
  zoom: 1.8,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

type CrisisData = {
  coordinates: [longitude: number, latitude: number];
  name: string;
  type:
    | "cyclone"
    | "flood"
    | "volcano"
    | "earthquake"
    | "wildfire"
    | "meteor"
    | "disaster"
    | "hurricane";
  description: string;
  magnitude?: number;
  intensity?: number;
  title: string;
};

async function getAllDisasterData() {
  try {
    const res = await fetch("/api/test");
    return await res.json();
  } catch (error) {
    return [];
  }
}

function renderTooltip(info: PickingInfo<CrisisData>) {
  const { object, x, y } = info;
  if (!object) return null;
  return {
    html: `<div class="tooltip" style="left: ${x}px; top: ${y}px; background: rgba(0,0,0,0.8); color: white; padding: 8px; border-radius: 4px; font-size: 12px;">
      ${object.title} ${object.type ? `(${object.type})` : ""}
      ${object.magnitude ? ` (M${object.magnitude})` : ""}
      ${object.description ? ` - ${object.description}` : ""}
    </div>`,
    style: {
      backgroundColor: "rgba(0,0,0,0.8)",
      color: "white",
      padding: "8px",
      borderRadius: "4px",
      fontSize: "12px",
    },
  };
}

export default function TestPage() {
  const [layers, setLayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    earthquakes: true,
    wildfires: true,
    meteors: true,
    disasters: true,
    cyclones: true,
    hurricanes: true,
  });
  const [allDisasters, setAllDisasters] = useState<any[]>([]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const disasterData = await getAllDisasterData();
      setAllDisasters(disasterData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLayers = useCallback(
    (disasterData: any[]) => {
      const newLayers = [];

      if (activeFilters.earthquakes) {
        const earthquakes = disasterData.filter(
          (d: any) => d.type === "earthquake",
        );
        newLayers.push(
          new ScatterplotLayer({
            id: "earthquake-layer",
            data: earthquakes,
            getPosition: (d: any) => d.coordinates,
            getRadius: (d: any) => (d.magnitude || 1) * 20000,
            getFillColor: [255, 0, 0],
            pickable: true,
            onClick: (info: any) =>
              alert(`${info.object.title} (M${info.object.magnitude})`),
          }),
        );
      }

      if (activeFilters.wildfires) {
        const wildfires = disasterData.filter(
          (d: any) => d.type === "wildfire",
        );
        newLayers.push(
          new ScatterplotLayer({
            id: "wildfire-layer",
            data: wildfires,
            getPosition: (d: any) => d.coordinates,
            getRadius: (d: any) => Math.min((d.intensity || 300) / 50, 50000),
            getFillColor: [255, 165, 0],
            pickable: true,
            onClick: (info: any) =>
              alert(`${info.object.title} - ${info.object.description}`),
          }),
        );
      }

      if (activeFilters.meteors) {
        const meteors = disasterData.filter((d: any) => d.type === "meteor");
        newLayers.push(
          new ScatterplotLayer({
            id: "meteor-layer",
            data: meteors,
            getPosition: (d: any) => d.coordinates,
            getRadius: 25000,
            getFillColor: [255, 255, 0],
            pickable: true,
            onClick: (info: any) =>
              alert(`${info.object.title} - ${info.object.description}`),
          }),
        );
      }

      if (activeFilters.disasters) {
        const disasters = disasterData.filter(
          (d: any) => d.type === "disaster",
        );
        newLayers.push(
          new ScatterplotLayer({
            id: "disaster-layer",
            data: disasters,
            getPosition: (d: any) => d.coordinates,
            getRadius: (d: any) => Math.min((d.intensity || 1) * 5000, 40000),
            getFillColor: [128, 0, 128],
            pickable: true,
            onClick: (info: any) =>
              alert(`${info.object.title} - ${info.object.description}`),
          }),
        );
      }

      if (activeFilters.cyclones) {
        const cyclones = disasterData.filter((d: any) => d.type === "cyclone");
        newLayers.push(
          new ScatterplotLayer({
            id: "cyclone-layer",
            data: cyclones,
            getPosition: (d: any) => d.coordinates,
            getRadius: 30000,
            getFillColor: [0, 0, 255],
            pickable: true,
            onClick: (info: any) =>
              alert(`${info.object.title} - ${info.object.description}`),
          }),
        );
      }

      if (activeFilters.hurricanes) {
        const hurricanes = disasterData.filter(
          (d: any) => d.type === "hurricane",
        );
        newLayers.push(
          new ScatterplotLayer({
            id: "hurricane-layer",
            data: hurricanes,
            getPosition: (d: any) => d.coordinates,
            getRadius: 40000,
            getFillColor: [255, 0, 255],
            pickable: true,
            onClick: (info: any) =>
              alert(`${info.object.title} - ${info.object.description}`),
          }),
        );
      }

      setLayers(newLayers);
    },
    [activeFilters],
  );

  const toggleFilter = (filterType: keyof typeof activeFilters) => {
    setActiveFilters((prev) => ({ ...prev, [filterType]: !prev[filterType] }));
  };

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch (error) {
      setWebglSupported(false);
    }
    loadAllData();
    const interval = setInterval(loadAllData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadAllData]);

  useEffect(() => {
    if (allDisasters.length > 0) updateLayers(allDisasters);
  }, [activeFilters, allDisasters, updateLayers]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="mb-4 text-6xl">🌍</div>
          <h3 className="mb-2 text-2xl font-semibold">
            Loading Environmental Data...
          </h3>
          <p className="text-gray-300">Fetching real-time crisis information</p>
        </div>
      </div>
    );
  }

  if (!webglSupported) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="mb-4 text-6xl">⚠️</div>
          <h3 className="mb-2 text-2xl font-semibold">WebGL Not Supported</h3>
          <p className="text-gray-300">
            Your browser doesn't support WebGL, which is required for the
            interactive map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <DeckGL
        layers={layers}
        views={MAP_VIEW}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{ dragRotate: false }}
        onClick={({ object }: PickingInfo<CrisisData>) => {}}
        getTooltip={renderTooltip}
        onError={(error) => {}}
        onWebGLInitialized={(gl) => {}}
      >
        <Map reuseMaps mapStyle={MAP_STYLE} />
      </DeckGL>

      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-2xl border border-white/30 bg-gradient-to-br from-white/20 to-white/10 p-4 text-white shadow-xl backdrop-blur-xl transition-all hover:scale-110 hover:from-white/30 hover:to-white/20 hover:shadow-2xl"
          title="Filter data"
        >
          <svg
            className="h-6 w-6 drop-shadow-lg"
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
      </div>

      {showFilters && (
        <div className="absolute top-4 left-20 z-10 rounded-2xl border border-white/30 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white drop-shadow-lg">
            Filter Data
          </h3>
          <div className="space-y-3">
            {[
              {
                key: "earthquakes",
                emoji: "🌋",
                label: "Earthquakes",
                color: "red",
              },
              {
                key: "wildfires",
                emoji: "🔥",
                label: "Wildfires",
                color: "orange",
              },
              {
                key: "meteors",
                emoji: "☄️",
                label: "Meteors",
                color: "yellow",
              },
              {
                key: "disasters",
                emoji: "⚠️",
                label: "Disasters",
                color: "purple",
              },
              {
                key: "cyclones",
                emoji: "🌪️",
                label: "Cyclones",
                color: "blue",
              },
              {
                key: "hurricanes",
                emoji: "🌀",
                label: "Hurricanes",
                color: "pink",
              },
            ].map(({ key, emoji, label, color }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-3 text-sm text-white transition-all hover:scale-105"
              >
                <input
                  type="checkbox"
                  checked={activeFilters[key as keyof typeof activeFilters]}
                  onChange={() =>
                    toggleFilter(key as keyof typeof activeFilters)
                  }
                  className={`h-4 w-4 rounded border-2 border-white/50 bg-white/20 text-${color}-500 focus:ring-2 focus:ring-${color}-400 focus:ring-offset-2 focus:ring-offset-transparent`}
                />
                <span className="text-lg">{emoji}</span>
                <span className="font-medium">{label}</span>
                <span
                  className={`ml-auto rounded-full bg-${color}-500/20 px-2 py-1 text-xs font-bold text-${color}-300`}
                >
                  {allDisasters.filter((d) => d.type === key).length}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-white/20 pt-4">
            <button
              onClick={() => setShowFilters(false)}
              className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
            >
              Apply Filters
            </button>
            <button
              onClick={loadAllData}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
            >
              Refresh Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
