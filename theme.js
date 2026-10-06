// Apply before styles load to avoid flashing the wrong theme on reload.
(() => {
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('rally-theme'); } catch { /* Storage can be unavailable. */ }
  let explicit = saved === 'light' || saved === 'dark';
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#141a20' : '#ffffff';
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
    button.textContent = theme === 'dark' ? '☀' : '☾';
    button.setAttribute('aria-label', label);
    button.title = label;
  }
  apply(explicit ? saved : preference.matches ? 'dark' : 'light');
  preference.addEventListener('change', e => { if (!explicit) apply(e.matches ? 'dark' : 'light'); });
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      explicit = true;
      apply(theme);
      try { localStorage.setItem('rally-theme', theme); } catch { /* Toggle still works without persistence. */ }
    });
  });
})();
