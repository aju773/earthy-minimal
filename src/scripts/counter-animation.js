/**
 * Counter Animation Script
 * 
 * Animates number counters from 0 to target value.
 * Uses IntersectionObserver to trigger when visible.
 * 
 * 🎯 The animation duration comes from CSS custom properties,
 * read via getComputedStyle. Even JS animations respect the design tokens.
 */

(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  // Read animation duration from CSS token
  const styles = getComputedStyle(document.documentElement);
  const durationStr = styles.getPropertyValue('--duration-slowest').trim();
  const duration = parseInt(durationStr) || 1200;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, duration);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(el => observer.observe(el));

  function animateCounter(el, totalDuration) {
    const target = parseInt(el.getAttribute('data-counter') || '0');
    const suffix = el.getAttribute('data-suffix') || '';
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Ease-out deceleration curve (matches --ease-decelerate)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
})();
