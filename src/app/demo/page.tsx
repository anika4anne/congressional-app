"use client";

import TopBar from "../_components/topbar";

export default function DemoPage() {
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
      <main className="flex min-h-screen items-center justify-center pt-32">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
              <span className="text-white">Planet</span>
              <span className="text-green-800">Alert</span> Demo
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-white sm:text-2xl">
              Watch our demonstration video
            </p>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/50 shadow-2xl">
            {/* Video embed placeholder - ready for iframe or video tag */}
            <div className="flex h-full items-center justify-center">
              <video className="h-full w-full" controls>
                <source src="/demo.mp4" type="video/mp4" />
              </video>
            </div>
            {/* 
              Replace the placeholder div above with your video embed code, for example:
              
              YouTube:
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              Or HTML5 video:
              <video className="h-full w-full" controls>
                <source src="/path/to/video.mp4" type="video/mp4" />
              </video>
            */}
          </div>
        </div>
      </main>

      <div className="absolute right-6 bottom-6 text-sm text-gray-400">
        © 2025 Designed by Anika A
      </div>
    </div>
  );
}
