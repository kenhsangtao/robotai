# Trạm Hàn KST — Bản v1 (màn hình 1.47")

Firmware điều khiển nhiệt độ mỏ hàn GOOT bằng ESP32-S3, dùng pin Makita 18-21V làm nguồn.

## Nội dung thư mục

```
release-v1/
├── firmware/
│   ├── goot-kst-v1-full.bin   ← FILE DUY NHẤT cần nạp (đã gộp sẵn 4 phần)
│   ├── bootloader.bin         ← (dùng nếu nạp thủ công từng phần)
│   ├── partitions.bin
│   ├── boot_app0.bin
│   ├── firmware.bin
│   └── flash-offsets.txt      ← địa chỉ nạp cho từng file, dùng khi cần nạp tay
├── docs/
│   ├── so-do-dau-noi-vi.svg   ← sơ đồ đấu dây (tiếng Việt)
│   └── wiring-diagram-en.svg  ← sơ đồ đấu dây (tiếng Anh)
├── HUONG-DAN-VN.md            ← file này
├── INSTRUCTIONS-EN.md
├── DANH-SACH-LINH-KIEN-VN.md
└── BOM-EN.md
```

## Cách nạp firmware

### Cách 1 — Dùng trang web nạp (khuyên dùng, không cần cài gì)

1. Dùng trình duyệt **Chrome** hoặc **Edge** trên máy tính (điện thoại không nạp được qua web).
2. Cắm board ESP32-S3 vào máy tính bằng cáp USB.
3. Vào trang nạp firmware (trang do anh tự dựng bằng ESP Web Tools hoặc tương tự), chọn đúng cổng COM của board.
4. Chỉ cần chọn **1 file duy nhất**: `firmware/goot-kst-v1-full.bin`, nạp ở địa chỉ **0x0**.
5. Đợi thanh tiến trình chạy xong, board tự khởi động lại.

### Cách 2 — Nạp thủ công bằng esptool (dòng lệnh)

```
esptool.py --chip esp32s3 --port COMx --baud 460800 write_flash -z ^
  --flash_mode dio --flash_freq 80m --flash_size 16MB ^
  0x0000 firmware/bootloader.bin ^
  0x8000 firmware/partitions.bin ^
  0xe000 firmware/boot_app0.bin ^
  0x10000 firmware/firmware.bin
```

(Thay `COMx` bằng cổng COM thật của board — xem trong Device Manager.)

Nếu board không tự vào chế độ nạp: giữ nút **BOOT**, bấm nhả nút **RESET/EN**, rồi thả **BOOT** ra, sau đó chạy lại lệnh nạp.

## Sau khi nạp xong

1. Board khởi động, màn hình hiện tên "Trạm Hàn KST" + logo, load 100%.
2. Board tự phát WiFi tên **`KST-TramHan`**, mật khẩu **`kst123456`**.
3. Điện thoại kết nối vào WiFi đó, mở trình duyệt vào địa chỉ **`192.168.4.1`** để cài đặt: ngôn ngữ, đơn vị °C/°F, còi báo, độ sáng màn hình, bù nhiệt độ, thời gian tự ngủ.

## Cách dùng cơ bản

- **Xoay núm encoder**: chỉnh nhiệt độ đặt (±5°C mỗi nấc).
- **Bấm nháy 1 cái**: nhảy nhanh qua 8 mức nhiệt dựng sẵn: 300→330→360→390→420→450→480→500°C.
- **Giữ 3 giây**: vào/thoát màn hình cài đặt (trong màn cài đặt, xoay để chọn mục, bấm nháy để đổi giá trị).
- Đặt mỏ hàn lên giá đỡ đủ lâu (theo thời gian cài trong Settings) → tự động hạ về 150°C tiết kiệm điện, nhấc lên là quay lại mức đặt.

## ⚠️ Lưu ý an toàn — ĐỌC KỸ TRƯỚC KHI DÙNG

- **Cực cặp nhiệt (T+/T−) phải đấu đúng chiều.** Nếu đấu ngược, số hiển thị sẽ chạy **âm dần** trong khi mỏ hàn nóng lên **không kiểm soát** (do vòng phản hồi bị đảo dấu) — rất nguy hiểm, có thể gây cháy/bỏng. Lần đầu cắm điện, quan sát: nếu số hiển thị **tăng** theo đúng hướng mỏ hàn nóng lên thì đấu đúng; nếu số **giảm/âm** mà mỏ hàn vẫn nóng thì rút điện ngay và đảo lại 2 dây cặp nhiệt.
- Luôn để tay gần công tắc/nguồn khi test lần đầu với một cấu hình dây mới.
- Xem đúng sơ đồ trong `docs/` trước khi đấu dây thật.

## Đối chiếu code nguồn

Firmware này build từ source code Arduino/PlatformIO (thư mục `src/`, `include/` trong project chính), không đính kèm ở đây để gọn nhẹ. Nếu cần build lại hoặc sửa code, dùng bản gốc.
