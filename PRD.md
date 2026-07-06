# Product Requirements Document (PRD)

## Project Name: Client Acquisition & Pitch Optimizer
**Author:** AI Coding Agent  
**Version:** 1.0.0  
**Target Platform:** Web (SPA + Node/Express Backend) & Desktop App (Electron)  

---

## 1. Executive Summary & Objective

### 1.1 Summary
The **Client Acquisition & Pitch Optimizer** is a premium, full-stack workflow engine designed specifically for software developers, technical freelancers, and boutique agency founders to systemize, streamline, and scale their cold outbound client acquisition campaigns. 

Many technical experts struggle with the sales and messaging aspect of freelancing. This platform bridges that gap by offering:
- An **interactive reverse-funnel planner** to visualize work-to-income equations.
- A **leads/prospect management CRM** to track target accounts.
- A **multi-step sequence builder** to design robust multi-touch campaigns.
- An **AI Personalization Engine** (powered by Gemini) that reads lead data (niche, tech stack, website, notes) and drafts highly personalized cold pitches.
- An **AI Critique Coach** to optimize custom pitches and identify profitable developer niches.

### 1.2 Desktop App Objective
To provide a dedicated desktop client version using **Electron.js** and build pipelines powered by **GitHub Actions** to support an offline-first and isolated desktop workflow.

---

## 2. Target Audience & Persona

1. **Freelance Software Engineers:** Developers with solid technical skills who need an easy-to-use pipeline builder to consistently book discovery calls.
2. **Technical Consultants:** Specialists selling high-value migration, performance optimization, or architectural audits.
3. **Agency Founders:** Boutique agency leaders looking to standardize outreach templates and use AI to inject high-context customization at scale.

---

## 3. Product Features & Functional Requirements

### 3.1 Client Acquisition Planner & Optimizer
*   **Goal:** Demystify acquisition work math.
*   **Requirements:**
    *   Dynamic sliders for Target Monthly Income, Average Project Size, Reply Rate, Booking Rate, and Deal Close Rate.
    *   Automatic calculations for daily/weekly outreach quotas, total deals needed, and intermediate funnel stage volumes (meetings, replies, pitches).
    *   Interactive reverse-funnel visual representation.
    *   Actionable strategic advice highlighting the leverage effect of increasing contract size and personalization reply rates.

### 3.2 Lead Board & CRM
*   **Goal:** Manage target client details and current campaign stages.
*   **Requirements:**
    *   Ability to add, edit, and delete leads.
    *   Key data points: Company Name, Contact Person, Email/LinkedIn Profile, Website, Target Tech Stack, Referral/Direct Source, Notes, and primary Pain Points.
    *   Dynamic status tracking (e.g., Prospect, Pitch Generated, Sent, Replied, Meeting Booked, Deal Closed-Won, Archived).
    *   High-contrast list view and responsive dialogs.

### 3.3 Outreach Campaign Sequences Designer
*   **Goal:** Plan follow-up cadences so developers don't give up after one email.
*   **Requirements:**
    *   Ability to create custom sequences (e.g., "SaaS Performance Audit Campaign").
    *   Multi-touch workflow containing dynamic steps (Day Delay, Channel Type e.g., Email, LinkedIn, Twitter, and Subject/Body template text).
    *   Inline step editing, re-ordering, deletion, and insertion.

### 3.4 AI Personalization Generator (Gemini Integration)
*   **Goal:** Create a high-converting, personalized cold pitch in seconds.
*   **Requirements:**
    *   Seamless integration with the modern `@google/genai` TypeScript SDK.
    *   The engine reads the selected prospect's context (notes, pain points, website, tech stack) and blends it into the selected campaign touchpoint template.
    *   Output: Personalized email body copy, customized subject line, "Bespoke Cold Index" response probability score, and an actionable tactical play.
    *   Actions to copy draft instantly or directly update the Lead's CRM status to "Sent".

### 3.5 AI Critique Coach & Niche Finder
*   **Goal:** Improve existing pitch quality and discover profitable markets.
*   **Requirements:**
    *   **Critique Panel:** Paste a custom pitch to receive 3 core actionable critiques on hook strength, CTA friction, value proposition, and an AI-optimized rewritten alternative.
    *   **Niche Suggestor:** Enter developer skills (e.g., "Next.js performance optimization") to output 3 high-margin niches, listing current SaaS/agency opportunities, key pain points, and specific high-converting hooks.

---

## 4. Technical Architecture & Tech Stack

```
   ┌────────────────────────────────────────────────────────┐
   │                  Electron Desktop Shell                │
   │  ┌───────────────────────┐   ┌───────────────────────┐ │
   │  │    Renderer Process   │   │     Main Process      │ │
   │  │   (Vite React Client) │◄─►│   (Express Backend)   │ │
   │  └───────────────────────┘   └───────────────────────┘ │
   └────────────────────────────────────────────────────────┘
```

### 4.1 System Components
*   **Frontend Client:** React 19, Vite, Tailwind CSS v4, Lucide React Icons, Motion animations.
*   **Backend Server:** Express.js + Node.js (running on port `3000`).
*   **AI Integration:** `@google/genai` (utilizing the state-of-the-art `gemini-3.5-flash` model).
*   **Desktop Shell:** Electron.js v43.0.0. In production, the Electron container launches the Express server as an internal background process and loads `http://localhost:3000` inside a chromeless wrapper.
*   **Persistence:** Dynamic context state with browser-safe standard state handlers.

---

## 5. CI/CD & Desktop Packaging (GitHub Actions)

To enable automatic compiling and packaging of installers across all operating systems:
- **Automation Engine:** GitHub Actions (`.github/workflows/build-desktop.yml`).
- **Matrix Build:** Builds concurrently on Windows, Linux, and macOS runtimes.
- **Packaging Utility:** `electron-builder`.
- **Target Formats:**
  - **Windows:** `.exe` (NSIS interactive installer)
  - **macOS:** `.dmg` (Apple disk image)
  - **Linux:** `.AppImage` (Universal standalone binary)

---

## 6. Non-Functional Requirements & Security

1. **API Key Safety:** The `GEMINI_API_KEY` is loaded strictly on the server-side / main process. It is never exposed to the client-side renderer process.
2. **Performance:** App startup takes under 2 seconds. AI personalization drafts render within 1.5 seconds.
3. **Accessibility:** Text elements conform to WCAG contrast requirements, using elegant Slate, Pink, Indigo, and Dark Slate premium colors.
4. **Resiliency:** If the Gemini API is offline or the user has not configured their key, the app gracefully alerts the user with helper text while maintaining full local CRM and planning features.
