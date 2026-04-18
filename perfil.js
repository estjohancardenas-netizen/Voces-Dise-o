    const galleryImgs = [
      "https://images.unsplash.com/photo-1551196073-bf42d5f6e429?w=300&q=80",
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=300&q=80",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300&q=80",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80",
    ];

    function renderGallery() {
      document.getElementById('galleryGrid').innerHTML = galleryImgs.map(img => `
        <div class="gallery-item"><img src="${img}" alt="mural"></div>
      `).join('');
    }

    function switchTab(tab) {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.profile-content').forEach(c => c.classList.add('hidden'));
      document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
      document.getElementById('content' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.remove('hidden');
    }

    const pts = parseInt(localStorage.getItem('vdm_pts') || '0');
    if (document.getElementById('ptsTotal')) document.getElementById('ptsTotal').textContent = pts;

    renderGallery();