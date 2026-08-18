# Nạp firmware không cần source code / Flash without source code

## 🇻🇳 Tiếng Việt

Chỉ có **1 file duy nhất** (`firmware.bin`) — đã gộp sẵn bootloader +
bảng phân vùng + ứng dụng, nạp thẳng vào **offset 0x0**, không cần nhớ
nhiều địa chỉ.

1. Cài `esptool`:
   ```bash
   pip install esptool
   ```
2. Cắm board qua USB Type-C, xác định cổng COM (Windows: Device Manager).
3. Chạy lệnh (thay `COM13` bằng cổng thật của bạn):
   ```bash
   python -m esptool --chip esp32s3 --port COM13 --baud 921600 write_flash 0x0 firmware.bin
   ```
4. Đợi nạp xong (~15-20 giây), board tự khởi động lại.

**Nếu anh đang làm trang web nạp firmware qua trình duyệt** (kiểu ESP Web
Tools), chỉ cần khai báo đúng 1 file này ở offset `0x0` trong
`manifest.json`, không cần khai nhiều file/offset như trước.

WiFi mặc định: `KST-MAKITA-TOOL`, mật khẩu `makita1234`, truy cập
`192.168.4.1`. Xem README chính ở thư mục gốc để biết sơ đồ đấu dây và
hướng dẫn sử dụng đầy đủ.

## 🇬🇧 English

Just **one file** (`firmware.bin`) — bootloader + partition table + app
already merged together, flash it directly to **offset 0x0**, no need to
track multiple addresses.

1. Install `esptool`:
   ```bash
   pip install esptool
   ```
2. Plug the board in via USB Type-C and find its COM port (Windows: Device
   Manager).
3. Run (replace `COM13` with your actual port):
   ```bash
   python -m esptool --chip esp32s3 --port COM13 --baud 921600 write_flash 0x0 firmware.bin
   ```
4. Wait for it to finish (~15-20s); the board restarts automatically.

**Building a browser-based flashing page** (e.g. ESP Web Tools)? Just
declare this single file at offset `0x0` in your `manifest.json` — no need
for multiple file/offset entries.

Default WiFi: `KST-MAKITA-TOOL`, password `makita1234`, browse to
`192.168.4.1`. See the main README in the repo root for the wiring diagram
and full usage guide.
