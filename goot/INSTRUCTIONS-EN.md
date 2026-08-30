# KST Soldering Station — v1 (1.47" display)

Temperature-controlled soldering station firmware for a GOOT soldering iron cartridge, built on ESP32-S3, powered by an 18-21V Makita LXT battery.

## Folder contents

```
release-v1/
├── firmware/
│   ├── goot-kst-v1-full.bin   ← the ONLY file you need to flash (pre-merged)
│   ├── bootloader.bin         ← (for manual multi-part flashing)
│   ├── partitions.bin
│   ├── boot_app0.bin
│   ├── firmware.bin
│   └── flash-offsets.txt      ← flash addresses for each file
├── docs/
│   ├── so-do-dau-noi-vi.svg   ← wiring diagram (Vietnamese)
│   └── wiring-diagram-en.svg  ← wiring diagram (English)
├── HUONG-DAN-VN.md
├── INSTRUCTIONS-EN.md         ← this file
├── DANH-SACH-LINH-KIEN-VN.md
└── BOM-EN.md
```

## Flashing the firmware

### Option 1 — Web flasher (recommended, no install needed)

1. Use **Chrome** or **Edge** on a computer (phones cannot flash over Web Serial).
2. Plug the ESP32-S3 board into the computer via USB.
3. Open your flashing page (built with ESP Web Tools or similar), select the correct COM port.
4. Flash the **single file** `firmware/goot-kst-v1-full.bin` at offset **0x0**.
5. Wait for it to finish; the board reboots automatically.

### Option 2 — Manual flashing via esptool

```
esptool.py --chip esp32s3 --port COMx --baud 460800 write_flash -z ^
  --flash_mode dio --flash_freq 80m --flash_size 16MB ^
  0x0000 firmware/bootloader.bin ^
  0x8000 firmware/partitions.bin ^
  0xe000 firmware/boot_app0.bin ^
  0x10000 firmware/firmware.bin
```

(Replace `COMx` with the board's actual COM port — check Device Manager.)

If the board doesn't enter flashing mode automatically: hold **BOOT**, tap **RESET/EN**, then release **BOOT**, and re-run the flash command.

## After flashing

1. The board boots, showing "KST Soldering Station" + logos, loading to 100%.
2. The board broadcasts its own WiFi network: SSID **`KST-TramHan`**, password **`kst123456`**.
3. Connect your phone to that WiFi and open **`192.168.4.1`** in a browser to configure: language, °C/°F unit, beep, screen brightness, temperature offset, sleep timeout.

## Basic usage

- **Rotate the encoder knob**: adjust the setpoint (±5°C per detent).
- **Short press**: cycle through 8 preset temperatures: 300→330→360→390→420→450→480→500°C.
- **Long press (3s)**: enter/exit the settings menu (rotate to select a row, short-press to change its value).
- Placing the iron on its stand long enough (per the configured sleep timeout) drops it to 150°C to save power; lifting it restores the previous setpoint.

## ⚠️ Safety — READ BEFORE USE

- **The thermocouple leads (T+/T−) must be wired with correct polarity.** If reversed, the displayed reading will drift **negative** while the iron heats up **completely out of control** (the feedback loop inverts) — this is dangerous and can cause burns or fire. On first power-up, check: if the reading **rises** as the iron actually gets hot, polarity is correct; if it **drops/goes negative** while the iron is clearly heating, unplug immediately and swap the two thermocouple leads.
- Keep a hand near the power switch/plug during first tests of any new wiring.
- Always double-check against the diagrams in `docs/` before wiring anything for real.

## Source code

This firmware is built from the Arduino/PlatformIO source (the `src/` and `include/` folders of the main project) — not included here to keep this package small. Use the main project if you need to rebuild or modify the code.
