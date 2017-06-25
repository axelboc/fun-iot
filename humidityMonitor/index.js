const logger = require('../_lib/logger');
const api = require('../_lib/api');

const TEMP_HUM = 'GroveTempHumD0';
const LED_STRIP = 'GroveLedWs2812D1';

function start(node) {
  const token = node.node_key;

  Promise.all([
    api.readValue(token, TEMP_HUM, 'humidity'),
    api.readValue(token, TEMP_HUM, 'temperature')
  ])
    .then(([{ humidity }, { celsius_degree }]) => {
      console.info('[HumidityMonitor] humidity=', humidity + process.env.HUM_OFFSET);
      console.info('[HumidityMonitor] temperature=', celsius_degree);
    })
    .catch(api.error);
}


module.exports = {
  start
};
