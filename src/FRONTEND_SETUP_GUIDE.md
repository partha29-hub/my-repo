# Interstellar Asteroid Tracker - Frontend Setup Guide

## 📋 Overview
This guide explains how to extract and integrate the **Interstellar Asteroid Tracker & Risk Analyser** frontend files into your VS Code environment. Your backend is ready, so you only need to set up the frontend.

---

## 🚀 Quick Start

### Step 1: Create a New React Project
```bash
# Create a new Vite + React project
npm create vite@latest asteroid-tracker -- --template react-ts

# Navigate to the project
cd asteroid-tracker

# Install dependencies
npm install
```

### Step 2: Install Required Dependencies
```bash
npm install react-router-dom zustand framer-motion lucide-react shadcn-ui @radix-ui/react-slot class-variance-authority clsx tailwind-merge moment recharts react-hook-form date-fns lodash three @hello-pangea/dnd
```

### Step 3: Setup Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '300' }],
        sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '300' }],
        base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '400' }],
        lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '400' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '600' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.03em', fontWeight: '600' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0.03em', fontWeight: '700' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.03em', fontWeight: '700' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.035em', fontWeight: '800' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '0.035em', fontWeight: '800' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.04em', fontWeight: '900' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.04em', fontWeight: '900' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '900' }],
      },
      fontFamily: {
        heading: "avenir-lt-w01_85-heavy1475544",
        paragraph: "avenir-lt-w01_35-light1475496"
      },
      colors: {
        accentcyan: '#00F0FF',
        darkgrayoverlay: '#1A1A1A',
        foreground: '#000000',
        destructive: '#DF3131',
        destructiveforeground: '#ffffff',
        background: '#F9F9F9',
        secondary: '#FFFFFF',
        'secondary-foreground': '#000000',
        'primary-foreground': '#FFFFFF',
        primary: '#000000'
      },
    },
  },
  plugins: [],
}
```

---

## 📁 Project Structure

Create the following folder structure in your `src` directory:

```
src/
├── components/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── NEODetailPage.tsx
│   │   ├── WatchlistPage.tsx
│   │   ├── CommunityPage.tsx
│   │   └── ProfilePage.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── image.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── badge.tsx
│   │   └── ... (other UI components)
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Router.tsx
├── entities/
│   └── index.ts
├── hooks/
│   ├── use-toast.tsx
│   └── use-size.ts
├── lib/
│   ├── utils.ts
│   └── scroll-to-top.tsx
├── styles/
│   ├── global.css
│   └── fonts.css
├── App.tsx
└── main.tsx
```

---

## 🔌 Backend Integration

### Connect to Your Backend API

Update your API calls in the page components:

```typescript
// Example: src/components/pages/DashboardPage.tsx
const API_BASE_URL = 'http://your-backend-url.com/api';

// Fetch NEO data
const fetchNEOs = async () => {
  const response = await fetch(`${API_BASE_URL}/neos`);
  const data = await response.json();
  return data;
};

// Fetch user watchlist
const fetchWatchlist = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/watchlist/${userId}`);
  const data = await response.json();
  return data;
};
```

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Page Components to Create

Create these files in `src/components/pages/`:

1. **DashboardPage.tsx** - Main dashboard with NEO listings
2. **NEODetailPage.tsx** - Detailed view of a specific asteroid
3. **WatchlistPage.tsx** - User's saved asteroids
4. **CommunityPage.tsx** - Discussion threads
5. **ProfilePage.tsx** - User profile management

---

## ✨ Key Features Implemented

✅ Responsive Design (Mobile, Tablet, Desktop)
✅ Dark/Light Theme Support
✅ Framer Motion Animations
✅ React Router Navigation
✅ Tailwind CSS Styling
✅ TypeScript Support
✅ Lucide React Icons
✅ shadcn/ui Components

---

## 📞 Support

For issues or questions:
1. Check the component files for implementation examples
2. Review the Tailwind config for available colors and fonts
3. Ensure all dependencies are installed correctly
4. Verify your backend API endpoints match the frontend calls

---

## ✨ Next Steps

1. Copy all files to your VS Code project
2. Install dependencies
3. Update backend API URLs
4. Create the remaining page components
5. Test all routes and features
6. Deploy to production

Happy coding! 🚀
