# KST AI Robot — Bản OLED + ToF / OLED + ToF Edition

Firmware cho robot AI mã nguồn mở dựa trên [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32) v2.4.0, chạy trên ESP32-S3, có màn hình OLED SSD1306, cảm biến chống rơi ToF, bánh xe động cơ DC (qua mạch L298N mini), LED trang trí và trợ lý giọng nói AI offline wake-word.

Firmware for an open-source AI robot based on [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32) v2.4.0, running on ESP32-S3, with an SSD1306 OLED screen, an anti-fall ToF sensor, DC-motor wheels (via a mini L298N driver), decorative LEDs, and an offline wake-word AI voice assistant.

**🇻🇳 [Tiếng Việt](#tiếng-việt) · 🇬🇧 [English](#english)**

File đính kèm / Attached files:
- `KST-AI-Robot-OLED.bin` — firmware, đã gồm bootloader, nạp thẳng ở offset `0x0` / bootloader included, flash directly at offset `0x0`
- `So-do-dau-noi-OLED.svg` — sơ đồ đấu nối (tiếng Việt) / wiring diagram (Vietnamese)
- `Wiring-Diagram-OLED-EN.svg` — wiring diagram (English) / sơ đồ đấu nối (tiếng Anh)

---

## Tiếng Việt

### 1. Yêu cầu phần cứng

- Chip ESP32-S3, loại 16MB flash (N16R8 hoặc tương đương)
- Dây cáp USB Type-C loại nạp được dữ liệu (không phải dây chỉ sạc)
- Màn hình OLED SSD1306 128×64 (I2C), cảm biến ToF VL6180X/TOF050C, mic INMP441, loa MAX98357A, cảm ứng chạm TTP223, mạch động cơ mini L298N + 2 bánh xe DC, 2 LED trang trí

### 2. Sơ đồ kết nối (GPIO)

| Linh kiện | Chân | GPIO |
| --- | --- | --- |
| Mic INMP441 | WS / SCK / SD | 4 / 5 / 6 |
| Mic INMP441 | L/R | → GND |
| Loa MAX98357A | DIN / BCLK / LRCK | 7 / 15 / 16 |
| Cảm ứng TTP223 | OUT | 17 |
| Màn hình OLED SSD1306 | SDA / SCL | 41 / 42 |
| **Mạch động cơ L298N mini — đang dùng** | IN1 / IN2 / IN3 / IN4 | 11 / 12 / 13 / 14 |
| Servo 360° — *tuỳ chọn, thay thế cho L298N* | Trái / Phải | 45 / 46 |
| Servo tay / cổ — *tuỳ chọn, chỉ nếu có lắp* | Tín hiệu | 47 / 3 |
| LED trang trí | Anode | 38 / 18 |
| Cảm biến ToF | SDA / SCL | 1 / 2 |
| RGB WS2812 (có sẵn) | Data | 48 |

Firmware hỗ trợ 2 kiểu truyền động bánh xe, chọn tại trang `/robot`: **L298N + động cơ DC** (đang dùng ở bản này) hoặc **Servo 360°** (tuỳ chọn thay thế).

![Sơ đồ đấu nối KST AI Robot OLED](So-do-dau-noi-OLED.svg)

**Nguồn:** Mic, TTP223, màn hình OLED, ToF dùng 3.3V (từ ESP32). Loa MAX98357A dùng nguồn 5V riêng. Mạch L298N cấp nguồn động cơ 5-6V riêng (không lấy từ ESP32). Nếu lắp thêm servo 360°/servo tay-cổ, mỗi loại cũng cần nguồn 5V riêng. Tất cả GND nối chung với nhau.

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
   python -m esptool --chip esp32s3 -p COM8 -b 460800 --before default-reset --after hard-reset write-flash --flash-mode dio --flash-size 16MB --flash-freq 80m 0x0 KST-AI-Robot-OLED.bin
   ```
   Lệnh này ghi đè được lên mọi board ESP32-S3 phù hợp, dù đang trắng hay đang có firmware khác — không cần xoá gì trước.
5. Đợi tới dòng "Hash of data verified." là xong.

**Lưu ý khi nạp lại board đã dùng qua:** nếu board đã từng cấu hình Wi-Fi và anh/chị chỉ cần cập nhật firmware mới (không phải cài từ đầu), nên dùng cách nạp riêng từng phần để không bị mất Wi-Fi đã lưu:
```
python -m esptool --chip esp32s3 -p COM8 -b 460800 --before default-reset --after hard-reset write-flash --flash-mode dio --flash-size 16MB --flash-freq 80m 0x0 bootloader.bin 0x8000 partition-table.bin 0xd000 ota_data_initial.bin 0x20000 xiaozhi.bin 0x800000 generated_assets.bin
```
(cần các file rời trong thư mục build — cách này chỉ áp dụng nếu anh/chị tự build từ mã nguồn; file `.bin` gộp sẵn đính kèm trong bản phát hành này dùng cách nạp ở bước 4 là đơn giản nhất cho board mới.)

### 4. Cấu hình Wi-Fi lần đầu

1. Lần đầu bật nguồn, robot tự phát Wi-Fi tên `KST-Robot-Ai-xxxx`
2. Kết nối điện thoại/máy tính vào mạng đó
3. Trang cấu hình tự mở (nếu không, vào `192.168.4.1`) — chọn Wi-Fi nhà (chỉ hỗ trợ 2.4GHz), nhập mật khẩu, lưu
4. Robot tự kết nối; hỏi "cho anh xem địa chỉ trang cài đặt" để robot đọc và hiện URL `http://<IP>/robot` trên màn hình — đây là trang điều khiển LAN

Nếu cần đổi Wi-Fi: **giữ cảm ứng chạm (TTP223) trong lúc cắm nguồn** khoảng 5 giây để vào lại chế độ cấu hình (chỉ kiểm tra lúc mới khởi động, không phải giữ khi robot đang chạy).

### 5. Kích hoạt tài khoản (xiaozhi.me)

Sau khi kết nối Wi-Fi, nếu thiết bị chưa kích hoạt, màn hình sẽ hiện một **mã 6 chữ số** (robot cũng đọc to). Vào https://xiaozhi.me, đăng nhập, thêm thiết bị mới, nhập đúng mã đó để kích hoạt.

### 6. Cách tương tác

- **Từ khoá đánh thức offline:** nói rõ **"Hi Lily"** gần mic khi robot đang chờ, chạy hoàn toàn cục bộ trên chip, không cần internet để "nghe thấy"
- **Chạm 2 lần nhanh** vào cảm ứng TTP223: bật/tắt trò chuyện
- **Ra lệnh bằng giọng nói:** "đi tới/lùi/rẽ trái/rẽ phải", "khởi động lại robot", "cho xem địa chỉ trang cài đặt"...

### 7. Trang điều khiển LAN (`/robot`)

Sau khi biết địa chỉ IP, mở `http://<IP-robot>/robot` trên điện thoại/máy tính cùng mạng để: xem trạng thái, chỉnh đảo chiều động cơ (IN1-IN4), đổi kiểu truyền động (L298N/Servo 360°), lái tay 4 hướng, bật/tắt LED, bật/tắt và chỉnh ngưỡng ToF, xem sơ đồ chân — có song ngữ VN/EN.

### 8. Ghi chú an toàn

- Mỗi lệnh lái đều có hẹn giờ tự dừng (mặc định 1 giây nếu không nói rõ)
- Robot tự dừng khi mất Wi-Fi, gặp lỗi, hoặc phát hiện mép bàn (khi đã bật ToF trong `/robot`)
- ToF **mặc định bật sẵn** trên bản này — nếu robot chưa gắn cảm biến ToF thật, hãy tắt trong `/robot` để tránh báo lỗi/dừng nhầm

---

## English

### 1. Hardware requirements

- ESP32-S3 chip, 16MB flash variant (N16R8 or equivalent)
- USB Type-C cable capable of data transfer (not charge-only)
- SSD1306 128×64 I2C OLED display, VL6180X/TOF050C ToF sensor, INMP441 mic, MAX98357A speaker, TTP223 touch sensor, mini L298N motor driver + 2 DC-motor wheels, 2 decorative LEDs

### 2. Wiring diagram (GPIO)

| Component | Pin | GPIO |
| --- | --- | --- |
| INMP441 mic | WS / SCK / SD | 4 / 5 / 6 |
| INMP441 mic | L/R | → GND |
| MAX98357A speaker | DIN / BCLK / LRCK | 7 / 15 / 16 |
| TTP223 touch | OUT | 17 |
| SSD1306 OLED display | SDA / SCL | 41 / 42 |
| **L298N mini motor driver — active** | IN1 / IN2 / IN3 / IN4 | 11 / 12 / 13 / 14 |
| 360° servo — *optional, alternative to L298N* | Left / Right | 45 / 46 |
| Arm / neck servo — *optional, only if fitted* | Signal | 47 / 3 |
| Decorative LEDs | Anode | 38 / 18 |
| ToF sensor | SDA / SCL | 1 / 2 |
| Onboard RGB WS2812 | Data | 48 |

The firmware supports two wheel drivetrain options, selectable on the `/robot` page: **L298N + DC motors** (active in this build) or **360° servo** (alternative option).

![KST AI Robot OLED wiring diagram](Wiring-Diagram-OLED-EN.svg)

**Power:** Mic, touch sensor, OLED display, and ToF run on 3.3V (from the ESP32). The MAX98357A speaker needs a separate 5V supply. The L298N driver needs a separate 5-6V motor supply (not from the ESP32). If you add a 360° servo drivetrain or arm/neck servos, each also needs its own separate 5V supply. Tie all grounds together.

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
   python -m esptool --chip esp32s3 -p COM8 -b 460800 --before default-reset --after hard-reset write-flash --flash-mode dio --flash-size 16MB --flash-freq 80m 0x0 KST-AI-Robot-OLED.bin
   ```
   This works on any matching ESP32-S3 board, blank or already flashed with something else — no need to erase first.
5. Wait for "Hash of data verified." to confirm success.

**Re-flashing a board that's already in use:** if the board already has Wi-Fi configured and you're only updating firmware (not setting it up from scratch), flash the individual partition files instead so the saved Wi-Fi credentials survive:
```
python -m esptool --chip esp32s3 -p COM8 -b 460800 --before default-reset --after hard-reset write-flash --flash-mode dio --flash-size 16MB --flash-freq 80m 0x0 bootloader.bin 0x8000 partition-table.bin 0xd000 ota_data_initial.bin 0x20000 xiaozhi.bin 0x800000 generated_assets.bin
```
(needs the individual build output files — only applies if you build from source yourself; the single merged `.bin` attached to this release, flashed per step 4, is the simplest option for a brand-new board.)

### 4. First-time Wi-Fi setup

1. On first boot, the robot broadcasts its own Wi-Fi network named `KST-Robot-Ai-xxxx`
2. Connect your phone/computer to that network
3. A config page opens automatically (or visit `192.168.4.1`) — pick your home Wi-Fi (2.4GHz only), enter the password, save
4. The robot connects automatically; ask it "show me the settings address" to have it read out and display the `http://<IP>/robot` URL on screen — that's the LAN control page

To change Wi-Fi later: **hold the touch sensor (TTP223) while powering the board on** for about 5 seconds to re-enter config mode (this is only checked right at boot, not while the robot is already running).

### 5. Account activation (xiaozhi.me)

Once connected to Wi-Fi, if the device isn't activated yet, the screen shows a **6-digit code** (also spoken aloud). Go to https://xiaozhi.me, log in, add a new device, and enter that code to activate.

### 6. How to interact with it

- **Offline wake word:** say **"Hi Lily"** clearly near the mic while the robot is idle — this runs fully on-device, no internet needed to "hear" it
- **Double-tap** the TTP223 touch sensor: start/stop a conversation
- **Voice commands:** "move forward/backward/left/right", "restart the robot", "show me the settings address"...

### 7. LAN control page (`/robot`)

Once you know the robot's IP address, open `http://<robot-ip>/robot` on any device on the same network to: check status, remap the L298N motor pins (IN1-IN4) to reverse direction, switch drivetrain type (L298N/360° servo), drive manually in 4 directions, toggle the LEDs, enable/tune the ToF threshold, and view the pinout reference — bilingual VN/EN.

### 8. Safety notes

- Every drive command has a built-in auto-stop timer (defaults to 1 second if not specified)
- The robot stops itself on Wi-Fi loss, an error, or a detected table edge (once ToF is enabled in `/robot`)
- ToF is **enabled by default** on this build — if your unit doesn't have the ToF sensor physically fitted, disable it in `/robot` to avoid false errors/stops

---

## Giấy phép / License

Dựa trên dự án mã nguồn mở [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32). Xem giấy phép gốc của dự án đó.
Based on the open-source [xiaozhi-esp32](https://github.com/78/xiaozhi-esp32) project. See that project's original license.
