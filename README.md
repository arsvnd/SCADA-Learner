# SCADA & IIoT Mastery — Personal Study Platform

A self-hosted, AI-powered study platform for the 11-module SCADA/IIoT curriculum. Built to be hosted on GitHub Pages with direct Anthropic API integration.

## Features

- **11 modules × 5 days** — complete structured curriculum
- **AI-generated study notes** — fresh, personalized notes per session via Claude API
- **AI tutor chatbot** — ask questions in context, get answers tied to your background
- **Progress tracking** — saved in browser localStorage
- **Study streak tracking** — stay motivated
- **Quick quiz** — on-demand quizzes per session

## Setup on GitHub Pages

### Step 1 — Fork or upload to GitHub

1. Create a new repository on GitHub (e.g. `scada-study`)
2. Upload all files (`index.html`, `style.css`, `app.js`, `data.js`)
3. Go to **Settings → Pages** → set Source to `main` branch, root folder
4. Your site will be live at `https://yourusername.github.io/scada-study/`

### Step 2 — Get your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. On the study site, click **⚙ API Settings** and paste your key

Your key is stored only in your browser's localStorage — it never leaves your device except when making calls directly to Anthropic.

## Usage

1. Open the site
2. Add your Anthropic API key via Settings
3. Click any module/day in the sidebar, or hit **Start / Continue Learning**
4. Click **⚡ Load Today's Notes** to generate your study session
5. Use the **AI Tutor** panel to ask questions
6. Click **✓ Mark Session Complete** when done — it auto-advances

## File Structure

```
index.html    — App shell and HTML structure
style.css     — Industrial dark theme
app.js        — Application logic + Anthropic API calls
data.js       — Course data (all 11 modules, 55 sessions)
README.md     — This file
```

## Privacy

- API key stored in browser localStorage only
- No backend, no server, no tracking
- All API calls go directly from your browser to `api.anthropic.com`

## Customization

To add your own notes or modify topics, edit the `COURSE_DATA` object in `data.js`.

---

Built for the SCADA/IIoT → OT Integration Engineer transition path.
