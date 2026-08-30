# Danh sách linh kiện — Trạm Hàn KST v1

| # | Linh kiện | Thông số | Số lượng | Ghi chú |
|---|---|---|---|---|
| 1 | ESP32-S3 DevKitC-1 | Bản N16R8: 16MB Flash, 8MB PSRAM (Octal/OPI) | 1 | Bộ não chính, chạy firmware |
| 2 | Module MAX31855 | Khuếch đại cặp nhiệt K-type, giao tiếp SPI, có ổn áp 3.3V onboard | 1 | Đo nhiệt độ mũi hàn |
| 3 | Màn hình ST7789 | SPI TFT 1.47", độ phân giải 172×320 | 1 | Hiển thị |
| 4 | Encoder EC11 | Núm xoay có nút nhấn tích hợp, pull-up 10kΩ sẵn trên board | 1 | Chỉnh nhiệt độ, điều hướng menu |
| 5 | MOSFET IRLB8721 | N-channel, logic-level (kích được ở 3.3V), gói TO-220 | 1 | Đóng/cắt heater |
| 6 | Điện trở 220Ω | 1/4W | 1 | Trở nối tiếp cổng Gate MOSFET |
| 7 | Điện trở 10kΩ | 1/4W | 1 | Trở kéo xuống (pulldown) cổng Gate |
| 8 | Còi (buzzer) | Loại chủ động 2 chân, 5V (chạy tốt cả ở 3.3V) | 1 | Báo hiệu |
| 9 | Công tắc hành trình / reed switch | Loại nhỏ, thường mở (NO) | 1 | Phát hiện mũi hàn đặt lên giá đỡ |
| 10 | Mũi hàn GOOT | Cartridge 2 chân heater (~8.2Ω đo thực tế) + cặp nhiệt K-type | 1 | Bộ phận gia nhiệt + cảm biến |
| 11 | Pin Makita 18-21V LXT | Cùng đế/holder pin Makita tương ứng | 1 | Nguồn cấp trực tiếp cho heater và cho mạch hạ áp |
| 12 | Module hạ áp DC-DC (Buck) | Ngõ vào 7-28V, ngõ ra 5V/3A | 1 | Cấp 5V cho ESP32-S3 |
| 13 | Phíp đồng (perfboard) | Kích thước tùy khung máy | 1 tấm | Hàn cố định mạch |
| 14 | Dây điện, thiếc hàn, ống co nhiệt | Loại thông thường | Tùy nhu cầu | Đấu nối |

## Ghi chú quan trọng

- **Không dùng công tắc, cầu chì, diode bảo vệ** trên đường nguồn từ pin Makita — bản thiết kế này cấp thẳng để đơn giản, gọn nhẹ. Nếu muốn an toàn hơn, anh có thể tự thêm cầu chì 5A trên đường dương.
- **Không cần tụ chống rung (debounce)** cho encoder — firmware đã xử lý chống rung bằng phần mềm (giải mã quadrature theo bảng trạng thái).
- **MOSFET không cần tản nhiệt riêng** — dòng tải thực tế (~2.5-3A) và tần số đóng cắt thấp (4Hz) khiến công suất tỏa nhiệt rất nhỏ (~0.3W), dư an toàn.
- Chân **3Vo** trên module MAX31855 là ngõ RA phụ (không phải ngõ vào), không cần dùng tới.
- Xem sơ đồ đấu nối chi tiết trong `docs/so-do-dau-noi-vi.svg`.
