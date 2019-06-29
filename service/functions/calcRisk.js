const BIGGEST_RISK_CALC = 10;
const RISK_DEMO = {
  "NORMAL": 1,
  "ELDERLY": 2,
  "DISABLED": 3
};

const DISASTER_TYPE = {
  "NOTHING": 0,
  "WEATHER": 1,
  "FLOOD": 2,
  "FIRE": 3,
  "EARTHQUAKE": 3,
  "BIOLOGICAL": 4,
  "CHEMICAL": 4,
  "DROUGHT": 1,
  "HEAT": 1,
  "HURRICANE":3,
  "LANDSLIDE":2,
  "RADIATION":3,
  "TORNADO":2,
  "TSUNAMI":3,
  "VOLCANO":3,
  "WILDFIRES":3,
  "STORM":1
};

/**
 * Calculates the risk based on a few factors:</br>
 * <ul>
 *   <li> Property value as it relates to average in the area</li>
 *   <li> Number of disasters in the area modified by risk type:
 *     <li> example: Flood is higher than weather but lower than fire</li>
 *   </li>
 *   <li> calculated to an integer 0-10</li>
 * </ul>
 * @param {Number} propertyValue Value of the property
 * @param {Number} averageValue Average value in area
 * @param {Number} numberDisasters Number of disasters in area
 * @param {Number} typeModifier Modifier to adjust the disaster value
 * @param {Number} highriskdemo Modifier to adjust for high risk demographic (elderly, etc.)
 */
const calcRisk = (propertyValue = 1, averageValue = 1, numberDisasters = 0, typeModifier = 0, highriskdemo = 1) => {
  if (!highriskdemo || highriskdemo < 1) {
    highriskdemo = 1;
  }
  const disaster = (numberDisasters * typeModifier);
  const risk = parseFloat((((
    Math.ceil((
    (propertyValue / averageValue)
    * (disaster > 0 ? disaster : 1)
    * highriskdemo)
    * 100.00)
  ) / 100)
    - 1)
    .toFixed(2));

    return (risk > 0) ? risk : 0;
};

module.exports = { calcRisk: calcRisk, DISASTER_TYPE: DISASTER_TYPE, RISK_DEMO: RISK_DEMO };
