"use client";

import React, { useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Map } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { IconLayer } from "@deck.gl/layers";

import IconClusterLayer from "./icon-cluster-layer";
import type { IconClusterLayerPickingInfo } from "./icon-cluster-layer";
import type { PickingInfo, MapViewState } from "@deck.gl/core";
import type { IconLayerProps } from "@deck.gl/layers";

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
  type: "cyclone" | "flood" | "volcano" | "earthquake" | "wildfire";
  description: string;
};

function renderTooltip(info: IconClusterLayerPickingInfo<CrisisData>) {
  const { object, objects, x, y } = info;

  if (objects) {
    return (
      <div className="tooltip interactive" style={{ left: x, top: y }}>
        {objects.map(({ name, type, description }) => {
          return (
            <div key={name}>
              <h5>{name}</h5>
              <div>Type: {type}</div>
              <div>Description: {description}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (!object) {
    return null;
  }

  return "cluster" in object && object.cluster ? (
    <div className="tooltip" style={{ left: x, top: y }}>
      {object.point_count} records
    </div>
  ) : (
    <div className="tooltip" style={{ left: x, top: y }}>
      {object.name} {object.type ? `(${object.type})` : ""}
    </div>
  );
}

/* eslint-disable react/no-deprecated */
export default function App({
  iconMapping = "data/location-icon-mapping.json",
  iconAtlas = "data/location-icon-atlas.png",
  // showCluster = false,
  mapStyle = MAP_STYLE,
}) {
  const layer = // showCluster
    // ? new IconClusterLayer({ ...layerProps, id: "icon-cluster", sizeScale: 40 })
    // :
    new IconLayer({
      id: "icon",
      data: "/api/test",
      pickable: true,
      getPosition: (d: CrisisData) => d.coordinates,
      iconAtlas,
      iconMapping,
      sizeBasis: "width",
      getIcon: (_d: CrisisData) => "marker",
      sizeUnits: "meters",
      sizeScale: 10000,
      sizeMinPixels: 100,
    });
  return (
    <DeckGL
      layers={[layer]}
      views={MAP_VIEW}
      initialViewState={INITIAL_VIEW_STATE}
      controller={{ dragRotate: false }}
      onClick={({ object }: PickingInfo<CrisisData>) => console.log(object)}
      getTooltip={({ object }: PickingInfo<CrisisData>) => object?.name ?? ""}
    >
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  );
}

export function renderToDOM(container: HTMLDivElement) {
  createRoot(container).render(<App />);
}
