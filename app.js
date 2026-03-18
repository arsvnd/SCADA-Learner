// ============================================================
// SCADA/IIoT Learning App — Main Application (Groq API)
// ============================================================

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function callGroq(apiKey, systemPrompt, userMessage, history = []) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    { role: 'user', content: userMessage }
  ];
  const response = await fetch(GROQ_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: GROQ_MODEL, max_tokens: 2500, temperature: 0.7, messages })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Groq API error ${response.status}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ── State ─────────────────────────────────────────────────────
const S = {
  module: 1,
  day: 1,
  apiKey: '',
  progress: {},
  studyDates: [],
  chatHistory: [],
  notesLoaded: false,
};

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderHome();
  bindAll();
});

function loadState() {
  try {
    const p = localStorage.getItem('sp'); if (p) Object.assign(S.progress, JSON.parse(p));
    const d = localStorage.getItem('sd'); if (d) S.studyDates = JSON.parse(d);
    S.apiKey = localStorage.getItem('sk') || '';
    const last = localStorage.getItem('sl'); if (last) { const l = JSON.parse(last); S.module = l.m || 1; S.day = l.d || 1; }
  } catch(e) {}
}

function save() {
  localStorage.setItem('sp', JSON.stringify(S.progress));
  localStorage.setItem('sd', JSON.stringify(S.studyDates));
  localStorage.setItem('sl', JSON.stringify({ m: S.module, d: S.day }));
}

// ── Helpers ───────────────────────────────────────────────────
const done = (m, d) => !!S.progress[`${m}-${d}`];
const modPct = (mid) => { const mod = getModule(mid); const c = mod.days.filter(d => done(mid, d.day)).length; return Math.round(c / mod.days.length * 100); };
const totalDone = () => Object.values(S.progress).filter(Boolean).length;
const streak = () => {
  if (!S.studyDates.length) return 0;
  const sorted = [...S.studyDates].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (sorted[0] !== today && sorted[0] !== yest) return 0;
  let s = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (Math.round((new Date(sorted[i-1]) - new Date(sorted[i])) / 86400000) === 1) s++;
    else break;
  }
  return s;
};
const nextSession = () => {
  for (const mod of COURSE_DATA.modules)
    for (const d of mod.days)
      if (!done(mod.id, d.day)) return { m: mod.id, d: d.day };
  return { m: 11, d: 5 };
};

// ── Render Home ───────────────────────────────────────────────
function renderHome() {
  const total = 55;
  const completed = totalDone();
  document.getElementById('homeBarFill').style.width = Math.round(completed / total * 100) + '%';
  document.getElementById('homeBarText').textContent = `${completed} of ${total} sessions done`;
  const s = streak();
  document.getElementById('homeStreak').textContent = s > 0 ? `🔥 ${s} day streak` : '';

  const list = document.getElementById('moduleList');
  list.innerHTML = '';
  let lastPhase = null;

  for (const mod of COURSE_DATA.modules) {
    const phase = getPhaseForModule(mod.id);
    if (phase.id !== lastPhase) {
      lastPhase = phase.id;
      const div = document.createElement('div');
      div.className = 'phase-divider';
      div.textContent = `Phase ${phase.id} — ${phase.title}`;
      list.appendChild(div);
    }

    const pct = modPct(mod.id);
    const item = document.createElement('div');
    item.className = 'mod-item';
    item.innerHTML = `
      <div class="mod-num">${String(mod.id).padStart(2,'0')}</div>
      <div class="mod-info">
        <div class="mod-title">${mod.shortTitle}</div>
        <div class="mod-days-row">${mod.days.map(d => `<div class="day-dot-sm ${done(mod.id, d.day) ? 'done' : (S.module === mod.id && S.day === d.day ? 'current' : '')}"></div>`).join('')}</div>
      </div>
      <div class="mod-right">
        <span class="mod-pct">${pct}%</span>
        ${pct === 100 ? '<span class="mod-check">✓</span>' : ''}
      </div>`;

    item.addEventListener('click', () => {
      // Open to first incomplete day of this module
      const firstIncomplete = mod.days.find(d => !done(mod.id, d.day));
      openSession(mod.id, firstIncomplete ? firstIncomplete.day : 1);
    });

    list.appendChild(item);
  }
}

// ── Open session ──────────────────────────────────────────────
function openSession(moduleId, day) {
  S.module = moduleId;
  S.day = day;
  S.notesLoaded = false;
  S.chatHistory = [];
  save();

  showScreen('screenStudy');
  renderStudy();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── Render Study ──────────────────────────────────────────────
function renderStudy() {
  const mod = getModule(S.module);
  const dayData = getDayData(S.module, S.day);
  if (!mod || !dayData) return;

  // Breadcrumb
  document.getElementById('studyBreadcrumb').textContent = mod.shortTitle;

  // Day tabs
  const tabs = document.getElementById('dayTabs');
  tabs.innerHTML = mod.days.map(d => `
    <button class="day-tab ${d.day === S.day ? 'active' : ''} ${done(S.module, d.day) ? 'done-tab' : ''}" data-day="${d.day}">
      <span class="tab-dot"></span>Day ${d.day}
    </button>`).join('');
  tabs.querySelectorAll('.day-tab').forEach(btn => {
    btn.addEventListener('click', () => openSession(S.module, parseInt(btn.dataset.day)));
  });

  // Header
  document.getElementById('studyModuleLabel').textContent = `Module ${S.module} · ${getPhaseForModule(S.module).title}`;
  document.getElementById('studyDayTitle').textContent = dayData.title;
  document.getElementById('studyKeywords').innerHTML = dayData.keywords.slice(0, 5).map(k => `<span class="kw-tag">${k}</span>`).join('');

  // Body — show topics preview
  const body = document.getElementById('studyBody');
  if (done(S.module, S.day)) {
    body.innerHTML = `<div class="empty-state"><div class="empty-icon">✓</div><p>Session completed. Load notes to review.</p><button class="btn-primary" id="loadBtn1">Review notes</button></div>`;
  } else {
    body.innerHTML = `<div class="empty-state"><div class="empty-icon">◎</div><p style="margin-bottom:8px">Today's topics:</p>${dayData.topics.map(t => `<p style="font-size:14px;color:var(--text3);margin:2px 0">• ${t}</p>`).join('')}<br><button class="btn-primary" id="loadBtn1">Generate today's notes</button></div>`;
  }
  document.getElementById('loadBtn1').addEventListener('click', loadNotes);

  // Footer
  document.getElementById('studyFooter').style.display = 'none';

  // Tutor
  document.getElementById('chatBody').innerHTML = `<div class="chat-intro">Ask anything about <em>${dayData.title}</em> — I'll tie it to your Rockwell &amp; panel wiring background.</div>`;
  renderQuickQs();
}

// ── Load Notes ────────────────────────────────────────────────
async function loadNotes() {
  if (!S.apiKey) { openModal(); return; }

  const mod = getModule(S.module);
  const dayData = getDayData(S.module, S.day);
  const phase = getPhaseForModule(S.module);
  const body = document.getElementById('studyBody');

  body.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Generating notes for <em>${dayData.title}</em>…</p></div>`;

  const prompt = `You are an expert SCADA/IIoT instructor writing personalized daily study notes.

STUDENT: Ash — electrical panel wiring & assembly (Rockwell Automation), Siemens HMI diagnostics, MES/SAP exposure, Python skills. Goal: Controls/Automation Engineer or OT Integration Engineer role.

SESSION: Module ${mod.id}: ${mod.title} | Phase: ${phase.title} | Day ${dayData.day}/5: ${dayData.title}
Topics: ${dayData.topics.join('; ')}
Keywords: ${dayData.keywords.join(', ')}

Write study notes in this exact markdown format:

## Overview
2–3 sentences on what this day covers and why it matters for an OT career.

## Core Concepts
For each topic, write a clear explanation (3–5 sentences). Tie abstract ideas to real industrial products and scenarios. Where relevant, relate to Allen-Bradley/Rockwell or Siemens systems.

## Key Terms
| Term | Definition | Why It Matters |
(Table for each keyword)

## In Practice
A concrete real-world walkthrough showing these concepts at work. Name actual products, protocols, signal types.

## Your Advantage
1–2 sentences on how Ash's existing background gives a head start with today's material.

## Quick Check
3 practical self-test questions (no answers). Make them scenario-based, not just definitions.

## Up Next
One sentence bridging to the next session.

Be direct and technical. No filler. Every sentence teaches something.`;

  try {
    const text = await callGroq(S.apiKey, 'You are an expert SCADA/IIoT instructor.', prompt);
    body.innerHTML = `<div class="notes">${mdToHtml(text)}</div>`;
    S.notesLoaded = true;
    document.getElementById('studyFooter').style.display = 'flex';
    document.getElementById('doneBtn').disabled = done(S.module, S.day);
    document.getElementById('doneBtn').textContent = done(S.module, S.day) ? '✓ Completed' : '✓ Mark complete & continue';
  } catch(err) {
    body.innerHTML = `<div class="error-box"><strong>Error:</strong> ${err.message}<br><br>Check your Groq API key in <a href="#" onclick="openModal();return false">Settings</a>. Get a free key at <a href="https://console.groq.com" target="_blank">console.groq.com</a>.</div>`;
  }
}

// ── Mark complete ─────────────────────────────────────────────
function markDone() {
  S.progress[`${S.module}-${S.day}`] = true;
  const today = new Date().toISOString().split('T')[0];
  if (!S.studyDates.includes(today)) S.studyDates.push(today);
  save();

  document.getElementById('doneBtn').textContent = '✓ Completed';
  document.getElementById('doneBtn').disabled = true;

  // Re-render day tabs to show green dot
  const tabs = document.getElementById('dayTabs');
  const mod = getModule(S.module);
  tabs.innerHTML = mod.days.map(d => `
    <button class="day-tab ${d.day === S.day ? 'active' : ''} ${done(S.module, d.day) ? 'done-tab' : ''}" data-day="${d.day}">
      <span class="tab-dot"></span>Day ${d.day}
    </button>`).join('');
  tabs.querySelectorAll('.day-tab').forEach(btn => {
    btn.addEventListener('click', () => openSession(S.module, parseInt(btn.dataset.day)));
  });

  // Advance after 1.2s
  setTimeout(() => {
    const modData = getModule(S.module);
    if (S.day < modData.days.length) {
      openSession(S.module, S.day + 1);
    } else {
      const idx = COURSE_DATA.modules.findIndex(m => m.id === S.module);
      if (idx < COURSE_DATA.modules.length - 1) {
        openSession(COURSE_DATA.modules[idx + 1].id, 1);
      } else {
        showScreen('screenHome');
        renderHome();
      }
    }
  }, 1200);
}

// ── Chat ──────────────────────────────────────────────────────
async function sendChat(msg) {
  if (!msg.trim()) return;
  if (!S.apiKey) { openModal(); return; }

  document.getElementById('chatInput').value = '';
  const body = document.getElementById('chatBody');
  const mod = getModule(S.module);
  const dayData = getDayData(S.module, S.day);

  body.innerHTML += `<div class="chat-msg"><div class="bubble user">${esc(msg)}</div></div>`;

  const tid = 'th-' + Date.now();
  body.innerHTML += `<div class="chat-msg" id="${tid}"><div class="bubble ai"><div class="thinking-dots"><span></span><span></span><span></span></div></div></div>`;
  body.scrollTop = body.scrollHeight;

  const sys = `You are an expert SCADA/IIoT tutor helping Ash, who has hands-on panel wiring, Rockwell Automation, and Siemens HMI background. Currently studying Module ${S.module}: ${mod.title}, Day ${S.day}: ${dayData.title}. Topics: ${dayData.topics.join('; ')}. Be concise, technical, and tie answers to real industrial products and scenarios. Use markdown.`;

  S.chatHistory.push({ role: 'user', content: msg });
  try {
    const reply = await callGroq(S.apiKey, sys, msg, S.chatHistory.slice(-10, -1));
    S.chatHistory.push({ role: 'assistant', content: reply });
    const el = document.getElementById(tid);
    if (el) el.outerHTML = `<div class="chat-msg"><div class="bubble ai">${mdToHtml(reply)}</div></div>`;
  } catch(err) {
    const el = document.getElementById(tid);
    if (el) el.outerHTML = `<div class="chat-msg"><div class="bubble error">Error: ${err.message}</div></div>`;
  }
  body.scrollTop = body.scrollHeight;
}

function renderQuickQs() {
  const dayData = getDayData(S.module, S.day);
  const kw = dayData?.keywords || [];
  const qs = [
    `Explain ${kw[0] || 'this'} like I'm a controls technician`,
    `Real-world example of ${kw[1] || 'this concept'}`,
    `How does this relate to Allen-Bradley systems?`,
    `Quiz me on today's topics`
  ];
  const el = document.getElementById('quickQs');
  el.innerHTML = qs.map(q => `<button class="quick-q">${q}</button>`).join('');
  el.querySelectorAll('.quick-q').forEach(btn => btn.addEventListener('click', () => sendChat(btn.textContent)));
}

// ── Modal ─────────────────────────────────────────────────────
function openModal() {
  document.getElementById('modalBg').classList.add('open');
  document.getElementById('apiInput').value = S.apiKey || '';
  updateKeyStatus();
}
function closeModal() { document.getElementById('modalBg').classList.remove('open'); }
function updateKeyStatus() {
  const el = document.getElementById('keyStatus');
  if (S.apiKey) { el.textContent = '✓ API key saved'; el.className = 'key-status ok'; }
  else { el.textContent = 'No key — AI features disabled'; el.className = 'key-status warn'; }
}

// ── Markdown ──────────────────────────────────────────────────
function mdToHtml(md) {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\| (.+) \|$/gm, (_, row) => '<tr>' + row.split(' | ').map(c => `<td>${c}</td>`).join('') + '</tr>')
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, m => {
      const rows = m.trim().split('\n').filter(r => r.includes('<tr>'));
      if (rows.length < 2) return `<div class="table-wrap"><table><tbody>${m}</tbody></table></div>`;
      const head = rows[0].replace(/<td>/g,'<th>').replace(/<\/td>/g,'</th>');
      const body = rows.slice(2).join('');
      return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
    })
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)(\n<li>[\s\S]*?<\/li>)*/g, m => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, '\n')
    .replace(/^(?!<[htbul])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
}

function esc(t) { const d = document.createElement('div'); d.appendChild(document.createTextNode(t)); return d.innerHTML; }

// ── Events ────────────────────────────────────────────────────
function bindAll() {
  document.getElementById('backBtn').addEventListener('click', () => { showScreen('screenHome'); renderHome(); });
  document.getElementById('loadBtn').addEventListener('click', loadNotes);
  document.getElementById('doneBtn').addEventListener('click', markDone);
  document.getElementById('chatSend').addEventListener('click', () => sendChat(document.getElementById('chatInput').value));
  document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(e.target.value); } });
  document.getElementById('tutorToggle').addEventListener('click', () => document.getElementById('tutorWrap').classList.add('open'));
  document.getElementById('tutorClose').addEventListener('click', () => document.getElementById('tutorWrap').classList.remove('open'));
  document.getElementById('homeSettingsBtn').addEventListener('click', openModal);
  document.getElementById('studySettingsBtn').addEventListener('click', openModal);
  document.getElementById('modalX').addEventListener('click', closeModal);
  document.getElementById('modalBg').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.getElementById('saveKey').addEventListener('click', () => {
    const k = document.getElementById('apiInput').value.trim();
    if (k) { S.apiKey = k; localStorage.setItem('sk', k); updateKeyStatus(); closeModal(); }
  });
  document.getElementById('clearKey').addEventListener('click', () => {
    S.apiKey = ''; localStorage.removeItem('sk');
    document.getElementById('apiInput').value = '';
    updateKeyStatus();
  });
}
