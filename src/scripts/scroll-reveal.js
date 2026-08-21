/**
 * Scroll Reveal Script
 * 
 * Uses IntersectionObserver to add .is-visible to .reveal elements
 * when they enter the viewport.
 * 
 * 🎯 KEY INSIGHT: The animation timing and easing is defined in 
 * animation.css tokens. This script only toggles a class.
 * When prefers-reduced-motion is on, the CSS tokens set 
 * --reveal-distance to 0 and durations to 0ms automatically.
 */

(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  reveals.forEach(el => observer.observe(el));
})();
