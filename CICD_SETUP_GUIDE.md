# 🚀 Hướng Dẫn Setup CI/CD với GitHub Actions

## 📋 Mục Lục
1. [Workflow đã tạo làm gì?](#workflow-đã-tạo-làm-gì)
2. [Các bước setup](#các-bước-setup)
3. [Cấu hình Secrets trên GitHub](#cấu-hình-secrets-trên-github)
4. [Cập nhật docker-compose.yml](#cập-nhật-docker-composeyml)
5. [Test CI/CD](#test-cicd)
6. [Troubleshooting](#troubleshooting)

---

## ✨ Workflow đã tạo làm gì?

File `.github/workflows/deploy.yml` sẽ tự động:

### Job 1: Build and Test (Chạy mọi lúc có push/PR)
- ✅ Tải code từ GitHub về
- ✅ Build các Docker images để kiểm tra
- ✅ Validate file docker-compose.yml

### Job 2: Deploy (Chỉ chạy khi push lên nhánh main)
- 🐳 Build Docker images cho 3 services
- ☁️ Push images lên Docker Hub
- 🚀 SSH vào server và deploy tự động

---

## 📝 Các Bước Setup

### Bước 1: Tạo tài khoản Docker Hub (Nếu chưa có)

1. Truy cập: https://hub.docker.com/
2. Đăng ký tài khoản miễn phí
3. Ghi nhớ **username** và **password**

### Bước 2: Cấu hình Secrets trên GitHub

Secrets là nơi lưu thông tin bảo mật (password, SSH keys...)

#### 2.1. Vào Repository Settings
1. Mở repository trên GitHub
2. Click **Settings** (ở thanh menu trên)
3. Trong sidebar bên trái, click **Secrets and variables** → **Actions**
4. Click nút **New repository secret**

#### 2.2. Thêm các Secrets sau:

##### Secret 1: `DOCKER_USERNAME`
- **Name**: `DOCKER_USERNAME`
- **Value**: Username Docker Hub của bạn
- Click **Add secret**

##### Secret 2: `DOCKER_PASSWORD`
- **Name**: `DOCKER_PASSWORD`
- **Value**: Password Docker Hub của bạn
- Click **Add secret**

##### Secret 3: `SERVER_HOST`
- **Name**: `SERVER_HOST`
- **Value**: IP hoặc domain của server (VD: `123.45.67.89` hoặc `qhungdtdm.click.io.vn`)
- Click **Add secret**

##### Secret 4: `SERVER_USER`
- **Name**: `SERVER_USER`
- **Value**: Username SSH của server (thường là `ubuntu`, `root`, hoặc `lvmhieu1`)
- Click **Add secret**

##### Secret 5: `SSH_PRIVATE_KEY`
- **Name**: `SSH_PRIVATE_KEY`
- **Value**: SSH private key để login vào server

**Cách lấy SSH Private Key:**

Trên máy tính của bạn (hoặc server), chạy lệnh:
```bash
cat ~/.ssh/id_rsa
```

Copy toàn bộ nội dung (từ `-----BEGIN ... KEY-----` đến `-----END ... KEY-----`)

Nếu chưa có SSH key, tạo mới:
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Sau đó copy public key lên server:
```bash
ssh-copy-id username@server-ip
```

### Bước 3: Cập nhật docker-compose.yml

Sửa file `docker-compose.yml` để dùng images từ Docker Hub thay vì build local:

```yaml
services:
  auth-service:
    image: YOUR_DOCKER_USERNAME/auth-service:latest
    # build: ./auth_service  # Comment dòng này
    container_name: auth-service
    ports:
      - "3001:3001"
    depends_on:
      - auth-db
    restart: unless-stopped

  product-service:
    image: YOUR_DOCKER_USERNAME/product-service:latest
    # build: ./product_service  # Comment dòng này
    container_name: product-service
    ports:
      - "3002:3002"
    depends_on:
      - product-db
    restart: unless-stopped

  order-service:
    image: YOUR_DOCKER_USERNAME/order-service:latest
    # build: ./order_service  # Comment dòng này
    container_name: order-service
    ports:
      - "3003:3003"
    depends_on:
      - order-db
    restart: unless-stopped
```

**Thay `YOUR_DOCKER_USERNAME`** bằng username Docker Hub của bạn!

### Bước 4: Push code lên GitHub

```bash
git add .
git commit -m "Add CI/CD with GitHub Actions"
git push origin main
```

---

## 🎯 Test CI/CD

### Xem Workflow chạy:
1. Vào repository trên GitHub
2. Click tab **Actions**
3. Bạn sẽ thấy workflow đang chạy

### Kết quả mong đợi:
- ✅ Build and Test: Thành công (màu xanh)
- ✅ Deploy: Thành công (màu xanh)

### Nếu có lỗi:
- ❌ Click vào workflow bị lỗi
- 📋 Xem log để biết lỗi ở đâu
- 🔧 Sửa và push lại

---

## 🛠️ Troubleshooting

### Lỗi: "Invalid username or password" (Docker Hub)
- Kiểm tra `DOCKER_USERNAME` và `DOCKER_PASSWORD` trong Secrets
- Thử login thủ công: `docker login`

### Lỗi: "Permission denied" (SSH)
- Kiểm tra `SSH_PRIVATE_KEY` đã copy đúng chưa
- Kiểm tra public key đã được thêm vào server: `~/.ssh/authorized_keys`
- Thử SSH thủ công: `ssh username@server-ip`

### Lỗi: "docker compose command not found"
- Server cần cài Docker và Docker Compose
- Cài Docker Compose trên server:
```bash
sudo apt update
sudo apt install docker-compose-plugin -y
```

### Workflow không chạy
- Kiểm tra file nằm đúng thư mục: `.github/workflows/deploy.yml`
- Kiểm tra branch hiện tại là `main` (không phải `master`)
- Commit và push lại

---

## 🎓 Giải Thích Workflow

### Khi nào workflow chạy?
```yaml
on:
  push:
    branches:
      - main  # Chạy khi push code lên main
  pull_request:
    branches:
      - main  # Chạy khi tạo pull request
```

### Job Build and Test
- Chạy trên máy ảo Ubuntu của GitHub
- Build các Docker images để đảm bảo code không lỗi
- Không push lên Docker Hub, chỉ test

### Job Deploy
- Chỉ chạy khi push lên `main` (không chạy với PR)
- Build images và push lên Docker Hub
- SSH vào server và pull images mới
- Restart các containers

---

## 💡 Tips

### 1. Chỉ deploy khi cần
Nếu không muốn deploy tự động, comment phần deploy trong workflow:

```yaml
# deploy:
#   name: Deploy to Server
#   ...
```

### 2. Deploy nhiều môi trường
Tạo nhiều workflows cho dev, staging, production:
- `.github/workflows/deploy-dev.yml`
- `.github/workflows/deploy-prod.yml`

### 3. Thêm tests
Thêm lệnh test vào workflow:
```yaml
- name: Run tests
  run: |
    cd auth_service
    npm test
```

### 4. Notifications
Thêm Slack/Discord notification khi deploy xong:
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: Deploy completed!
```

---

## 📚 Tài Liệu Tham Khảo

- GitHub Actions: https://docs.github.com/en/actions
- Docker Hub: https://docs.docker.com/docker-hub/
- SSH Key Setup: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

**Có vấn đề?** Mở issue hoặc hỏi trực tiếp! 🚀
