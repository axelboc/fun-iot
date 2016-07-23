# Humidity monitor

Record humidity and temperature at regular intervals, and plot the data points along with local weather data.

## Grove modules

- [Digital 0]: Temperature & Humidity sensor
- [Digital 1]: 30-LED strip

## Well-known

```
GET /v1/node/GroveTempHumD0/humidity -> float humidity
GET /v1/node/GroveTempHumD0/temperature -> float celsius_degree
GET /v1/node/GroveTempHumD0/temperature_f -> float fahrenheit_degree
POST /v1/node/GroveLedWs2812D1/clear/{uint8_t total_led_cnt}/{char *rgb_hex_string}
POST /v1/node/GroveLedWs2812D1/segment/{uint8_t start}/{char *rgb_hex_string}
POST /v1/node/GroveLedWs2812D1/start_rainbow_flow/{uint8_t length}/{uint8_t brightness}/{uint8_t speed}
POST /v1/node/GroveLedWs2812D1/stop_rainbow_flow
```
