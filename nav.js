(function initBottomNav() {
  const links = document.querySelectorAll('.bottom-nav .nav-item[href]');
  if (!links.length) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    const targetPage = href.split('?')[0];
    const isCenter = link.classList.contains('nav-center');

    if (!isCenter) {
      link.classList.toggle('active', targetPage === currentPage);
    }

    link.addEventListener('click', (event) => {
      if (window.location.pathname.endsWith(targetPage) && !href.includes('?')) return;

      // Force navigation here so it still works if another global handler intercepts links.
      event.preventDefault();
      window.location.assign(href);
    });
  });
})();
