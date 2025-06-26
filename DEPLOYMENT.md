# Panduan Deployment - Book Nails Art

## 🚀 Deployment Options

### 1. Vercel (Recommended)

#### Langkah-langkah:
1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect ke Vercel**
   - Buka [Vercel](https://vercel.com)
   - Sign in dengan GitHub
   - Klik "New Project"
   - Import repository dari GitHub

3. **Configure Environment Variables**
   - Di Vercel dashboard, buka project settings
   - Tambahkan environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://nqhavobbrdbrdlloiyqw.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
     ```

4. **Deploy**
   - Klik "Deploy"
   - Tunggu build selesai
   - Aplikasi akan live di `https://your-project.vercel.app`

#### Keuntungan Vercel:
- ✅ Otomatis deploy dari GitHub
- ✅ Preview deployments untuk setiap PR
- ✅ CDN global
- ✅ SSL otomatis
- ✅ Analytics built-in

### 2. Netlify

#### Langkah-langkah:
1. **Push ke GitHub** (sama seperti Vercel)

2. **Connect ke Netlify**
   - Buka [Netlify](https://netlify.com)
   - Sign in dengan GitHub
   - Klik "New site from Git"
   - Pilih repository

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables**
   - Di Netlify dashboard, buka Site settings > Environment variables
   - Tambahkan:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://nqhavobbrdbrdlloiyqw.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
     ```

5. **Deploy**
   - Klik "Deploy site"

### 3. Railway

#### Langkah-langkah:
1. **Push ke GitHub**

2. **Connect ke Railway**
   - Buka [Railway](https://railway.app)
   - Sign in dengan GitHub
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"

3. **Configure Environment**
   - Tambahkan environment variables di Railway dashboard
   - Railway akan otomatis detect Next.js

4. **Deploy**
   - Railway akan otomatis deploy

### 4. Manual Deployment (VPS/Server)

#### Prerequisites:
- Node.js 18+
- PM2 (untuk process management)
- Nginx (untuk reverse proxy)

#### Langkah-langkah:
1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd book_nails_uas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build aplikasi**
   ```bash
   npm run build
   ```

4. **Setup environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local dengan credentials yang benar
   ```

5. **Start dengan PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "book-nails-art" -- start
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Environment Variables

### Required Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Optional Variables:
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔒 Security Checklist

### Pre-deployment:
- [ ] Environment variables tidak di-commit ke Git
- [ ] Supabase RLS policies sudah aktif
- [ ] CORS settings di Supabase sudah dikonfigurasi
- [ ] Email verification diaktifkan di Supabase Auth

### Post-deployment:
- [ ] HTTPS aktif
- [ ] Domain sudah dikonfigurasi
- [ ] Error monitoring aktif
- [ ] Backup database rutin

## 📊 Monitoring

### Vercel Analytics
- Buka Vercel dashboard
- Klik "Analytics" tab
- Monitor performance dan errors

### Supabase Monitoring
- Buka Supabase dashboard
- Monitor database performance
- Cek auth logs

### Custom Monitoring
```bash
# Log monitoring
pm2 logs book-nails-art

# Performance monitoring
pm2 monit
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build

# Check dependencies
npm audit fix
```

### Runtime Errors
```bash
# Check logs
pm2 logs

# Restart app
pm2 restart book-nails-art
```

### Database Connection Issues
- Cek environment variables
- Cek Supabase project status
- Cek RLS policies

## 📈 Performance Optimization

### Build Optimization
```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Optimize images
# Gunakan next/image component
```

### Runtime Optimization
- Enable caching di Nginx
- Use CDN untuk static assets
- Monitor memory usage

## 🔄 Updates & Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Rebuild and redeploy
npm run build
pm2 restart book-nails-art
```

### Database Maintenance
- Backup rutin di Supabase
- Monitor query performance
- Clean up old data

## 📞 Support

Untuk bantuan deployment:
1. Cek logs di platform deployment
2. Cek Supabase dashboard
3. Cek browser console untuk errors
4. Buat issue di repository 