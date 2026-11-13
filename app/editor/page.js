const initialObjects = [
  {
    id: 'text-1',
    type: 'text',
    x: 92,
    y: 94,
    w: 220,
    h: 70,
    rotation: 0,
    fill: '#ffffff',
    text: 'PixelForge',
    fontSize: 34,
  },
  {
    id: 'shape-1',
    type: 'shape',
    shape: 'circle',
    x: 240,
    y: 285,
    w: 142,
    h: 142,
    rotation: 0,
    fill: '#6ee7b7',
  },
  {
    id: 'shape-2',
    type: 'shape',
    shape: 'rect',
    x: 85,
    y: 340,
    w: 220,
    h: 118,
    rotation: 14,
    fill: '#8b5cf6',
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function EditorPage() {
  const canvasRef = useRef(null);
  const interactionRef = useRef(null);
  const [objects, setObjects] = useState(initialObjects);
  const [selectedId, setSelectedId] = useState(initialObjects[0].id);

  const selectedObject = useMemo(
    () => objects.find((item) => item.id === selectedId) ?? objects[0],
    [objects, selectedId],
  );

  const updateObject = (id, updater) => {
    setObjects((current) =>
      current.map((item) => (item.id === id ? { ...item, ...updater } : item)),
    );
  };

  const addText = () => {
    const id = `text-${Date.now()}`;
    const newItem = {
      id,
      type: 'text',
      x: 110 + Math.random() * 80,
      y: 140 + Math.random() * 80,
      w: 210,
      h: 62,
      rotation: 0,
      fill: '#fefefe',
      text: 'New Text',
      fontSize: 28,
    };

    setObjects((current) => [...current, newItem]);
    setSelectedId(id);
  };

  const addShape = (shape = 'rect') => {
    const id = `shape-${Date.now()}`;
    const newItem = {
      id,
      type: 'shape',
      shape,
      x: 150 + Math.random() * 90,
      y: 180 + Math.random() * 80,
      w: 160,
      h: 120,
      rotation: 0,
      fill: shape === 'circle' ? '#fbbf24' : '#38bdf8',
    };

    setObjects((current) => [...current, newItem]);
    setSelectedId(id);
  };

  const beginMove = (event, id) => {
    event.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const obj = objects.find((item) => item.id === id);
    if (!obj) return;

    setSelectedId(id);
    interactionRef.current = {
      mode: 'move',
      id,
      offsetX: point.x - obj.x,
      offsetY: point.y - obj.y,
    };
  };

  const beginResize = (event, id) => {
    event.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const obj = objects.find((item) => item.id === id);
    if (!obj) return;

    setSelectedId(id);
    interactionRef.current = {
      mode: 'resize',
      id,
      startX: point.x,
      startY: point.y,
      startWidth: obj.w,
      startHeight: obj.h,
    };
  };

  const handlePointerMove = (event) => {
    if (!interactionRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const { id, mode } = interactionRef.current;

    if (mode === 'move') {
      const nextX = clamp(point.x - interactionRef.current.offsetX, 18, 560);
      const nextY = clamp(point.y - interactionRef.current.offsetY, 18, 420);
      updateObject(id, { x: nextX, y: nextY });
    }

    if (mode === 'resize') {
      const nextW = clamp(
        interactionRef.current.startWidth + (point.x - interactionRef.current.startX),
        80,
        280,
      );
      const nextH = clamp(
        interactionRef.current.startHeight + (point.y - interactionRef.current.startY),
        45,
        220,
      );
      updateObject(id, { w: nextW, h: nextH });
    }
  };

  const handlePointerUp = () => {
    interactionRef.current = null;
  };

  const duplicateSelected = () => {
    if (!selectedObject) return;
    const next = {
      ...selectedObject,
      id: `${selectedObject.type}-${Date.now()}`,
      x: clamp(selectedObject.x + 30, 20, 470),
      y: clamp(selectedObject.y + 24, 20, 360),
    };
    setObjects((current) => [...current, next]);
    setSelectedId(next.id);
  };

  const deleteSelected = () => {
    if (!selectedObject) return;
    setObjects((current) => current.filter((item) => item.id !== selectedObject.id));
    setSelectedId(objects[0]?.id ?? '');
  };

  const rotateSelected = (delta) => {
    if (!selectedObject) return;
    updateObject(selectedObject.id, {
      rotation: (selectedObject.rotation || 0) + delta,
    });
  };

  const changeColor = (value) => {
    if (!selectedObject) return;
    updateObject(selectedObject.id, { fill: value });
  };

  return (
    <main className="editor-shell">
      <header className="editor-header">
        <div className="editor-header-left">
          <button className="ghost-btn">Back</button>
          <div>
            <p className="eyebrow">Editor</p>
            <h1>Social Media Campaign</h1>
          </div>
        </div>

        <div className="editor-actions">
          <button className="ghost-btn">Undo</button>
          <button className="ghost-btn">Redo</button>
          <button className="primary-btn">Export</button>
        </div>
      </header>

      <section className="toolbar-row">
        <button onClick={addText}>Text</button>
        <button onClick={() => addShape('rect')}>Shape</button>
        <button onClick={() => addShape('circle')}>Circle</button>
        <button>Images</button>
        <button>Stickers</button>
        <button>Background</button>
        <button>Layers</button>
      </section>

      <section className="editor-layout">
        <aside className="side-panel left-panel">
          <div className="panel-block">
            <h3>Canvas</h3>
            <div className="mini-stats">
              <span>Zoom 100%</span>
              <span>Snap On</span>
            </div>
          </div>

          <div className="panel-block">
            <h3>Layers</h3>
            <ul className="layer-list">
              {objects.map((item) => (
                <li
                  key={item.id}
                  className={item.id === selectedId ? 'active' : ''}
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.type === 'text' ? 'Text Layer' : `${item.shape ?? 'Shape'} Layer`}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="canvas-stage">
          <div
            ref={canvasRef}
            className="design-canvas"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div className="canvas-grid" />

            {objects.map((item) => {
              const isSelected = item.id === selectedId;
              const commonStyle = {
                position: 'absolute',
                left: item.x,
                top: item.y,
                width: item.w,
                height: item.h,
                transform: `rotate(${item.rotation || 0}deg)`,
                border: isSelected ? '2px solid rgba(96, 165, 250, 1)' : '2px solid transparent',
                cursor: 'move',
                userSelect: 'none',
              };

              if (item.type === 'text') {
                return (
                  <div
                    key={item.id}
                    style={commonStyle}
                    className="text-layer"
                    onPointerDown={(event) => beginMove(event, item.id)}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span style={{ color: item.fill, fontSize: `${item.fontSize}px` }}>
                      {item.text}
                    </span>
                  </div>
                );
              }

              if (item.shape === 'circle') {
                return (
                  <div
                    key={item.id}
                    style={{
                      ...commonStyle,
                      borderRadius: '50%',
                      background: item.fill,
                    }}
                    onPointerDown={(event) => beginMove(event, item.id)}
                    onClick={() => setSelectedId(item.id)}
                  >
                    {isSelected && (
                      <span
                        className="resize-handle"
                        onPointerDown={(event) => beginResize(event, item.id)}
                      />
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  style={{
                    ...commonStyle,
                    background: item.fill,
                    borderRadius: '18px',
                  }}
                  onPointerDown={(event) => beginMove(event, item.id)}
                  onClick={() => setSelectedId(item.id)}
                >
                  {isSelected && (
                    <span
                      className="resize-handle"
                      onPointerDown={(event) => beginResize(event, item.id)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="side-panel right-panel">
          <div className="panel-block">
            <h3>Properties</h3>
            {selectedObject && (
              <>
                <label>
                  Fill
                  <input
                    type="color"
                    value={selectedObject.fill || '#ffffff'}
                    onChange={(event) => changeColor(event.target.value)}
                  />
                </label>

                <div className="property-actions">
                  <button onClick={() => rotateSelected(-15)}>Rotate -</button>
                  <button onClick={() => rotateSelected(15)}>Rotate +</button>
                </div>

                <div className="property-actions">
                  <button onClick={duplicateSelected}>Duplicate</button>
                  <button onClick={deleteSelected}>Delete</button>
                </div>
              </>
            )}
          </div>

          <div className="panel-block">
            <h3>Quick Effects</h3>
            <div className="chip-list compact">
              <span className="chip">Shadow</span>
              <span className="chip">Glow</span>
              <span className="chip">Blur</span>
              <span className="chip">Gradient</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

/* eslint-disable no-unused-vars */
import { useMemo, useRef, useState } from 'react';
