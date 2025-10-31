import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {};
config.redirects = async () => [
  {
    source: "/demo",
    destination:
      "https://drive.google.com/file/d/14p9SIlg4THD7ZAf_VMkMwloLCL8pJDIt/view?usp=sharing",
    permanent: true,
  },
];

export default config;
