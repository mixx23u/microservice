# 🔧 Hướng Dẫn Setup Git và Push Code lên GitHub

## 📋 Quy trình setup lần đầu

### Bước 1: Tạo Repository trên GitHub

1. Truy cập: https://github.com
2. Click nút **New** (hoặc dấu **+** góc phải → **New repository**)
3. Điền thông tin:
   - **Repository name**: `microservice` (hoặc tên bạn muốn)
   - **Description**: "Microservice project with Docker"
   - **Public** hoặc **Private**: Tùy chọn
   - ❌ **KHÔNG** tích "Add a README file" (vì đã có code)
4. Click **Create repository**

### Bước 2: Setup Git Local

Mở terminal trong thư mục project:

```bash
# Kiểm tra Git đã được init chưa
git status

# Nếu chưa có Git, khởi tạo:
git init

# Thêm tất cả files vào staging
git add .

# Commit lần đầu
git commit -m "Initial commit: Microservice project with CI/CD"
```

### Bước 3: Kết nối với GitHub Repository

```bash
# Thay YOUR_USERNAME và YOUR_REPO bằng thông tin thực tế
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Kiểm tra remote đã được thêm
git remote -v
```

### Bước 4: Tạo và Push nhánh develop

```bash
# Tạo nhánh develop từ code hiện tại
git branch -M develop

# Push lên GitHub lần đầu
git push -u origin develop
```

✅ **Xong!** Code đã lên GitHub và CI/CD sẽ chạy!

---

## 🌳 Git Branching Strategy

### Cấu trúc nhánh khuyến nghị:

```
main (production)
  ↑
  └─ develop (testing/staging)
       ↑
       ├─ feature/login
       ├─ feature/payment
       └─ hotfix/bug-123
```

### Chi tiết từng nhánh:

#### 1. **develop** (Nhánh chính để phát triển)
- Code đang develop, chưa stable
- CI/CD tự động chạy khi push
- Deploy lên server test/staging
- Merge từ các nhánh feature

#### 2. **main** (Production)
- Code stable, đã test kỹ
- Deploy lên production (server thật)
- Chỉ merge từ develop khi đã sẵn sàng

#### 3. **feature/*** (Nhánh tính năng)
- Tạo từ develop
- Mỗi tính năng 1 nhánh
- Ví dụ: `feature/user-authentication`, `feature/product-api`

#### 4. **hotfix/*** (Sửa lỗi khẩn cấp)
- Tạo từ main
- Sửa bug production nhanh
- Merge về cả main và develop

---

## 🚀 Quy Trình Làm Việc Hàng Ngày

### Kịch bản 1: Phát triển tính năng mới

```bash
# 1. Đảm bảo develop là mới nhất
git checkout develop
git pull origin develop

# 2. Tạo nhánh feature từ develop
git checkout -b feature/add-payment

# 3. Code tính năng mới
# ... viết code ...

# 4. Commit thường xuyên
git add .
git commit -m "Add payment API endpoint"

# 5. Push nhánh feature lên GitHub
git push -u origin feature/add-payment

# 6. Tạo Pull Request trên GitHub
# GitHub: feature/add-payment → develop

# 7. CI/CD tự động chạy test

# 8. Sau khi review & approve → Merge PR

# 9. Xóa nhánh feature (tùy chọn)
git branch -d feature/add-payment
git push origin --delete feature/add-payment
```

### Kịch bản 2: Sửa bug nhỏ trực tiếp trên develop

```bash
# 1. Checkout develop
git checkout develop
git pull origin develop

# 2. Sửa code
# ... fix bug ...

# 3. Commit và push
git add .
git commit -m "Fix: Auth service connection timeout"
git push origin develop

# 4. CI/CD tự động chạy và deploy
```

### Kịch bản 3: Deploy lên Production

```bash
# Khi develop đã stable và sẵn sàng production

# 1. Tạo PR: develop → main trên GitHub
# 2. Review kỹ lưỡng
# 3. Merge PR
# 4. (Optional) Tạo tag version
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 📝 Các Lệnh Git Thường Dùng

### Kiểm tra trạng thái
```bash
git status                    # Xem files đã thay đổi
git log --oneline            # Xem lịch sử commit
git branch                   # Xem tất cả nhánh local
git branch -a                # Xem cả nhánh remote
```

### Làm việc với nhánh
```bash
git checkout develop         # Chuyển sang nhánh develop
git checkout -b feature/new  # Tạo và chuyển sang nhánh mới
git branch -d feature/old    # Xóa nhánh local
git push origin --delete feature/old  # Xóa nhánh remote
```

### Đồng bộ code
```bash
git pull origin develop      # Kéo code mới từ GitHub
git fetch origin            # Lấy thông tin mới (không merge)
git merge develop           # Merge nhánh develop vào nhánh hiện tại
```

### Hoàn tác thay đổi
```bash
git checkout -- file.js     # Hoàn tác thay đổi 1 file
git reset HEAD~1            # Hoàn tác commit cuối (giữ thay đổi)
git reset --hard HEAD~1     # Hoàn tác commit cuối (XÓA thay đổi)
```

---

## 🔐 Authentication với GitHub

### Cách 1: HTTPS với Personal Access Token (Khuyến nghị)

**Tạo token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token** → **Generate new token (classic)**
3. Chọn scopes: ✅ `repo`, ✅ `workflow`
4. Click **Generate token**
5. **Copy token** (chỉ hiện 1 lần!)

**Sử dụng:**
```bash
# Khi push, nhập:
# Username: your_github_username
# Password: paste_your_token_here

# Lưu token để không phải nhập lại:
git config --global credential.helper store
```

### Cách 2: SSH Key

```bash
# 1. Tạo SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. Copy public key
cat ~/.ssh/id_ed25519.pub

# 3. Thêm vào GitHub
# GitHub → Settings → SSH and GPG keys → New SSH key

# 4. Đổi remote URL sang SSH
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. File .gitignore
Tạo file `.gitignore` để không push files không cần thiết:

```bash
# File: .gitignore
node_modules/
.env
*.log
.DS_Store
*.swp
```

### 2. Environment Variables
**KHÔNG BAO GIỜ** commit passwords, API keys vào Git!

```bash
# ❌ SAI
MYSQL_PASSWORD=root123  # Trong docker-compose.yml

# ✅ ĐÚNG
MYSQL_PASSWORD=${DB_PASSWORD}  # Dùng biến môi trường
```

### 3. Pull Before Push
Luôn pull code mới trước khi push:
```bash
git pull origin develop
git push origin develop
```

### 4. Commit Messages rõ ràng
```bash
# ❌ SAI
git commit -m "fix"
git commit -m "update"

# ✅ ĐÚNG
git commit -m "Fix: Auth service MySQL connection timeout"
git commit -m "Add: Product filtering by category"
git commit -m "Update: Docker compose memory limits"
```

---

## 🎯 Setup Hoàn Chỉnh Cho Project

### Tạo cấu trúc nhánh đầy đủ:

```bash
# 1. Init và commit code hiện tại
git init
git add .
git commit -m "Initial commit"

# 2. Tạo nhánh develop từ code hiện tại
git branch -M develop

# 3. Kết nối GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 4. Push develop lên GitHub
git push -u origin develop

# 5. Tạo nhánh main từ develop (cho production sau này)
git checkout -b main
git push -u origin main

# 6. Quay về develop để làm việc
git checkout develop
```

### Bảo vệ nhánh main (Production):

1. GitHub → Settings → Branches
2. Click **Add branch protection rule**
3. Branch name: `main`
4. Tích:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Require status checks to pass

→ Không ai push trực tiếp vào main được!

---

## 🆘 Troubleshooting

### Lỗi: "Permission denied (publickey)"
```bash
# Kiểm tra SSH key
ssh -T git@github.com

# Nếu lỗi, dùng HTTPS thay SSH
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### Lỗi: "fatal: not a git repository"
```bash
# Khởi tạo Git
git init
```

### Lỗi: "Your branch is behind 'origin/develop'"
```bash
# Pull code mới về
git pull origin develop
```

### Lỗi: "merge conflict"
```bash
# Xem files conflict
git status

# Sửa từng file conflict
# Sau đó:
git add .
git commit -m "Resolve merge conflict"
```

---

## 📚 Tài Liệu Tham Khảo

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- Git Flow: https://nvie.com/posts/a-successful-git-branching-model/

---

**Câu hỏi?** Hỏi trực tiếp hoặc tham khảo các tài liệu trên! 🚀
