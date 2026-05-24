# 📦 Harsh Phalke Films & Photography - Project Download Guide

## ✅ Your Project is Complete and Ready!

This is a **fully functional, production-ready** React + TypeScript website for Harsh Phalke Films & Photography.

---

## 📁 Files You Need to Download

### **Essential Files (Required)**

1. **`src/app/App.tsx`** (1,100+ lines)
   - 📍 Location: `/workspaces/default/code/src/app/App.tsx`
   - ⭐ This is your MAIN application file
   - Contains all components, logic, and UI

2. **`src/styles/theme.css`** (182 lines)
   - 📍 Location: `/workspaces/default/code/src/styles/theme.css`
   - Contains color scheme and Tailwind configuration

3. **`src/styles/fonts.css`** (1 line)
   - 📍 Location: `/workspaces/default/code/src/styles/fonts.css`
   - Google Fonts import

4. **`package.json`**
   - 📍 Location: `/workspaces/default/code/package.json`
   - Project dependencies

5. **`vite.config.ts`**
   - 📍 Location: `/workspaces/default/code/vite.config.ts`
   - Build configuration

### **Optional Image Files**

6. **PhonePe QR Code**
   - 📍 Location: `/workspaces/default/code/src/imports/WhatsApp_Image_2026-05-22_at_10.00.08_PM.jpeg`

7. **Instagram QR Code**
   - 📍 Location: `/workspaces/default/code/src/imports/WhatsApp_Image_2026-05-22_at_10.00.07_PM.jpeg`

---

## 🚀 Quick Start Guide

### Method 1: Using the Built-in Copy Script

```bash
# Run the copy script (in the current directory)
./COPY-FILES.sh

# Navigate to the new project
cd harsh-phalke-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Method 2: Manual Setup

1. **Create a new folder on your computer:**
   ```bash
   mkdir harsh-phalke-website
   cd harsh-phalke-website
   ```

2. **Copy these files from the Figma Make environment:**
   - Download each file listed above
   - Place them in the correct folder structure

3. **Create the folder structure:**
   ```
   harsh-phalke-website/
   ├── package.json
   ├── vite.config.ts
   ├── tsconfig.json
   └── src/
       ├── app/
       │   └── App.tsx
       ├── styles/
       │   ├── fonts.css
       │   └── theme.css
       └── imports/
           ├── WhatsApp_Image_2026-05-22_at_10.00.08_PM.jpeg
           └── WhatsApp_Image_2026-05-22_at_10.00.07_PM.jpeg
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📊 Project Statistics

- **Total Code:** ~1,300 lines
- **Main Application:** 1,100+ lines (App.tsx)
- **Styling:** 200+ lines (CSS)
- **Components:** All-in-one single-file app
- **Dependencies:** 10 core packages

---

## 🎨 What's Included

### ✅ **Complete Features**

- ✨ Smooth animations with Motion (Framer Motion)
- 📱 Fully responsive mobile design
- 🎯 Interactive event selection
- 💰 Live bill calculator
- 📋 Booking form with validation
- 📱 WhatsApp integration
- 💳 UPI payment section
- 🖼️ Portfolio modal
- 📧 Contact section
- 📜 Terms accordion
- 🍞 Toast notifications
- 🔍 QR code zoom overlays
- ✅ Success animations

### 🎨 **Design System**

- **Colors:**
  - Gold: `#C9A84C`
  - Cream: `#F5F0E8`
  - Dark Background: `#0A0A0A`
  - Dark Card: `#1E1E1E`

- **Fonts:**
  - Playfair Display (headings, italic)
  - DM Sans (body text)

- **Framework:**
  - React 18 + TypeScript
  - Tailwind CSS v4
  - Vite build tool

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "lucide-react": "^0.487.0",      // Icons
    "motion": "^12.23.24",           // Animations (Framer Motion)
    "react": "^18.3.1",              // UI Framework
    "react-dom": "^18.3.1",          // React DOM
    "sonner": "^2.0.3"               // Toast notifications
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.12",  // Tailwind CSS v4
    "@vitejs/plugin-react": "^4.7.0", // React plugin for Vite
    "tailwindcss": "^4.1.12",        // Tailwind CSS
    "vite": "^6.3.5",                // Build tool
    "typescript": "^5.6.2"           // TypeScript
  }
}
```

---

## 🌐 Deployment Options

Your built application (after `npm run build`) can be deployed to:

### **Recommended Platforms:**

1. **Vercel** (https://vercel.com)
   - Free hosting
   - Automatic builds from GitHub
   - Custom domains
   - Commands:
     ```bash
     npm i -g vercel
     vercel
     ```

2. **Netlify** (https://netlify.com)
   - Free hosting
   - Drag & drop deployment
   - Custom domains
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **GitHub Pages**
   - Free hosting on GitHub
   - Requires GitHub repository

4. **Any Static Host**
   - AWS S3 + CloudFront
   - Firebase Hosting
   - DigitalOcean
   - Cloudflare Pages

---

## 📝 File Paths Reference

Use these exact paths to find your files:

```bash
# Main application
/workspaces/default/code/src/app/App.tsx

# Styles
/workspaces/default/code/src/styles/theme.css
/workspaces/default/code/src/styles/fonts.css

# Configuration
/workspaces/default/code/package.json
/workspaces/default/code/vite.config.ts

# Images (optional)
/workspaces/default/code/src/imports/WhatsApp_Image_2026-05-22_at_10.00.08_PM.jpeg
/workspaces/default/code/src/imports/WhatsApp_Image_2026-05-22_at_10.00.07_PM.jpeg
```

---

## 🔧 Customization Guide

### **Change Colors:**

Edit `/src/styles/theme.css`:

```css
:root {
  --gold: #C9A84C;        /* Change primary accent color */
  --cream: #F5F0E8;       /* Change text color */
  --dark-bg: #0A0A0A;     /* Change background */
  --dark-card: #1E1E1E;   /* Change card backgrounds */
}
```

### **Change Content:**

Edit `/src/app/App.tsx` and modify:
- Event categories (line ~50)
- Add-on services (line ~80)
- Terms & conditions (line ~90)
- Contact information (inline throughout)

### **Change Fonts:**

Edit `/src/styles/fonts.css` to change Google Fonts import
Edit `/src/styles/theme.css` to update font variables

---

## ❓ Troubleshooting

### **"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Port already in use:**
```bash
# Vite will automatically use the next available port
# Or specify a port:
npm run dev -- --port 3000
```

### **Build errors:**
```bash
# Clear cache and rebuild
rm -rf dist .vite
npm run build
```

---

## 📞 Business Information (In App)

- **Studio:** Harsh Phalke Films & Photography
- **Email:** harshphalke05@gmail.com
- **Phone:** +91 77200 49725
- **WhatsApp:** +91 77200 49725
- **Instagram:** @HARSH_PHALKE_FILMS
- **Location:** Pune, Maharashtra, India
- **UPI:** Master HARSHAL SANJAY FALKE

---

## 🎯 Next Steps

1. ✅ Download all files from the paths above
2. ✅ Set up project structure
3. ✅ Install dependencies (`npm install`)
4. ✅ Run development server (`npm run dev`)
5. ✅ Test all features
6. ✅ Build for production (`npm run build`)
7. ✅ Deploy to hosting platform
8. ✅ Share with the world!

---

## 📄 Additional Documentation

- **DOWNLOAD-ALL-CODE.md** - Complete source code documentation
- **COPY-FILES.sh** - Automated file copy script
- **package.json** - Dependencies and scripts

---

## ✨ Features Checklist

- [x] Hero section with animations
- [x] About section with modal details
- [x] Event selection system
- [x] Album packages
- [x] Add-on services
- [x] Live bill calculator
- [x] Bill generator with print
- [x] UPI payment with QR codes
- [x] Booking form with validation
- [x] Contact section
- [x] Terms & conditions accordion
- [x] Mobile navigation
- [x] Toast notifications
- [x] Multiple modals
- [x] Responsive design
- [x] WhatsApp integration
- [x] Email integration
- [x] Social media links
- [x] Smooth scroll navigation
- [x] Form validation
- [x] Success animations

---

**🎉 Your website is complete and ready to deploy!**

Created with ❤️ using Claude Code
May 24, 2026
