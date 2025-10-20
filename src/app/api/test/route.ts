const exampleData = [
  {
    id: 1,
    name: "Cyclone 1",
    type: "Cyclone",
    description: "A cyclone is a weather event that occurs in the ocean.",
  },
];

export async function GET() {
  return new Response(JSON.stringify(exampleData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
