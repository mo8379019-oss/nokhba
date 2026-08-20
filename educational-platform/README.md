# المنصة التعليمية | Educational Platform

منصة تعليمية Web Application كاملة باللغة العربية (RTL) لعرض المحاضرات والمواد الدراسية للطلاب، مع لوحة تحكم إدارية كاملة.

## 🏗️ التقنيات المستخدمة

**Backend:** Node.js + Express + TypeScript + PostgreSQL + Prisma ORM + JWT Auth + Cloudinary
**Frontend:** React + Vite + TypeScript + Tailwind CSS + React Router + TanStack Query + react-pdf

---

## 📁 هيكل المشروع

```
educational-platform/
├── server/          # Backend API (Express + Prisma)
│   ├── src/
│   │   ├── config/       # env, database, cloudinary
│   │   ├── controllers/  # منطق معالجة الطلبات
│   │   ├── services/     # منطق الأعمال + Prisma queries
│   │   ├── routes/       # تعريف الـ API endpoints
│   │   ├── middleware/   # auth, admin, validation, upload, errors
│   │   ├── validators/   # Zod schemas
│   │   └── utils/        # helpers (jwt, password, responses)
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
└── client/          # Frontend (React + Vite)
    └── src/
        ├── pages/         # صفحات الطالب + صفحات الأدمن (admin/)
        ├── components/    # common, educational, admin, layout
        ├── layouts/       # MainLayout, AdminLayout
        ├── context/       # AuthContext
        ├── api/           # axios API calls
        ├── hooks/         # useDebounce...
        └── types/         # TypeScript types
```

---

## ⚙️ خطوات التشغيل (Local Development)

### 1. المتطلبات الأساسية
- Node.js 18+
- PostgreSQL 14+ (مثبت محليًا أو عبر Docker)
- حساب [Cloudinary](https://cloudinary.com) مجاني (لتخزين الصور/PDF/الصوتيات)

### 2. تثبيت الحزم

```bash
# من مجلد المشروع الرئيسي
cd server && npm install
cd ../client && npm install
```

### 3. إعداد قاعدة البيانات

```bash
cd server
cp .env.example .env
```

عدّل ملف `.env` وضع فيه:
- `DATABASE_URL` — رابط اتصال PostgreSQL بتاعك
- `JWT_SECRET` — أي نص عشوائي قوي (سرّي)
- بيانات `CLOUDINARY_*` من لوحة تحكم Cloudinary

بعد كده شغّل الأوامر دي لإنشاء الجداول:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. إضافة بيانات تجريبية (Seed)

```bash
npm run seed
```

هيتم إنشاء:
- **حساب أدمن**: `admin@platform.com` / `Admin@12345`
- **حساب طالب تجريبي**: `student@platform.com` / `Student@123`
- 4 فرق دراسية + 5 مواد + محاضرات تجريبية + بانر

### 5. تشغيل السيرفر (Backend)

```bash
cd server
npm run dev
```

السيرفر هيشتغل على: `http://localhost:4000`

### 6. تشغيل الواجهة (Frontend)

في تيرمينال تاني:

```bash
cd client
cp .env.example .env
npm run dev
```

الموقع هيفتح على: `http://localhost:5173`

---

## 🔐 الحسابات التجريبية

| الدور | البريد الإلكتروني | كلمة المرور |
|---|---|---|
| Admin | admin@platform.com | Admin@12345 |
| Student | student@platform.com | Student@123 |

⚠️ **مهم:** غيّر كلمات المرور دي فورًا في بيئة الإنتاج (Production).

---

## 🚀 خطوات النشر (Deployment)

1. **Database:** استضف PostgreSQL على خدمة زي Railway / Supabase / Neon.
2. **Backend:** انشره على Railway / Render / Fly.io — شغّل `npm run build` ثم `npm start`، ونفّذ `npm run prisma:deploy` لتطبيق الـ migrations.
3. **Frontend:** انشره على Vercel / Netlify — شغّل `npm run build` في `client/`، وحدّث `VITE_API_URL` ليشير لرابط الـ Backend المنشور.
4. **Cloudinary:** تأكد من إضافة بيانات الاعتماد الصحيحة في متغيرات البيئة الخاصة بالسيرفر المنشور.
5. حدّث `CLIENT_URL` في إعدادات الـ Backend ليطابق رابط الفرونت المنشور (مطلوب لإعدادات CORS والكوكيز).

---

## 📌 ملاحظات مهمة للتطوير المستقبلي

- المشروع مبني بمعمارية **Modular** (Controllers → Services → Prisma)، فأي Feature جديدة (امتحانات، شهادات، إشعارات، مفضلة...) يمكن إضافتها بدون التأثير على الموجود.
- كل الـ API Endpoints موثقة في الكود داخل `server/src/routes/`.
- الأمان: JWT في HTTP-only Cookie + Role-Based Access Control + Rate Limiting + Zod Validation + Helmet.
- الرفع للملفات (PDF/Audio/Images) يتم عبر Cloudinary مباشرة من الذاكرة (Memory Storage) بدون تخزين مؤقت على السيرفر.

---

## 📄 الترخيص

هذا المشروع خاص وتم إنشاؤه حسب المواصفات المطلوبة.
