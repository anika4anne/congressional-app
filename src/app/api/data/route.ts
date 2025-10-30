import { NextResponse } from "next/server";
import type { Disaster } from "../../../constants";

export async function GET() {
  const disasters: Disaster[] = [];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

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
