export const CURRENT_PROJECT_KEY = 'pixelforge:current-project:v1';
export const PROJECTS_KEY = 'pixelforge:projects:v1';
export const THEME_TYPE = 'pixelforge-theme';
export const THEME_VERSION = 1;

export function createEmptyProject() {
  return {
    id: createId('project'),
    name: 'Untitled Design',
    width: 1080,
    height: 1080,
    background: '#101827',
    objects: [
      {
        id: 'welcome-title', type: 'text', name: 'Title', text: 'PixelForge Studio',
        x: 120, y: 170, w: 840, h: 110, fill: '#ffffff', fontSize: 74,
        fontFamily: 'Arial, sans-serif', fontWeight: 700, align: 'center', rotation: 0,
        opacity: 1, visible: true, locked: false,
      },
      {
        id: 'welcome-subtitle', type: 'text', name: 'Subtitle', text: 'Make something remarkable',
        x: 180, y: 315, w: 720, h: 70, fill: '#a5b4fc', fontSize: 38,
        fontFamily: 'Arial, sans-serif', fontWeight: 400, align: 'center', rotation: 0,
        opacity: 1, visible: true, locked: false,
      },
      {
        id: 'welcome-orbit', type: 'shape', name: 'Accent circle', shape: 'circle',
        x: 390, y: 475, w: 300, h: 300, fill: '#6d5dfc', rotation: 0,
        opacity: 0.9, visible: true, locked: false,
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function createId(prefix = 'item') {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`;
}

export function normalizeProject(value) {
  if (!value || typeof value !== 'object') throw new Error('Project data is not valid.');
  const width = Number(value.width ?? value.canvas?.width);
  const height = Number(value.height ?? value.canvas?.height);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1 || width > 10000 || height > 10000) {
    throw new Error('Canvas dimensions must be between 1 and 10,000 pixels.');
  }
  if (!Array.isArray(value.objects) || value.objects.length > 500) {
    throw new Error('Project must contain at most 500 layers.');
  }

  const objects = value.objects.map((item, index) => {
    if (!item || !['text', 'shape', 'image'].includes(item.type)) throw new Error(`Layer ${index + 1} has an unsupported type.`);
    const number = (input, fallback) => Number.isFinite(Number(input)) ? Number(input) : fallback;
    return {
      ...item,
      id: typeof item.id === 'string' ? item.id : createId('layer'),
      name: typeof item.name === 'string' ? item.name : `${item.type} ${index + 1}`,
      x: number(item.x, 40), y: number(item.y, 40),
      w: Math.max(1, number(item.w, 180)), h: Math.max(1, number(item.h, 100)),
      rotation: number(item.rotation, 0), opacity: Math.min(1, Math.max(0, number(item.opacity, 1))),
      fill: typeof item.fill === 'string' ? item.fill : '#ffffff',
      visible: item.visible !== false, locked: item.locked === true,
    };
  });

  return {
    id: typeof value.id === 'string' ? value.id : createId('project'),
    name: typeof value.name === 'string' ? value.name : 'Untitled Design',
    width, height,
    background: value.background ?? value.canvas?.background ?? '#ffffff',
    objects,
    updatedAt: new Date().toISOString(),
  };
}

export function loadCurrentProject() {
  if (typeof window === 'undefined') return createEmptyProject();
  try {
    const raw = window.localStorage.getItem(CURRENT_PROJECT_KEY);
    return raw ? normalizeProject(JSON.parse(raw)) : createEmptyProject();
  } catch {
    return createEmptyProject();
  }
}

export function persistCurrentProject(project) {
  if (typeof window !== 'undefined') window.localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
}

export function loadProjects() {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROJECTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProjectToLibrary(project) {
  const saved = loadProjects();
  const nextProject = { ...project, updatedAt: new Date().toISOString() };
  const next = [nextProject, ...saved.filter((entry) => entry.id !== project.id)].slice(0, 30);
  window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
  persistCurrentProject(nextProject);
  return next;
}

export function makeTheme(project) {
  return {
    format: THEME_TYPE,
    version: THEME_VERSION,
    name: project.name,
    canvas: { width: project.width, height: project.height, background: project.background },
    objects: project.objects,
  };
}

export async function readThemeFile(file) {
  if (!file || file.size > 15 * 1024 * 1024) throw new Error('Choose a theme file smaller than 15 MB.');
  const theme = JSON.parse(await file.text());
  if (theme?.format !== THEME_TYPE || theme?.version !== THEME_VERSION) {
    throw new Error('This is not a supported PixelForge .pftheme file.');
  }
  return normalizeProject({
    id: createId('project'),
    name: theme.name || 'Imported design',
    width: theme.canvas?.width,
    height: theme.canvas?.height,
    background: theme.canvas?.background,
    objects: theme.objects,
  });
}

export function downloadTheme(project) {
  downloadBlob(new Blob([JSON.stringify(makeTheme(project), null, 2)], { type: 'application/json' }), `${safeName(project.name)}.pftheme`);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function safeName(name) {
  return (name || 'pixelforge-design').toLowerCase().trim().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '') || 'pixelforge-design';
}
