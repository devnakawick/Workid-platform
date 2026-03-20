# 🎉 WorkID Complete Website - MERGED!

**ONE website** with BOTH:
1. **Links Page** (Homepage) - Like Sotercare with all social links
2. **Full Marketing Website** - Complete multi-section site

## 🌐 How It Works

```
User visits: www.workid.lk
    ↓
HOMEPAGE = Links Page (Sotercare-style)
    ├── All social media links
    ├── App links (Worker/Employer signup)
    ├── Quick links (Docs, Support, etc.)
    └── "Visit Our Website" button
        ↓
    Click "Visit Our Website"
        ↓
Full Marketing Website
    ├── Hero section
    ├── Features (9 cards)
    ├── How It Works
    └── Footer
```

## ✨ Features

### Homepage (Links Page):
- 🎨 Animated gradient background
- 🎭 Glassmorphism design
- 📱 All social media links
- 🚀 App launch buttons
- 💫 Smooth animations
- 📊 Live stats
- ✨ "Visit Our Website" button → Goes to full site

### Marketing Website (/website):
- 🎯 Full hero section
- ✅ 9 feature cards
- 📋 How it works (4 steps)
- 📞 Complete footer
- ⬅️ "Back to Links" button

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Run
```bash
npm run dev
```

Opens at: `http://localhost:3000`

**Routes:**
- `/` - Links page (homepage)
- `/website` - Full marketing site

### 3. Build
```bash
npm run build
```

## 🔗 Customize Links

Edit `src/pages/LinksPage.jsx`:

### Update App URLs
```javascript
const mainLinks = [
  {
    title: '🚀 Launch WorkID App',
    url: 'https://YOUR-APP-URL.com',  // ← Change this
  }
]
```

### Update Social Media
```javascript
const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/YOUR_PAGE',  // ← Change this
  }
]
```

### Update Email
```javascript
<a href="mailto:YOUR_EMAIL@domain.com">
```

## 🎨 How Navigation Works

### From Links Page → Marketing Site:
```javascript
// In LinksPage.jsx
onClick: () => navigate('/website')
```

### From Marketing Site → Back to Links:
```javascript
// In MarketingPage.jsx
onClick: () => navigate('/')
```

## 🌐 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "WorkID Complete Site"
git push

# 2. Deploy
- Go to vercel.com
- Import repository
- Deploy!
```

Your site: `https://workid.vercel.app`

### Routes After Deploy:
- `https://workid.vercel.app/` → Links page
- `https://workid.vercel.app/website` → Marketing site

## 📱 Perfect User Journey

1. **User sees link** (Instagram bio, QR code, etc.)
2. **Clicks link** → Lands on beautiful links page
3. **Sees all options**:
   - Visit full website
   - Download app
   - Worker signup
   - Employer signup
   - Social media
   - Docs/Support
4. **Clicks "Visit Our Website"** → Full marketing site opens
5. **Explores features** → Learns about WorkID
6. **Clicks "Back to Links"** → Returns to links page

## 🎯 Two Sites in One!

### Use Links Page For:
- Instagram bio
- Twitter profile
- LinkedIn
- Business cards
- QR codes
- Quick access

### Use Marketing Site For:
- Detailed information
- Feature showcase
- SEO & Google
- Professional presentation

## 📁 File Structure

```
workid-complete/
├── src/
│   ├── pages/
│   │   ├── LinksPage.jsx      ✅ Homepage (Sotercare-style)
│   │   └── MarketingPage.jsx  ✅ Full website
│   ├── components/
│   │   ├── Hero.jsx           ✅ Hero section
│   │   ├── Features.jsx       ✅ Feature cards
│   │   ├── HowItWorks.jsx     ✅ Process steps
│   │   └── Footer.jsx         ✅ Footer
│   ├── App.jsx                ✅ Router setup
│   ├── main.jsx               ✅ Entry point
│   └── index.css              ✅ Styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## 🎨 Features Summary

### Links Page (Homepage `/`):
- ✨ Animated gradient background
- 🎭 Glass cards
- 📱 4 main action buttons:
  1. **Visit Our Website** → Goes to /website
  2. Launch App
  3. Worker Signup
  4. Employer Signup
- 📚 4 quick links (grid)
- 🌐 6 social media icons
- 📧 Email contact
- 📊 Live stats

### Marketing Site (`/website`):
- ⬅️ Back to Links button (top left)
- 🎯 Full hero with phone mockup
- ✅ 9 feature cards
- 📋 4-step how it works
- 📞 Complete footer
- 🚀 CTAs to app

## 💡 Pro Tips

### 1. SEO Optimization
Both pages are SEO-friendly:
- Homepage: Focus on links & social
- Marketing: Focus on features & keywords

### 2. Analytics
Track which page users prefer:
```javascript
// Add Google Analytics to both pages
```

### 3. Custom Domain
```
www.workid.lk → Full site
links.workid.lk → Could redirect to / (homepage)
```

### 4. Share Links
- Instagram bio: `https://workid.lk`
- Marketing: `https://workid.lk/website`

## 🎉 What You Get

✅ **ONE website** with TWO experiences  
✅ Homepage = Sotercare-style links  
✅ `/website` = Full marketing site  
✅ Smooth navigation between them  
✅ Mobile-perfect responsive  
✅ Production-ready  
✅ SEO optimized  
✅ Deploy in 2 minutes  

## 🚀 Deployment Tips

### Vercel Redirects (Optional)
Create `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/links",
      "destination": "/"
    }
  ]
}
```

### Custom Domain Setup
```
www.workid.lk → Homepage (links page)
www.workid.lk/website → Marketing site
```

## 📞 Support

Questions?
- Email: hello@workid.lk
- Twitter: @workid

---

Made with ❤️ for WorkID - The perfect combination! 🎊
