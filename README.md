# Ứng Dụng Tập Thể Hình & Dinh Dưỡng Thông Minh (Fitness AI)

Ứng dụng di động luyện tập thể hình và theo dõi dinh dưỡng cá nhân hóa, được xây dựng bằng **React Native (Expo SDK 57)** và **TypeScript**, bám sát 100% bộ thiết kế 18 màn hình từ file mockup PDF (`Ứng dụng tập thể hình - Mockup.pdf`).

---

## 📱 Danh Sách 18 Màn Hình Chuẩn Mockup PDF

Toàn bộ 18 màn hình trong tài liệu thiết kế đều được hiện thực hóa đầy đủ:

| Trang PDF | Màn hình | Tên màn hình / Chức năng | Đường dẫn file (Expo Router) |
|:---:|:---|:---|:---|
| **Page 1** | Màn hình chính | Trang chủ bài tập: Buổi tập gợi ý (Chân & Core), Calo đã nạp, Bài đã tập, Danh sách bài trong buổi | [`app/(tabs)/workout.tsx`](file:///d:/Didong2_lab/app/(tabs)/workout.tsx) |
| **Page 2** | Video bài tập | Trình phát video chuyên nghiệp (`expo-video`), chuyển đổi 2D/3D giữ nguyên thời gian, PiP, tốc độ 0.5x/0.75x/1x, vòng lặp | [`app/exercise/[id]/video.tsx`](file:///d:/Didong2_lab/app/exercise/[id]/video.tsx) |
| **Page 3** | Tập cùng Camera | Màn hình chia đôi: Nửa trên video mẫu (0.75x), nửa dưới camera trước + khung xương neon AI, đo góc khớp gối, cảnh báo tư thế, đếm rep | [`app/exercise/[id]/camera-workout.tsx`](file:///d:/Didong2_lab/app/exercise/[id]/camera-workout.tsx) |
| **Page 4** | Quét món ăn | Camera chụp/chọn ảnh món ăn (`expo-image-picker`), AI nhận diện món, bảng dinh dưỡng (Calo, Đạm, Tinh bột, Béo), chỉnh khẩu phần (±50g) | [`app/nutrition/scan.tsx`](file:///d:/Didong2_lab/app/nutrition/scan.tsx) |
| **Page 5** | Đăng nhập | Đăng nhập email/mật khẩu, ghi nhớ phiên, mô phỏng Google Sign-In, chuyển tiếp Onboarding | [`app/(auth)/login.tsx`](file:///d:/Didong2_lab/app/(auth)/login.tsx) |
| **Page 6** | Đăng ký | Đăng ký tài khoản mới: Họ tên, email, mật khẩu, nhập lại mật khẩu, đồng ý điều khoản dịch vụ | [`app/(auth)/register.tsx`](file:///d:/Didong2_lab/app/(auth)/register.tsx) |
| **Page 7** | Onboarding 1 | Thông tin thể chất: Giới tính (Nam/Nữ/Khác), Tuổi, Chiều cao, Cân nặng, tính tự động BMI & phân loại Việt hóa | [`app/(onboarding)/step1-profile.tsx`](file:///d:/Didong2_lab/app/(onboarding)/step1-profile.tsx) |
| **Page 8** | Onboarding 2 | Mục tiêu tập luyện: Giảm mỡ, Tăng cơ, Giữ dáng, Tăng sức bền & Cân nặng mong muốn | [`app/(onboarding)/step2-goal.tsx`](file:///d:/Didong2_lab/app/(onboarding)/step2-goal.tsx) |
| **Page 9** | Onboarding 3 | Lịch & thiết bị: Trình độ (Mới bắt đầu/Trung bình/Nâng cao), Số buổi/tuần (2-6), Thời lượng (30/45/60p), Dụng cụ | [`app/(onboarding)/step3-schedule.tsx`](file:///d:/Didong2_lab/app/(onboarding)/step3-schedule.tsx) |
| **Page 10** | Onboarding 4 | Lộ trình 8 tuần AI đề xuất: Lịch phân bổ chi tiết các ngày trong tuần, ghi chú lưu ý y tế, tạo lại lộ trình | [`app/(onboarding)/step4-ai-plan.tsx`](file:///d:/Didong2_lab/app/(onboarding)/step4-ai-plan.tsx) |
| **Page 11** | Thư viện bài tập | Danh mục bài tập phân nhóm cơ (Tất cả, Ngực, Lưng, Chân, Core), thanh tìm kiếm nhanh, nhãn 2D/3D & độ khó | [`app/exercise-library.tsx`](file:///d:/Didong2_lab/app/exercise-library.tsx) |
| **Page 12** | Chi tiết buổi tập | Danh sách chi tiết các bài tập trong buổi, số hiệp x số lần/thời gian, thời gian nghỉ ngơi, khởi động | [`app/workout/[id].tsx`](file:///d:/Didong2_lab/app/workout/[id].tsx) |
| **Page 13** | Tổng kết buổi tập | Bảng thống kê hoàn thành: Thời gian tập, Calo tiêu hao, Tổng số lần, Điểm tư thế tổng & chi tiết từng bài, chia sẻ mạng xã hội | [`app/workout/summary.tsx`](file:///d:/Didong2_lab/app/workout/summary.tsx) |
| **Page 14** | Nhật ký dinh dưỡng | Tiến độ calo trong ngày (`1.240 / 2.000 kcal`), 3 thanh macro Đạm/Tinh bột/Béo, 4 bữa ăn (Sáng, Trưa, Tối, Phụ), nút quét món ăn | [`app/(tabs)/nutrition.tsx`](file:///d:/Didong2_lab/app/(tabs)/nutrition.tsx) |
| **Page 15** | Tiến độ | Biểu đồ cân nặng theo thời gian (Tuần, Tháng, 3 tháng), mức giảm cân, tổng số buổi tập, chuỗi ngày streak, lịch sử buổi tập gần đây | [`app/(tabs)/progress.tsx`](file:///d:/Didong2_lab/app/(tabs)/progress.tsx) |
| **Page 16** | Hồ sơ | Thông tin cá nhân, mục tiêu và tuần tập hiện tại, 3 thẻ chỉ số (Chiều cao, Cân nặng, BMI), các liên kết quản trị, đăng xuất | [`app/(tabs)/profile.tsx`](file:///d:/Didong2_lab/app/(tabs)/profile.tsx) |
| **Page 17** | Cài đặt | Cài đặt nhắc nhở tập luyện, giờ nhắc, nhắc ghi bữa ăn, đơn vị đo lường (kg, cm), ngôn ngữ, giao diện tối, đổi mật khẩu, xóa tài khoản | [`app/profile/settings.tsx`](file:///d:/Didong2_lab/app/profile/settings.tsx) |
| **Page 18** | Sửa thông tin | Chỉnh sửa họ tên, email, tuổi, chiều cao, cân nặng, mục tiêu; tự động đồng bộ lại chỉ số BMI vào hồ sơ | [`app/profile/edit.tsx`](file:///d:/Didong2_lab/app/profile/edit.tsx) |

---

## 🛠️ Công Nghệ & Kiến Trúc

- **Framework**: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) với [Expo Router](https://docs.expo.dev/router/introduction/) (điều hướng file-based).
- **Ngôn ngữ**: TypeScript 100% với kiểm tra kiểu dữ liệu nghiêm ngặt (`npx tsc --noEmit` đạt 0 lỗi).
- **Thư viện Video trọng tâm**: `expo-video` với `useVideoPlayer` và `VideoView`:
  - Điều khiển giao diện tùy biến (custom controls overlay).
  - Nút chuyển đổi giữa video 2D và mô hình góc nhìn 3D giữ nguyên chính xác vị trí thời gian `currentTime`.
  - Hỗ trợ Picture-in-Picture (PiP).
  - Tùy chỉnh tốc độ phát: 0.5x, 0.75x, 1x.
  - Chế độ lặp lại (loop) và hiển thị trạng thái đệm/lỗi.
- **Thư viện Camera & Ảnh**:
  - `expo-camera` (`CameraView`) quản lý quyền truy cập và hiển thị luồng camera trước ở chế độ chia đôi màn hình.
  - `expo-image-picker` cho phép chụp ảnh thực tế hoặc chọn ảnh món ăn từ thư viện máy.
- **Lưu trữ cục bộ**: `@react-native-async-storage/async-storage` bao bọc qua service chuẩn hóa, lưu trữ toàn bộ hồ sơ, dữ liệu dinh dưỡng, lịch sử buổi tập và cài đặt người dùng.
- **Thiết kế & Giao diện (Theme)**:
  - Màu nền: `#0F1412` (Đen xanh than tối chuyên nghiệp).
  - Bề mặt thẻ (Surface): `#1A211E`.
  - Viền phân cách (Border): `#3A4640`.
  - Màu chữ chính (Primary Text): `#F2F5F0`.
  - Màu chữ phụ (Secondary Text): `#A3AEA8`.
  - Màu nhấn chính (Accent / Lime): `#C6F432` (Chữ trên nền nhấn dùng `#0F1412`).
  - Màu chỉ số tốt (Success): `#7BE0A4`.
  - Màu cảnh báo (Warning): `#FFB454`.
  - Phông chữ: **Be Vietnam Pro** (Regular 400, SemiBold 600, Bold 700) nạp qua `@expo-google-fonts/be-vietnam-pro`.
  - Bo góc chuẩn: Thẻ 16px, nút 26px (chiều cao 52px, đảm bảo vùng chạm an toàn ≥ 44px), chip chọn 20px.

---

## 🤖 Mô Tả Các Tính Năng AI Giả Lập (Simulated AI)

1. **AI 8-Week Personalized Workout Generator (`aiPlanService`)**:
   - Sử dụng rule engine phân tích các thông số thể chất (tuổi, giới tính, BMI), mục tiêu (giảm mỡ, tăng cơ, giữ dáng, sức bền) và thiết bị hiện có để phân bổ lịch tập 8 tuần khoa học, cân đối giữa ngày tập (Chân & Core, Thân trên, Toàn thân, Cardio) và ngày nghỉ phục hồi.
2. **AI Realtime Pose Skeleton & Angle Analyzer (`poseAnalyzer`)**:
   - Mô phỏng hệ thống thị giác máy tính nhận diện các điểm mốc cơ thể (khung xương neon xanh chanh nổi bật trên luồng camera trước).
   - Đo góc gập gối (ví dụ: `92°` trong bài Squat).
   - Phát hiện lỗi sai tư thế tức thì và hiển thị thẻ cảnh báo (ví dụ: `LƯNG HƠI CONG`), kèm chỉ dẫn khắc phục nhanh (`Mở ngực, nhìn thẳng phía trước`) và đếm số rep chuẩn xác.
3. **AI Food Recognition & Nutrition Estimator (`foodRecognitionService`)**:
   - Phân tích ảnh chụp món ăn, nhận dạng tên món (ví dụ: `Phở bò`), ước tính tổng calo (`≈ 450 kcal`) và cấu trúc Macro (Đạm 28g, Tinh bột 52g, Béo 12g).
   - Đi kèm bộ đệm tinh chỉnh khẩu phần thời gian thực (tăng/giảm ±50g) tự động tính toán lại giá trị calo và các chất dinh dưỡng tương ứng.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

> ⚠️ **LƯU Ý QUAN TRỌNG VỀ MÔI TRƯỜNG CHẠY**:
> Các module native hiện đại gồm `expo-video` và `expo-camera` yêu cầu mã nguồn native nên **không thể chạy trên ứng dụng Expo Go tiêu chuẩn**. Bạn cần chạy bằng **Development Build** (Android/iOS) hoặc chạy trên nền tảng **Web**.

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Chạy trên Development Build (Khuyến nghị cho thiết bị di động thật / giả lập)
Trước khi chạy lần đầu, hãy tạo mã nguồn native:
```bash
# Tạo thư mục android/ios nếu chưa có
npx expo prebuild

# Chạy trên máy ảo hoặc thiết bị Android thật đã bật USB Debugging:
npx expo run:android

# Chạy trên máy ảo iOS Simulator (chỉ dành cho macOS):
npx expo run:ios
```

### 3. Chạy trên trình duyệt Web (Xem nhanh giao diện)
```bash
npx expo start --web
```

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
├── app/                           # Điều hướng Expo Router (18 màn hình)
│   ├── (auth)/                    # Màn hình Đăng nhập, Đăng ký
│   │   ├── login.tsx              # [Page 5] Đăng nhập
│   │   └── register.tsx           # [Page 6] Đăng ký
│   ├── (onboarding)/              # Luồng thiết lập hồ sơ ban đầu
│   │   ├── step1-profile.tsx      # [Page 7] Thông tin cơ thể & BMI
│   │   ├── step2-goal.tsx         # [Page 8] Mục tiêu tập luyện
│   │   ├── step3-schedule.tsx     # [Page 9] Lịch & thiết bị
│   │   └── step4-ai-plan.tsx      # [Page 10] Lộ trình 8 tuần AI
│   ├── (tabs)/                    # Thanh điều hướng chính (Bottom Tab Bar)
│   │   ├── _layout.tsx            # Cấu hình thanh tab tùy chỉnh
│   │   ├── workout.tsx            # [Page 1] Trang chủ - Buổi tập hôm nay
│   │   ├── nutrition.tsx          # [Page 14] Nhật ký dinh dưỡng & macro
│   │   ├── progress.tsx           # [Page 15] Tiến độ cân nặng & lịch sử
│   │   └── profile.tsx            # [Page 16] Trang cá nhân
│   ├── exercise-library.tsx       # [Page 11] Thư viện bài tập & lọc nhóm cơ
│   ├── workout/
│   │   ├── [id].tsx               # [Page 12] Chi tiết buổi tập
│   │   └── summary.tsx            # [Page 13] Tổng kết kết quả buổi tập
│   ├── exercise/
│   │   └── [id]/
│   │       ├── video.tsx          # [Page 2] Trình phát video bài tập 2D/3D (expo-video)
│   │       └── camera-workout.tsx # [Page 3] Tập chia đôi camera & khung xương AI
│   ├── nutrition/
│   │   └── scan.tsx               # [Page 4] Quét món ăn qua camera / chọn ảnh
│   ├── profile/
│   │   ├── edit.tsx               # [Page 18] Sửa thông tin cá nhân
│   │   └── settings.tsx           # [Page 17] Cài đặt ứng dụng
│   ├── _layout.tsx                # Layout gốc nạp font Be Vietnam Pro
│   └── index.tsx                  # Điều phối luồng khởi động (Auth guard)
├── components/                    # Thư viện UI Component dùng lại theo Design System
│   ├── Button.tsx                 # Nút bấm chuẩn 52px (primary, secondary, ghost, danger)
│   ├── Card.tsx                   # Thẻ bề mặt 16px radius (default, hero, selectable)
│   ├── Chip.tsx                   # Thẻ tag chọn nhanh (nhóm cơ, tốc độ, dụng cụ)
│   ├── TextField.tsx              # Ô nhập dữ liệu kèm nhãn & thông báo lỗi
│   ├── StepProgress.tsx           # Thanh tiến trình các bước Onboarding
│   ├── ExerciseRow.tsx            # Hàng hiển thị bài tập kèm nhãn Video 2D/3D
│   ├── StatTile.tsx               # Thẻ số liệu đo lường calo, bài tập, cân nặng
│   ├── TabBar.tsx                 # Thanh tab dưới đáy tùy biến theo nhận diện PDF
│   ├── Header.tsx                 # Tiêu đề trang kèm nút quay lại
│   └── index.ts
├── constants/
│   └── strings.ts                 # Toàn bộ chuỗi ngôn ngữ Tiếng Việt tập trung
├── mocks/
│   └── mockData.ts                # Dữ liệu mẫu bài tập 2D/3D, thực đơn, kế hoạch AI
├── services/                      # Tầng logic nghiệp vụ tách biệt qua TypeScript Interfaces
│   ├── interfaces.ts              # Định nghĩa contracts cho các service
│   ├── authService.ts             # Quản lý xác thực & phiên đăng nhập
│   ├── profileService.ts          # Quản lý thông tin thể chất & cập nhật hồ sơ
│   ├── workoutService.ts          # Quản lý buổi tập, danh mục bài tập, lưu log
│   ├── nutritionService.ts        # Quản lý nhật ký ăn uống & calo
│   ├── aiPlanService.ts           # Sinh kế hoạch 8 tuần theo thuật toán AI
│   ├── poseAnalyzer.ts            # Phân tích khung xương và góc khớp thời gian thực
│   ├── foodRecognitionService.ts  # Nhận diện món ăn và tính toán khẩu phần
│   ├── storage.ts                 # Wrapper AsyncStorage an toàn
│   └── index.ts
├── theme/                         # Hệ thống biến thiết kế (Tokens)
│   ├── colors.ts                  # Bảng màu chuẩn thiết kế PDF
│   ├── typography.ts              # Cấu hình phông Be Vietnam Pro
│   ├── spacing.ts                 # Khoảng cách & bo góc (radii)
│   └── index.ts
└── types/                         # Toàn bộ kiểu dữ liệu TypeScript (User, Workout, Nutrition,...)
```

---

## 🧪 Kiểm Thử & Đảm Bảo Chất Lượng

Dự án tuân thủ nghiêm ngặt chuẩn code TypeScript:
```bash
# Kiểm tra toàn bộ mã nguồn không phát sinh lỗi types
npx tsc --noEmit
```
Kết quả kiểm tra: **0 errors**.
