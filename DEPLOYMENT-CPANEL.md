# WPCodingPress - Complete Deployment Guide (cPanel Only)

## System Architecture (cPanel Only)

```
┌─────────────────────────────────────────────────────────────┐
│                      cPanel Server                        │
│                                                       │
│  ┌──────────────────┐    ┌──────────────────────┐     │
│  │   Next.js App     │    │    PHP API           │     │
│  │   (Node.js)      │───►│    /public_html/api  │     │
│  │   Port 3000      │    │                      │     │
│  └──────────────────┘    └──────────┬───────────┘     │
│                                    │                   │
│                                    ▼                   │
│                          ┌──────────────────────┐     │
│                          │      MySQL            │     │
│                          │    (localhost)       │     │
│                          └──────────────────────┘     │
│                                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture Options

### Option A: PHP API (Recommended for Scalability)

**Best for:** Production applications, SaaS, multiple frontends

```
Next.js (Frontend) → PHP API → MySQL
```

### Option B: Next.js API Routes (Simpler)

**Best for:** Simple apps, prototypes, single frontend

```
Next.js (Full Stack) → MySQL
```

---

## Option A: PHP API Deployment (Recommended)

### Step 1: Upload PHP API to cPanel

1. **In cPanel File Manager**, navigate to `public_html`
2. **Create folder:** `api`
3. **Upload these files** to `public_html/api/`:

```
public_html/
├── api/
│   ├── config/
│   │   ├── db.php
│   │   ├── cors.php
│   │   ├── jwt.php
│   │   └── response.php
│   ├── middleware/
│   │   └── verify-token.php
│   ├── routes/
│   │   ├── auth/
│   │   ├── services/
│   │   ├── orders/
│   │   ├── contacts/
│   │   └── portfolio/
│   └── index.php
```

### Step 2: Create Database

1. **cPanel** → **MySQL Databases**
2. Create database: `thecodin_wpcodingpress`
3. Create user: `thecodin_wppress_db`
4. Add user to database with all privileges

### Step 3: Import Database Schema

1. **cPanel** → **phpMyAdmin**
2. Select database
3. Click **Import** tab
4. Upload `database/schema.sql`

### Step 4: Update PHP API Config

**Edit `api/config/db.php`:**
```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'thecodin_wpcodingpress');
define('DB_USER', 'thecodin_wppress_db');
define('DB_PASS', 'thecodin_wppress_db');
```

**Edit `api/config/jwt.php`:**
```php
define('JWT_SECRET', 'your-secure-secret-key-change-this');
```

### Step 5: Test PHP API

Visit:
```
https://wpcodingpress.com/api/routes/auth/login.php
```

Should return:
```json
{"success":false,"message":"Method not allowed","data":null}
```

### Step 6: Test Login API (with curl)

```bash
curl -X POST https://wpcodingpress.com/api/routes/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"rahman.ceo@wpcodingpress.com","password":"S0pnahenayf"}'
```

---

## Option B: Next.js API Routes (Simpler)

Since Next.js is already on cPanel, you can use the built-in API routes.

### Your Existing API Routes

```
app/
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── orders/route.ts
│   ├── orders/[id]/route.ts
│   ├── services/route.ts
│   ├── services/[id]/route.ts
│   ├── contacts/route.ts
│   ├── contacts/admin/route.ts
│   ├── portfolio/route.ts
│   ├── portfolio/[id]/route.ts
│   └── seed/route.ts
```

### Why These Might Not Work

| Issue | Cause |
|-------|-------|
| Memory errors | Shared hosting has limited RAM |
| Build failures | Prisma requires more memory |
| Connection issues | Database connection problems |

---

## Recommended Approach: Use PHP API

Since your Next.js API routes have issues due to shared hosting limitations, **PHP API is the best solution**.

### Benefits

| Benefit | Description |
|---------|-------------|
| Lightweight | PHP uses minimal memory |
| Fast | Optimized for shared hosting |
| Scalable | Easy to add more endpoints |
| Secure | Built-in JWT authentication |
| Compatible | Works with any frontend |

---

## Complete Deployment Checklist

### Phase 1: Database Setup
- [ ] Create MySQL database
- [ ] Create database user
- [ ] Import schema.sql
- [ ] Verify tables created

### Phase 2: PHP API Setup
- [ ] Upload API files to `public_html/api/`
- [ ] Update db.php credentials
- [ ] Update JWT secret
- [ ] Test login endpoint

### Phase 3: Next.js Setup
- [ ] Update lib/api.ts (use `/api` instead of full URL)
- [ ] Deploy to cPanel Node.js
- [ ] Test API calls

### Phase 4: Verification
- [ ] Test admin login
- [ ] Test order submission
- [ ] Test admin dashboard
- [ ] Verify all CRUD operations

---

## Quick Start Commands

### Test PHP API
```bash
# Login
curl -X POST https://wpcodingpress.com/api/routes/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"rahman.ceo@wpcodingpress.com","password":"S0pnahenayf"}'

# Get Services
curl https://wpcodingpress.com/api/routes/services/get.php \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Order
curl -X POST https://wpcodingpress.com/api/routes/orders/create.php \
  -H "Content-Type: application/json" \
  -d '{"service_id":1,"client_name":"John","client_email":"john@test.com","client_phone":"123","package_type":"basic"}'
```

---

## Default Credentials

| Type | Value |
|------|-------|
| Admin Email | rahman.ceo@wpcodingpress.com |
| Admin Password | S0pnahenayf |
| Database | thecodin_wpcodingpress |
| Database User | thecodin_wppress_db |

---

## Troubleshooting

### PHP API Not Working

1. Check file permissions (644 for PHP files)
2. Verify .htaccess is not blocking
3. Check error logs in cPanel

### CORS Errors

Edit `api/config/cors.php` and add your domain:
```php
$allowed_origins = [
    'https://wpcodingpress.com',
    'https://www.wpcodingpress.com',
];
```

### Database Connection Failed

1. Verify credentials in `db.php`
2. Check if database user has privileges
3. Test connection in phpMyAdmin

### 500 Server Error

1. Check cPanel error logs
2. Enable error display temporarily:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

---

## Next Steps

### Create Admin Pages

Would you like me to create:
1. **Admin login page** using PHP API
2. **Admin dashboard** with stats
3. **Orders management** page
4. **Services CRUD** page
5. **Contacts management** page
6. **Portfolio management** page

Let me know which pages you need!

---

**Built with ❤️ by WPCodingPress**
