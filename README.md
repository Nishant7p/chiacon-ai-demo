# Chiacon — AI Use Case Generator
### 48-Hour Take-Home Assignment · AI Consultant Role
 
**Live Site →** [https://chiacon-ai-demo.vercel.app](https://vercel.com/tomernishant43-2473s-projects/chiacon-ai-demo)
 
> Built end-to-end in 48 hours by **Nishant Tomer**
 
---
 
## Table of Contents
 
1. [Assignment Brief](#assignment-brief)
2. [What I Built](#what-i-built)
3. [Screenshots](#screenshots)
4. [Core AI Feature](#core-ai-feature)
5. [Beyond the Brief — 5 Extra Features](#beyond-the-brief--5-extra-features)
6. [Tech Stack](#tech-stack)
7. [Architecture](#architecture)
8. [Project Structure](#project-structure)
9. [How to Run Locally](#how-to-run-locally)
10. [Design Decisions](#design-decisions)
 
---
 
## Assignment Brief
 
The task was to build a simple, clean webpage that:
 
- Demonstrates Chiacon's AI capability
- Includes a headline, short description, and 2–3 AI use cases
- Has **one working AI feature** — specifically **Option A: AI Use Case Generator**
  - User inputs a business problem
  - AI returns: a problem summary, 2–3 AI opportunities, and expected business impact
- Must be deployed and accessible via a live link
- Must include a README explaining the stack and how it works
 
**Time limit: 48 hours.**
 
---
 
## What I Built
 
I delivered the full brief — and then went significantly further.
 
The result is a complete, production-grade single-page application with a polished brand identity, two input modes (wizard and all-at-once), strict enterprise guardrails on the AI layer, and five additional features that turn a demo into a real consulting tool.
 
The page is structured as follows:
 
- **Navigation** — sticky, blurred header with logo, section links, history dropdown, theme toggle, and CTA
- **Hero** — headline, subtext, two CTAs, and a capabilities card
- **Services** — four pillars (Analytics, RPA, QA, Project Catalysts) in a grid layout
- **AI Use Cases** — three real-world use case cards with context and Chiacon's approach
- **AI Demo** — the live AI Use Case Generator, the centrepiece of the assignment
 
---
 
## Screenshots
 
### Light Mode — Home
![Light Home](Assets/Light_Home.png)
 
### Dark Mode — Hero
![Dark Mode](Assets/DarkMode.png)
 
### Dark Mode — About / Services
![Dark Mode About](Assets/DarkMode_about.png)
 
### Light Mode — About / Services
![Light About](Assets/LightAbout.png)
 
### AI Demo — Input Panel
![AI Demo](Assets/AI_Demo.png)
 
### Step-by-Step Wizard Mode
![Sequential UI](Assets/Sequential_UI.png)
 
### AI Output — Full Results Panel
![UI Output](Assets/UI_output.png)
 
### Feature Highlight — ROI Calculator & Roadmap
![Feature](Assets/Feature.png)
 
### Results — History Inbox / Dropdown
![UI Inbox](Assets/UI_Inbox.png)
 
---
 
## Core AI Feature
 
### AI Use Case Generator
 
The user provides context about their business problem through one of two input modes:
 
**All-at-once mode** — The user selects chips for Industry, Company Size, Department, and Current Approach, then types a free-text description of the problem. Ctrl+Enter triggers generation.
 
**Step-by-step Wizard mode** — A guided, animated flow presents one question at a time with progress tracking, dot indicators, back/skip navigation, and auto-advance on chip selection.
 
Both modes call the same backend endpoint.
 
**What the AI returns:**
 
| Field | Description |
|---|---|
| `summary` | 2–3 sentence restatement of the core problem |
| `opportunities[3]` | Named solutions with tech stack and one-line explanation each |
| `roi_metrics.time_saved` | Punchy metric, max 10 words |
| `roi_metrics.cost_reduction` | Punchy metric, max 10 words |
| `roi_metrics.hours_saved_per_month` | Integer used by the ROI calculator |
| `roadmap[3]` | Phase name, timeframe, and one-line description for each of 3 delivery phases |
 
**Enterprise Guardrails:** Every request is validated before a response is returned. Off-topic inputs (general knowledge, jokes, creative writing), vague inputs ("help me"), and inappropriate content all return `isValid: false` with a polite professional message. The frontend surfaces this cleanly — it never treats a rejected input as an error.
 
**Follow-up / Refinement:** After a result is generated, a follow-up bar appears with five quick-chip prompts (cost reduction, implementation steps, prioritisation, risks, timeline) and a free-text input. Follow-up messages are appended to the full conversation history and sent back to the API, so the model has full context for each refinement.
 
---
 
## Beyond the Brief — 5 Extra Features
 
The assignment asked for one working AI feature. I implemented five additional production-quality features to demonstrate what a real consultant-grade tool looks like.
 
---
 
### 1. Global Dark / Light Mode Toggle
 
**Where:** Top navigation bar — Sun/Moon icon button, rightmost before the CTA.
 
**What it does:** Flips the entire site's colour palette between a clean light scheme and a deep navy dark scheme. The transition is smooth (CSS `transition: background .25s`). The preference is persisted to `localStorage` so it survives page refresh and return visits.
 
**How it works:** CSS variables on `:root` define the light palette. A `[data-theme="dark"]` attribute selector on the `<html>` element overrides those variables. `initTheme()` reads from `localStorage` on page load. `toggleTheme()` flips the attribute and writes back.
 
No framework, no class toggling on hundreds of elements — one attribute change cascades through the entire design via CSS inheritance.
 
> Screenshot: compare `Light_Home.png` vs `DarkMode.png`
 
---
 
### 2. Session History (Local Storage)
 
**Where:** "Recent" button in the navigation bar, opens a dropdown panel.
 
**What it does:** Every time a valid AI analysis is successfully generated, the full JSON result, the user's context answers, and a timestamp are saved to `localStorage`. Up to 5 entries are retained (oldest is dropped). Clicking a past entry instantly re-renders the full report — no API call, no waiting.
 
**How it works:** `saveAnalysisToHistory()` writes to `localStorage` under the key `chiacon_history`. `renderHistoryDropdown()` builds the panel HTML from the stored list. `loadHistoryEntry()` reconstructs the conversation array (for follow-up continuity), calls `renderResult()` with `isInstant: true` (which bypasses typewriter animations), and scrolls the result panel into view.
 
This means a user can generate multiple analyses for different clients and switch between them instantly.
 
> Screenshot: `UI_Inbox.png`
 
---
 
### 3. Interactive "Real ROI" Calculator
 
**Where:** Below the three ROI metric cards, inside the result panel.
 
**What it does:** A horizontal slider lets the user set an average employee hourly rate ($20–$200/hr, defaulting to $40). As the slider moves, a large serif dollar figure updates in real-time: `hours_saved_per_month × hourly_rate × 12 = annual value recovered`.
 
**Why this matters:** The AI returns a raw integer (`hours_saved_per_month`) derived specifically from the problem described. The calculator makes that number personal — a logistics company and a fintech startup have very different hourly rates, and the tool reflects that instantly.
 
**Backend change:** `roi_metrics.timeline` was replaced with `roi_metrics.hours_saved_per_month` (integer) and the existing string fields were constrained to 10 words maximum via the system prompt, enforcing punchy metrics rather than verbose descriptions.
 
The calculator block is hidden from the `@media print` PDF export — it's an interactive tool, not a static report element.
 
> Screenshot: `Feature.png`
 
---
 
### 4. Executive Audio Briefing (Web Speech API)
 
**Where:** Inside the "Problem Summary" block header, to the left of the Copy button.
 
**What it does:** Clicking "▶ Play Briefing" reads the generated summary text aloud using the browser's native `SpeechSynthesis` API. The button changes to "⏹ Stop" while playing. Clicking again cancels playback immediately. The button and state are automatically reset if the user generates a new analysis, loads history, or resets the form.
 
**Why this matters:** It's a genuine differentiator for a consulting demo — an executive can listen to the AI-generated problem summary without reading, which is how real briefings are consumed.
 
**How it works:** `startAudioBriefing()` creates a `SpeechSynthesisUtterance`, sets rate and pitch, attaches `onend` and `onerror` handlers to reset the button state, and calls `window.speechSynthesis.speak()`. No third-party library. No API call. Zero cost.
 
The audio button is hidden from the `@media print` CSS so it never appears in the downloaded PDF report.
 
---
 
### 5. Dynamic Visual Implementation Roadmap
 
**Where:** Below the ROI calculator, inside the result panel.
 
**What it does:** Renders a horizontal three-step CSS Flexbox stepper showing the implementation journey. Each phase has a numbered circle, a phase name, a pill-style timeframe badge, and a one-line description. A subtle horizontal line connects the three circles.
 
**Backend change:** `roi_metrics.timeline` (a single string) was replaced with `roadmap` — a top-level array of exactly 3 objects: `{ phase, timeframe, description }`. The system prompt enforces exactly 3 phases and requires problem-specific content (not boilerplate).
 
**Print compatibility:** The roadmap renders correctly in the PDF export. The `@media print` block forces light background colours, removes dark glassmorphism borders, and overrides `display: none` so the block always appears in the printed report. On mobile, the stepper switches from horizontal to vertical (column layout) via a media query.
 
`renderRoadmapStepper()` maps the array to HTML — the connecting line is a CSS `::before` pseudo-element on the stepper container, positioned absolutely between the first and last circle.
 
> Screenshot: `Feature.png`
 
---
 
## Tech Stack
 
| Layer | Technology | Reason |
|---|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript | Zero build step, instant deploy, complete control over every pixel |
| Fonts | Instrument Serif + DM Sans (Google Fonts) | Editorial serif for headings; refined sans for UI — matches Chiacon's professional tone |
| AI Model | Google Gemini 2.5 Flash | Fast, high-quality JSON output; `responseMimeType: 'application/json'` enforces structured responses natively |
| Backend | Vercel Serverless Function (Node.js) | Single `api/chat.js` file; handles the API key server-side so it is never exposed to the client |
| Deployment | Vercel | Zero-config deploy from a single HTML file + one API route |
| Storage | Browser `localStorage` | No database needed; history and theme preferences are per-user and client-side |
| Speech | Native `window.speechSynthesis` | No dependency, no cost, works in all modern browsers |
 
---
 
## Architecture
 
```
Browser (index.html)
│
│  User fills context + problem
│  JS calls /api/chat with conversation history array
│
▼
Vercel Serverless Function (api/chat.js)
│
│  Attaches system prompt (guardrails + JSON schema)
│  Forwards to Gemini 2.5 Flash API
│  Returns raw JSON text to browser
│
▼
Browser
│
│  Strips any markdown fences
│  JSON.parse() the response
│  Validates isValid flag
│  Renders result with typewriter animation
│  Saves to localStorage history
```
 
**Conversation continuity:** The full message history array (user + assistant turns) is maintained in a `conversation` variable and sent with every request. This means follow-up questions have full context — the model knows what it already recommended and can refine or expand on it.
 
**No streaming:** The full JSON must be valid before it can be rendered, so streaming is intentionally not used. The loading animation (cycling through three "thinking" steps) provides perceived responsiveness.
 
---
 
## Project Structure
 
```
chiacon-ai-demo/
├── index.html          # Entire frontend — HTML, CSS, JS in one file
├── api/
│   └── chat.js         # Vercel serverless function — Gemini API proxy
├── Assets/
│   ├── Light_Home.png
│   ├── DarkMode.png
│   ├── DarkMode_about.png
│   ├── LightAbout.png
│   ├── AI_Demo.png
│   ├── Sequential_UI.png
│   ├── UI_output.png
│   ├── Feature.png
│   └── UI_Inbox.png
└── README.md
```
 
The entire frontend is a single `index.html` file — no bundler, no framework, no build step. This was a deliberate choice: the assignment asked for a working prototype delivered fast, and a single-file architecture means zero configuration overhead and instant Vercel deployment.
 
---
 
## How to Run Locally
 
**Prerequisites:** Node.js 18+, a Vercel account (free), a Gemini API key (free tier available at [aistudio.google.com](https://aistudio.google.com)).
 
```bash
# 1. Clone the repository
git clone https://github.com/your-username/chiacon-ai-demo.git
cd chiacon-ai-demo
 
# 2. Install Vercel CLI
npm install -g vercel
 
# 3. Create a local environment file
echo "GEMINI_API_KEY=your_key_here" > .env.local
 
# 4. Run locally
vercel dev
```
 
Open `http://localhost:3000` in your browser. The serverless function runs locally via Vercel Dev — no separate backend server needed.
 
**To deploy:**
 
```bash
vercel --prod
```
 
Set `GEMINI_API_KEY` as an Environment Variable in your Vercel project dashboard under Settings → Environment Variables.
 
---
