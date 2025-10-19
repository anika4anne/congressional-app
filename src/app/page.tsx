import TopBar from "./_components/topbar";

export default function Home() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: 'url("/bg/cover5.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <TopBar />
      <main className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-8 space-y-4">
            <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl">
              Environmental
            </h1>
            <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
              <span className="text-green-800">Crisis</span>{" "}
              <span className="text-white">Tracker</span>
            </h1>
          </div>

          <p className="mx-auto mb-12 max-w-3xl text-xl text-white sm:text-2xl">
            Track environmental data in{" "}
            <span className="font-semibold text-green-300">real-time</span> for{" "}
            <span className="font-semibold text-orange-300">action</span>.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-green-500 hover:to-emerald-500">
              <span>View Interactive Map</span>
              <span>→</span>
            </button>
            <button className="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-gray-900">
              Explore Data
            </button>
          </div>
        </div>
      </main>

      <div className="absolute right-6 bottom-6 text-sm text-gray-400">
        © 2025 Designed by Anika A
      </div>
    </div>
  );
}
