# Client Acquisition Planner & AI Pitch Optimizer 🚀

An elite, full-stack workflow application and automated pipeline built to empower software engineers, technical consultants, and agency founders to scale their client acquisition. This app reverse-engineers revenue goals, designs multi-step campaigns, manages prospects, and uses Gemini AI to personalize cold outreach messages and optimize pitch hooks.

This project can be run as a **Full-Stack Web App** or packaged as a standalone **Multi-Platform Desktop Client** using Electron.js.

---

## 🌌 Key Highlights & Features

### 1. Reverse-Funnel Planner & Optimizer
- Input your target monthly income and average contract size.
- Calibrate reply rates, meeting conversion rates, and closed-won ratios.
- Automatically receive an actionable weekly/daily outreach quota to reach your goal.

### 2. Live Leads Board & CRM
- Register key prospects with rich technical contexts: company tech stack, custom notes, referral source, and specific pain points.
- Map pipeline status sequentially from prospect identification to contract signing.

### 3. Campaign Sequences Architect
- Design multi-touch follow-up sequences across multiple channels (Email, LinkedIn, Twitter).
- Control delay intervals (e.g., Touchpoint 1: Day 0, Touchpoint 2: Day 3).
- Craft reusable outreach templates using smart dynamic placeholders.

### 4. Gemini-Powered AI Pitch Personalizer
- Automatically matches a prospect's tech stack, notes, and pain points against sequence templates.
- Generates high-converting personalized pitches, subject lines, response metrics ("Bespoke Cold Index"), and situational optimization plays.

### 5. Pitch Critique Coach & Niche Finder
- **Critique Coach:** Analyze any existing pitch draft to receive constructive improvements and an elite rewrite.
- **Niche Finder:** Inputs your technical developer skills and outputs the 3 most profitable outbound client niches with pain points and specific hooks.

---

## 🛠️ Tech Stack & Architecture

- **Client SPA:** React 19, Vite, Tailwind CSS v4, Motion (animations), Lucide Icons.
- **Backend Service:** Express.js, Node.js, TSX (TS runner), esbuild.
- **AI Core:** `@google/genai` (utilizing the `gemini-3.5-flash` model).
- **Desktop Wrapper:** Electron.js (bundles Express and React into a single binary).
- **CI/CD Build System:** GitHub Actions (`electron-builder`).

---

## 🚀 Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Configuration
Create a `.env` file in the root directory and add your API key:
```env
# .env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Running the Web Version
Start the development server (runs both Vite frontend and Express backend concurrently via tsx):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 💻 Running & Packaging the Desktop App (Electron)

The application includes an integrated Electron setup where the desktop client starts the Express server locally on port 3000 in production.

### Run Desktop App in Development Mode
1. In one terminal, start the web dev server:
   ```bash
   npm run dev
   ```
2. In another terminal, boot up the Electron shell:
   ```bash
   npm run electron:start
   ```

### Package Desktop App Local Installer
Compile the React frontend, bundle the Express server, and compile an unpackaged folder version of the desktop app for testing:
```bash
npm run electron:build
```

To build a fully compressed, production-ready distributable installer (e.g., Windows `.exe`, macOS `.dmg`, or Linux `.AppImage` depending on your OS):
```bash
npm run electron:dist
```
The compiled installers will be saved in the `/dist-electron` directory.

---

## 🤖 CI/CD with GitHub Actions

A comprehensive CI/CD workflow is configured in `.github/workflows/build-desktop.yml`.

- **Platform Matrix:** Automatically builds and packages your desktop app concurrently on Windows, macOS, and Linux runtimes.
- **Trigger Points:** Launches on every push to the `main` branch, creation of version tags (e.g., `v1.0.0`), or manual triggers via the GitHub Action tab.
- **Artifacts:** Generates cross-platform installers and uploads them to GitHub Action artifacts or releases.

---

## 📂 Project Structure

```
├── .github/workflows/      # GitHub Actions CI/CD workflows
│   └── build-desktop.yml   # Multi-platform Electron packager
├── assets/                 # Brand assets, icons, and logos
├── electron/               # Electron main process & preloads
│   ├── main.cjs            # Electron main process script
│   └── preload.cjs         # Secure Electron preload bridging
├── src/                    # React 19 Client SPA
│   ├── components/         # Interactive UI views (CRM, Calculator, Generator)
│   ├── App.tsx             # Core application UI & navigator
│   ├── main.tsx            # React client mounting entry
│   └── index.css           # Global Tailwind v4 styles
├── server.ts               # Express Backend (Vite dev server + Gemini API)
├── package.json            # Scripts, dependencies, and packaging configurations
└── PRD.md                  # Detailed Product Requirements Document
```

---

## 🔒 Security Best Practices
- **Server-Side Credentials:** All Gemini AI model interactions occur inside the Express backend process. The `GEMINI_API_KEY` is loaded strictly on the server-side environment and is never sent to the renderer process.
- **Context Isolation:** Electron is configured with `contextIsolation: true` and `nodeIntegration: false`, preventing arbitrary frontend scripts from executing native Node.js APIs directly.
