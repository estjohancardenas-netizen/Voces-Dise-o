    document.querySelectorAll('.interest-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('selected');
        updateButton();
      });
    });

    function updateButton() {
      const selected = document.querySelectorAll('.interest-card.selected');
      const btn = document.getElementById('btnComenzar');
      btn.style.opacity = selected.length > 0 ? '1' : '0.5';
      btn.style.pointerEvents = selected.length > 0 ? 'auto' : 'none';
    }

    function saveInterestsAndGo() {
      const selected = [...document.querySelectorAll('.interest-card.selected')].map(c => c.dataset.interest);
      if (selected.length === 0) return;
      localStorage.setItem('vdm_interests', JSON.stringify(selected));
      window.location.href = 'mapa.html';
    }

    updateButton();