# Helpdesk IT System

Sistem Helpdesk IT merupakan aplikasi berbasis web yang dirancang untuk mengelola dan memantau tiket permasalahan teknologi informasi dalam sebuah organisasi. Sistem ini dibangun menggunakan arsitektur client–server dengan pemisahan frontend dan backend yang jelas.

## Teknologi Utama

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express  
- **Autentikasi & Otorisasi:** Keycloak (Identity Provider)  
- **Database:** MySQL  
- **UI Framework:** Tailwind CSS  
- **Containerization:** Docker & Docker Compose

---

## Persyaratan Sistem

Sebelum memulai, pastikan sistem Anda memiliki:

- **Docker** versi 20.10 atau lebih baru
- **Docker Compose** versi 2.0 atau lebih baru
- **Keycloak Server** versi 26.x (berjalan di port 8080)
- RAM minimal 4GB
- Port yang tersedia: 3306 (MySQL), 4000 (Backend), 5173 (Frontend), 8080 (Keycloak)

---

## Arsitektur Sistem

```
┌─────────────────┐
│   Keycloak      │ (Port 8080)
│   (External)    │
└────────┬────────┘
         │
         │ Authentication
         │
┌────────▼────────────────────────────────┐
│           Docker Network                 │
│                                          │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │   Frontend   │  │     Backend     │ │
│  │  (Vite Dev)  │◄─┤   (Node.js)     │ │
│  │  Port: 5173  │  │   Port: 4000    │ │
│  └──────────────┘  └────────┬────────┘ │
│                              │          │
│                     ┌────────▼────────┐ │
│                     │   MySQL DB      │ │
│                     │   Port: 3306    │ │
│                     └─────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Setup dan Instalasi

### 1. Setup Keycloak Server

Keycloak tidak disertakan dalam Docker Compose karena digunakan sebagai service eksternal.

#### Cara Menjalankan Keycloak:

**Menggunakan Docker (Standalone):**
```bash
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.2.1 \
  start-dev
```

**Atau menggunakan Docker Compose terpisah:**
```yaml
# keycloak-compose.yml
version: '3.9'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.2.1
    container_name: keycloak
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev
    restart: unless-stopped
```

Jalankan dengan:
```bash
docker-compose -f keycloak-compose.yml up -d
```

#### Konfigurasi Keycloak:

1. **Akses Keycloak Admin Console:**
   - URL: http://localhost:8080
   - Username: `admin`
   - Password: `admin`

2. **Buat Realm Baru:**
   - Klik dropdown di pojok kiri atas → Create realm
   - Name: `helpdesk-realm`
   - Klik **Create**

3. **Buat Client:**
   - Masuk ke realm `helpdesk-realm`
   - Menu: Clients → Create client
   - **General Settings:**
     - Client ID: `helpdesk-frontend`
     - Client type: `OpenID Connect`
     - Klik **Next**
   
   - **Capability config:**
     - Client authentication: `OFF`
     - Authorization: `OFF`
     - Authentication flow: Centang `Standard flow` dan `Direct access grants`
     - Klik **Next**
   
   - **Login settings:**
     - Valid redirect URIs: `http://localhost:5173/*`
     - Valid post logout redirect URIs: `http://localhost:5173/*`
     - Web origins: `http://localhost:5173`
     - Klik **Save**

4. **Buat Roles:**
   - Menu: Realm roles → Create role
   - Buat 3 role berikut:
     - `user` (untuk pengguna umum)
     - `admin` (untuk administrator)
     - `manager` (untuk manajer)

5. **Buat Test Users:**
   - Menu: Users → Add user
   
   **User 1 (Role: user):**
   - Username: `testuser`
   - Email: `testuser@helpdesk.com`
   - Email verified: ON
   - Klik **Create**
   - Tab **Credentials** → Set password → Password: `password123`
   - Tab **Role mapping** → Assign role → Pilih `user`
   
   **User 2 (Role: admin):**
   - Username: `testadmin`
   - Email: `testadmin@helpdesk.com`
   - Password: `password123`
   - Role: `admin`
   
   **User 3 (Role: manager):**
   - Username: `testmanager`
   - Email: `testmanager@helpdesk.com`
   - Password: `password123`
   - Role: `manager`

---

### 2. Konfigurasi Environment Variables

#### File `.env` (Root Directory)

File ini sudah ada dan berisi konfigurasi untuk Docker Compose:

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=helpdesk_db
MYSQL_USER=helpdesk
MYSQL_PASSWORD=helpdesk123

BACKEND_PORT=4000

# Keycloak configuration (untuk backend)
KEYCLOAK_ISSUER=http://localhost:8080/realms/helpdesk-realm
KEYCLOAK_AUDIENCE=account
KEYCLOAK_JWKS_URI=http://host.docker.internal:8080/realms/helpdesk-realm/protocol/openid-connect/certs
```

#### File `backend/.env`

File ini untuk development lokal (tanpa Docker):

```env
PORT=4000

KEYCLOAK_ISSUER=http://localhost:8080/realms/helpdesk-realm
KEYCLOAK_AUDIENCE=account
KEYCLOAK_JWKS_URI=http://localhost:8080/realms/helpdesk-realm/protocol/openid-connect/certs

DB_HOST=localhost
DB_PORT=3306
DB_NAME=helpdesk_db
DB_USERNAME=helpdesk
DB_PASSWORD=helpdesk123
```

#### File `frontend/.env`

File ini sudah dikonfigurasi:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=helpdesk-realm
VITE_KEYCLOAK_CLIENT_ID=helpdesk-frontend

VITE_API_BASE=http://localhost:4000
```

---

### 3. Menjalankan Aplikasi dengan Docker

#### Build dan Start Services

```bash
# Pastikan Anda berada di root directory project
cd d:\Admin Server\helpdesk_IT

# Build dan jalankan semua services
docker-compose up -d

# Atau untuk melihat logs real-time
docker-compose up
```

#### Verifikasi Services

Periksa status semua container:
```bash
docker-compose ps
```

Output yang diharapkan:
```
NAME                  IMAGE              STATUS         PORTS
helpdesk-backend      node:20-alpine     Up            0.0.0.0:4000->4000/tcp
helpdesk-frontend     node:20-alpine     Up            0.0.0.0:5173->5173/tcp
helpdesk-mysql        mysql:8.0          Up (healthy)  0.0.0.0:3306->3306/tcp
```

#### Melihat Logs

```bash
# Semua services
docker-compose logs -f

# Service tertentu
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

---

### 4. Mengakses Aplikasi

Setelah semua services berjalan:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **Keycloak:** http://localhost:8080
- **MySQL:** localhost:3306 (gunakan MySQL client)

#### Test Endpoints

**Health Check:**
```bash
curl http://localhost:4000/api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Backend Helpdesk IT running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 5. Login ke Aplikasi

1. Buka browser: http://localhost:5173
2. Klik tombol **"Login untuk Melanjutkan"**
3. Anda akan diarahkan ke halaman login Keycloak
4. Login menggunakan salah satu test user:
   - **User:** `testuser` / `password123` → Akses: TicketsPage
   - **Admin:** `testadmin` / `password123` → Akses: AdminPage
   - **Manager:** `testmanager` / `password123` → Akses: ManagerPage

---

## Perintah Docker Compose

### Menjalankan Services

```bash
# Start semua services
docker-compose up -d

# Start dengan rebuild image
docker-compose up -d --build

# Start tanpa detached mode (lihat logs)
docker-compose up
```

### Menghentikan Services

```bash
# Stop semua services
docker-compose stop

# Stop dan hapus containers
docker-compose down

# Stop, hapus containers + volumes (HATI-HATI: Data hilang!)
docker-compose down -v
```

### Restart Services

```bash
# Restart semua services
docker-compose restart

# Restart service tertentu
docker-compose restart backend
docker-compose restart frontend
```

### Update Code

```bash
# Jika ada perubahan code, restart service yang diupdate
docker-compose restart backend
docker-compose restart frontend

# Jika ada perubahan package.json, rebuild
docker-compose up -d --build backend
```

---

## Troubleshooting

### 1. Backend tidak bisa connect ke Keycloak

**Masalah:** Error "unable to get issuer"

**Solusi:**
- Pastikan Keycloak sudah running di port 8080
- Periksa [backend/.env](backend/.env) menggunakan `host.docker.internal` untuk `KEYCLOAK_JWKS_URI`
- Pastikan `extra_hosts` sudah ada di [docker-compose.yml](docker-compose.yml):
  ```yaml
  extra_hosts:
    - "host.docker.internal:host-gateway"
  ```

### 2. Database connection error

**Masalah:** "ER_NOT_SUPPORTED_AUTH_MODE"

**Solusi:**
```bash
# Masuk ke MySQL container
docker exec -it helpdesk-mysql mysql -uroot -prootpassword

# Jalankan query berikut
ALTER USER 'helpdesk'@'%' IDENTIFIED WITH mysql_native_password BY 'helpdesk123';
FLUSH PRIVILEGES;
exit;

# Restart backend
docker-compose restart backend
```

### 3. Frontend tidak bisa akses Backend

**Masalah:** CORS error atau 404

**Solusi:**
- Periksa [frontend/.env](frontend/.env) → `VITE_API_BASE=http://localhost:4000`
- Periksa [backend/server.js](backend/server.js) → CORS origin: `http://localhost:5173`
- Restart kedua services:
  ```bash
  docker-compose restart backend frontend
  ```

### 4. Port sudah digunakan

**Masalah:** "Bind for 0.0.0.0:xxxx failed: port is already allocated"

**Solusi:**
```bash
# Cek proses yang menggunakan port
# Windows
netstat -ano | findstr :4000
netstat -ano | findstr :5173
netstat -ano | findstr :3306

# Linux/Mac
lsof -i :4000
lsof -i :5173
lsof -i :3306

# Matikan proses atau ubah port di .env
```

### 5. Token expired atau invalid

**Masalah:** 401 Unauthorized setelah beberapa menit

**Solusi:**
- Logout dan login kembali
- Token refresh otomatis sudah dihandle di [`AuthContext.jsx`](frontend/src/auth/AuthContext.jsx)
- Jika masih error, periksa konfigurasi Keycloak → Client → Advanced → Access Token Lifespan

### 6. Hot reload tidak berfungsi

**Masalah:** Perubahan code tidak otomatis refresh

**Solusi:**
- Frontend: Sudah dikonfigurasi dengan `--host` flag di [docker-compose.yml](docker-compose.yml)
- Backend: Gunakan nodemon (opsional):
  ```yaml
  # Di docker-compose.yml, service backend
  command: sh -c "npm install && npx nodemon server.js"
  ```

---

## Struktur Database

Database akan otomatis dibuat saat backend pertama kali dijalankan. Struktur tabel:

### Tabel: `ticket`

| Column      | Type         | Description                  |
|-------------|--------------|------------------------------|
| id_ticket   | INTEGER      | Primary key, auto increment  |
| title       | STRING       | Judul tiket                  |
| status      | STRING       | open/inprogress/closed       |
| priority    | STRING       | low/medium/high              |
| createdBy   | STRING       | Username pembuat             |
| createdAt   | DATETIME     | Timestamp pembuatan          |
| updatedAt   | DATETIME     | Timestamp update terakhir    |

---

## Fitur Berdasarkan Role

### Role: User
- ✅ Membuat tiket baru
- ✅ Melihat daftar tiket pribadi
- ✅ Memantau status tiket
- ✅ Melihat statistik tiket pribadi

### Role: Admin
- ✅ Melihat semua tiket
- ✅ Mengubah status tiket (open/inprogress/closed)
- ✅ Mengubah prioritas tiket (low/medium/high)
- ✅ Menghapus tiket
- ✅ Pencarian & filter tiket

### Role: Manager
- ✅ Dashboard statistik lengkap
- ✅ Monitoring log aktivitas (50 baris terakhir)
- ✅ Analisis kinerja tim
- ✅ Monitoring real-time

---

## Development Workflow

### Setup Local Development (Tanpa Docker)

Jika ingin development tanpa Docker:

```bash
# 1. Install dependencies
cd backend
npm install
cd ../frontend
npm install

# 2. Setup MySQL
# Buat database manual atau gunakan docker untuk MySQL saja:
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=helpdesk_db \
  -e MYSQL_USER=helpdesk \
  -e MYSQL_PASSWORD=helpdesk123 \
  mysql:8.0

# 3. Setup Keycloak (seperti di atas)

# 4. Jalankan Backend
cd backend
node server.js

# 5. Jalankan Frontend (terminal baru)
cd frontend
npm run dev
```

### Testing API dengan Postman/cURL

**1. Get Access Token:**
```bash
curl -X POST http://localhost:8080/realms/helpdesk-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=helpdesk-frontend" \
  -d "username=testuser" \
  -d "password=password123" \
  -d "grant_type=password"
```

**2. Create Ticket:**
```bash
curl -X POST http://localhost:4000/api/tickets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Ticket","priority":"high"}'
```

**3. Get My Tickets:**
```bash
curl http://localhost:4000/api/tickets/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Monitoring & Logs

### Application Logs

Logs disimpan di [`backend/logs/app.log`](backend/logs/app.log) menggunakan Winston logger.

Melihat logs:
```bash
# Dari container
docker exec -it helpdesk-backend cat /app/logs/app.log

# Atau mount volume dan baca dari host
# (tambahkan di docker-compose.yml, service backend)
volumes:
  - ./backend/logs:/app/logs
```

### Tracked Events

System mencatat event berikut:
- `TICKET_CREATED` - Tiket baru dibuat
- `TICKET_STATUS_UPDATED` - Status tiket berubah
- `TICKET_PRIORITY_UPDATED` - Prioritas berubah
- `TICKET_DELETED` - Tiket dihapus

Format log:
```json
{
  "level": "info",
  "message": "TICKET_CREATED",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "ticketId": 1,
  "title": "Internet lambat",
  "createdBy": "testuser",
  "priority": "high"
}
```

---

## Security

### Keamanan yang Diimplementasikan

1. **JWT Token Validation**
   - Setiap request ke protected endpoint diverifikasi
   - Token validation menggunakan JWKS dari Keycloak
   - Implementasi: [`backend/middleware/auth.js`](backend/middleware/auth.js)

2. **Role-Based Access Control (RBAC)**
   - Middleware `authorizeRoles` di [`backend/middleware/auth.js`](backend/middleware/auth.js)
   - Protected routes di frontend: [`ProtectedRoute.jsx`](frontend/src/components/ProtectedRoute.jsx)

3. **CORS Configuration**
   - Whitelist origin: `http://localhost:5173`
   - Credentials enabled
   - Konfigurasi: [`backend/server.js`](backend/server.js)

4. **PKCE Flow**
   - Digunakan di Keycloak authentication
   - Implementasi: [`frontend/src/auth/AuthContext.jsx`](frontend/src/auth/AuthContext.jsx)

---

## Production Deployment

### Checklist Sebelum Deploy

- [ ] Ubah semua password default
- [ ] Gunakan HTTPS untuk semua endpoint
- [ ] Setup reverse proxy (Nginx/Traefik)
- [ ] Enable SSL di Keycloak
- [ ] Gunakan production database (bukan dev mode)
- [ ] Setup backup database otomatis
- [ ] Enable rate limiting
- [ ] Setup monitoring (Prometheus/Grafana)
- [ ] Configure log rotation
- [ ] Setup firewall rules
- [ ] Disable development features (CORS open, debug logs)

### Environment Variables untuk Production

```env
# .env (Production)
NODE_ENV=production
BACKEND_PORT=4000

# Database
MYSQL_ROOT_PASSWORD=<STRONG_PASSWORD>
MYSQL_DATABASE=helpdesk_db
MYSQL_USER=helpdesk
MYSQL_PASSWORD=<STRONG_PASSWORD>

# Keycloak (gunakan HTTPS)
KEYCLOAK_ISSUER=https://keycloak.yourdomain.com/realms/helpdesk-realm
KEYCLOAK_AUDIENCE=account
KEYCLOAK_JWKS_URI=https://keycloak.yourdomain.com/realms/helpdesk-realm/protocol/openid-connect/certs
```

---

## Tech Stack Details

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Frontend Framework | React | 19.2.0 | UI Components |
| Build Tool | Vite | 7.2.4 | Fast dev server & bundler |
| Styling | Tailwind CSS | 3.4.18 | Utility-first CSS |
| Routing | React Router | 7.10.1 | Client-side routing |
| HTTP Client | Axios | 1.13.2 | API requests |
| Auth Client | Keycloak JS | 26.2.1 | SSO integration |
| Backend Framework | Express | 5.2.1 | REST API |
| ORM | Sequelize | 6.37.7 | Database abstraction |
| JWT | jsonwebtoken | 9.0.3 | Token validation |
| Logger | Winston | 3.19.0 | Application logging |
| Database | MySQL | 8.0 | Relational database |
| Identity Provider | Keycloak | 26.2.1 | Authentication & Authorization |

---

## API Documentation

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |

### Ticket Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/tickets` | Get all tickets | Yes | admin |
| POST | `/api/tickets` | Create ticket | Yes | user |
| GET | `/api/tickets/my` | Get my tickets | Yes | user |
| GET | `/api/tickets/count/all` | Total tickets | Yes | admin, manager |
| GET | `/api/tickets/count/open` | Open tickets count | Yes | admin, manager |
| GET | `/api/tickets/count/closed` | Closed tickets count | Yes | admin, manager |
| GET | `/api/tickets/count/inprogress` | In-progress tickets count | Yes | admin, manager |
| GET | `/api/tickets/count/priority` | Priority distribution | Yes | admin, manager |
| PUT | `/api/tickets/:id/status` | Update status | Yes | admin |
| PUT | `/api/tickets/:id/priority` | Update priority | Yes | admin |
| DELETE | `/api/tickets/:id` | Delete ticket | Yes | admin |

### Log Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/logs` | Get application logs | Yes | manager |

---

## Contributing

Jika ingin berkontribusi:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---
