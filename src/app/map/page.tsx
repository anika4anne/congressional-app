import TopBar from "../_components/topbar";
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), {
  loading: () => (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-800">
      <div className="text-center">
        <div className="mb-4 text-6xl">🗺️</div>
        <h3 className="mb-2 text-2xl font-semibold text-white">
          Loading Map...
        </h3>
        <p className="text-gray-300">Initializing interactive map</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: 'url("/bg/bg3.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <TopBar className="top-8" />

      <main className="min-h-screen pt-24">
        <div className="container mx-auto h-full w-full max-w-7xl px-4 py-8">
          <div className="mb-8 text-center"></div>

          <div className="h-full w-full overflow-hidden">
            <MapClient />
          </div>
        </div>
      </main>

      <div className="absolute right-6 bottom-6 text-sm text-gray-400">
        © 2025 Designed by Anika A
      </div>
    </div>
  );
}
