"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Map } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { PickingInfo, MapViewState } from "@deck.gl/core";
import TopBar from "../_components/topbar";
import Link from "next/link";

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

type Disaster = {
  id: string;
  type: string;
  title: string;
  date: string;
  location: string;
  magnitude?: number;
  url?: string;
  coordinates: [number, number];
  description: string;
};

async function getAllDisasterData(): Promise<Disaster[]> {
  try {
    const res = await fetch("/api/test");
    return (await res.json()) as Disaster[];
  } catch {
    return [];
  }
}

function renderTooltip(info: PickingInfo<CrisisData>) {
  const { object } = info;
  if (!object) return null;

  return {
    html: `
      <div class="bg-black/80 text-white p-3 rounded-lg shadow-lg border border-white/20">
        <h3 class="font-bold text-lg mb-2">${object.title}</h3>
        <p class="text-sm text-gray-300 mb-1">${object.description}</p>
        <p class="text-xs text-gray-400">Type: ${object.type}</p>
        ${object.magnitude ? `<p class="text-xs text-gray-400">Magnitude: ${object.magnitude}</p>` : ""}
        ${object.intensity ? `<p class="text-xs text-gray-400">Intensity: ${object.intensity}</p>` : ""}
      </div>
    `,
    style: {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
    },
  };
}

export default function MapPage() {
  const [layers, setLayers] = useState<ScatterplotLayer[]>([]);
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
  const [allDisasters, setAllDisasters] = useState<Disaster[]>([]);
  const [selectedDisaster, setSelectedDisaster] = useState<
    Disaster | undefined
  >(undefined);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const disasterData = await getAllDisasterData();

      setAllDisasters(disasterData);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLayers = useCallback(
    (disasterData: Disaster[]) => {
      const newLayers = [];

      if (activeFilters.earthquakes) {
        const earthquakes = disasterData.filter((d) => d.type === "earthquake");
        newLayers.push(
          new ScatterplotLayer({
            id: "earthquake-layer",
            data: earthquakes,
            getPosition: (d: Disaster) => d.coordinates,
            getRadius: 30000,
            getFillColor: [255, 0, 0],
            pickable: true,
            onClick: (info: { object?: Disaster }) =>
              setSelectedDisaster(info.object),
          }),
        );
      }

      if (activeFilters.wildfires) {
        const wildfires = disasterData.filter((d) => d.type === "wildfire");
        newLayers.push(
          new ScatterplotLayer({
            id: "wildfire-layer",
            data: wildfires,
            getPosition: (d: Disaster) => d.coordinates,
            getRadius: 25000,
            getFillColor: [255, 165, 0],
            pickable: true,
            onClick: (info: { object?: Disaster }) =>
              alert(`${info.object?.title} - ${info.object?.description}`),
          }),
        );
      }

      if (activeFilters.meteors) {
        const meteors = disasterData.filter((d) => d.type === "meteor");
        newLayers.push(
          new ScatterplotLayer({
            id: "meteor-layer",
            data: meteors,
            getPosition: (d: Disaster) => d.coordinates,
            getRadius: 20000,
            getFillColor: [255, 255, 0],
            pickable: true,
            onClick: (info: { object?: Disaster }) =>
              alert(`${info.object?.title} - ${info.object?.description}`),
          }),
        );
      }

      if (activeFilters.disasters) {
        const disasters = disasterData.filter((d) => d.type === "disaster");
        newLayers.push(
          new ScatterplotLayer({
            id: "disaster-layer",
            data: disasters,
            getPosition: (d: Disaster) => d.coordinates,
            getRadius: 35000,
            getFillColor: [128, 0, 128],
            pickable: true,
            onClick: (info: { object?: Disaster }) =>
              alert(`${info.object?.title} - ${info.object?.description}`),
          }),
        );
      }

      if (activeFilters.cyclones) {
        const cyclones = disasterData.filter((d) => d.type === "cyclone");
        newLayers.push(
          new ScatterplotLayer({
            id: "cyclone-layer",
            data: cyclones,
            getPosition: (d: Disaster) => d.coordinates,
            getRadius: 30000,
            getFillColor: [0, 0, 255],
            pickable: true,
            onClick: (info: { object?: Disaster }) =>
              alert(`${info.object?.title} - ${info.object?.description}`),
          }),
        );
      }

      if (activeFilters.hurricanes) {
        const hurricanes = disasterData.filter((d) => d.type === "hurricane");
        newLayers.push(
          new ScatterplotLayer({
            id: "hurricane-layer",
            data: hurricanes,
            getPosition: (d: Disaster) => d.coordinates,
            getRadius: 40000,
            getFillColor: [255, 0, 255],
            pickable: true,
            onClick: (info: { object?: Disaster }) =>
              alert(`${info.object?.title} - ${info.object?.description}`),
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
        canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
    void loadAllData();
    const interval = setInterval(() => void loadAllData(), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadAllData]);

  useEffect(() => {
    if (allDisasters.length > 0) {
      updateLayers(allDisasters);
    }
  }, [allDisasters, updateLayers]);

  useEffect(() => {
    if (allDisasters.length > 0) {
      updateLayers(allDisasters);
    }
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
            Your browser doesn&apos;t support WebGL, which is required for the
            interactive map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col px-9 pt-[140px] pb-9">
      {/* <div className="relative w-full flex-grow overflow-hidden rounded-2xl border border-white/20 shadow-2xl"> */}
      {webglSupported ? (
        <DeckGL
          layers={layers}
          views={MAP_VIEW}
          initialViewState={INITIAL_VIEW_STATE}
          controller={{ dragRotate: false }}
          onClick={({ object }: PickingInfo<CrisisData>) => {
            // if (object) {
            //   setSelectedDisaster(object as Disaster);
            // }
          }}
          getTooltip={renderTooltip}
          onError={(error: Error) => {
            if (error?.message?.includes("maxTextureDimension2D")) {
              setWebglSupported(false);
            }
          }}
          onWebGLInitialized={(gl) => {
            if (gl?.getParameter) {
              try {
                const maxTextureSize = gl.getParameter(
                  gl.MAX_TEXTURE_SIZE,
                ) as number;
              } catch (e) {}
            }
          }}
        >
          <Map reuseMaps mapStyle={MAP_STYLE} />
        </DeckGL>
      ) : (
        <div className="flex h-full items-center justify-center text-white">
          <div className="text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h3 className="mb-2 text-xl font-semibold">WebGL Not Supported</h3>
            <p className="text-gray-300">
              Please use a modern browser to view the interactive map
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="absolute top-16 left-4 z-10 rounded-2xl border border-white/30 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-bold text-white drop-shadow-lg">
            Filter Data
          </h3>
          <div className="mb-4 rounded bg-black/20 p-2 text-sm text-white/80">
            <div>Total Disasters: {allDisasters.length}</div>
            <div>
              Earthquakes:{" "}
              {allDisasters.filter((d) => d.type === "earthquake").length}
            </div>
            <div>
              Wildfires:{" "}
              {allDisasters.filter((d) => d.type === "wildfire").length}
            </div>
            <div>
              Meteors: {allDisasters.filter((d) => d.type === "meteor").length}
            </div>
          </div>
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
                  {
                    allDisasters.filter((d) => d.type === key.slice(0, -1))
                      .length
                  }
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

      {selectedDisaster && (
        <div className="absolute top-4 right-4 z-10 w-1/3 rounded-2xl border border-white/30 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">
              {selectedDisaster.title}
            </h3>
            <button
              className="cursor-pointer"
              onClick={() => setSelectedDisaster(undefined)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <p className="text-gray-300">
              <span className="font-semibold text-white">Type:</span>{" "}
              {selectedDisaster.type}
            </p>

            <p className="text-gray-300">
              <span className="font-semibold text-white">Description:</span>{" "}
              {selectedDisaster.description}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-white">Type:</span>{" "}
              {selectedDisaster.type}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-white">Magnitude:</span>{" "}
              {selectedDisaster.magnitude}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-white">Date:</span>{" "}
              {selectedDisaster.date}
            </p>
            {/* <p className="text-gray-300">
              <span className="font-semibold text-white">Location:</span>{" "}
              {selectedDisaster.location}
            </p> */}
            <p className="text-gray-300">
              <span className="font-semibold text-white">Coordinates:</span>{" "}
              {selectedDisaster.coordinates[0].toFixed(4)},{" "}
              {selectedDisaster.coordinates[1].toFixed(4)}
            </p>

            {selectedDisaster.url && (
              <Link href={selectedDisaster.url} className="text-blue-500">
                Learn More
              </Link>
            )}
          </div>
        </div>
      )}

      {/* </div> */}
    </main>
  );
}
