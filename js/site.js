(() => {
  const headerTarget = document.getElementById('site-header');
  const footerTarget = document.getElementById('site-footer');

  if (headerTarget) {
    headerTarget.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <nav class="site-nav" aria-label="Primary">
        <a class="nav-brand" href="index.html">UNBLOCKED<span>.</span>GG</a>
        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="index.html#games">Games</a></li>
          <li><a href="index.html#coming-soon">Coming Soon</a></li>
          <li><a href="index.html#about">About</a></li>
          <li><a href="index.html#feedback">Feedback</a></li>
        </ul>
        <div class="nav-actions">
          <button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-label="Toggle navigation">Menu</button>
          <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle theme">Theme</button>
          <span class="nav-pill" id="nav-count">0 games</span>
        </div>
      </nav>
    `;
  }

  if (footerTarget) {
    const year = new Date().getFullYear();
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="footer-left">
          <div class="footer-logo">UNBLOCKED<span>.</span>GG</div>
          <div class="footer-note">© ${year} · 100% browser-based</div>
        </div>
        <div class="footer-links">
          <a href="index.html#feedback">Feedback</a>
          <a href="index.html#about">About</a>
        </div>
      </footer>
    `;
  }

  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const stored = localStorage.getItem('site-theme');
    if (stored) {
      document.body.dataset.theme = stored;
    }
    themeToggle.addEventListener('click', () => {
      const next = document.body.dataset.theme === 'light' ? 'dark' : 'light';
      document.body.dataset.theme = next;
      localStorage.setItem('site-theme', next);
    });
  }

  const navCount = document.getElementById('nav-count');
  if (navCount) {
    const liveCards = document.querySelectorAll('.game-card[data-status="live"]');
    const soonCards = document.querySelectorAll('.game-card[data-status="soon"]');
    if (liveCards.length) {
      navCount.textContent = `${liveCards.length} live`;
    } else if (soonCards.length) {
      navCount.textContent = `${soonCards.length} soon`;
    }
  }

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const toggleButton = () => {
      backToTop.classList.toggle('visible', window.scrollY > 240);
    };
    window.addEventListener('scroll', toggleButton, { passive: true });
    toggleButton();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const analyticsPayload = {
    placeholder: true,
    page: window.location.pathname,
    timestamp: Date.now()
  };
  window.__analyticsPlaceholder = analyticsPayload;
})();
