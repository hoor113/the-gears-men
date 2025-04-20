# Library Management System  

Hệ thống quản lý thư viện giúp đơn giản hóa việc quản lý sách, độc giả, và các giao dịch mượn/trả sách.  

## Mục lục  
1. [Giới thiệu](#giới-thiệu)  
2. [Tính năng chính](#tính-năng-chính)  
3. [Cấu trúc dự án](#cấu-trúc-dự-án)  
4. [Cài đặt](#cài-đặt)  
5. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)  
6. [Tài liệu tham khảo](#tài-liệu-tham-khảo)  

---

## Giới thiệu  
Dự án **Library Management System** được phát triển nhằm hỗ trợ quản lý sách và độc giả hiệu quả hơn thông qua giao diện hiện đại và hệ thống backend mạnh mẽ.  

Frontend được xây dựng bằng **ReactJS**.  
Backend được phát triển với **Java Spring Boot**.  
Cơ sở dữ liệu sử dụng **PostgreSQL** để lưu trữ thông tin.  

---

## Tính năng chính  
- Quản lý sách (thêm, sửa, xóa, tìm kiếm sách).  
- Quản lý độc giả và thông tin cá nhân.  
- Theo dõi lịch sử mượn/trả sách.  
- Thống kê sách đang mượn, sách quá hạn.  
- Quản lý tài khoản (Admin/Staff/User).  

---

## Cấu trúc dự án  
Dự án được chia thành hai phần chính:  
1. **Frontend**  
   - Repository: [Library Management Frontend](https://github.com/hnguyen04/library-management-frontend)  
   - Công nghệ: ReactJS  

2. **Backend**  
   - Repository: [Library Management Backend](https://github.com/hnguyen04/library-management-backend)  
   - Công nghệ: Java Spring Boot  
   - Cơ sở dữ liệu: PostgreSQL  

---

## Cài đặt  
### Yêu cầu hệ thống:  
- **Node.js** (v18 trở lên)  
- **Java JDK** (17 trở lên)  
- **PostgreSQL** (15 trở lên)  

### Cài đặt Frontend:  
1. Clone repository:
   ```bash
   git clone https://github.com/hnguyen04/library-management-frontend.git
   cd library-management-frontend

2. Cài đặt các gói phụ thuộc:
   ```bash
   yarn install
   ```
3. Tạo file `.env.local` và thêm đường dẫn backend (ví dụ):
   ```bash
   VITE_API_ENDPOINT=http://localhost:8080"
   ```
4. Chạy ứng dụng:
   ```bash
   yarn run dev
   ```
Ứng dụng sẽ chạy tại: http://localhost:5173/

   ```bash
   yarn install
3. Chạy ứng dụng:
   ```bash
   yarn run dev
Ứng dụng sẽ chạy tại: http://localhost:5173/

### Cài đặt Backend:
1. Clone repository:
   ```bash
   git clone https://github.com/hnguyen04/library-management-backend.git
   cd library-management-backend
2. Chạy ứng dụng (recommend chạy trên IntelliJ IDEA)
  - Mở IntelliJ, chọn File > Open.
  - Dẫn đến thư mục dự án library-management-backend và mở.
  - Trong IntelliJ, tìm file LibraryBackendManagementApplication.java trong thư mục src/main/java.
  - Nhấn chuột phải và chọn Run 'LibraryBackendManagementApplication'.
  - Backend sẽ chạy tại: http://localhost:8080.

## Hướng dẫn sử dụng  
1. Mở trình duyệt và truy cập [http://localhost:5173](http://localhost:5173).  
2. Đăng nhập bằng tài khoản mẫu:  
   - **Admin:**  
     - **Username:** `admin`  
     - **Password:** `admin`  
3. Sử dụng các chức năng chính của hệ thống:  
   - **Quản lý sách:** Thêm, chỉnh sửa, xóa sách.
   - **Theo dõi độc giả:** Xem danh sách độc giả và lịch sử mượn sách.  
   - **Quản lý tài khoản:** Tạo và quản lý tài khoản nhân viên.
  
## Tài liệu tham khảo  
- [ReactJS Documentation](https://reactjs.org/docs/getting-started.html)  
- [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)  
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)  
