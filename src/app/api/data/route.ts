import { NextResponse } from "next/server";
import type { Disaster } from "../../../constants";

export async function GET() {
  const disasters: Disaster[] = [];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // // Earthquakes
  // try {
  //   const eqRes = await fetch(
  //     `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${oneWeekAgo.toISOString()}&minmagnitude=2.0`,
  //   );
  //   const eqData = (await eqRes.json()) as EarthquakeData;
  //   const earthquakes = eqData.features ?? [];

  //   earthquakes.forEach((eq) => {
  //     const [lng, lat] = eq.geometry.coordinates;
  //     disasters.push({
  //       id: `eq-${eq.id}`,
  //       type: "earthquake",
  //       title: eq.properties.place,
  //       date: new Date(eq.properties.time).toISOString(),
  //       location: `${lat}, ${lng}`,
  //       coordinates: [lng, lat],
  //       magnitude: eq.properties.mag,
  //       description: `Magnitude ${eq.properties.mag}`,
  //       url: eq.properties.url,
  //     });
  //   });
  // } catch {}

  // // Wildfires
  // try {
  //   // Use NASA EONET open API for active wildfire events (no API key required)
  //   const eonetRes = await fetch(
  //     "https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires?status=open",
  //   );
  //   const eonetData = (await eonetRes.json()) as {
  //     events?: Array<{
  //       id: string;
  //       title: string;
  //       link?: string;
  //       geometry?: Array<{
  //         date: string;
  //         coordinates?: [number, number] | [number, number, number];
  //       }>;
  //     }>;
  //   };
  //   (eonetData.events ?? []).slice(0, 30).forEach((event, i) => {
  //     const latest = event.geometry?.[event.geometry.length - 1];
  //     const coords = latest?.coordinates;
  //     if (
  //       Array.isArray(coords) &&
  //       coords.length >= 2 &&
  //       Number.isFinite(coords[0]) &&
  //       Number.isFinite(coords[1])
  //     ) {
  //       const [lng, lat] = coords as [number, number];
  //       disasters.push({
  //         id: `fire-${event.id ?? i}`,
  //         type: "wildfire",
  //         title: event.title ?? `Wildfire ${i + 1}`,
  //         date: latest?.date ?? new Date().toISOString(),
  //         location: `${lat}, ${lng}`,
  //         coordinates: [lng, lat],
  //         intensity: 1,
  //         description: "Active wildfire (EONET)",
  //         url: event.link,
  //       });
  //     }
  //   });
  // } catch {}

  // //Floods
  // try {
  //   // Use NASA EONET open API for active flood events
  //   const floodsRes = await fetch(
  //     "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=floods",
  //   );
  //   const floodsData = (await floodsRes.json()) as {
  //     events?: Array<{
  //       id: string;
  //       title: string;
  //       link?: string;
  //       geometry?: Array<{
  //         date: string;
  //         coordinates?: [number, number] | [number, number, number];
  //       }>;
  //     }>;
  //   };
  //   (floodsData.events ?? []).slice(0, 30).forEach((event, i) => {
  //     const latest = event.geometry?.[event.geometry.length - 1];
  //     const coords = latest?.coordinates;
  //     if (
  //       Array.isArray(coords) &&
  //       coords.length >= 2 &&
  //       Number.isFinite(coords[0]) &&
  //       Number.isFinite(coords[1])
  //     ) {
  //       const [lng, lat] = coords as [number, number];
  //       disasters.push({
  //         id: `flood-${event.id ?? i}`,
  //         // Using generic "disaster" type so it appears under the existing Disasters filter
  //         type: "disaster",
  //         title: event.title ?? `Flood ${i + 1}`,
  //         date: latest?.date ?? new Date().toISOString(),
  //         location: `${lat}, ${lng}`,
  //         coordinates: [lng, lat],
  //         intensity: 1,
  //         description: "Active flood (EONET)",
  //         url: event.link,
  //       });
  //     }
  //   });
  // } catch {}

  const res = await fetch(
    "https://eonet.gsfc.nasa.gov/api/v3/events?status=open",
  );
  const data = (await res.json()) as {
    events: {
      id: string;
      title: string;
      description: string;
      link: string;
      closed: false;
      categories: { id: string; title: string }[];
      geometry: {
        coordinates: [number, number];
        magnitudeValue: number;
        magnitudeUnit: string;
        date: string;
      }[];
      sources: {
        id: string;
        url: string;
      }[];
    }[];
  };

  data.events.forEach((event) => {
    event.geometry.forEach((geometry) => {
      disasters.push({
        id: event.id,
        title: event.title,
        description: event.description,
        categories: event.categories,
        sources: event.sources,
        date: geometry.date,
        coordinates: geometry.coordinates,
        magnitude: geometry.magnitudeValue,
        intensity: geometry.magnitudeValue,
      });
    });
  });

  return NextResponse.json(
    disasters.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  );
}
