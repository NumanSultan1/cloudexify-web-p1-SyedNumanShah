# CloudExify Web Development Internship — Month 1, Project 1
## Personal Portfolio Website

This repository contains my submission for **Project 1: Personal Portfolio Website** for the CloudExify Summer Internship 2026.

---

### 📋 Intern Credentials & Info
- **Developer Name:** Syed Numan Shah
- **Registration Number:** CX-INT-2026-9842
- **Build Track Chosen:** Glass & Gradient (Futuristic / SaaS Theme)
- **Live Vercel Link:** https://cloudexify-web-p1-syed-numan-shah.vercel.app

---

### ✨ Signature Features Implemented
1. **Live Theme & Accent Color Switcher**
   - Seamlessly toggle between **Dark Space Glass** and **Light Pastel Glass** modes.
   - Interactive accent color dials allowing the user to select their neon tint (Cyan, Purple, or Emerald) in real-time.
   - Fully persisted in the browser's `localStorage` to preserve state on reload.
2. **Typewriter Hero Intro**
   - A pure Vanilla JS typewriter engine that dynamically types, pauses, and erases text to introduce different roles and taglines.
3. **Scroll-Triggered Animated Skill Bars**
   - Using the `IntersectionObserver` API, progress indicators animate from `0%` to their target levels once they enter the viewport.
   - Features a simultaneous numerical count-up timer matching the progress bar fill transition.
4. **Live Project Filter**
   - Interactive tag-based project cards grid allowing users to filter projects by categories (Frontend, Full Stack, JavaScript, Python) with smooth scaling transitions.
5. **Hidden Easter Egg**
   - **Keyboard sequence detector:** Typing `secret` or inputting the classic **Konami Code** (`↑ ↑ ↓ ↓ ← → ← → B A`) reveals a glowing holographic "Master Intern Badge" achievement overlay.
   - **Mouse-only fallback:** Double-clicking the `<logo>` also triggers the secret achievement window.

---

### 📂 Codebase Structure
```text
cloudexify-web-p1/
├── index.html          # Semantic HTML5 page layout, forms, and custom components
├── css/
│   └── style.css       # Core design system: layout, glassmorphic utilities, and themes
├── js/
│   └── script.js       # Main controller: Typewriter, Swappers, Observers, and Eggs
├── assets/
│   └── resume.pdf      # Mock downloadable Resume PDF
└── README.md           # Submission documentation & setup instructions
```

---

### 🚀 Running Locally
1. Clone this repository to your local system.
2. Launch a local web server (e.g., using VS Code Live Server extension or running `python3 -m http.server 8000` in the directory root).
3. Open `http://localhost:8000` in your web browser.
