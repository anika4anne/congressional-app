export const disasterTypes = [
  {
    id: "drought",
    title: "Drought",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/drought",
    description:
      "Long lasting absence of precipitation affecting agriculture and livestock, and the overall availability of food and water.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/drought",
    color: [85, 55, 0],
    emoji: "🌵",
  },
  {
    id: "dustHaze",
    title: "Dust and Haze",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/dustHaze",
    description:
      "Related to dust storms, air pollution and other non-volcanic aerosols. Volcano-related plumes shall be included with the originating eruption event.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/dustHaze",
    color: [180, 150, 70],
    emoji: "😶‍🌫️",
  },
  {
    id: "earthquakes",
    title: "Earthquakes",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/earthquakes",
    description:
      "Related to all manner of shaking and displacement. Certain aftermath of earthquakes may also be found under landslides and floods.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/earthquakes",
    color: [0, 100, 0],
    emoji: "🌍",
  },
  {
    id: "floods",
    title: "Floods",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/floods",
    description:
      "Related to aspects of actual flooding--e.g., inundation, water extending beyond river and lake extents.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/floods",
    color: [0, 0, 150],
    emoji: "🌊",
  },
  {
    id: "landslides",
    title: "Landslides",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/landslides",
    description:
      "Related to landslides and variations thereof: mudslides, avalanche.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/landslides",
    color: [80, 130, 60],
    emoji: "🪨",
  },
  {
    id: "manmade",
    title: "Manmade",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/manmade",
    description:
      "Events that have been human-induced and are extreme in their extent.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/manmade",
    color: [255, 0, 255],
    emoji: "👷",
  },
  {
    id: "seaLakeIce",
    title: "Sea and Lake Ice",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/seaLakeIce",
    description:
      "Related to all ice that resides on oceans and lakes, including sea and lake ice (permanent and seasonal) and icebergs.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/seaLakeIce",
    color: [0, 143, 143],
    emoji: "🧊",
  },
  {
    id: "severeStorms",
    title: "Severe Storms",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/severeStorms",
    description:
      "Related to the atmospheric aspect of storms (hurricanes, cyclones, tornadoes, etc.). Results of storms may be included under floods, landslides, etc.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/severeStorms",
    color: [150, 150, 150],
    emoji: "🌪️",
  },
  {
    id: "snow",
    title: "Snow",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/snow",
    description:
      "Related to snow events, particularly extreme/anomalous snowfall in either timing or extent/depth.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/snow",
    color: [255, 255, 255],
    emoji: "🌨️",
  },
  {
    id: "tempExtremes",
    title: "Temperature Extremes",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/tempExtremes",
    description: "Related to anomalous land temperatures, either heat or cold.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/tempExtremes",
    color: [255, 134, 0],
    emoji: "🌡️",
  },
  {
    id: "volcanoes",
    title: "Volcanoes",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/volcanoes",
    description:
      "Related to both the physical effects of an eruption (rock, ash, lava) and the atmospheric (ash and gas plumes).",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/volcanoes",
    color: [150, 48, 0],
    emoji: "🌋",
  },
  {
    id: "waterColor",
    title: "Water Color",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/waterColor",
    description:
      "Related to events that alter the appearance of water: phytoplankton, red tide, algae, sediment, whiting, etc.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/waterColor",
    color: [80, 80, 120],
    emoji: "💧",
  },
  {
    id: "wildfires",
    title: "Wildfires",
    link: "https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires",
    description:
      "Wildland fires includes all nature of fire, in forest and plains, as well as those that spread to become urban and industrial fire events. Fires may be naturally caused or manmade.",
    layers: "https://eonet.gsfc.nasa.gov/api/v3/layers/wildfires",
    color: [255, 0, 0],
    emoji: "🔥",
  },
];

export type Disaster = {
  id: string;
  title: string;
  date: string;
  coordinates: [number, number];
  magnitude?: number;
  intensity?: number;
  description: string;
  categories: {
    id: (typeof disasterTypes)[number]["id"];
    title: (typeof disasterTypes)[number]["title"];
  }[];
  sources: {
    id: string;
    url: string;
  }[];
};

export const sources = [
  {
    id: "AVO",
    title: "Alaska Volcano Observatory",
    source: "https://www.avo.alaska.edu/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=AVO",
  },

  {
    id: "ABFIRE",
    title: "Alberta Wildfire",
    source: "https://wildfire.alberta.ca/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=ABFIRE",
  },

  {
    id: "AU_BOM",
    title: "Australia Bureau of Meteorology",
    source: "http://www.bom.gov.au/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=AU_BOM",
  },

  {
    id: "BYU_ICE",
    title: "Brigham Young University Antarctic Iceberg Tracking Database",
    source: "http://www.scp.byu.edu/data/iceberg/database1.html",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=BYU_ICE",
  },

  {
    id: "BCWILDFIRE",
    title: "British Columbia Wildfire Service",
    source: "http://bcwildfire.ca/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=BCWILDFIRE",
  },

  {
    id: "CALFIRE",
    title: "California Department of Forestry and Fire Protection",
    source: "http://www.calfire.ca.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=CALFIRE",
  },

  {
    id: "CEMS",
    title: "Copernicus Emergency Management Service",
    source: "http://emergency.copernicus.eu/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=CEMS",
  },

  {
    id: "EO",
    title: "Earth Observatory",
    source: "https://earthobservatory.nasa.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=EO",
  },

  {
    id: "Earthdata",
    title: "Earthdata",
    source: "https://earthdata.nasa.gov",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=Earthdata",
  },

  {
    id: "FEMA",
    title: "Federal Emergency Management Agency (FEMA)",
    source: "https://www.fema.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=FEMA",
  },

  {
    id: "FloodList",
    title: "FloodList",
    source: "http://floodlist.com/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=FloodList",
  },

  {
    id: "GDACS",
    title: "Global Disaster Alert and Coordination System",
    source: "http://www.gdacs.org/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=GDACS",
  },

  {
    id: "GLIDE",
    title: "GLobal IDEntifier Number (GLIDE)",
    source: "http://www.glidenumber.net/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=GLIDE",
  },

  {
    id: "InciWeb",
    title: "InciWeb",
    source: "https://inciweb.nwcg.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=InciWeb",
  },

  {
    id: "IRWIN",
    title: "Integrated Reporting of Wildfire Information (IRWIN) Observer",
    source: "https://irwin.doi.gov/observer/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=IRWIN",
  },

  {
    id: "IDC",
    title: "International Charter on Space and Major Disasters",
    source: "https://www.disasterscharter.org/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=IDC",
  },

  {
    id: "JTWC",
    title: "Joint Typhoon Warning Center",
    source: "http://www.metoc.navy.mil/jtwc/jtwc.html",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=JTWC",
  },

  {
    id: "MRR",
    title: "LANCE Rapid Response",
    source: "https://lance.modaps.eosdis.nasa.gov/cgi-bin/imagery/gallery.cgi",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=MRR",
  },

  {
    id: "MBFIRE",
    title: "Manitoba Wildfire Program",
    source: "http://www.gov.mb.ca/sd/fire/Fire-Maps/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=MBFIRE",
  },

  {
    id: "NASA_ESRS",
    title: "NASA Earth Science and Remote Sensing Unit",
    source: "https://eol.jsc.nasa.gov/ESRS/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=NASA_ESRS",
  },

  {
    id: "NASA_DISP",
    title: "NASA Earth Science Disasters Program",
    source: "https://disasters.nasa.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=NASA_DISP",
  },

  {
    id: "NASA_HURR",
    title: "NASA Hurricane And Typhoon Updates",
    source: "https://blogs.nasa.gov/hurricanes/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=NASA_HURR",
  },

  {
    id: "NOAA_NHC",
    title: "National Hurricane Center",
    source: "https://www.nhc.noaa.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=NOAA_NHC",
  },

  {
    id: "NOAA_CPC",
    title: "NOAA Center for Weather and Climate Prediction",
    source: "http://www.cpc.ncep.noaa.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=NOAA_CPC",
  },

  {
    id: "PDC",
    title: "Pacific Disaster Center",
    source: "http://www.pdc.org/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=PDC",
  },

  {
    id: "ReliefWeb",
    title: "ReliefWeb",
    source: "http://reliefweb.int/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=ReliefWeb",
  },

  {
    id: "SIVolcano",
    title: "Smithsonian Institution Global Volcanism Program",
    source: "http://www.volcano.si.edu/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=SIVolcano",
  },

  {
    id: "NATICE",
    title: "U.S. National Ice Center",
    source: "http://www.natice.noaa.gov/Main_Products.htm",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=NATICE",
  },

  {
    id: "UNISYS",
    title: "Unisys Weather",
    source: "http://weather.unisys.com/hurricane/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=UNISYS",
  },

  {
    id: "USGS_EHP",
    title: "USGS Earthquake Hazards Program",
    source: "https://earthquake.usgs.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=USGS_EHP",
  },

  {
    id: "USGS_CMT",
    title: "USGS Emergency Operations Collection Management Tool",
    source: "https://cmt.usgs.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=USGS_CMT",
  },

  {
    id: "HDDS",
    title: "USGS Hazards Data Distribution System",
    source: "https://hddsexplorer.usgs.gov/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=HDDS",
  },

  {
    id: "DFES_WA",
    title: "Western Australia Department of Fire and Emergency Services",
    source: "https://www.dfes.wa.gov.au/",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events?source=DFES_WA",
  },
];
