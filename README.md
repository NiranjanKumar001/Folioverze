# <p align="center">✨ FOLIOVERZE | SOFTWARE & TECH AGENCY ✨</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Syne&weight=700&size=28&duration=3000&pause=1000&color=D7263D&center=true&vCenter=true&width=520&lines=WE+BUILD+PREMIUM+SOFTWARE;AUTOMATIONS+AND+AI;FOLIOVERZE" alt="Typing SVG" />
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="#"><img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Lenis-Smooth_Scroll-black?style=for-the-badge" alt="Lenis" /></a>
</p>

```text
  _____ ___  _     ___ _____     _______ ____   __________ 
 |  ___/ _ \| |   |_ _/ _ \ \   / / ____|  _ \ |__  / ____|
 | |_ | | | | |    | | | | \ \ / /|  _| | |_) |  / /|  _|  
 |  _|| |_| | |___ | | |_| |\ V / | |___|  _ <  / /_| |___ 
 |_|   \___/|_____|___\___/  \_/  |_____|_| \_\/____|_____|

               -- ＥＳＴ.  ２０２６  /  ＡＳＳＡＭ --
```

---

> [!NOTE]
> **Folioverze** is a freelance software & tech agency — we build premium websites, automations, AI integrations, and internal tools. This repo is our landing page: immersive typography, buttery-smooth kinetics, and high-fidelity interaction in a Next.js frontend.

---

## ⚡ Key Animations & Features

### 🌀 3D Circular Slider Gallery
*   **Immersive Perspective**: A custom 3D wheel rendering gallery built using standard CSS 3D transforms, triggered seamlessly on demand.
*   **Double-Tap / Double-Click Activation**: Intentional activation model utilizing `dblclick` (desktop) and tap-latency tracking (mobile) to enter/exit the interactive viewer state.
*   **Continuous Physics-based Lerp**: Features a custom GSAP tick-lerp loop that interpolates swipe movements at 60fps/120fps, translating even micro-swipes into fluid, elastic slide transitions.

### 📱 Touchscreen Adaptability
*   **Smart Device Detection**: Automatically disables power-heavy mouse-bound operations (such as custom squashing cursors, 3D parallax hero tilts, and magnetic grid buttons) on mobile to preserve battery life and prevent interaction conflicts.
*   **Responsive Scaling**: Layout images seamlessly scale from premium large viewports (`260px` x `360px` on desktop) down to neat, optimized boundaries (`180px` x `250px` on mobile) using pure media queries.

### 🚀 Performance & Polishing
*   **Zero FOUC (Flash of Unstyled Content)**: Pre-initialized CSS states ensure all images start hidden at `scale(0)` and text containers load at `opacity: 0` before GSAP splits and orchestrates them.
*   **WebP Modern Compression**: Standard image links use `.webp` assets to ensure instant loading speeds on high-latency mobile networks.

---

## 🛠️ Local Development & Commands

The app lives in [`next-js/`](./next-js). From that folder:

```bash
cd next-js
npm install
npm run dev      # http://localhost:3000
```

Production build:
```bash
npm run build && npm run start
```

---

## 📂 Project Structure
```text
Folioverze/
├── README.md
├── assets/                   # Source design files (not served)
│   ├── logo/                 # Brand logo SVGs (source for the generated icons)
│   └── projects/             # Original project screenshots (e.g. Drokpa)
└── next-js/                  # The Next.js app (single source of truth)
    ├── src/app/
    │   ├── page.tsx          # Core GSAP timelines, physics loop & touch mapping
    │   ├── globals.css       # Typography tokens & responsive layout
    │   ├── layout.tsx        # Root layout, metadata & fonts
    │   ├── icon.svg / favicon.ico / apple-icon.png / opengraph-image.png
    │   ├── manifest.ts / robots.ts / sitemap.ts
    │   └── privacy/          # Privacy Policy page
    └── public/               # video.mp4 + img1..15.webp + logo-mark.svg + icons
```

---

<p align="center">
  <sub>Built with precision by Folioverze — software & tech, from Assam, India.</sub>
</p>
