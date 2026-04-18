    const murals = [
      { id:1, name:"Rostros de la Memoria", artist:"DJ Lu", year:2019, location:"La Candelaria", lat:4.5981, lng:-74.0759, category:"historia", tags:["Memoria","Conflicto","Reconciliación"], emoji:"👁️" },
      { id:2, name:"Mujer Ancestral", artist:"Guache", year:2018, location:"La Candelaria", lat:4.5971, lng:-74.0749, category:"arte", tags:["Identidad","Cultura"], emoji:"🌿" },
      { id:3, name:"Colibrí Tropical", artist:"DJ Lu", year:2020, location:"Chapinero", lat:4.6320, lng:-74.0642, category:"fotografia", tags:["Naturaleza","Color"], emoji:"🐦" },
      { id:4, name:"Jaguar Sagrado", artist:"Toxicómano", year:2017, location:"Teusaquillo", lat:4.6097, lng:-74.0817, category:"arte", tags:["Ancestral","Poder"], emoji:"🐆" },
      { id:5, name:"Cóndor Andino", artist:"Lesivo", year:2021, location:"Chapinero", lat:4.6380, lng:-74.0672, category:"historia", tags:["Libertad","Patria"], emoji:"🦅" },
    ];

    const categoryColors = { historia:"#E85D04", arte:"#10B981", fotografia:"#06B6D4" };

    let map, markers=[], activeInterests=[];

    function initMap() {
      activeInterests = JSON.parse(localStorage.getItem('vdm_interests') || '["historia","arte","fotografia"]');
      
      map = L.map('map', { zoomControl: false, attributionControl: false }).setView([4.6097, -74.0817], 14);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      renderMarkers();
      renderFilterChips();
      renderMuralsList();
    }

    function renderMarkers() {
      markers.forEach(m => map.removeLayer(m));
      markers = [];

      const filtered = murals.filter(m => activeInterests.includes(m.category));
      document.getElementById('muralsCount').textContent = `${filtered.length} murales cerca`;

      filtered.forEach(mural => {
        const color = categoryColors[mural.category];
        const icon = L.divIcon({
          html: `<div class="map-pin" style="background:${color}"><span>${mural.emoji}</span></div>`,
          className: '',
          iconSize: [44, 54],
          iconAnchor: [22, 54]
        });
        const marker = L.marker([mural.lat, mural.lng], { icon }).addTo(map);
        marker.on('click', () => window.location.href = `detalle.html?id=${mural.id}`);
        markers.push(marker);
      });
    }

    function renderFilterChips() {
      const all = ['historia','arte','fotografia'];
      const container = document.getElementById('filterChips');
      container.innerHTML = all.map(cat => `
        <div class="chip ${activeInterests.includes(cat) ? 'active' : ''}" 
             style="--chip-color: ${categoryColors[cat]}"
             onclick="toggleFilter('${cat}')">
          ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </div>`).join('');
    }

    function toggleFilter(cat) {
      if (activeInterests.includes(cat)) {
        if (activeInterests.length === 1) return;
        activeInterests = activeInterests.filter(i => i !== cat);
      } else {
        activeInterests.push(cat);
      }
      localStorage.setItem('vdm_interests', JSON.stringify(activeInterests));
      renderMarkers();
      renderFilterChips();
      renderMuralsList();
    }

    function renderMuralsList(query='') {
      const filtered = murals.filter(m => activeInterests.includes(m.category) && 
        (!query || m.name.toLowerCase().includes(query.toLowerCase()) || m.artist.toLowerCase().includes(query.toLowerCase())));
      const container = document.getElementById('muralsList');
      container.innerHTML = filtered.map(m => `
        <a href="detalle.html?id=${m.id}" class="mural-list-item">
          <div class="mural-list-dot" style="background:${categoryColors[m.category]}"></div>
          <div class="mural-list-info">
            <strong>${m.name}</strong>
            <span>${m.artist} · ${m.location}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </a>`).join('');
    }

    function filterMurals(query) { renderMuralsList(query); }

    document.addEventListener('DOMContentLoaded', initMap);