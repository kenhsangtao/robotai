# Bill of Materials — KST Soldering Station v1

| # | Component | Spec | Qty | Notes |
|---|---|---|---|---|
| 1 | ESP32-S3 DevKitC-1 | N16R8 variant: 16MB Flash, 8MB PSRAM (Octal/OPI) | 1 | Main controller board |
| 2 | MAX31855 module | K-type thermocouple amplifier, SPI, onboard 3.3V regulator | 1 | Tip temperature sensing |
| 3 | ST7789 display | 1.47" SPI TFT, 172×320 resolution | 1 | Display |
| 4 | EC11 rotary encoder | Knob with integrated push button, 10kΩ pull-up on board | 1 | Temperature adjust + menu navigation |
| 5 | IRLB8721 MOSFET | N-channel, logic-level (drives fine at 3.3V), TO-220 package | 1 | Heater switching |
| 6 | 220Ω resistor | 1/4W | 1 | Gate series resistor |
| 7 | 10kΩ resistor | 1/4W | 1 | Gate pulldown resistor |
| 8 | Active buzzer | 2-pin, 5V rated (runs fine at 3.3V logic too) | 1 | Audible feedback |
| 9 | Micro switch / reed switch | Small, normally-open (NO) | 1 | Detects iron resting on its stand |
| 10 | GOOT soldering iron cartridge | 2-pin heater (~8.2Ω measured) + K-type thermocouple pair | 1 | Heating element + sensor |
| 11 | Makita 18-21V LXT battery | With matching battery holder/adapter | 1 | Direct power source for heater and buck converter |
| 12 | DC-DC buck converter module | Input 7-28V, output 5V/3A | 1 | Powers the ESP32-S3 |
| 13 | Copper-clad perfboard | Sized to fit your enclosure | 1 sheet | Circuit assembly |
| 14 | Hookup wire, solder, heat-shrink tubing | Standard | As needed | Wiring |

## Important notes

- **No switch, fuse, or protection diode** on the battery power path — this design feeds power directly for simplicity. Add a 5A fuse on the positive line yourself if you want extra protection.
- **No debounce capacitors needed** for the encoder — debouncing is handled entirely in software (quadrature state-table decoding).
- **The MOSFET does not need a heatsink** — real load current (~2.5-3A) and low switching frequency (4Hz) keep power dissipation tiny (~0.3W), with large safety margin.
- The **3Vo** pin on the MAX31855 module is a spare regulated OUTPUT (not an input) — it's not used in this design.
- See `docs/wiring-diagram-en.svg` for the full wiring reference.
