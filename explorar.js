    function setMode(mode) {
      const isCam = mode === 'camara';
      document.getElementById('btnCamara').classList.toggle('active', isCam);
      document.getElementById('btnStencil').classList.toggle('active', !isCam);
      document.getElementById('stencilToolbar').classList.toggle('visible', !isCam);
    }

    function toggleGrid() {
      document.getElementById('gridOverlay').classList.toggle('hidden');
    }

    function toggleLight() { /* flash effect */ 
      document.getElementById('arView').style.filter = 'brightness(1.4)';
      setTimeout(() => document.getElementById('arView').style.filter = '', 200);
    }

    function closeTip() { document.getElementById('arTip').style.display = 'none'; }
    function closeAR() { window.history.back(); }

    let draggedStencil = null;
    function dragStencil(e) { draggedStencil = e.target.dataset.stencil; }

    const arView = document.getElementById('arView');
    arView.addEventListener('dragover', e => e.preventDefault());
    arView.addEventListener('drop', e => {
      e.preventDefault();
      if (!draggedStencil) return;
      const rect = arView.getBoundingClientRect();
      const el = document.createElement('div');
      el.className = 'dropped-stencil';
      el.textContent = draggedStencil;
      el.style.left = (e.clientX - rect.left - 20) + 'px';
      el.style.top = (e.clientY - rect.top - 20) + 'px';
      el.onclick = () => el.remove();
      document.getElementById('droppedStencils').appendChild(el);
    });

    function capturePhoto() {
      const flash = document.createElement('div');
      flash.style.cssText = 'position:absolute;inset:0;background:white;opacity:0.8;z-index:100;pointer-events:none;transition:opacity 0.3s';
      arView.appendChild(flash);
      setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 300); }, 100);
    }