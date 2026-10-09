const studies = window.AV_PROJECTS || [];
const slug = new URLSearchParams(location.search).get('slug');
const project = studies.find(item => item.slug === slug) || studies[0];
const setText = (id, value) => { document.getElementById(id).textContent = value; };

if (project) {
  document.title = `${project.title} — Ashish Verma`;
  setText('project-number', `PROJECT ${project.number} / ${project.type.toUpperCase()}`);
  setText('project-title', project.title);
  setText('project-overview', project.overview);
  setText('project-type', project.type);
  setText('project-scope', project.scope);
  setText('project-location', project.location);
  setText('project-year', project.year);
  setText('project-concept', project.concept);
  setText('project-role', project.role);
  setText('project-challenge', project.challenge);
  setText('project-outcome', project.outcome);
  const cover = document.getElementById('project-cover');
  cover.src = project.cover;
  cover.alt = project.coverAlt;
  const next = studies[(studies.indexOf(project) + 1) % studies.length];
  document.getElementById('next-project').href = `project.html?slug=${encodeURIComponent(next.slug)}`;
  setText('next-title', next.title);
}

const viewer = document.getElementById('drawing-viewer');
const viewerImage = document.getElementById('viewer-image');
const viewerStage = document.getElementById('viewer-stage');
const zoomValue = document.getElementById('zoom-value');
let zoom = 1, panX = 0, panY = 0;
const pointers = new Map();
let pinchDistance = 0;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const updateView = () => {
  viewerImage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  zoomValue.textContent = `${Math.round(zoom * 100)}%`;
};
const setZoom = value => {
  zoom = clamp(value, 1, 6);
  if (zoom === 1) { panX = 0; panY = 0; }
  updateView();
};
const openViewer = drawing => {
  viewerImage.src = drawing.src;
  viewerImage.alt = drawing.label;
  setText('viewer-title', drawing.label);
  zoom = 1; panX = 0; panY = 0; updateView();
  viewer.showModal();
  document.getElementById('viewer-close').focus();
};

if (project) {
  const drawingList = document.getElementById('project-drawings');
  project.drawings.forEach(drawing => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'drawing-card';
    button.setAttribute('aria-label', `Open ${drawing.label} in full-screen viewer`);
    const image = document.createElement('img');
    image.src = drawing.src;
    image.alt = drawing.label;
    image.loading = 'lazy';
    const info = document.createElement('div');
    info.className = 'drawing-card-info';
    const labels = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = drawing.label;
    const kind = document.createElement('small');
    kind.textContent = drawing.kind;
    labels.append(title, kind);
    const arrow = document.createElement('b');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    info.append(labels, arrow);
    button.append(image, info);
    button.addEventListener('click', () => openViewer(drawing));
    drawingList.append(button);
  });
  if (project.render && project.drawings.length) {
    const drawing = document.getElementById('comparison-drawing');
    const render = document.getElementById('comparison-render');
    drawing.src = project.drawings[0].src;
    drawing.alt = project.drawings[0].label;
    render.src = project.render;
    render.alt = project.renderAlt;
  } else {
    document.getElementById('comparison-section').hidden = true;
    document.getElementById('render-only-section').hidden = false;
    setText('render-only-note', 'The drawing is the final visual study for this project, with the linework carrying the complete design idea.');
  }
}

document.getElementById('viewer-close').addEventListener('click', () => viewer.close());
document.getElementById('zoom-in').addEventListener('click', () => setZoom(zoom * 1.25));
document.getElementById('zoom-out').addEventListener('click', () => setZoom(zoom / 1.25));
document.getElementById('zoom-reset').addEventListener('click', () => setZoom(1));
viewerStage.addEventListener('wheel', event => { event.preventDefault(); setZoom(zoom * Math.exp(-event.deltaY * .0015)); }, { passive: false });
viewerStage.addEventListener('pointerdown', event => {
  viewerStage.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
  }
});
viewerStage.addEventListener('pointermove', event => {
  if (!pointers.has(event.pointerId)) return;
  const prior = pointers.get(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinchDistance) setZoom(zoom * distance / pinchDistance);
    pinchDistance = distance;
  } else if (zoom > 1) {
    panX += event.clientX - prior.x;
    panY += event.clientY - prior.y;
    updateView();
  }
});
const endPointer = event => { pointers.delete(event.pointerId); pinchDistance = 0; };
viewerStage.addEventListener('pointerup', endPointer);
viewerStage.addEventListener('pointercancel', endPointer);
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
viewer.addEventListener('keydown', event => {
  if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom * 1.25); }
  if (event.key === '-') { event.preventDefault(); setZoom(zoom / 1.25); }
  if (event.key === '0') { event.preventDefault(); setZoom(1); }
});

if (project?.model) {
  document.getElementById('model-section').hidden = false;
  const canvas = document.getElementById('massing-canvas');
  const ctx = canvas.getContext('2d');
  let yaw = -.55;
  let dragX = null;
  const projected = (x, y, z) => {
    const rx = x * Math.cos(yaw) - z * Math.sin(yaw);
    const depth = x * Math.sin(yaw) + z * Math.cos(yaw);
    return [410 + rx * 82, 494 - y * 67 + depth * 27];
  };
  const polygon = (points, fill, stroke = '#d1b397', width = 1.4) => {
    ctx.beginPath();
    points.forEach((point, index) => {
      const [x, y] = projected(...point);
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke();
  };
  const box = (y0, y1, inset = 0) => {
    const x0 = -2 + inset, x1 = 2 - inset, z0 = -1.28, z1 = 1.28;
    const faces = [
      { points: [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]], color: '#314146', depth: -z1 },
      { points: [[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]], color: '#455552', depth: x0 },
      { points: [[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]], color: '#455552', depth: x1 },
      { points: [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]], color: '#596560', depth: z1 },
      { points: [[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]], color: '#a99580', depth: 2 }
    ];
    faces.sort((a, b) => a.depth - b.depth).forEach(face => polygon(face.points, face.color));
    for (let i = 0; i < 5; i++) {
      const wx = x0 + .19 + i * (x1 - x0 - .35) / 5;
      const ww = (x1 - x0 - .7) / 5;
      polygon([[wx,y0+.11,z1+.012],[wx+ww,y0+.11,z1+.012],[wx+ww,y1-.11,z1+.012],[wx,y1-.11,z1+.012]], (i % 3 === 0 ? '#bb865f' : '#1c3034'), '#899793', .8);
    }
  };
  const renderModel = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(192,216,205,.13)'; ctx.lineWidth = 1;
    for (let i = -7; i <= 7; i++) {
      const [a,b] = projected(i*.7,0,-4), [c,d] = projected(i*.7,0,4);
      ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();
      const [e,f] = projected(-5,0,i*.7), [g,h] = projected(5,0,i*.7);
      ctx.beginPath();ctx.moveTo(e,f);ctx.lineTo(g,h);ctx.stroke();
    }
    for (let level = 0; level < 8; level++) box(level * .69, level * .69 + .55, level > 5 ? .25 : 0);
    ctx.fillStyle = '#d8b595'; ctx.font = 'bold 13px DM Sans, Arial'; ctx.fillText('SCHEMATIC MASSING / DRAG TO ROTATE', 30, 45);
    ctx.fillStyle = '#91a69b'; ctx.font = '11px DM Sans, Arial'; ctx.fillText('FORM STUDY / EIGHT LEVELS', 30, 566);
  };
  canvas.addEventListener('pointerdown', event => { dragX = event.clientX; canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove', event => {
    if (dragX === null) return;
    yaw = clamp(yaw + (event.clientX - dragX) * .008, -1.25, 1.25);
    dragX = event.clientX; renderModel();
  });
  canvas.addEventListener('pointerup', () => { dragX = null; });
  canvas.addEventListener('pointercancel', () => { dragX = null; });
  document.getElementById('model-left').addEventListener('click', () => { yaw = clamp(yaw - .22, -1.25, 1.25); renderModel(); });
  document.getElementById('model-right').addEventListener('click', () => { yaw = clamp(yaw + .22, -1.25, 1.25); renderModel(); });
  document.getElementById('model-reset').addEventListener('click', () => { yaw = -.55; renderModel(); });
  renderModel();
}
