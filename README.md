# KST AI Robot — Bản ST7735 + ToF / ST7735 + ToF Edition

Firmware cho robot AI mã nguồn mở dựa trên [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32) v2.4.0, chạy trên ESP32-S3, có màn hình TFT màu ST7735, cảm biến chống rơi ToF, bánh xe servo 360° (hoặc động cơ DC tuỳ chọn), servo tay/cổ và trợ lý giọng nói AI offline wake-word.

Firmware for an open-source AI robot based on [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32) v2.4.0, running on ESP32-S3, with a color ST7735 TFT screen, anti-fall ToF sensor, 360° servo wheels (or optional DC motors), arm/neck servos, and an offline wake-word AI voice assistant.

**🇻🇳 [Tiếng Việt](#tiếng-việt) · 🇬🇧 [English](#english)**

File đính kèm / Attached files:
- `KST-AI-Robot-ST7735.bin` — firmware, đã gồm bootloader, nạp thẳng ở offset `0x0` / bootloader included, flash directly at offset `0x0`
- `So-do-dau-noi-ST7735.svg` — sơ đồ đấu nối (tiếng Việt) / wiring diagram (Vietnamese)
- `Wiring-Diagram-ST7735-EN.svg` — wiring diagram (English) / sơ đồ đấu nối (tiếng Anh)

---

## Tiếng Việt

### 1. Yêu cầu phần cứng

- Chip ESP32-S3, loại 16MB flash (N16R8 hoặc tương đương)
- Dây cáp USB Type-C loại nạp được dữ liệu (không phải dây chỉ sạc)
- Màn hình ST7735 128×160 (SPI), cảm biến ToF VL6180X/TOF050C, mic INMP441, loa MAX98357A, 2 servo 360° (bánh xe), 2 servo tay/cổ, cảm ứng chạm TTP223

### 2. Sơ đồ kết nối (GPIO)

| Linh kiện | Chân | GPIO |
| --- | --- | --- |
| Mic INMP441 | WS / SCK / SD | 4 / 5 / 6 |
| Mic INMP441 | L/R | → GND |
| Loa MAX98357A | LRC / BCLK / DIN | 15 / 16 / 17 |
| Loa MAX98357A | GAIN / SD | → GND / → VIN |
| Cảm ứng TTP223 | OUT | 7 |
| Màn hình ST7735 | MOSI / SCK / DC / CS / RST | 11 / 12 / 10 / 13 / 14 |
| **Servo 360° (bánh xe) — đang dùng** | Trái / Phải | 47 / 45 |
| Mạch động cơ L298N — *tuỳ chọn, không dùng ở bản này* | IN1 / IN2 / IN3 / IN4 | 38 / 39 / 40 / 41 |
| Servo tay / cổ | Tín hiệu | 20 / 21 |
| LED trái / phải | Anode | 3 / 18 |
| Cảm biến ToF | SDA / SCL | 1 / 2 |
| RGB WS2812 (có sẵn) | Data | 48 |

Firmware hỗ trợ 2 kiểu truyền động bánh xe, chọn tại trang `/robot`: **Servo 360°** (đang dùng ở bản này) hoặc **L298N + động cơ DC** (tuỳ chọn thay thế).

![Sơ đồ đấu nối KST AI Robot ST7735](So-do-dau-noi-ST7735.svg)

**Nguồn:** Mic, TTP223, màn hình, ToF dùng 3.3V (từ ESP32). Loa MAX98357A, 2 servo tay/cổ và 2 servo 360° dùng nguồn 5V **riêng**, không lấy từ ESP32. Nếu dùng L298N thay thế, nguồn động cơ cấp riêng theo motor. Tất cả GND nối chung với nhau.

**Không dùng GPIO36/GPIO37** cho bất kỳ mục đích nào — 2 chân này thuộc bus PSRAM nội bộ, đấu vào sẽ làm robot tự reset liên tục.

### 3. Cách nạp firmware

1. Cài Python 3: https://www.python.org/downloads/ (nhớ tick "Add python.exe to PATH")
2. Mở terminal, cài esptool:
   ```
   pip install esptool
   ```
3. Cắm board qua USB, kiểm tra cổng COM ở Device Manager (Windows) hoặc `ls /dev/tty.*` (macOS/Linux)
4. Nạp (thay `COM8` bằng cổng thực tế của anh/chị):
   ```
   python -m esptool --chip esp32s3 -p COM8 -b 460800 --before default-reset --after hard-reset write-flash --flash-mode dio --flash-size 16MB --flash-freq 80m 0x0 KST-AI-Robot-ST7735.bin
   ```
   Lệnh này ghi đè được lên mọi board ESP32-S3 phù hợp, dù đang trắng hay đang có firmware khác — không cần xoá gì trước.
5. Đợi tới dòng "Hash of data verified." là xong.

### 4. Cấu hình Wi-Fi lần đầu

1. Lần đầu bật nguồn, robot tự phát Wi-Fi tên `KST-Robot-Ai-xxxx`
2. Kết nối điện thoại/máy tính vào mạng đó
3. Trang cấu hình tự mở (nếu không, vào `192.168.4.1`) — chọn Wi-Fi nhà (chỉ hỗ trợ 2.4GHz), nhập mật khẩu, lưu
4. Robot tự kết nối và khởi động lại; màn hình hiện `CÀI ĐẶT: http://<IP>/robot` — đây là trang điều khiển LAN

Nếu cần đổi Wi-Fi: giữ cảm ứng chạm (TTP223) khi cắm nguồn khoảng 5 giây để vào lại chế độ cấu hình.

### 5. Kích hoạt tài khoản (xiaozhi.me)

Sau khi kết nối Wi-Fi, nếu thiết bị chưa kích hoạt, màn hình sẽ hiện một **mã 6 chữ số** (robot cũng đọc to). Vào https://xiaozhi.me, đăng nhập, thêm thiết bị mới, nhập đúng mã đó để kích hoạt.

### 6. Từ khoá đánh thức offline

Robot có wake-word chạy hoàn toàn cục bộ trên chip (không cần internet để "nghe thấy"): nói rõ **"Hi Lily"** gần mic khi robot đang ở màn hình chờ. Cách khác: chạm 2 lần vào cảm ứng để bật/tắt trò chuyện.

### 7. Ghi chú an toàn

- Mỗi lệnh lái đều có hẹn giờ tự dừng (mặc định 1 giây nếu không nói rõ)
- Robot tự dừng khi mất Wi-Fi, gặp lỗi, hoặc phát hiện mép bàn (khi đã bật ToF trong `/robot`)
- ToF **mặc định tắt** — bật thủ công trong `/robot` sau khi đã gắn cảm biến, **khởi động lại robot 1 lần** để cảm biến hoạt động

---

## English

### 1. Hardware requirements

- ESP32-S3 chip, 16MB flash variant (N16R8 or equivalent)
- USB Type-C cable capable of data transfer (not charge-only)
- ST7735 128×160 SPI display, VL6180X/TOF050C ToF sensor, INMP441 mic, MAX98357A speaker, 2x 360° servo (wheels), 2x arm/neck servo, TTP223 touch sensor

### 2. Wiring diagram (GPIO)

| Component | Pin | GPIO |
| --- | --- | --- |
| INMP441 mic | WS / SCK / SD | 4 / 5 / 6 |
| INMP441 mic | L/R | → GND |
| MAX98357A speaker | LRC / BCLK / DIN | 15 / 16 / 17 |
| MAX98357A speaker | GAIN / SD | → GND / → VIN |
| TTP223 touch | OUT | 7 |
| ST7735 display | MOSI / SCK / DC / CS / RST | 11 / 12 / 10 / 13 / 14 |
| **360° servo (wheels) — active** | Left / Right | 47 / 45 |
| L298N motor driver — *optional, not used in this build* | IN1 / IN2 / IN3 / IN4 | 38 / 39 / 40 / 41 |
| Arm / neck servo | Signal | 20 / 21 |
| Left / right LED | Anode | 3 / 18 |
| ToF sensor | SDA / SCL | 1 / 2 |
| Onboard RGB WS2812 | Data | 48 |

The firmware supports two wheel drivetrain options, selectable on the `/robot` page: **360° servo** (active in this build) or **L298N + DC motors** (alternative option).

![KST AI Robot ST7735 wiring diagram](Wiring-Diagram-ST7735-EN.svg)

**Power:** Mic, touch sensor, display, and ToF run on 3.3V (from the ESP32). The MAX98357A speaker, both arm/neck servos, and both 360° wheel servos need a **separate** 5V supply — do not power them from the ESP32. If using the L298N alternative, its motor supply is separate too. Tie all grounds together.

**Never use GPIO36/GPIO37** for anything — these belong to the internal PSRAM bus and will cause continuous reset loops if used.

### 3. Flashing instructions

1. Install Python 3: https://www.python.org/downloads/ (check "Add python.exe to PATH")
2. Open a terminal and install esptool:
   ```
   pip install esptool
   ```
3. Plug the board in via USB and find its COM/serial port (Device Manager on Windows, `ls /dev/tty.*` on macOS/Linux)
4. Flash it (replace `COM8` with your actual port):
   ```
   python -m esptool --chip esp32s3 -p COM8 -b 460800 --before default-reset --after hard-reset write-flash --flash-mode dio --flash-size 16MB --flash-freq 80m 0x0 KST-AI-Robot-ST7735.bin
   ```
   This works on any matching ESP32-S3 board, blank or already flashed with something else — no need to erase first.
5. Wait for "Hash of data verified." to confirm success.

### 4. First-time Wi-Fi setup

1. On first boot, the robot broadcasts its own Wi-Fi network named `KST-Robot-Ai-xxxx`
2. Connect your phone/computer to that network
3. A config page opens automatically (or visit `192.168.4.1`) — pick your home Wi-Fi (2.4GHz only), enter the password, save
4. The robot connects and restarts; the screen shows `SETTINGS: http://<IP>/robot` — that's the LAN control page

To change Wi-Fi later: hold the touch sensor (TTP223) while powering on for about 5 seconds to re-enter config mode.

### 5. Account activation (xiaozhi.me)

Once connected to Wi-Fi, if the device isn't activated yet, the screen shows a **6-digit code** (also spoken aloud). Go to https://xiaozhi.me, log in, add a new device, and enter that code to activate.

### 6. Offline wake word

The robot runs its wake-word detection fully on-device (no internet needed to "hear" it): say **"Hi Lily"** clearly near the mic while the robot is idle. Alternative: double-tap the touch sensor to start/stop a conversation.

### 7. Safety notes

- Every drive command has a built-in auto-stop timer (defaults to 1 second if not specified)
- The robot stops itself on Wi-Fi loss, an error, or a detected table edge (once ToF is enabled in `/robot`)
- ToF is **disabled by default** — enable it manually in `/robot` after fitting the sensor, then **reboot the robot once** for it to activate

---

## Giấy phép / License

Dựa trên dự án mã nguồn mở [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32). Xem giấy phép gốc của dự án đó.
Based on the open-source [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32) project. See that project's original license.
