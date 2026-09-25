# Trust Gate Overseas - Quick Start Guide

## 🚀 Running the Application

### Start Development Server
```bash
npm run dev
```
Access at: http://localhost:3000

### Build for Production
```bash
npm run build
npm run start
```

---

## 🔐 Demo Credentials

### Admin Access
- **URL:** http://localhost:3000/admin/login
- **Email:** admin@demo.com
- **Password:** demo1234
- **Role:** Super Admin (full access)

### Client Access
- **URL:** http://localhost:3000/client/login
- **Email:** client@demo.com
- **Password:** demo1234
- **Role:** Client (portal access)

---

## 📁 Key Commands

### Development
```bash
npm run dev          # Start dev server
npm run lint         # Check code quality
npm run format       # Format with Prettier
```

### Database
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Sync schema (fast, for dev)
npm run db:migrate   # Create migration (for production)
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed demo data
```

### Build
```bash
npm run build        # Production build
npm run start        # Start production server
```

---

## 🌐 Key Pages

### Public Site
- **Homepage:** http://localhost:3000
- **Countries:** http://localhost:3000/countries
- **Services:** http://localhost:3000/services
- **Eligibility:** http://localhost:3000/eligibility
- **Apply:** http://localhost:3000/apply
- **Contact:** http://localhost:3000/contact
- **About:** http://localhost:3000/about
- **FAQ:** http://localhost:3000/faq

### Admin Dashboard
- **Login:** http://localhost:3000/admin/login
- **Dashboard:** http://localhost:3000/admin
- **Leads:** http://localhost:3000/admin/leads
- **Applications:** http://localhost:3000/admin/applications
- **Countries:** http://localhost:3000/admin/countries
- **Services:** http://localhost:3000/admin/services
- **Blog:** http://localhost:3000/admin/blog
- **Users:** http://localhost:3000/admin/users

### Client Portal
- **Login:** http://localhost:3000/client/login
- **Dashboard:** http://localhost:3000/client
- **Application:** http://localhost:3000/client/application
- **Documents:** http://localhost:3000/client/documents
- **Messages:** http://localhost:3000/client/messages
- **Profile:** http://localhost:3000/client/profile

---

## 🛠 Quick Fixes

### Reset Database
```bash
npm run db:push
npm run db:seed
```

### Clear Build Cache
```bash
rm -rf .next
npm run build
```

### Regenerate Prisma Client
```bash
npm run db:generate
```

### Fix TypeScript Errors
```bash
npx tsc --noEmit
```

---

## 📝 Environment Variables

### Required (.env.local)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Generate Secret
```bash
openssl rand -base64 48
```

---

## 🎨 Customization

### Update Site Info
Edit: `src/lib/site-config.ts`

### Update Colors/Theme
Edit: `tailwind.config.ts`

### Add New Pages
- Public: `src/app/(public)/[name]/page.tsx`
- Admin: `src/app/admin/(dashboard)/[name]/page.tsx`
- Client: `src/app/client/(dashboard)/[name]/page.tsx`

---

## 🔧 Troubleshooting

### Server Won't Start
1. Check if port 3000 is in use
2. Delete `.next` folder
3. Run `npm install`
4. Try `npm run dev` again

### Database Connection Error
1. Check DATABASE_URL in .env.local
2. Verify database is accessible
3. Run `npm run db:push`

### TypeScript Errors
1. Run `npm run db:generate`
2. Restart TypeScript server in IDE
3. Run `npx tsc --noEmit` to see all errors

### Build Fails
1. Check for TypeScript errors
2. Clear `.next` folder
3. Run `npm run db:generate`
4. Try `npm run build` again

---

## 📊 Project Status

✅ **All Systems Operational**

- TypeScript: ✅ Zero errors
- Build: ✅ Successful
- Database: ✅ Connected & seeded
- Authentication: ✅ Working
- Public Site: ✅ All pages load
- Admin Dashboard: ✅ Functional
- Client Portal: ✅ Functional

---

## 🚢 Ready to Deploy

The application is production-ready. Follow the deployment steps in `PRODUCTION_READY_REPORT.md`.

**Last Verified:** August 23, 2026
