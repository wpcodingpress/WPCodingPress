# WPCodingPress - PHP API Deployment Guide

## Complete System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Next.js       │ HTTP    │   PHP API       │ SQL     │   MySQL         │
│   Frontend      │ ──────► │   (cPanel)      │ ──────► │   (localhost)   │
│   (Vercel)      │         │   /public_html  │         │   cPanel        │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## Phase 1: Upload PHP API to cPanel

### Step 1.1: Prepare Files

The PHP API files are in: `api/` folder

Upload the following structure to cPanel `public_html/api/`:

```
public_html/
└── api/
    ├── config/
    │   ├── db.php
    │   ├── cors.php
    │   ├── jwt.php
    │   └── response.php
    ├── middleware/
    │   └── verify-token.php
    ├── routes/
    │   ├── auth/
    │   │   ├── login.php
    │   │   ├── register.php
    │   │   ├── logout.php
    │   │   ├── refresh.php
    │   │   └── me.php
    │   ├── services/
    │   │   ├── get.php
    │   │   ├── create.php
    │   │   ├── update.php
    │   │   └── delete.php
    │   ├── orders/
    │   │   ├── get.php
    │   │   ├── create.php
    │   │   ├── update.php
    │   │   └── delete.php
    │   ├── contacts/
    │   │   ├── get.php
    │   │   ├── create.php
    │   │   ├── read.php
    │   │   └── delete.php
    │   └── portfolio/
    │       ├── get.php
    │       ├── create.php
    │       ├── update.php
    │       └── delete.php
    └── index.php
```

### Step 1.2: Update Database Credentials

Edit `api/config/db.php` with your cPanel MySQL credentials:

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');
```

### Step 1.3: Update JWT Secret

Edit `api/config/jwt.php`:

```php
define('JWT_SECRET', 'your-very-secure-secret-key-change-this');
```

### Step 1.4: Update CORS Settings

Edit `api/config/cors.php` - add your domains:

```php
$allowed_origins = [
    'http://localhost:3000',
    'https://wpcodingpress.com',
    'https://www.wpcodingpress.com',
    // Add Vercel domain when deployed
    'https://your-app.vercel.app',
];
```

---

## Phase 2: Create Database Tables

### Step 2.1: Access phpMyAdmin

1. Login to cPanel
2. Go to **Databases** → **phpMyAdmin**

### Step 2.2: Import Schema

1. Select your database
2. Click **Import** tab
3. Upload the file: `database/schema.sql`
4. Click **Go**

This will create all tables and insert default data.

---

## Phase 3: Test PHP API

### Step 3.1: Test Login API

Visit in browser:
```
https://wpcodingpress.com/api/routes/auth/login.php
```

Expected response:
```json
{
  "success": false,
  "message": "Method not allowed",
  "data": null
}
```

### Step 3.2: Test with POST Request

Use Postman or curl:

```bash
curl -X POST https://wpcodingpress.com/api/routes/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"rahman.ceo@wpcodingpress.com","password":"S0pnahenayf"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Rahman",
      "email": "rahman.ceo@wpcodingpress.com",
      "role": "admin"
    },
    "expires_in": 604800
  }
}
```

---

## Phase 4: Deploy Next.js to Vercel

### Step 4.1: Push Code to GitHub

```bash
cd "C:\Users\Asus\Documents\GitHub\wpcodingpress\WPCodingPress"
git add .
git commit -m "Add PHP API and update frontend"
git push origin main
```

### Step 4.2: Create Vercel Project

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Click **Deploy**

### Step 4.3: Configure Environment Variables

In Vercel project settings → **Environment Variables**:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://wpcodingpress.com/api` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

### Step 4.4: Deploy

Click **Deploy** and wait for deployment to complete.

---

## Phase 5: Connect Custom Domain (Optional)

### Step 5.1: Add Domain in Vercel

1. Vercel project → **Settings** → **Domains**
2. Add `wpcodingpress.com`
3. Update DNS records as instructed

### Step 5.2: Update CORS in PHP

Edit `api/config/cors.php` and add your domain.

---

## API Documentation

### Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/routes/auth/login.php` | POST | No | Admin login |
| `/api/routes/auth/register.php` | POST | No | Register new user |
| `/api/routes/auth/logout.php` | POST | Yes | Logout |
| `/api/routes/auth/me.php` | GET | Yes | Get current user |
| `/api/routes/auth/refresh.php` | POST | No | Refresh token |

### Services Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/routes/services/get.php` | GET | Yes | Get all services |
| `/api/routes/services/create.php` | POST | Yes (Admin) | Create service |
| `/api/routes/services/update.php` | POST | Yes (Admin) | Update service |
| `/api/routes/services/delete.php` | POST | Yes (Admin) | Delete service |

### Orders Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/routes/orders/get.php` | GET | Yes | Get all orders |
| `/api/routes/orders/create.php` | POST | No | Create order (public) |
| `/api/routes/orders/update.php` | POST | Yes (Admin) | Update order |
| `/api/routes/orders/delete.php` | POST | Yes (Admin) | Delete order |

### Contacts Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/routes/contacts/get.php` | GET | Yes | Get all contacts |
| `/api/routes/contacts/create.php` | POST | No | Create contact (public) |
| `/api/routes/contacts/read.php` | POST | Yes (Admin) | Mark as read |
| `/api/routes/contacts/delete.php` | POST | Yes (Admin) | Delete contact |

### Portfolio Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/routes/portfolio/get.php` | GET | Yes | Get all items |
| `/api/routes/portfolio/create.php` | POST | Yes (Admin) | Create item |
| `/api/routes/portfolio/update.php` | POST | Yes (Admin) | Update item |
| `/api/routes/portfolio/delete.php` | POST | Yes (Admin) | Delete item |

---

## Default Credentials

| Type | Value |
|------|-------|
| Email | rahman.ceo@wpcodingpress.com |
| Password | S0pnahenayf |
| Role | admin |

---

## Troubleshooting

### CORS Errors
- Ensure your domain is in `$allowed_origins` array
- Check browser console for specific error

### 500 Server Error
- Check PHP error logs in cPanel
- Verify database credentials in `db.php`
- Ensure all PHP files are uploaded correctly

### JWT Token Issues
- Verify `JWT_SECRET` is set and consistent
- Check token expiration

### Database Connection Failed
- Verify MySQL credentials
- Ensure database exists in phpMyAdmin
- Check if user has proper permissions

---

## Security Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a secure random string
- [ ] Add your domain to CORS allowed origins
- [ ] Enable HTTPS (automatic with SSL)
- [ ] Keep PHP and dependencies updated

---

**Built with ❤️ by WPCodingPress**
