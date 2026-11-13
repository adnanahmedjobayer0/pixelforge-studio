'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createEmptyProject, createId, downloadBlob, downloadTheme, loadCurrentProject,
  loadProjects, makeTheme, normalizeProject, persistCurrentProject, readThemeFile,
  safeName, saveProjectToLibrary,
} from '@/lib/editor-store';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const fonts = ['Arial, sans-serif', 'Georgia, serif', 'Verdana, sans-serif', 'Trebuchet MS, sans-serif', 'monospace'];

export default function EditorPage() {
  const [project, setProject] = useState(createEmptyProject);
  const [selectedId, setSelectedId] = useState('welcome-title');
  const [savedProjects, setSavedProjects] = useState([]);
  const [status, setStatus] = useState('Loading project…');
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef(null);
  const interaction = useRef(null);
  const history = useRef({ undo: [], redo: [] });
  const fileInput = useRef(null);
  const imageInput = useRef(null);
  const ready = useRef(false);

  useEffect(() => {
    const loaded = loadCurrentProject();
    setProject(loaded);
    setSelectedId(loaded.objects[0]?.id ?? '');
    setSavedProjects(loadProjects());
    ready.current = true;
    setStatus('All changes saved locally');
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    const timer = window.setTimeout(() => {
      try {
        persistCurrentProject(project);
        setStatus('Autosaved on this device');
      } catch {
        setStatus('Could not autosave — storage may be full');
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [project]);

  const selected = useMemo(() => project.objects.find((item) => item.id === selectedId) ?? null, [project.objects, selectedId]);

  const commit = useCallback((next) => {
    history.current.undo.push(JSON.stringify(project));
    if (history.current.undo.length > 60) history.current.undo.shift();
    history.current.redo = [];
    setProject(next);
  }, [project]);

  const updateProject = (updater) => {
    const next = typeof updater === 'function' ? updater(project) : updater;
    commit(next);
  };

  const updateSelected = (changes) => {
    if (!selected) return;
    updateProject((current) => ({
      ...current,
      objects: current.objects.map((item) => item.id === selected.id ? { ...item, ...changes } : item),
    }));
  };

  const addObject = (item) => {
    updateProject((current) => ({ ...current, objects: [...current.objects, item] }));
    setSelectedId(item.id);
  };

  const addText = () => addObject({
    id: createId('text'), type: 'text', name: 'Text layer', text: 'Double-click to edit',
    x: 320, y: 430, w: 460, h: 90, fill: '#ffffff', fontSize: 48,
    fontFamily: fonts[0], fontWeight: 600, align: 'center', rotation: 0, opacity: 1,
    visible: true, locked: false,
  });

  const addShape = (shape) => addObject({
    id: createId(shape), type: 'shape', name: shape === 'circle' ? 'Circle' : 'Rectangle', shape,
    x: 380, y: 380, w: 260, h: 200, fill: shape === 'circle' ? '#38bdf8' : '#8b5cf6',
    rotation: 0, opacity: 1, visible: true, locked: false,
  });

  const pointFromEvent = (event) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * project.width,
      y: ((event.clientY - rect.top) / rect.height) * project.height,
    };
  };

  const beginInteraction = (event, item, mode) => {
    event.stopPropagation();
    if (item.locked) { setSelectedId(item.id); return; }
    event.currentTarget.ownerSVGElement?.setPointerCapture?.(event.pointerId);
    setSelectedId(item.id);
    const point = pointFromEvent(event);
    history.current.undo.push(JSON.stringify(project));
    if (history.current.undo.length > 60) history.current.undo.shift();
    history.current.redo = [];
    interaction.current = {
      id: item.id, mode, startX: point.x, startY: point.y,
      x: item.x, y: item.y, w: item.w, h: item.h,
    };
  };

  const moveInteraction = (event) => {
    if (!interaction.current) return;
    const point = pointFromEvent(event);
    const drag = interaction.current;
    const dx = point.x - drag.startX;
    const dy = point.y - drag.startY;
    setProject((current) => ({
      ...current,
      objects: current.objects.map((item) => {
        if (item.id !== drag.id) return item;
        if (drag.mode === 'resize') return { ...item, w: Math.max(24, drag.w + dx), h: Math.max(24, drag.h + dy) };
        return { ...item, x: drag.x + dx, y: drag.y + dy };
      }),
    }));
  };

  const endInteraction = () => {
    if (interaction.current) setStatus('Saving changes…');
    interaction.current = null;
  };

  const undo = () => {
    const previous = history.current.undo.pop();
    if (!previous) return;
    history.current.redo.push(JSON.stringify(project));
    setProject(JSON.parse(previous));
    setStatus('Undo');
  };

  const redo = () => {
    const next = history.current.redo.pop();
    if (!next) return;
    history.current.undo.push(JSON.stringify(project));
    setProject(JSON.parse(next));
    setStatus('Redo');
  };

  const duplicate = () => {
    if (!selected) return;
    addObject({ ...selected, id: createId(selected.type), name: `${selected.name} copy`, x: selected.x + 32, y: selected.y + 32 });
  };

  const deleteSelected = () => {
    if (!selected) return;
    updateProject((current) => ({ ...current, objects: current.objects.filter((item) => item.id !== selected.id) }));
    setSelectedId('');
  };

  const reorderSelected = (direction) => {
    if (!selected) return;
    updateProject((current) => {
      const index = current.objects.findIndex((item) => item.id === selected.id);
      const target = clamp(index + direction, 0, current.objects.length - 1);
      const objects = [...current.objects];
      [objects[index], objects[target]] = [objects[target], objects[index]];
      return { ...current, objects };
    });
  };

  const saveProject = () => {
    try {
      setSavedProjects(saveProjectToLibrary(project));
      setStatus('Project saved to My Projects');
    } catch {
      setStatus('Could not save project — storage may be full');
    }
  };

  const loadSavedProject = (event) => {
    const saved = savedProjects.find((item) => item.id === event.target.value);
    if (!saved) return;
    const loaded = normalizeProject(saved);
    setProject(loaded);
    setSelectedId(loaded.objects[0]?.id ?? '');
    history.current = { undo: [], redo: [] };
    setStatus('Project opened');
  };

  const importTheme = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const imported = await readThemeFile(file);
      commit(imported);
      setSelectedId(imported.objects[0]?.id ?? '');
      setStatus('Editable theme imported');
    } catch (error) {
      window.alert(error.message || 'Could not import that theme file.');
    }
  };

  const addImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      window.alert('Choose an image under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => addObject({
      id: createId('image'), type: 'image', name: file.name, src: reader.result,
      x: 250, y: 250, w: 580, h: 420, rotation: 0, opacity: 1, visible: true, locked: false,
    });
    reader.readAsDataURL(file);
  };

  const exportImage = async (format = 'png') => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true);
    clone.querySelectorAll('[data-editor-ui]').forEach((node) => node.remove());
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(project.width));
    clone.setAttribute('height', String(project.height));
    const source = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = project.width;
      canvas.height = project.height;
      const context = canvas.getContext('2d');
      if (format === 'jpg') {
        context.fillStyle = project.background;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, format === 'jpg' ? 'image/jpeg' : 'image/png', 0.94));
      if (!blob) throw new Error('Could not render the image.');
      downloadBlob(blob, `${safeName(project.name)}.${format}`);
      setStatus(`${format.toUpperCase()} exported`);
    } catch (error) {
      window.alert(error.message || 'Export failed. Try removing unsupported image assets.');
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const exportSvg = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true);
    clone.querySelectorAll('[data-editor-ui]').forEach((node) => node.remove());
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(project.width));
    clone.setAttribute('height', String(project.height));
    downloadBlob(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }), `${safeName(project.name)}.svg`);
    setStatus('SVG exported');
  };

  const objectTransform = (item) => `rotate(${item.rotation || 0} ${item.x + item.w / 2} ${item.y + item.h / 2})`;

  return (
    <main className="editor-shell editor-app">
      <header className="editor-header">
        <div className="editor-header-left">
          <Link className="ghost-btn" href="/">← Home</Link>
          <div className="editor-title-wrap">
            <p className="eyebrow">PixelForge Studio · Editor</p>
            <input className="project-name-input" aria-label="Project name" value={project.name} onChange={(event) => setProject((current) => ({ ...current, name: event.target.value }))} />
            <small className="save-status">{status}</small>
          </div>
        </div>
        <div className="editor-actions">
          <button className="ghost-btn" onClick={undo} disabled={!history.current.undo.length}>Undo</button>
          <button className="ghost-btn" onClick={redo} disabled={!history.current.redo.length}>Redo</button>
          <button className="secondary-btn" onClick={saveProject}>Save project</button>
          <button className="primary-btn" onClick={() => exportImage('png')}>Export PNG</button>
        </div>
      </header>

      <section className="toolbar-row editor-toolbar" aria-label="Editor tools">
        <button onClick={addText}>＋ Text</button>
        <button onClick={() => addShape('rect')}>▱ Rectangle</button>
        <button onClick={() => addShape('circle')}>◯ Circle</button>
        <button onClick={() => imageInput.current?.click()}>▧ Add image</button>
        <button onClick={() => fileInput.current?.click()}>⇧ Import theme</button>
        <button onClick={() => downloadTheme(project)}>⇩ Export theme</button>
        <button onClick={() => exportImage('jpg')}>Export JPG</button>
        <button onClick={exportSvg}>Export SVG</button>
        <input ref={fileInput} className="visually-hidden" type="file" accept=".pftheme,application/json" onChange={importTheme} />
        <input ref={imageInput} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={addImage} />
      </section>

      <section className="editor-layout">
        <aside className="side-panel editor-side-panel">
          <div className="panel-block">
            <h3>My Projects</h3>
            <div className="project-save-row">
              <button className="primary-btn" onClick={saveProject}>Save current</button>
              <select aria-label="Open saved project" value="" onChange={loadSavedProject}>
                <option value="">Open saved…</option>
                {savedProjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
          </div>
          <div className="panel-block">
            <div className="panel-heading-row"><h3>Layers</h3><span>{project.objects.length}</span></div>
            <ul className="layer-list">
              {[...project.objects].reverse().map((item) => (
                <li key={item.id} className={item.id === selectedId ? 'active' : ''}>
                  <button className="layer-select" onClick={() => setSelectedId(item.id)}>{item.type === 'text' ? 'T' : item.type === 'image' ? '▧' : '◈'} {item.name}</button>
                  <button className="layer-visibility" aria-label={`${item.visible ? 'Hide' : 'Show'} ${item.name}`} onClick={() => updateProject((current) => ({ ...current, objects: current.objects.map((layer) => layer.id === item.id ? { ...layer, visible: !layer.visible } : layer) }))}>{item.visible ? '◉' : '○'}</button>
                  <button className="layer-visibility" aria-label={`${item.locked ? 'Unlock' : 'Lock'} ${item.name}`} onClick={() => updateProject((current) => ({ ...current, objects: current.objects.map((layer) => layer.id === item.id ? { ...layer, locked: !layer.locked } : layer) }))}>{item.locked ? '🔒' : '⌑'}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel-block">
            <h3>Canvas</h3>
            <label>Background<input type="color" value={/^#[0-9a-f]{6}$/i.test(project.background) ? project.background : '#101827'} onChange={(event) => updateProject((current) => ({ ...current, background: event.target.value }))} /></label>
            <div className="canvas-size-fields">
              <label>Width<input type="number" min="1" max="10000" value={project.width} onChange={(event) => setProject((current) => ({ ...current, width: clamp(Number(event.target.value) || 1, 1, 10000) }))} /></label>
              <label>Height<input type="number" min="1" max="10000" value={project.height} onChange={(event) => setProject((current) => ({ ...current, height: clamp(Number(event.target.value) || 1, 1, 10000) }))} /></label>
            </div>
          </div>
        </aside>

        <div className="canvas-workspace">
          <div className="canvas-controls">
            <span>{project.width} × {project.height}px</span>
            <div><button aria-label="Zoom out" onClick={() => setZoom((value) => clamp(value - 0.1, 0.4, 1.5))}>−</button><span>{Math.round(zoom * 100)}%</span><button aria-label="Zoom in" onClick={() => setZoom((value) => clamp(value + 0.1, 0.4, 1.5))}>＋</button></div>
          </div>
          <div className="canvas-stage">
            <svg ref={svgRef} className="design-canvas svg-canvas" viewBox={`0 0 ${project.width} ${project.height}`} style={{ background: project.background, transform: `scale(${zoom})` }} onPointerMove={moveInteraction} onPointerUp={endInteraction} onPointerCancel={endInteraction} onPointerLeave={endInteraction} onPointerDown={(event) => { if (event.target === svgRef.current) setSelectedId(''); }} role="img" aria-label={`${project.name} canvas`}>
              <rect x="0" y="0" width={project.width} height={project.height} fill={project.background} />
              {project.objects.map((item) => {
                if (!item.visible) return null;
                const selectedLayer = item.id === selectedId;
                const common = { opacity: item.opacity ?? 1, transform: objectTransform(item), style: { cursor: item.locked ? 'default' : 'move', touchAction: 'none' }, onPointerDown: (event) => beginInteraction(event, item, 'move') };
                return <g key={item.id} {...common}>
                  {item.type === 'text' ? <text x={item.x + (item.align === 'center' ? item.w / 2 : 0)} y={item.y + item.h * 0.72} fill={item.fill} fontSize={item.fontSize || 40} fontFamily={item.fontFamily || 'Arial, sans-serif'} fontWeight={item.fontWeight || 400} textAnchor={item.align === 'center' ? 'middle' : item.align === 'right' ? 'end' : 'start'}>{item.text}</text> : item.type === 'image' ? <image href={item.src} x={item.x} y={item.y} width={item.w} height={item.h} preserveAspectRatio="xMidYMid meet" /> : item.shape === 'circle' ? <ellipse cx={item.x + item.w / 2} cy={item.y + item.h / 2} rx={item.w / 2} ry={item.h / 2} fill={item.fill} /> : <rect x={item.x} y={item.y} width={item.w} height={item.h} rx={item.shape === 'roundRect' ? 28 : 0} fill={item.fill} />}
                  {selectedLayer && <rect data-editor-ui="true" x={item.x} y={item.y} width={item.w} height={item.h} fill="none" stroke="#60a5fa" strokeWidth={4} strokeDasharray="12 8" pointerEvents="none" />}
                  {selectedLayer && !item.locked && <rect data-editor-ui="true" x={item.x + item.w - 24} y={item.y + item.h - 24} width={48} height={48} rx={12} fill="#60a5fa" stroke="#fff" strokeWidth={3} style={{ cursor: 'nwse-resize', touchAction: 'none' }} onPointerDown={(event) => beginInteraction(event, item, 'resize')} />}
                </g>;
              })}
            </svg>
          </div>
        </div>

        <aside className="side-panel editor-side-panel properties-panel">
          <div className="panel-block"><div className="panel-heading-row"><h3>Properties</h3>{selected ? <span>{selected.type}</span> : null}</div>
            {selected ? <>
              <label>Layer name<input value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} /></label>
              {selected.type === 'text' && <>
                <label>Text<input value={selected.text} onChange={(event) => updateSelected({ text: event.target.value })} /></label>
                <label>Font<select value={selected.fontFamily || fonts[0]} onChange={(event) => updateSelected({ fontFamily: event.target.value })}>{fonts.map((font) => <option key={font} value={font}>{font.split(',')[0]}</option>)}</select></label>
                <div className="canvas-size-fields"><label>Size<input type="number" min="8" max="300" value={selected.fontSize || 40} onChange={(event) => updateSelected({ fontSize: clamp(Number(event.target.value) || 8, 8, 300) })} /></label><label>Weight<select value={selected.fontWeight || 400} onChange={(event) => updateSelected({ fontWeight: Number(event.target.value) })}><option value="400">Regular</option><option value="600">Semi-bold</option><option value="700">Bold</option></select></label></div>
                <label>Alignment<select value={selected.align || 'left'} onChange={(event) => updateSelected({ align: event.target.value })}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
              </>}
              {selected.type !== 'image' && <label>Fill<input type="color" value={/^#[0-9a-f]{6}$/i.test(selected.fill) ? selected.fill : '#ffffff'} onChange={(event) => updateSelected({ fill: event.target.value })} /></label>}
              <div className="canvas-size-fields"><label>X<input type="number" value={Math.round(selected.x)} onChange={(event) => updateSelected({ x: Number(event.target.value) })} /></label><label>Y<input type="number" value={Math.round(selected.y)} onChange={(event) => updateSelected({ y: Number(event.target.value) })} /></label></div>
              <label>Opacity<input type="range" min="0" max="1" step="0.05" value={selected.opacity ?? 1} onChange={(event) => updateSelected({ opacity: Number(event.target.value) })} /></label>
              <label>Rotation<input type="range" min="-180" max="180" value={selected.rotation || 0} onChange={(event) => updateSelected({ rotation: Number(event.target.value) })} /></label>
              <div className="property-actions"><button onClick={duplicate}>Duplicate</button><button onClick={deleteSelected}>Delete</button></div>
              <div className="property-actions"><button onClick={() => reorderSelected(1)}>Send backward</button><button onClick={() => reorderSelected(-1)}>Bring forward</button></div>
            </> : <p className="empty-selection">Select a layer on the canvas or add a new one.</p>}
          </div>
          <div className="panel-block"><h3>Export</h3><div className="export-actions"><button onClick={() => exportImage('png')}>Download PNG</button><button onClick={() => exportImage('jpg')}>Download JPG</button><button onClick={() => downloadTheme(project)}>Editable .pftheme</button></div><p className="helper-copy">Projects and autosaves are stored in this browser on this device.</p></div>
        </aside>
      </section>
    </main>
  );
}
