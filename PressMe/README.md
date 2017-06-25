# Press Me

Open a webpage and light up the LED strip for a set amount of time when pressing the button.

## Grove modules

- [Digital 0]: Button
- [Digital 1]: 30-LED strip

## Well-known

```
POST /v1/node/GroveLedWs2812D1/clear/{uint8_t total_led_cnt}/{char *rgb_hex_string}
POST /v1/node/GroveLedWs2812D1/segment/{uint8_t start}/{char *rgb_hex_string}
POST /v1/node/GroveLedWs2812D1/start_rainbow_flow/{uint8_t length}/{uint8_t brightness}/{uint8_t speed}
POST /v1/node/GroveLedWs2812D1/stop_rainbow_flow
GET /v1/node/GroveButtonD0/pressed -> uint8_t pressed
Event GroveButtonD0 button_pressed
```
