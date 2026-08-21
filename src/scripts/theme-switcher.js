/**
 * Theme Switcher Script
 * 
 * Sets data-theme attribute on <html> element.
 * Persists choice to localStorage.
 * 
 * 🎯 KEY INSIGHT: We don't change CSS files. We set a data attribute
 * on the root element. The CSS tokens in primitives.css and semantic.css
 * have selectors like [data-theme="dark"] that automatically activate
 * the right token overrides. Zero JavaScript color logic.
 */

(function initThemeSwitcher() {
  const root = document.documentElement;
  const switcher = document.getElementById('theme-switcher');
  if (!switcher) return;

  const buttons = switcher.querySelectorAll('[data-theme-value]');
  const hueToggle = switcher.querySelector('[data-hue-toggle]');

  // Restore saved theme
  const savedTheme = localStorage.getItem('earthguard-theme') || '';
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }
  updateActiveButton(savedTheme);

  // Restore hue shift state
  const savedHue = localStorage.getItem('earthguard-hue-shift') === 'true';
  if (savedHue) {
    root.setAttribute('data-hue-shift', 'true');
    hueToggle?.classList.add('is-active');
  }

  // Theme buttons
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-value') || '';
      root.setAttribute('data-theme', theme);
      localStorage.setItem('earthguard-theme', theme);
      updateActiveButton(theme);
    });
  });

  // Hue rotation toggle
  hueToggle?.addEventListener('click', () => {
    const isActive = root.getAttribute('data-hue-shift') === 'true';
    if (isActive) {
      root.removeAttribute('data-hue-shift');
      hueToggle.classList.remove('is-active');
      localStorage.setItem('earthguard-hue-shift', 'false');
    } else {
      root.setAttribute('data-hue-shift', 'true');
      hueToggle.classList.add('is-active');
      localStorage.setItem('earthguard-hue-shift', 'true');
    }
  });

  function updateActiveButton(theme) {
    buttons.forEach(btn => {
      const val = btn.getAttribute('data-theme-value') || '';
      btn.classList.toggle('is-active', val === theme);
    });
  }
})();
