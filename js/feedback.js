(() => {
  const listEl = document.getElementById('feedback-list');
  const emptyEl = document.getElementById('feedback-empty');
  if (!listEl) return;

  fetch('/feedback.json')
    .then(res => res.ok ? res.json() : [])
    .then(items => {
      if (!items || !items.length) {
        emptyEl.style.display = 'block';
        return;
      }
      listEl.innerHTML = items.map(item => {
        const name = item.name ? item.name.replace(/</g, '&lt;') : 'Anonymous';
        const message = item.message ? item.message.replace(/</g, '&lt;') : '';
        const time = item.time ? new Date(item.time).toLocaleString() : '';
        return `
          <div class="panel" style="display:grid; gap:10px;">
            <div style="font-weight:700;">${name}</div>
            <div class="section-sub" style="color: var(--text);">${message}</div>
            <div style="font-size:0.65rem; letter-spacing:0.08em; text-transform:uppercase; color: var(--muted);">${time}</div>
          </div>
        `;
      }).join('');
    })
    .catch(() => {
      emptyEl.textContent = 'Feedback unavailable. Start the server with `python3 app.py`.';
      emptyEl.style.display = 'block';
    });
})();
