# Gia Phả Việt Pro — React + Supabase

Ứng dụng gia phả trực tuyến với website công khai, đăng nhập Supabase Auth và trang quản trị riêng. Mã nguồn này là bản nền triển khai, cần kiểm thử và sao lưu trước khi dùng với dữ liệu dòng họ thực.

## 1. Yêu cầu
- Node.js 20+ và npm
- Tài khoản Supabase, một **project mới**
- VS Code

## 2. Cài đặt trên Windows
Giải nén, mở thư mục `gia-pha-viet-pro` trong VS Code, mở Terminal:

```powershell
npm install
```

Sao chép `.env.example` thành `.env`, rồi điền các giá trị từ Supabase > Project Settings > API (hoặc Connect):

```dotenv
VITE_SUPABASE_URL=https://TEN-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

**Chỉ dùng publishable/anon key ở frontend; tuyệt đối không đưa `service_role` hoặc secret key vào đây.**

## 3. Tạo database và chính sách RLS
Vào Supabase Dashboard > SQL Editor > New query. Mở `supabase/schema.sql`, sao chép **toàn bộ** và chạy trong **project mới**. SQL tạo `branches`, `profiles`, `members`, trigger tạo profile, kiểm tra quan hệ, RLS và hai chi họ mẫu. Không chạy lặp file này trên DB đã có bảng.

Vào Authentication > Providers > Email: bật Email. Với môi trường thật, bật **Confirm email** và thiết lập SMTP phù hợp; có thể tắt đăng ký công khai để chỉ mời người dùng (trong trường hợp này form Đăng ký trên web sẽ không sử dụng được).

Trong Authentication > URL Configuration: đặt Site URL và Redirect URLs cho `http://localhost:5173` và tên miền triển khai.

### Bổ sung biệt danh cho thành viên

Với database đã có bảng `public.members`, chạy tệp `supabase/migrations/20261104_add_member_nickname.sql` trong Supabase SQL Editor trước khi dùng phiên bản này. Với database mới, chạy tệp này sau khi tạo bảng `members`. Migration bổ sung cột `nickname` không bắt buộc, giữ nguyên các hồ sơ hiện có.

Trường **Biệt danh** có thể nhập, sửa hoặc xóa trong biểu mẫu thành viên. Biệt danh hiển thị trên sơ đồ, danh sách, hồ sơ chi tiết và bảng quản trị; có thể tìm kiếm và được lưu trong bản xuất JSON.

## 4. Tạo Super Admin đầu tiên
1. Chạy ứng dụng và đăng ký tài khoản email của bạn, xác nhận email nếu được yêu cầu.
2. Vào Supabase > SQL Editor, thay email trong lệnh sau bằng email đã đăng ký:

```sql
update public.profiles
set role = 'super_admin'
where user_id = (select id from auth.users where email = 'admin@example.com');
```

3. Đăng xuất, đăng nhập lại hoặc tải lại trang. Mục **Quản trị** và **Tài khoản** xuất hiện.
4. Trong trang quản trị, tạo thêm chi họ, nhập thành viên, đặt `Hiển thị công khai` cho hồ sơ được phép xuất hiện với khách.
5. Trong **Tài khoản**, gán chi họ cho tài khoản trước khi đổi vai trò thành `branch_admin`.

**Lưu ý:** Cấp quyền Super Admin đầu tiên chỉ thực hiện trong SQL Editor; không tự động cấp qua form đăng ký.

## 5. Chạy thử

```powershell
npm run dev
```

Mở `http://localhost:5173`.

Đường dẫn:
- `/` — cây gia phả và danh sách, tìm kiếm, lọc, xem chi tiết.
- `/login` — đăng nhập/đăng ký.
- `/admin` — bảng quản trị, thêm chi họ và sửa/xóa thành viên.
- `/admin/members/new` — trang riêng nhập thành viên.
- `/admin/members/:id` — chỉnh sửa.
- `/admin/accounts` — Super Admin phân quyền.

## 6. Phân quyền
- `super_admin`: quản lý tất cả chi họ, hồ sơ và vai trò tài khoản.
- `branch_admin`: thêm/sửa/xóa hồ sơ **trong chi được giao**.
- `member`: xem hồ sơ nội bộ sau đăng nhập, không sửa.
- Khách (chưa đăng nhập): chỉ xem hồ sơ có `is_public = true`.

RLS được kiểm tra trong PostgreSQL; kiểm tra giao diện không thay thế RLS. Người dùng mới mặc định có quyền `member`.

## 7. Đưa lên website
Chạy `npm run build`, deploy thư mục `dist` lên Vercel/Netlify hoặc hosting hỗ trợ SPA fallback về `index.html`. Khai báo hai biến `VITE_...` trong cấu hình build của hosting. Đặt URL website trong Supabase Authentication > URL Configuration. Sử dụng HTTPS và bật sao lưu database.

## 8. Lưu ý về tính năng và giới hạn
- Dữ liệu mẫu trong `src/data/mockData.js` chỉ dùng tham khảo; **không tự nhập vào database**. Khi mới kết nối, website trống cho đến khi quản trị viên tạo hồ sơ.
- JSON export chỉ sao lưu **những bản ghi mà tài khoản đang được quyền xem**. Import hàng loạt chưa bật vì cần kiểm tra quan hệ, xung đột ID và phân quyền trên máy chủ.
- `avatar_url` hiện dùng URL ảnh ngoài, chưa có giao diện upload Supabase Storage.
- Quan hệ `spouse_id` là liên kết một chiều, nên cần nhập nhất quán; thiết kế dữ liệu phù hợp gia đình phức tạp hơn cần bảng `relationships` riêng.
- `death_calendar` ghi nhận ngày theo âm/dương lịch nhưng **chưa có thuật toán chuyển đổi âm lịch**; không được coi ngày `death_date` là ngày âm đã quy đổi.
- Trước khi triển khai dữ liệu thật, nên bổ sung nhật ký thay đổi, bảo vệ Super Admin cuối cùng, chính sách quyền riêng tư, xác nhận xóa, kiểm thử RLS bằng nhiều tài khoản và sao lưu định kỳ.

## 9. Nếu trang trắng
Nhấn F12 > Console để đọc lỗi. Kiểm tra `.env`, đã chạy SQL chưa, `npm install` có hoàn tất không, và đường dẫn localhost. Thư viện React Flow sử dụng **named import** (`ReactFlow`, `useReactFlow`) từ `@xyflow/react`.
