    const muralsColorea = [
      { id:1, name:"Colibrí Tropical", artist:"DJ Lu", diff:"Fácil", pts:50, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", progress:0 },
      { id:2, name:"Mujer Ancestral", artist:"Guache", diff:"Medio", pts:80, img:"https://images.unsplash.com/photo-1551196073-bf42d5f6e429?w=400&q=80", progress:0 },
      { id:3, name:"Jaguar Sagrado", artist:"Toxicómano", diff:"Difícil", pts:120, img:"https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80", progress:0 },
      { id:4, name:"Cóndor Andino", artist:"Lesivo", diff:"Medio", pts:80, img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", progress:0 },
      { id:5, name:"Raíces de Bogotá", artist:"Stinkfish", diff:"Fácil", pts:50, img:"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80", progress:0 },
      { id:6, name:"El Tiempo Libre", artist:"Tripdog", diff:"Difícil", pts:120, img:"https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80", progress:0 },
    ];

    const diffColors = { Fácil:"#10B981", Medio:"#F59E0B", Difícil:"#EF4444" };
    const palette = ["#E85D04","#06B6D4","#EF4444","#FBBF24","#10B981","#06B6D4","#8B5CF6","#F472B6","#06D6A0","#EC4899","#E85D04","#22C55E"];

    let userPts = parseInt(localStorage.getItem('vdm_pts') || '0');
    let currentMural = null;
    let brushSize = 12;
    let currentColor = "#E85D04";
    let isDrawing = false;
    let totalPixels = 0;
    let paintedPixels = 0;

    function updatePtsDisplay() {
      document.getElementById('totalPts').textContent = userPts;
      document.getElementById('headerPts').textContent = userPts;
    }

    function renderGrid() {
      const saved = JSON.parse(localStorage.getItem('vdm_progress') || '{}');
      const grid = document.getElementById('cologrid');
      grid.innerHTML = muralsColorea.map(m => {
        const prog = saved[m.id] || 0;
        return `
        <div class="colorea-card" onclick="openStencil(${m.id})">
          <div class="colorea-card-img">
            <img src="${m.img}" alt="${m.name}">
            ${prog === 0 ? `<div class="colorea-card-overlay"><span class="colorea-start-icon">🎨</span></div>` : ''}
          </div>
          <div class="diff-badge" style="background:${diffColors[m.diff]}22;color:${diffColors[m.diff]}">${m.diff}</div>
          <div class="pts-badge-card">+${m.pts} pts</div>
          <div class="colorea-card-info">
            <strong>${m.name}</strong>
            <span>${m.artist}</span>
          </div>
          <div class="colorea-progress-row">
            <div class="colorea-mini-bar"><div class="colorea-mini-fill" style="width:${prog}%"></div></div>
            <span>${prog}%</span>
          </div>
        </div>`;
      }).join('');
    }

    function openStencil(id) {
      currentMural = muralsColorea.find(m => m.id === id);
      document.getElementById('stencilTitle').textContent = currentMural.name;
      document.getElementById('stencilPts').textContent = `+${currentMural.pts} pts`;
      document.getElementById('stencilModal').classList.add('active');
      document.getElementById('stencilBackdrop').classList.add('active');
      setupCanvas();
      renderPalette();
      updateBrushPreview();
    }

    function closeStencil() {
      document.getElementById('stencilModal').classList.remove('active');
      document.getElementById('stencilBackdrop').classList.remove('active');
      renderGrid();
    }

    function setupCanvas() {
      const canvas = document.getElementById('stencilCanvas');
      const ctx = canvas.getContext('2d');
      const overlay = document.getElementById('stencilOverlay');
      overlay.style.backgroundImage = `url(${currentMural.img})`;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      totalPixels = canvas.width * canvas.height;
      paintedPixels = 0;
      updateProgress();
      setupDrawing(canvas, ctx);
    }

    function setupDrawing(canvas, ctx) {
      const getPos = (e) => {
        const r = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (clientX - r.left) * (canvas.width / r.width), y: (clientY - r.top) * (canvas.height / r.height) };
      };

      const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        estimateProgress(ctx, canvas);
      };

      canvas.onmousedown = canvas.ontouchstart = (e) => { isDrawing = true; draw(e); };
      canvas.onmousemove = canvas.ontouchmove = draw;
      canvas.onmouseup = canvas.ontouchend = () => { isDrawing = false; };
      canvas.onmouseleave = () => { isDrawing = false; };
    }

    function estimateProgress(ctx, canvas) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let painted = 0;
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 10) painted++;
      }
      const pct = Math.min(Math.round((painted / (canvas.width * canvas.height)) * 400), 100);
      updateProgress(pct);
    }

    function updateProgress(pct=0) {
      document.getElementById('progressPct').textContent = pct + '%';
      document.getElementById('progressFill').style.width = pct + '%';
      
      if (currentMural) {
        const saved = JSON.parse(localStorage.getItem('vdm_progress') || '{}');
        if (pct > (saved[currentMural.id] || 0)) {
          const gained = Math.floor((pct - (saved[currentMural.id] || 0)) / 10) * Math.floor(currentMural.pts / 10);
          userPts += gained;
          localStorage.setItem('vdm_pts', userPts);
          saved[currentMural.id] = pct;
          localStorage.setItem('vdm_progress', JSON.stringify(saved));
          updatePtsDisplay();
        }
      }
    }

    function resetCanvas() {
      const canvas = document.getElementById('stencilCanvas');
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      updateProgress(0);
    }

    function renderPalette() {
      const container = document.getElementById('colorPalette');
      container.innerHTML = palette.map(c => `
        <div class="color-swatch ${c===currentColor?'active':''}" style="background:${c}" onclick="selectColor('${c}', this)"></div>
      `).join('');
    }

    function selectColor(color, el) {
      currentColor = color;
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      el.classList.add('active');
      updateBrushPreview();
    }

    function changeBrush(delta) {
      brushSize = Math.max(4, Math.min(40, brushSize + delta));
      updateBrushPreview();
    }

    function updateBrushPreview() {
      const prev = document.getElementById('brushPreview');
      prev.style.width = prev.style.height = (brushSize * 2) + 'px';
      prev.style.background = currentColor;
    }

    updatePtsDisplay();
    renderGrid();