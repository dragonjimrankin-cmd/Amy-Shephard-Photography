const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const filterButtons = [...document.querySelectorAll('.filter-button')];
const workCards = [...document.querySelectorAll('.work-card')];
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxClose = document.querySelector('.lightbox-close');
let lastTrigger = null;

function closeMobileNav() {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileNav.hidden = true;
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  mobileNav.hidden = isOpen;
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 620) closeMobileNav();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    workCards.forEach((card) => {
      const showCard = filter === 'all' || card.dataset.category === filter;
      card.hidden = !showCard;
      if (showCard) visibleCount += 1;
    });

    const status = document.querySelector('.filter-status');
    if (status) status.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'piece' : 'pieces'} of work.`;
  });
});

function openLightbox(card) {
  if (!lightbox || !lightboxImage) return;
  lastTrigger = card;
  lightboxImage.src = card.dataset.full;
  lightboxImage.alt = card.dataset.alt || card.dataset.title || 'Selected portfolio image';
  lightboxTitle.textContent = card.dataset.title || 'Selected work';
  lightbox.showModal();
  lightboxClose?.focus();
}

workCards.forEach((card) => {
  card.addEventListener('click', () => openLightbox(card));
});

lightboxClose?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener('close', () => {
  lightboxImage.removeAttribute('src');
  if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
});

document.addEventListener('error', (event) => {
  const image = event.target;
  if (image instanceof HTMLImageElement) {
    image.closest('[data-image-frame]')?.classList.add('image-fallback');
  }
}, true);

const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());
