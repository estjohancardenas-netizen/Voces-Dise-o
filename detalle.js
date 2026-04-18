    const muralsData = {
      1: { name:"Rostros de la Memoria", artist:"DJ Lu", year:2019, location:"La Candelaria", tags:["Memoria","Conflicto","Reconciliación"], desc:"Una obra monumental que retrata los rostros de víctimas del conflicto armado colombiano. Los colores vibrantes contrastan con la dureza del tema, creando un diálogo visual entre la esperanza y el dolor.", img:"https://images.unsplash.com/photo-1551196073-bf42d5f6e429?w=800&q=80", category:"historia" },
      2: { name:"Mujer Ancestral", artist:"Guache", year:2018, location:"La Candelaria", tags:["Identidad","Cultura","Feminidad"], desc:"Una figura femenina indígena emerge de entre colores vivos que celebran la herencia cultural de los pueblos originarios de Colombia.", img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", category:"arte" },
      3: { name:"Colibrí Tropical", artist:"DJ Lu", year:2020, location:"Chapinero", tags:["Naturaleza","Color","Biodiversidad"], desc:"Un homenaje a la biodiversidad colombiana. El colibrí, símbolo de resiliencia, toma vida en un mural de más de 20 metros de altura.", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", category:"fotografia" },
    };

    const tagColors = { "Memoria":"#E85D04","Conflicto":"#DC2626","Reconciliación":"#10B981","Identidad":"#8B5CF6","Cultura":"#F59E0B","Feminidad":"#EC4899","Naturaleza":"#10B981","Color":"#06B6D4","Biodiversidad":"#22C55E","Libertad":"#E85D04","Patria":"#10B981","Ancestral":"#8B5CF6","Poder":"#F59E0B" };

    const urlParams = new URLSearchParams(window.location.search);
    const muralId = parseInt(urlParams.get('id')) || 1;
    const mural = muralsData[muralId] || muralsData[1];

    document.getElementById('muralImg').src = mural.img;
    document.getElementById('detailTitle').textContent = mural.name;
    document.getElementById('artistName').textContent = mural.artist;
    document.getElementById('artistAvatar').textContent = mural.artist[0];
    document.getElementById('muralYear').textContent = mural.year;
    document.getElementById('muralLocation').textContent = mural.location;
    document.getElementById('detailDesc').textContent = mural.desc;
    document.getElementById('audioTitle').textContent = `Historia del Mural — Guía Audio`;
    document.getElementById('audioArtist').textContent = mural.artist;

    document.getElementById('detailTags').innerHTML = mural.tags.map(tag =>
      `<span class="tag" style="background:${(tagColors[tag]||'#444')}22;color:${tagColors[tag]||'#aaa'};border-color:${tagColors[tag]||'#444'}44">${tag}</span>`
    ).join('');

    // Waveform
    const waveform = document.getElementById('waveform');
    for (let i = 0; i < 60; i++) {
      const bar = document.createElement('div');
      bar.className = 'wave-bar';
      bar.style.height = (Math.random() * 28 + 4) + 'px';
      waveform.appendChild(bar);
    }

    // Audio simulation
    let playing = false, currentSec = 0, totalSec = 225, timer;
    const bars = document.querySelectorAll('.wave-bar');

    function togglePlay() {
      playing = !playing;
      document.getElementById('playIcon').style.display = playing ? 'none' : 'block';
      document.getElementById('pauseIcon').style.display = playing ? 'block' : 'none';
      if (playing) { timer = setInterval(tick, 1000); } else { clearInterval(timer); }
    }

    function tick() {
      currentSec = Math.min(currentSec + 1, totalSec);
      const s = currentSec % 60, m = Math.floor(currentSec / 60);
      document.getElementById('currentTime').textContent = `${m}:${s.toString().padStart(2,'0')}`;
      const progress = currentSec / totalSec;
      bars.forEach((bar, i) => {
        bar.style.background = i < bars.length * progress ? '#E85D04' : 'rgba(255,255,255,0.2)';
      });
      if (currentSec >= totalSec) { clearInterval(timer); playing = false; }
    }

    function seekBack() { currentSec = Math.max(0, currentSec - 10); }
    function seekForward() { currentSec = Math.min(totalSec, currentSec + 10); }

    let favorited = false;
    function toggleFavorite() {
      favorited = !favorited;
      const btn = document.getElementById('favoriteBtn');
      btn.querySelector('svg').setAttribute('fill', favorited ? '#E85D04' : 'none');
    }

    function shareDetail() { if (navigator.share) { navigator.share({ title: mural.name, url: window.location.href }); } }