// ==========================================
// VOCES DEL MURO — Global App State
// ==========================================

const VDM = {
  // Murals database
  murals: [
    { id:1, name:"Rostros de la Memoria", artist:"DJ Lu", year:2019, location:"La Candelaria", lat:4.5981, lng:-74.0759, category:"historia", tags:["Memoria","Conflicto","Reconciliación"] },
    { id:2, name:"Mujer Ancestral", artist:"Guache", year:2018, location:"La Candelaria", lat:4.5971, lng:-74.0749, category:"arte", tags:["Identidad","Cultura"] },
    { id:3, name:"Colibrí Tropical", artist:"DJ Lu", year:2020, location:"Chapinero", lat:4.6320, lng:-74.0642, category:"fotografia", tags:["Naturaleza","Color"] },
    { id:4, name:"Jaguar Sagrado", artist:"Toxicómano", year:2017, location:"Teusaquillo", lat:4.6097, lng:-74.0817, category:"arte", tags:["Ancestral","Poder"] },
    { id:5, name:"Cóndor Andino", artist:"Lesivo", year:2021, location:"Chapinero", lat:4.6380, lng:-74.0672, category:"historia", tags:["Libertad","Patria"] },
  ],

  categoryColors: { historia:"#E85D04", arte:"#10B981", fotografia:"#06B6D4" },

  getInterests() {
    return JSON.parse(localStorage.getItem('vdm_interests') || '["historia","arte","fotografia"]');
  },

  setInterests(arr) {
    localStorage.setItem('vdm_interests', JSON.stringify(arr));
  },

  getPts() {
    return parseInt(localStorage.getItem('vdm_pts') || '0');
  },

  addPts(n) {
    const curr = this.getPts();
    localStorage.setItem('vdm_pts', curr + n);
    return curr + n;
  },

  getProgress() {
    return JSON.parse(localStorage.getItem('vdm_progress') || '{}');
  },

  getMuralById(id) {
    return this.murals.find(m => m.id === id);
  }
};

// Page transition effect
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

// Intercept nav links for smooth transitions
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http')) return;
  e.preventDefault();
  document.body.style.opacity = '0';
  setTimeout(() => { window.location.href = href; }, 250);
});

console.log('🎨 Voces del Muro — Iniciado');
