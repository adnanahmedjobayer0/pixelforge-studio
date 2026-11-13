* {
  box-sizing: border-box;
}

html {
  color-scheme: dark;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(180deg, #090b12 0%, #111827 32%, #0b1120 100%);
  color: #e5edf7;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.page-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 110px;
}

.topbar,
.editor-header,
.panel-header,
.toolbar-row,
.editor-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar,
.editor-header {
  gap: 16px;
  margin-bottom: 22px;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 11px;
  color: #8ab4ff;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: clamp(2rem, 4vw, 3.2rem);
}

.search-panel,
.panel,
.action-card,
.side-panel,
.toolbar-row,
.design-canvas {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 18px 38px rgba(2, 6, 23, 0.28);
}

.search-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 18px;
  margin-bottom: 18px;
  color: #bfd4ff;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}

.action-card {
  padding: 22px 18px;
  border-radius: 18px;
  min-height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 12px;
  background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.3), transparent 38%);
}

.action-card.purple {
  background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.36), transparent 35%), rgba(15, 23, 42, 0.72);
}

.action-card.blue {
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.35), transparent 35%), rgba(15, 23, 42, 0.72);
}

.action-card.green {
  background: radial-gradient(circle at top left, rgba(16, 185, 129, 0.35), transparent 35%), rgba(15, 23, 42, 0.72);
}

.tag {
  width: fit-content;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
  padding: 6px 10px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #dbeafe;
}

.primary-btn,
.secondary-btn,
.ghost-btn,
.toolbar-row button,
.property-actions button,
.side-panel button {
  border: 0;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: white;
  font-weight: 700;
}

.secondary-btn,
.ghost-btn,
.toolbar-row button,
.property-actions button,
.side-panel button {
  background: rgba(148, 163, 184, 0.11);
  color: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.primary-btn:hover,
.secondary-btn:hover,
.ghost-btn:hover,
.toolbar-row button:hover,
.property-actions button:hover,
.side-panel button:hover {
  transform: translateY(-1px);
}

.content-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 18px;
  margin-bottom: 18px;
}

.panel {
  border-radius: 22px;
  padding: 18px;
}

.full-width {
  margin-bottom: 20px;
}

.panel-header {
  margin-bottom: 18px;
}

.panel-header a,
.panel-header h2 {
  color: #edf3ff;
}

.stack-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project-row {
  display: grid;
  grid-template-columns: 52px 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.project-row:last-child {
  border-bottom: 0;
}

.project-thumb {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(16, 185, 129, 0.8));
}

.project-row strong,
.project-row small,
.project-row span,
.project-row em {
  display: block;
}

.project-row small,
.project-row span,
.project-row em {
  color: #a9b6d0;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.1);
  color: #dbeafe;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 8px 12px;
}

.sticker-chip {
  background: rgba(168, 85, 247, 0.12);
}

.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  width: min(620px, calc(100% - 24px));
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.14);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.42);
  border-radius: 18px;
  padding: 10px;
}

.bottom-nav a {
  padding: 11px 10px;
  border-radius: 12px;
  text-align: center;
  color: #a5b4cf;
}

.bottom-nav a.active {
  background: rgba(99, 102, 241, 0.2);
  color: #eff6ff;
}

.editor-shell {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 18px 70px;
}

.editor-header {
  margin-bottom: 18px;
}

.editor-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.editor-actions {
  gap: 10px;
}

.toolbar-row {
  gap: 12px;
  padding: 12px 16px;
  border-radius: 18px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.editor-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 300px;
  gap: 18px;
  align-items: start;
}

.side-panel {
  border-radius: 18px;
  padding: 18px;
}

.panel-block + .panel-block {
  margin-top: 22px;
}

.layer-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layer-list li {
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(148, 163, 184, 0.05);
  border: 1px solid transparent;
  color: #dbeafe;
}

.layer-list li.active {
  border-color: rgba(96, 165, 250, 0.4);
  background: rgba(59, 130, 246, 0.08);
}

.mini-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.mini-stats span {
  background: rgba(148, 163, 184, 0.07);
  padding: 7px 10px;
  border-radius: 999px;
  color: #cbd5e1;
  font-size: 12px;
}

.canvas-stage {
  display: flex;
  justify-content: center;
}

.design-canvas {
  position: relative;
  width: min(100%, 760px);
  height: 760px;
  border-radius: 26px;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1120, #111827 50%, #0b1220);
}

.canvas-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
}

.text-layer {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  white-space: nowrap;
  background: transparent;
}

.resize-handle {
  position: absolute;
  right: -9px;
  bottom: -9px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #60a5fa;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.7);
  cursor: nwse-resize;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  color: #dbeafe;
}

input[type='color'] {
  width: 100%;
  height: 42px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 0;
}

.property-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.property-actions button {
  flex: 1;
}

.compact {
  gap: 8px;
}

@media (max-width: 980px) {
  .quick-grid,
  .content-grid,
  .editor-layout {
    grid-template-columns: 1fr;
  }

  .design-canvas {
    height: 520px;
  }
}

@media (max-width: 640px) {
  .topbar,
  .editor-header,
  .search-panel,
  .toolbar-row,
  .panel-header,
  .editor-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .page-shell,
  .editor-shell {
    padding-left: 14px;
    padding-right: 14px;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }

  .bottom-nav {
    width: calc(100% - 16px);
  }
}
