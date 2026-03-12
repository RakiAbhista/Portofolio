# 📊 Database Setup - Portfolio Web Project

## ✅ Status: COMPLETE

Database Prisma dengan SQLite telah berhasil dikonfigurasi dan di-seed dengan data lengkap untuk semua fitur portfolio.

---

## 📋 Database Schema

### Models yang Dibuat:

#### 1. **Profile** (Profil Anda)
```prisma
- id: Int (Primary Key)
- name: String (Unique)
- title: String
- description: String
- aboutText: String
- createdAt: DateTime
- updatedAt: DateTime
```
**Data**: 1 profile dengan informasi "Raki Abhista Prakoso"

#### 2. **Skill** (Skill/Teknologi)
```prisma
- id: Int (Primary Key)
- name: String (Unique)
- icon: String? (Optional icon name)
- category: String? (Frontend, Backend, Language, Tools, Database, ORM, Animation)
- createdAt: DateTime
- updatedAt: DateTime
```
**Data**: 14 skills termasuk JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, SQLite, Prisma, Git, Docker, Tailwind CSS, Framer Motion, REST API, GraphQL

#### 3. **Project** (Portfolio Projects)
```prisma
- id: Int (Primary Key)
- title: String (Unique)
- description: String
- preview: String? (Image URL)
- techStack: String (Comma-separated: "Next.js, Tailwind, Prisma")
- liveUrl: String? (Live demo URL)
- githubUrl: String? (GitHub repository)
- featured: Boolean (Default: false)
- order: Int (Display order, Default: 0)
- createdAt: DateTime
- updatedAt: DateTime
```
**Data**: 5 featured projects dengan deskripsi lengkap

#### 4. **Certificate** (Sertifikasi)
```prisma
- id: Int (Primary Key)
- title: String (Unique)
- issuer: String (Institusi/Penerbit)
- date: DateTime
- credentialUrl: String? (Link credential)
- preview: String? (Gambar sertifikat)
- createdAt: DateTime
- updatedAt: DateTime
```
**Data**: 5 sertifikat dari AWS, University of Helsinki, Google Cloud, Coursera, dan Udemy

#### 5. **SocialLink** (Media Sosial)
```prisma
- id: Int (Primary Key)
- name: String (Unique)
- icon: String (Icon name dari Lucide React)
- url: String
- order: Int (Display order)
- createdAt: DateTime
- updatedAt: DateTime
```
**Data**: 5 social links (Email, GitHub, LinkedIn, Instagram, Twitter)

---

## 🚀 Cara Menggunakan

### 1. **Setup Awal (First Time)**
```bash
# Install dependencies
npm install

# Push schema ke database dan generate Prisma Client
npx prisma db push

# Seed database dengan data awal
npm run db:seed
```

### 2. **Development**
```bash
# Jalankan dev server
npm run dev

# Buka browser: http://localhost:3000
```

### 3. **Manage Database**
```bash
# Buka Prisma Studio (GUI untuk manage data)
npm run prisma:studio
# Buka: http://localhost:5555

# Lihat isi database secara visual
# Tambah/edit/hapus data langsung dari UI
```

### 4. **Reset Database** (jika diperlukan)
```bash
# Delete dan recreate database
rm prisma/dev.db

# Push schema lagi
npx prisma db push

# Seed data lagi
npm run db:seed
```

---

## 📁 File-File Database

- **`prisma/schema.prisma`** - Definisi schema/model database
- **`prisma/seed.ts`** - Script untuk populate data awal
- **`.env.local`** - Konfigurasi DATABASE_URL (lokal)
- **`.env.example`** - Template .env untuk referensi
- **`prisma/dev.db`** - SQLite database file (auto-generated)

---

## 🔄 Scripts Available

Di `package.json`:

```json
{
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "tsx prisma/seed.ts",
  "prisma:studio": "prisma studio",
  "db:push": "prisma db push",
  "db:seed": "npm run prisma:seed"
}
```

Jalankan dengan: `npm run <script-name>`

---

## 🔌 Integrasi di Aplikasi

### File Utama: `src/app/page.tsx`

```typescript
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch data dari database
  const profile = (await prisma.profile.findFirst()) ?? undefined;
  const skills = await prisma.skill.findMany();
  const rawProjects = await prisma.project.findMany();
  const certificates = await prisma.certificate.findMany();
  const socialLinks = await prisma.socialLink.findMany();

  // Transform data sesuai kebutuhan komponen
  const projects = rawProjects.map((p) => ({
    ...p,
    techStack: p.techStack ? p.techStack.split(',').map((s) => s.trim()) : []
  }));

  return (
    <div className="flex flex-col items-center w-full">
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Certificates certificates={certificates} />
      <Contact socialLinks={socialLinks} />
    </div>
  );
}
```

---

## 📝 Contoh Query

Buka `src/lib/prisma.ts` atau langsung di komponen:

```typescript
// Get single profile
const profile = await prisma.profile.findFirst();

// Get all skills
const skills = await prisma.skill.findMany();

// Get featured projects saja
const featuredProjects = await prisma.project.findMany({
  where: { featured: true }
});

// Get skills dengan kategori tertentu
const frontendSkills = await prisma.skill.findMany({
  where: { category: "Frontend" }
});

// Get certificates sorted by date
const certificates = await prisma.certificate.findMany({
  orderBy: { date: 'desc' }
});

// Get social links dengan custom order
const socialLinks = await prisma.socialLink.findMany({
  orderBy: { order: 'asc' }
});
```

---

## 🛠️ Menambah/Edit Data

### Via Prisma Studio (Recommended)
```bash
npm run prisma:studio
```
Buka GUI di `http://localhost:5555` - drag & drop friendly UI

### Via Code
```typescript
// Create
await prisma.project.create({
  data: {
    title: "New Project",
    description: "Description here",
    preview: "image-url",
    techStack: "React, Node.js",
    liveUrl: "https://...",
    githubUrl: "https://...",
    featured: true
  }
});

// Update
await prisma.project.update({
  where: { id: 1 },
  data: { featured: false }
});

// Delete
await prisma.project.delete({
  where: { id: 1 }
});
```

---

## 🔒 Environment Variables

**.env.local** (Keep private, don't commit):
```
DATABASE_URL="file:./prisma/dev.db"
```

**.env.example** (Safe to commit):
```
DATABASE_URL="file:./prisma/dev.db"
```

---

## ✨ Fitur Database

✅ **SQLite** - Lightweight, file-based database
✅ **Prisma ORM** - Type-safe database access
✅ **Timestamps** - createdAt & updatedAt otomatis
✅ **Unique Constraints** - Prevent duplicate data
✅ **Relationships** - Ready untuk future expansion
✅ **Seed Script** - Auto-populate data awal
✅ **Type Safety** - TypeScript integration penuh

---

## 📊 Data Summary

| Model | Count | Status |
|-------|-------|--------|
| Profile | 1 | ✅ |
| Skills | 14 | ✅ |
| Projects | 5 | ✅ |
| Certificates | 5 | ✅ |
| Social Links | 5 | ✅ |
| **TOTAL** | **30** | **✅ SEEDED** |

---

## 🎯 Next Steps

1. **Customize Data** - Buka Prisma Studio dan edit data sesuai kebutuhan Anda
   ```bash
   npm run prisma:studio
   ```

2. **Update Profile** - Edit informasi pribadi di tabel Profile

3. **Add More Projects** - Tambahkan project portfolio Anda sendiri

4. **Customize Skills** - Sesuaikan daftar teknologi yang Anda gunakan

5. **Update Social Links** - Ubah URL ke social media akun Anda sendiri

6. **Deploy to Production** - Database SQLite siap untuk di-host

---

## 📚 Dokumentasi Referensi

- [Prisma Docs](https://www.prisma.io/docs/)
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [Next.js Docs](https://nextjs.org/docs)

---

## ✅ Build & Deploy Status

✅ Database schema valid
✅ Data seeded successfully
✅ TypeScript compilation passed
✅ Next.js build successful
✅ Dev server running
✅ All features integrated

**Siap untuk development dan production!** 🚀
