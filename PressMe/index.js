const open = require('open');
const logger = require('../_lib/logger');
const api = require('../_lib/api');

const BUTTON = 'GroveButtonD0';
const LED_STRIP = 'GroveLedWs2812D1';
const LED_COUNT = 30; // DO NOT INCREASE

let token, timeout, isWebpageOpen;

function start(node) {
  token = node.node_key;
  api.openSocket(token, wait, onEvent);
}

function wait() {
  isWebpageOpen = false;
  logger.info('[PressMe] waiting for button press...');
}

function onEvent(evt) {
  if (!evt.button_pressed) {
    logger.error(`[PressMe] invalid button_pressed event:`, evt);
    return;
  }

  logger.info('[PressMe] button pressed');
  lightsOn();
}

function lightsOn() {
  const { BRIGHTNESS, RAINBOW_SPEED, TIMER, WEBPAGE_URL } = process.env;

  api.writeValue(token, LED_STRIP, 'start_rainbow_flow', LED_COUNT, BRIGHTNESS, RAINBOW_SPEED)
    .then(() => {
      logger.info(`[PressMe] lights on for ${Math.floor(TIMER / 1000)}s`);

      // Reset and start timer to turn off lights
      clearTimeout(timeout);
      timeout = setTimeout(lightsOff, TIMER);

      // Open webpage unless already open
      if (!isWebpageOpen && WEBPAGE_URL) {
        open(WEBPAGE_URL);
        isWebpageOpen = true;
      }
    })
    .catch(api.error);
}

function lightsOff() {
  api.writeValue(token, LED_STRIP, 'clear', LED_COUNT, '000000')
    .then(() => {
      logger.info('[PressMe] lights off');
      wait();
    })
    .catch(api.error);
}

module.exports = {
  start
};
