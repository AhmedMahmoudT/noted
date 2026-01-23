# Noted

**Noted** is a premium, offline-first note-taking application built with Next.js, designed to function as a "second brain" similar to Obsidian. It features realtime synchronization across devices while maintaining full functionality without an internet connection.

## ✨ Features

- **Offline-First**: Create and edit notes without internet. Changes sync automatically when online.
- **PWA Support**: Installable on Desktop and Mobile as a native-like app.
- **Realtime Sync**: Powered by Firebase Firestore.
- **Markdown Support**: (Coming Soon) Rich text editing with Markdown.
- **Dark Mode**: Sleek, obsidian-inspired dark aesthetic.
- **Responsive Design**: Optimized for both desktop and mobile workflows.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: Standard CSS with Variables (No Tailwind, custom design system)
- **Backend/DB**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: `next-pwa`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AhmedMahmoudT/noted.git
   cd noted
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 PWA Development

To test PWA features locally, you need to build the application:

```bash
npm run build
npm start
```

## 📄 License

MIT
