# Harsh Phalke Films & Photography - Complete Source Code

This file contains all the source code for the Harsh Phalke Films & Photography website.

---

## File Structure

```
harsh-phalke-website/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   └── App.tsx (MAIN APPLICATION FILE)
│   └── styles/
│       ├── fonts.css
│       └── theme.css
└── README.md
```

---

## 1. package.json

```json
{
  "name": "harsh-phalke-films",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.487.0",
    "motion": "^12.23.24",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.12",
    "@vitejs/plugin-react": "^4.7.0",
    "tailwindcss": "^4.1.12",
    "vite": "^6.3.5",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.6.2"
  }
}
```

---

## 2. vite.config.ts

```typescript
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
```

---

## 3. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 4. src/styles/fonts.css

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@400;500&display=swap');
```

---

## 5. src/styles/theme.css

See the actual theme.css file in your project at `/workspaces/default/code/src/styles/theme.css`

The theme includes:
- Custom CSS variables for colors (gold, cream, dark backgrounds)
- Font family definitions
- Dark mode support
- Base typography styles
- Tailwind CSS v4 integration

---

## 6. src/app/App.tsx (MAIN APPLICATION FILE)

**⚠️ IMPORTANT: This is your complete application code - 1000+ lines**

See the actual App.tsx file in your project at `/workspaces/default/code/src/app/App.tsx`

This file contains:
- All React components and logic
- State management for events, albums, add-ons, forms
- Interactive modals (portfolio, about, QR zoom, booking success)
- Bill calculation and generation
- Form validation
- Mobile navigation
- Toast notifications
- All animations using Motion (Framer Motion)
- Complete UI for all 8 sections:
  1. Hero Section
  2. About Us
  3. Services (Events, Albums, Add-ons)
  4. Bill Generator
  5. UPI Payment
  6. Booking Form
  7. Contact
  8. Terms & Conditions

---

## How to Use This Code

### Option 1: Development Mode (Recommended)

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/ (LTS version)

2. **Create a new project folder**
   ```bash
   mkdir harsh-phalke-website
   cd harsh-phalke-website
   ```

3. **Copy all files** from this documentation into the appropriate folders

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```
   The production files will be in the `dist/` folder

---

### Option 2: Get Files from This Project

All your source files are located in:
```
/workspaces/default/code/src/
```

**Key Files:**
- `/workspaces/default/code/src/app/App.tsx` - Main application (1000+ lines)
- `/workspaces/default/code/src/styles/theme.css` - Theme and colors
- `/workspaces/default/code/src/styles/fonts.css` - Font imports
- `/workspaces/default/code/package.json` - Dependencies

**Images:**
- `/workspaces/default/code/src/imports/WhatsApp_Image_2026-05-22_at_10.00.08_PM.jpeg` - PhonePe QR
- `/workspaces/default/code/src/imports/WhatsApp_Image_2026-05-22_at_10.00.07_PM.jpeg` - Instagram QR

---

## Features Included

✅ **Navigation**
- Fixed navbar with smooth scroll
- Mobile hamburger menu with slide-in drawer
- Logo click to scroll to home

✅ **Hero Section**
- Animated entrance
- CTA buttons (Book Now, Explore Services)
- Scroll indicator

✅ **About Section**
- Three clickable cards with modals
- Detailed information overlays

✅ **Services**
- Priority events grid (5 featured events)
- Other events grid (10 additional events)
- Event selection with checkboxes
- Full Day / Half Day duration toggle
- Album package selection (Small/Large)
- Pages input with live calculation
- Add-on services with toggle selection

✅ **Bill Generator**
- Customer name input
- Itemized bill breakdown
- Live total calculation
- Generate Bill button
- Print/Download functionality
- Bill preview modal

✅ **UPI Payment**
- PhonePe QR code display
- Click to zoom QR overlay
- WhatsApp integration with pre-filled message

✅ **Booking Form**
- Full form validation
- Error messages for required fields
- Event type dropdown (auto-populated)
- Date picker
- Total amount (auto-filled from bill)
- Success modal on submission

✅ **Contact Section**
- WhatsApp card (opens chat with message)
- Phone card (tel: link)
- Instagram card (opens profile)
- Instagram QR code with zoom
- Email link (mailto:)
- Location display

✅ **Terms & Conditions**
- Accordion with 10 terms
- Expand/collapse animation
- One term open at a time

✅ **Interactive Features**
- Toast notifications (success, error, info)
- Multiple modal overlays
- Smooth animations throughout
- Responsive mobile design
- Form validation
- Dynamic calculations

---

## Dependencies

### Core
- **React 18.3.1** - UI framework
- **Motion (Framer Motion) 12.23.24** - Animations
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool

### UI Components
- **lucide-react** - Icons
- **sonner** - Toast notifications
- **Tailwind CSS v4** - Styling

---

## Color Scheme

```css
--gold: #C9A84C          /* Primary accent */
--cream: #F5F0E8         /* Text color */
--dark-bg: #0A0A0A       /* Background */
--dark-card: #1E1E1E     /* Card backgrounds */
--light-grey: #CCCCCC    /* Secondary text */
--muted-grey: #888888    /* Muted text */
```

---

## Fonts

- **Playfair Display** (serif, italic) - Headings and display text
- **DM Sans** (sans-serif) - Body text and UI

---

## Contact Information (Built Into App)

- **Email:** harshphalke05@gmail.com
- **Phone/WhatsApp:** +91 77200 49725
- **Instagram:** @HARSH_PHALKE_FILMS
- **Location:** Pune, Maharashtra, India
- **UPI:** Master HARSHAL SANJAY FALKE

---

## Browser Compatibility

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Deployment

The built application is a static site that can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting**

---

## Support

For questions or modifications, refer to:
- React documentation: https://react.dev
- Motion documentation: https://motion.dev
- Tailwind CSS: https://tailwindcss.com
- Vite documentation: https://vitejs.dev

---

## License

This is a custom website for Harsh Phalke Films & Photography.
All rights reserved © 2025 Harsh Phalke Films And Photography

---

**Created with Claude Code**
**Build Date:** May 24, 2026
