const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航');
  mobileNav.hidden = true;
}

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? '打开导航' : '关闭导航');
  mobileNav.hidden = expanded;
});
mobileNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
  const link = event.target.closest('a[href^="#"]');
  if (link) openNote(link.hash);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
function openNote(hash) {
  const target = document.getElementById(hash.slice(1));
  if (target instanceof HTMLDetailsElement) target.open = true;
}
function openLinkedNote() {
  openNote(window.location.hash);
}
window.addEventListener('hashchange', openLinkedNote);
openLinkedNote();
document.getElementById('year').textContent = new Date().getFullYear();
