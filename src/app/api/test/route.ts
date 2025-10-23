import { NextResponse } from "next/server";

type Disaster = {
  id: string;
  type: string;
  title: string;
  date: string;
  location: string;
  coordinates: [number, number];
  magnitude?: number;
  intensity?: number;
  description: string;
  url?: string;
};

export async function GET() {
  const disasters: Disaster[] = [];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Earthquakes
  try {
    const eqRes = await fetch(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${oneWeekAgo.toISOString()}&limit=1000`,
    );
    const eqData = await eqRes.json();
    eqData.features?.forEach((eq: any) => {
      const [lng, lat] = eq.geometry.coordinates;
      disasters.push({
        id: `eq-${eq.id}`,
        type: "earthquake",
        title: eq.properties.place,
        date: new Date(eq.properties.time).toISOString(),
        location: `${lat}, ${lng}`,
        coordinates: [lng, lat],
        magnitude: eq.properties.mag,
        description: `Magnitude ${eq.properties.mag}`,
        url: eq.properties.url,
      });
    });
  } catch {}

  // Wildfires
  try {
    const fireRes = await fetch(
      "https://firms.modaps.eosdis.nasa.gov/api/country/csv/demo_key/MODIS_NRT/USA/1",
    );
    const fireText = await fireRes.text();
    fireText
      .split("\n")
      .slice(1, 31)
      .forEach((line, i) => {
        if (line?.trim()) {
          const [lat, lng, confidence, brightness] = line.split(",");
          if (
            lat &&
            lng &&
            !isNaN(parseFloat(lat)) &&
            !isNaN(parseFloat(lng))
          ) {
            disasters.push({
              id: `fire-${i}`,
              type: "wildfire",
              title: `Wildfire ${i}`,
              date: new Date().toISOString(),
              location: `${lat}, ${lng}`,
              coordinates: [parseFloat(lng), parseFloat(lat)],
              intensity: parseFloat(brightness || "300"),
              description: `Confidence: ${confidence || "Medium"}`,
            });
          }
        }
      });
  } catch {}

  // Meteors
  try {
    const meteorRes = await fetch(
      "https://api.nasa.gov/neo/rest/v1/feed?api_key=DEMO_KEY",
    );
    const meteorData = await meteorRes.json();
    let meteorCount = 0;
    Object.values(meteorData.near_earth_objects || {}).forEach(
      (dayObjects: any) => {
        if (meteorCount >= 20) return;
        dayObjects.forEach((neo: any) => {
          if (meteorCount >= 20) return;
          const approachData = neo.close_approach_data?.[0];
          if (approachData) {
            disasters.push({
              id: `neo-${neo.id}`,
              type: "meteor",
              title: neo.name || `Near Earth Object ${neo.id}`,
              date:
                approachData.close_approach_date_full ||
                new Date().toISOString(),
              location: "Near Earth (space)",
              coordinates: [
                parseFloat(approachData.orbiting_body?.longitude || "0") ||
                  Math.random() * 360 - 180,
                parseFloat(approachData.orbiting_body?.latitude || "0") ||
                  Math.random() * 180 - 90,
              ],
              intensity: parseFloat(
                neo.estimated_diameter?.kilometers?.estimated_diameter_max ||
                  "0",
              ),
              description: `Diameter: ${neo.estimated_diameter?.kilometers?.estimated_diameter_max || "Unknown"} km`,
              url: neo.nasa_jpl_url,
            });
            meteorCount++;
          }
        });
      },
    );
  } catch {}

  // Disasters
  try {
    const disasterRes = await fetch(
      "https://data.undrr.org/api/json/hips/hazards/1.0.0/",
    );
    const disasterData = await disasterRes.json();
    const disasterArray = Array.isArray(disasterData)
      ? disasterData
      : disasterData.data || [];
    disasterArray.slice(0, 20).forEach((disaster: any, index: number) => {
      const lat = disaster.latitude || disaster.lat;
      const lng = disaster.longitude || disaster.lng;
      if (lat && lng) {
        disasters.push({
          id: `disaster-${index}`,
          type: "disaster",
          title:
            disaster.short_name || disaster.name || `Disaster ${index + 1}`,
          date: new Date().toISOString(),
          location: `${lat}, ${lng}`,
          coordinates: [parseFloat(lng), parseFloat(lat)],
          intensity: parseFloat(disaster.intensity || disaster.severity || "5"),
          description: "Environmental hazard",
        });
      }
    });
  } catch {}

  // Hurricanes
  try {
    const gdacsRes = await fetch(
      "https://www.gdacs.org/gdacsapi/api/events/geteventlist/TC",
    );
    const gdacsData = await gdacsRes.json();
    if (gdacsData.features?.length > 0) {
      gdacsData.features.forEach((storm: any, index: number) => {
        const [lng, lat] = storm.geometry?.coordinates || [];
        if (lat && lng && lat !== 0 && lng !== 0) {
          disasters.push({
            id: `hurricane-${storm.properties?.eventid || index}`,
            type: "hurricane",
            title: storm.properties?.eventname || "Hurricane",
            date: storm.properties?.fromdate || new Date().toISOString(),
            location: `${lat}, ${lng}`,
            coordinates: [lng, lat],
            intensity: storm.properties?.severity || 5,
            description: `Alert Level: ${storm.properties?.alertlevel || "Unknown"}, Country: ${storm.properties?.country || "Unknown"}`,
            url: storm.properties?.url || "https://www.gdacs.org",
          });
        }
      });
    }
  } catch {}

  return NextResponse.json(
    disasters.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  );
}
