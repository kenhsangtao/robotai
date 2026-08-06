# KST Robot AI Firmware Website

Website: `https://kenhsangtao.github.io/robotai/`

## Đưa bộ khung lên GitHub

1. Mở repository `kenhsangtao/robotai`.
2. Chọn **Add file → Upload files**.
3. Giải nén file ZIP này.
4. Chọn toàn bộ file và thư mục bên trong rồi tải lên.
5. Bấm **Commit changes**.
6. Đợi GitHub Pages cập nhật khoảng 1–5 phút.

## Khi đã có firmware

ESP Web Tools khuyến nghị dùng một file firmware đã gộp cho ESP32-S3.

1. Đặt file đã gộp vào:
   `firmware/robotai-merged.bin`
2. Sửa phiên bản trong `manifest.json`.
3. Trong `index.html`, thay nút tạm bằng:

```html
<esp-web-install-button manifest="manifest.json">
  <button slot="activate" class="primary">Nạp firmware</button>
</esp-web-install-button>
```

4. Commit lại lên GitHub.

## Lưu ý

- Website phải chạy qua HTTPS; GitHub Pages đáp ứng yêu cầu này.
- Người dùng nên mở bằng Chrome hoặc Edge trên máy tính.
- Cần xác định đúng cấu trúc firmware và địa chỉ flash trước khi kích hoạt nút nạp.
