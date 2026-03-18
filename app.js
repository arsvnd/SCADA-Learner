// ============================================================
// SCADA/IIoT Learning App — Main Application (Gemini API)
// ============================================================

const GEMINI_MODEL = 'gemini-1.5-flash';
function geminiUrl(key) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
}

async function callGemini(apiKey, systemPrompt, userMessage, history = []) {
  // Build contents array: system turn + history + new user message
  const contents = [];

  // Gemini doesn't have a system role — prepend as first user/model exchange
  contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
  contents.push({ role: 'model', parts: [{ text: 'Understood. I am ready to help.' }] });

  // Add conversation history (already in {role, content} format)
  for (const msg of history) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  // Add current user message
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const response = await fetch(geminiUrl(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: { maxOutputTokens: 2500, temperature: 0.7 }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Gemini API error ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── State ────────────────────────────────────────────────────
const state = {
  currentView: 'dashboard',
  currentModule: 1,
  currentDay: 1,
  notesLoaded: false,
  chatHistory: [],
  apiKey: '',
  progress: {}, // { "1-1": true, "1-2": true, ... }
  studyDates: [], // ["2024-03-18", ...]
  lastStudyDate: null,
};

// ── Init ─────────────────────────────────────────────────────
function init() {
  loadState();
  renderSidebar();
  renderDashboard();
  bindEvents();
  updateStreakBadge();
  checkApiKey();
}

function loadState() {
  try {
    const saved = localStorage.getItem('scada_progress');
    if (saved) Object.assign(state.progress, JSON.parse(saved));
    const dates = localStorage.getItem('scada_study_dates');
    if (dates) state.studyDates = JSON.parse(dates);
    state.apiKey = localStorage.getItem('scada_api_key') || '';
    const last = localStorage.getItem('scada_last_session');
    if (last) {
      const parsed = JSON.parse(last);
      state.currentModule = parsed.module || 1;
      state.currentDay = parsed.day || 1;
    }
  } catch (e) {}
}

function saveState() {
  localStorage.setItem('scada_progress', JSON.stringify(state.progress));
  localStorage.setItem('scada_study_dates', JSON.stringify(state.studyDates));
  localStorage.setItem('scada_last_session', JSON.stringify({
    module: state.currentModule,
    day: state.currentDay
  }));
}

// ── Progress helpers ──────────────────────────────────────────
function isComplete(moduleId, day) {
  return !!state.progress[`${moduleId}-${day}`];
}

function markComplete(moduleId, day) {
  state.progress[`${moduleId}-${day}`] = true;
  const today = new Date().toISOString().split('T')[0];
  if (!state.studyDates.includes(today)) {
    state.studyDates.push(today);
  }
  saveState();
}

function getModuleProgress(moduleId) {
  const mod = getModule(moduleId);
  if (!mod) return 0;
  const done = mod.days.filter(d => isComplete(moduleId, d.day)).length;
  return Math.round((done / mod.days.length) * 100);
}

function getOverallProgress() {
  const total = COURSE_DATA.modules.reduce((sum, m) => sum + m.days.length, 0);
  const done = Object.keys(state.progress).filter(k => state.progress[k]).length;
  return Math.round((done / total) * 100);
}

function getStreak() {
  if (!state.studyDates.length) return 0;
  const sorted = [...state.studyDates].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev - curr) / 86400000;
    if (Math.round(diff) === 1) streak++;
    else break;
  }
  return streak;
}

function getNextSession() {
  for (const mod of COURSE_DATA.modules) {
    for (const d of mod.days) {
      if (!isComplete(mod.id, d.day)) return { moduleId: mod.id, day: d.day };
    }
  }
  return { moduleId: 11, day: 5 };
}

// ── Render Sidebar ─────────────────────────────────────────────
function renderSidebar() {
  const nav = document.getElementById('moduleNav');
  nav.innerHTML = '';

  for (const phase of COURSE_DATA.phases) {
    const phaseEl = document.createElement('div');
    phaseEl.className = 'phase-group';

    const phaseHeader = document.createElement('div');
    phaseHeader.className = 'phase-group-header';
    phaseHeader.innerHTML = `<span class="phase-dot" style="background:${phase.color}"></span><span>${phase.title}</span>`;
    phaseEl.appendChild(phaseHeader);

    for (const modId of phase.modules) {
      const mod = getModule(modId);
      const pct = getModuleProgress(modId);
      const isActive = state.currentModule === modId;

      const modEl = document.createElement('div');
      modEl.className = `nav-module${isActive ? ' active' : ''}`;
      modEl.dataset.moduleId = modId;
      modEl.innerHTML = `
        <div class="nav-mod-header">
          <span class="nav-mod-num">${modId.toString().padStart(2, '0')}</span>
          <span class="nav-mod-title">${mod.shortTitle}</span>
          ${pct === 100 ? '<span class="nav-mod-check">✓</span>' : ''}
        </div>
        <div class="nav-mod-progress">
          <div class="nav-mod-bar" style="width:${pct}%;background:${phase.color}"></div>
        </div>
      `;

      // Days sub-list (expandable)
      const daysEl = document.createElement('div');
      daysEl.className = `nav-days${isActive ? ' open' : ''}`;
      mod.days.forEach(d => {
        const done = isComplete(modId, d.day);
        const isCurrent = state.currentModule === modId && state.currentDay === d.day;
        const dayEl = document.createElement('div');
        dayEl.className = `nav-day${done ? ' done' : ''}${isCurrent ? ' current' : ''}`;
        dayEl.dataset.module = modId;
        dayEl.dataset.day = d.day;
        dayEl.innerHTML = `<span class="day-dot">${done ? '✓' : d.day}</span><span>${d.title}</span>`;
        daysEl.appendChild(dayEl);
      });

      modEl.appendChild(daysEl);
      modEl.addEventListener('click', (e) => {
        if (e.target.closest('.nav-day')) return;
        toggleModuleNav(modId);
      });
      phaseEl.appendChild(modEl);
    }

    nav.appendChild(phaseEl);
  }

  // Day click events
  nav.querySelectorAll('.nav-day').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const moduleId = parseInt(el.dataset.module);
      const day = parseInt(el.dataset.day);
      openSession(moduleId, day);
    });
  });

  // Update overall bar
  const pct = getOverallProgress();
  const bar = document.getElementById('overallBar');
  const pctEl = document.getElementById('overallPct');
  if (bar) bar.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}

function toggleModuleNav(moduleId) {
  const nav = document.getElementById('moduleNav');
  const modEls = nav.querySelectorAll('.nav-module');
  modEls.forEach(el => {
    const isThis = parseInt(el.dataset.moduleId) === moduleId;
    el.classList.toggle('active', isThis);
    const days = el.querySelector('.nav-days');
    if (days) days.classList.toggle('open', isThis);
  });
}

// ── Render Dashboard ───────────────────────────────────────────
function renderDashboard() {
  const next = getNextSession();
  const completedModules = COURSE_DATA.modules.filter(m => getModuleProgress(m.id) === 100).length;
  const daysStudied = state.studyDates.length;

  document.getElementById('statDaysStudied').textContent = daysStudied;
  document.getElementById('statModulesComplete').textContent = `${completedModules}/11`;
  document.getElementById('statDaysStreak').textContent = getStreak();
  document.getElementById('statNextUp').textContent = `M${next.moduleId}·D${next.day}`;

  const grid = document.getElementById('phasesGrid');
  grid.innerHTML = '';

  for (const phase of COURSE_DATA.phases) {
    const card = document.createElement('div');
    card.className = 'phase-card';
    card.style.setProperty('--phase-color', phase.color);
    card.style.setProperty('--phase-color-light', phase.colorLight);

    const totalDays = phase.modules.reduce((sum, mid) => sum + getModule(mid).days.length, 0);
    const doneDays = phase.modules.reduce((sum, mid) => {
      return sum + getModule(mid).days.filter(d => isComplete(mid, d.day)).length;
    }, 0);
    const pct = Math.round((doneDays / totalDays) * 100);

    card.innerHTML = `
      <div class="phase-card-top">
        <div class="phase-card-num">Phase ${phase.id}</div>
        <div class="phase-card-weeks">Weeks ${phase.weeks}</div>
      </div>
      <div class="phase-card-title">${phase.title}</div>
      <div class="phase-card-mods">${phase.modules.length} module${phase.modules.length > 1 ? 's' : ''} · ${totalDays} days</div>
      <div class="phase-card-bar-wrap">
        <div class="phase-card-bar" style="width:${pct}%"></div>
      </div>
      <div class="phase-card-pct">${pct}%</div>
    `;

    card.addEventListener('click', () => {
      const firstMod = phase.modules[0];
      const mod = getModule(firstMod);
      const firstIncomplete = mod.days.find(d => !isComplete(firstMod, d.day));
      openSession(firstMod, firstIncomplete ? firstIncomplete.day : 1);
    });

    grid.appendChild(card);
  }
}

// ── Open Study Session ─────────────────────────────────────────
function openSession(moduleId, day) {
  state.currentModule = moduleId;
  state.currentDay = day;
  state.notesLoaded = false;
  state.chatHistory = [];
  saveState();

  showView('study');
  renderSidebar();
  renderSession();
}

function renderSession() {
  const mod = getModule(state.currentModule);
  const dayData = getDayData(state.currentModule, state.currentDay);
  const phase = getPhaseForModule(state.currentModule);

  if (!mod || !dayData) return;

  // Header
  document.getElementById('sessionMeta').textContent = `Module ${state.currentModule} · Day ${state.currentDay} of ${mod.days.length}`;
  document.getElementById('sessionTitle').textContent = dayData.title;
  document.getElementById('topbarTitle').textContent = `${mod.shortTitle} — Day ${state.currentDay}`;

  // Tags
  const tagsEl = document.getElementById('sessionTags');
  tagsEl.innerHTML = dayData.keywords.slice(0, 5).map(k =>
    `<span class="tag" style="border-color:${phase.color}20;color:${phase.color}">${k}</span>`
  ).join('');

  // Content area
  const contentArea = document.getElementById('contentArea');
  if (isComplete(state.currentModule, state.currentDay)) {
    contentArea.innerHTML = `
      <div class="content-placeholder completed">
        <div class="placeholder-icon">✓</div>
        <p>You've completed this session. Load notes to review.</p>
      </div>`;
  } else {
    contentArea.innerHTML = `
      <div class="content-placeholder">
        <div class="placeholder-icon" style="color:${phase.color}">⬡</div>
        <p>Ready to study? Click <strong>Load Today's Notes</strong> to generate your session.</p>
        <div class="session-topics-preview">
          ${dayData.topics.map(t => `<div class="topic-pill">• ${t}</div>`).join('')}
        </div>
      </div>`;
  }

  // Buttons
  document.getElementById('loadNotesBtn').style.display = 'inline-flex';
  document.getElementById('markDoneBtn').style.display = 'none';
  document.getElementById('quizBtn').style.display = 'none';

  // AI tutor context
  document.getElementById('tutorContext').textContent = `M${state.currentModule} D${state.currentDay}`;

  // Quick prompts
  const prompts = getQuickPrompts(state.currentModule, state.currentDay);
  const qpEl = document.getElementById('quickPrompts');
  qpEl.innerHTML = prompts.map(p =>
    `<button class="quick-prompt-btn">${p}</button>`
  ).join('');
  qpEl.querySelectorAll('.quick-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => sendChat(btn.textContent));
  });

  // Clear chat
  document.getElementById('chatMessages').innerHTML = `
    <div class="chat-welcome">
      <p>I'm here to help with <strong>${dayData.title}</strong>. Ask anything — I'll tie it back to your controls & automation background.</p>
    </div>`;
}

// ── Load Study Notes via API ───────────────────────────────────
async function loadNotes() {
  if (!state.apiKey) {
    showApiModal();
    return;
  }

  const mod = getModule(state.currentModule);
  const dayData = getDayData(state.currentModule, state.currentDay);
  const phase = getPhaseForModule(state.currentModule);
  const contentArea = document.getElementById('contentArea');

  contentArea.innerHTML = `<div class="loading-notes"><div class="spinner"></div><p>Generating study notes for ${dayData.title}…</p></div>`;

  const prompt = buildNotesPrompt(mod, dayData, phase);

  try {
    const text = await callGemini(state.apiKey, 'You are an expert SCADA/IIoT instructor.', prompt);
    renderNotes(text, phase);

    state.notesLoaded = true;
    document.getElementById('markDoneBtn').style.display = 'inline-flex';
    document.getElementById('quizBtn').style.display = 'inline-flex';

    if (isComplete(state.currentModule, state.currentDay)) {
      document.getElementById('markDoneBtn').textContent = '✓ Completed';
      document.getElementById('markDoneBtn').disabled = true;
    }

  } catch (err) {
    contentArea.innerHTML = `<div class="error-msg"><strong>Error loading notes:</strong> ${err.message}<br><br>Check your API key in Settings.</div>`;
  }
}

function buildNotesPrompt(mod, dayData, phase) {
  return `You are an expert SCADA/IIoT instructor creating personalized daily study notes.

STUDENT CONTEXT:
- Background: Electrical wiring, panel assembly (Rockwell Automation), Siemens HMI diagnostics, MES/SAP exposure, Python skills
- Goal: Transition to Controls/Automation Engineer or OT Integration Engineer role
- Already knows: Allen-Bradley systems, ladder logic basics, 4-20mA signals, panel wiring

TODAY'S SESSION:
- Module ${mod.id}: ${mod.title}
- Phase: ${phase.title}
- Day ${dayData.day} of 5: ${dayData.title}
- Topics to cover: ${dayData.topics.join('; ')}
- Key terms: ${dayData.keywords.join(', ')}

INSTRUCTIONS:
Write comprehensive study notes for this session. Format using markdown with these sections:

## Overview
2-3 sentence orientation for this day's content and why it matters.

## Core Concepts
For each topic listed above, write a clear explanation (3-5 sentences each). Where relevant, tie it to Allen-Bradley/Rockwell systems or the student's existing background in panel wiring and HMI work. Use concrete industrial examples.

## Key Terms & Definitions
A clean glossary table (Term | Definition | Why It Matters) for the keywords listed.

## How It Works in Practice
A real-world scenario or walkthrough showing these concepts in action. Be specific — name actual products, protocols, signal types.

## Ash's Advantage
1-2 sentences about how the student's existing background (Rockwell, Siemens HMI, wiring) gives them a head start with today's material.

## Quick Check
3 short questions to verify understanding (no answers — these are for self-testing). Make them practical, not just definition recall.

## Coming Up Next
One sentence bridging to the next day or module.

Keep the tone technical but clear. Avoid generic filler — every sentence should teach something.`;
}

function renderNotes(markdown, phase) {
  const contentArea = document.getElementById('contentArea');
  const html = markdownToHtml(markdown, phase.color);
  contentArea.innerHTML = `<div class="notes-content">${html}</div>`;
}

// Simple markdown renderer
function markdownToHtml(md, accentColor) {
  return md
    .replace(/^## (.+)$/gm, `<h2 style="color:${accentColor}">$1</h2>`)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(' | ');
      return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, match => {
      const rows = match.trim().split('\n');
      const header = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      const body = rows.slice(2).join('\n');
      return `<div class="table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
    })
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hut]|<li|<\/|<div|<table)(.+)$/gm, '$1')
    .replace(/<\/p><p>(<[h2-3]|<ul|<div)/g, '$1')
    .replace(/^<p>(<h[23]|<ul|<div)/, '$1');
}

// ── Quick Quiz ─────────────────────────────────────────────────
async function loadQuiz() {
  if (!state.apiKey) { showApiModal(); return; }

  const mod = getModule(state.currentModule);
  const dayData = getDayData(state.currentModule, state.currentDay);

  const userMsg = `Generate a 5-question multiple choice quiz for Module ${mod.id} Day ${dayData.day}: "${dayData.title}". 

Topics: ${dayData.topics.join('; ')}

Format each question as:
Q: [question]
A) [option]
B) [option]  
C) [option]
D) [option]
Answer: [letter] — [brief explanation]

Make questions practical and industrial-focused, not just definition recall. Tie them to real plant scenarios.`;

  sendChat(userMsg, true);
}

// ── Chat / AI Tutor ────────────────────────────────────────────
async function sendChat(userMessage, isSystem = false) {
  if (!state.apiKey) {
    showApiModal();
    return;
  }

  if (!userMessage.trim()) return;

  const chatMessages = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');

  if (!isSystem) input.value = '';

  // Add user message to UI
  chatMessages.innerHTML += `
    <div class="chat-msg user">
      <div class="chat-bubble">${escapeHtml(userMessage)}</div>
    </div>`;

  // Add thinking indicator
  const thinkingId = 'thinking-' + Date.now();
  chatMessages.innerHTML += `
    <div class="chat-msg ai" id="${thinkingId}">
      <div class="chat-bubble thinking"><span></span><span></span><span></span></div>
    </div>`;
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Build message history
  const mod = getModule(state.currentModule);
  const dayData = getDayData(state.currentModule, state.currentDay);
  const phase = getPhaseForModule(state.currentModule);

  const systemPrompt = `You are an expert SCADA/IIoT tutor helping a student named Ash who is transitioning into an OT Integration Engineer / Controls Engineer role.

STUDENT BACKGROUND:
- Hands-on: panel wiring, cabinet assembly at Rockwell Automation, Siemens HMI diagnostics, MES/SAP exposure
- Knows: Allen-Bradley ladder logic basics, 4-20mA loops, signal conditioning, panel wiring
- Upskilling: Studio 5000, SCADA systems, industrial communications, cloud/IIoT
- Python proficient — can write scripts and data pipelines

CURRENT STUDY CONTEXT:
- Module ${state.currentModule} (Phase: ${phase.title}): ${mod.title}
- Day ${state.currentDay}: ${dayData.title}
- Topics today: ${dayData.topics.join('; ')}

TUTOR GUIDELINES:
- Be concise but thorough. No fluffy preambles.
- Always tie abstract concepts to concrete industrial examples (specific products, signal types, real plant scenarios).
- When explaining protocols or architectures, relate them to Allen-Bradley/Rockwell systems when relevant.
- For code questions, use Python with industrial libraries (pycomm3, snap7, etc.) where appropriate.
- If asked to quiz, make questions practical and scenario-based.
- Format responses with markdown (headers, bold, code blocks) for readability.`;

  state.chatHistory.push({ role: 'user', content: userMessage });

  try {
    const aiText = await callGemini(
      state.apiKey,
      systemPrompt,
      userMessage,
      state.chatHistory.slice(-10, -1) // history without the message we just pushed
    );

    state.chatHistory.push({ role: 'assistant', content: aiText });

    // Replace thinking with real response
    const thinkingEl = document.getElementById(thinkingId);
    if (thinkingEl) {
      thinkingEl.outerHTML = `
        <div class="chat-msg ai">
          <div class="chat-bubble ai-response">${markdownToHtml(aiText, '#378ADD')}</div>
        </div>`;
    }
  } catch (err) {
    const thinkingEl = document.getElementById(thinkingId);
    if (thinkingEl) {
      thinkingEl.outerHTML = `
        <div class="chat-msg ai">
          <div class="chat-bubble error">Error: ${err.message}</div>
        </div>`;
    }
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ── Navigation & UI ────────────────────────────────────────────
function showView(viewName) {
  state.currentView = viewName;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
  if (target) target.classList.add('active');
}

function updateStreakBadge() {
  const streak = getStreak();
  const badge = document.getElementById('streakBadge');
  if (badge) {
    badge.textContent = streak > 0 ? `🔥 ${streak}` : '';
    badge.style.display = streak > 0 ? 'inline-flex' : 'none';
  }
}

function showApiModal() {
  document.getElementById('modalOverlay').classList.add('open');
  const input = document.getElementById('apiKeyInput');
  if (state.apiKey) input.value = state.apiKey;
}

function hideModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function checkApiKey() {
  const status = document.getElementById('apiStatus');
  if (state.apiKey) {
    status.innerHTML = '<span class="status-ok">✓ API key saved</span>';
  } else {
    status.innerHTML = '<span class="status-warn">No API key — AI features disabled</span>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ── Event Bindings ─────────────────────────────────────────────
function bindEvents() {
  // Sidebar toggle
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main').classList.toggle('sidebar-collapsed');
  });
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('mobile-open');
  });

  // Continue button on dashboard
  document.getElementById('continueBtn').addEventListener('click', () => {
    const next = getNextSession();
    openSession(next.moduleId, next.day);
  });

  // Load notes
  document.getElementById('loadNotesBtn').addEventListener('click', loadNotes);

  // Mark done
  document.getElementById('markDoneBtn').addEventListener('click', () => {
    markComplete(state.currentModule, state.currentDay);
    document.getElementById('markDoneBtn').textContent = '✓ Completed';
    document.getElementById('markDoneBtn').disabled = true;
    updateStreakBadge();
    renderSidebar();

    // Auto-advance after 1.5s
    setTimeout(() => {
      const mod = getModule(state.currentModule);
      if (state.currentDay < mod.days.length) {
        openSession(state.currentModule, state.currentDay + 1);
      } else {
        const nextModIdx = COURSE_DATA.modules.findIndex(m => m.id === state.currentModule);
        if (nextModIdx < COURSE_DATA.modules.length - 1) {
          const nextMod = COURSE_DATA.modules[nextModIdx + 1];
          openSession(nextMod.id, 1);
        } else {
          showView('dashboard');
          renderDashboard();
        }
      }
    }, 1500);
  });

  // Quiz button
  document.getElementById('quizBtn').addEventListener('click', loadQuiz);

  // Chat send
  document.getElementById('chatSend').addEventListener('click', () => {
    sendChat(document.getElementById('chatInput').value);
  });
  document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat(document.getElementById('chatInput').value);
    }
  });

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', showApiModal);
  document.getElementById('modalClose').addEventListener('click', hideModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) hideModal();
  });

  // API key save
  document.getElementById('saveApiKey').addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (key) {
      state.apiKey = key;
      localStorage.setItem('scada_api_key', key);
      checkApiKey();
      hideModal();
    }
  });
  document.getElementById('clearApiKey').addEventListener('click', () => {
    state.apiKey = '';
    localStorage.removeItem('scada_api_key');
    document.getElementById('apiKeyInput').value = '';
    checkApiKey();
  });
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
