/* ====================================================
   福祉タクシーぬさまい — Main JS (claude-designed)
   ==================================================== */

/* --- Accordion (FAQ) --- */
document.querySelectorAll('.accordion-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const panel = btn.nextElementSibling;

    const group = btn.closest('.accordion');
    group.querySelectorAll('.accordion-trigger').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
    }
  });
});

document.querySelectorAll('.accordion').forEach(acc => {
  const first = acc.querySelector('.accordion-trigger');
  if (first) {
    first.setAttribute('aria-expanded', 'true');
    first.nextElementSibling.classList.add('open');
  }
});

/* --- Mobile menu toggle --- */
const menuToggle = document.querySelector('.menu-toggle');
const headerNav  = document.querySelector('.header-nav');
const headerCta  = document.querySelector('.header-cta');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const open = headerNav.classList.toggle('open');
    if (headerCta) headerCta.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

document.querySelectorAll('.header-nav a').forEach(a => {
  a.addEventListener('click', () => {
    headerNav.classList.remove('open');
    if (headerCta) headerCta.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  });
});

/* --- Scroll reveal --- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}
