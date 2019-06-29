const NAME_LOOKUP = {
  "STORM": "Winter Storm",
  "FLOOD": "Flood",
  "FIRE": "Fire",
  "WILDFIRE": "Brush and/or Wildfire",
  "TORNADO": "Tornado",
  "WEATHER": "Severe Weather",
  "EARTHQUAKE": "Earthquake",
  "BIOLOGICAL": "Biological Threat",
  "CHEMICAL": "Chemical Threat",
  "DROUGHT": "Drought",
  "HEAT": "Extreme Heat",
  "HURRICANE": "Hurricane",
  "LANDSLIDE": "Landslide",
  "RADIATION": "Radiation and Nuclear",
  "TSUNAMI": "Tsunami",
  "VOLCANO": "Volcano",
  "NA": "N/A"
};

const renderDisasters = (disasters) => {
  let html = "";
  if (disasters && Array.isArray(disasters) && disasters.length > 0) {
    let i = 0;
    const l = disasters.length;
    html += "<ul>";
    for (i; i < l; i++) {
      html += `<li>${(NAME_LOOKUP[disasters[i]]) ? NAME_LOOKUP[disasters[i]] : disasters[i]}</li>`;
    }
    html += "</ul>";
  } else {
    html += NAME_LOOKUP.NA;
  }
  return html;
};

export default renderDisasters;
