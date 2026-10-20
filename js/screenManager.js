/**
 * screenManager.js – manages screen transitions (fade / slide)
 */

const SCREENS = ['screen-envelope', 'screen-letter', 'screen-photos', 'screen-video'];
let currentIndex = 0;
let isTransitioning = false;

const dots = [];
const navPrev = document.getElementById('nav-prev');
const navNext = document.getElementById('nav-next');

export function initScreenManager() {
  // Create nav dots
  const dotsWrap = document.getElementById('nav-dots');
  SCREENS.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'nav-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Màn hình ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  // Activate first screen
  document.getElementById(SCREENS[0]).classList.add('active', 'slide-enter');
  updateNav();
}

export function goTo(index) {
  if (isTransitioning || index === currentIndex) return;
  if (index < 0 || index >= SCREENS.length) return;
  isTransitioning = true;

  const leaving = document.getElementById(SCREENS[currentIndex]);
  const entering = document.getElementById(SCREENS[index]);
  const forward = index > currentIndex;

  // Prepare entering screen off-screen
  entering.classList.remove('active', 'slide-exit');
  entering.classList.add('slide-enter');
  entering.style.transform = forward ? 'translateX(100%)' : 'translateX(-100%)';
  entering.style.opacity = '0';
  entering.style.pointerEvents = 'none';

  // Force reflow
  entering.getBoundingClientRect();

  // Start transition
  requesting(() => {
    leaving.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    leaving.style.transform = forward ? 'translateX(-100%)' : 'translateX(100%)';
    leaving.style.opacity = '0';

    entering.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    entering.style.transform = 'translateX(0)';
    entering.style.opacity = '1';
    entering.style.pointerEvents = 'auto';

    setTimeout(() => {
      leaving.classList.remove('active');
      leaving.style.cssText = '';
      entering.classList.add('active');
      entering.style.cssText = '';
      currentIndex = index;
      isTransitioning = false;
      updateNav();
      emitScreenChange(SCREENS[index]);
    }, 580);
  });
}

export function goNext() { goTo(currentIndex + 1); }
export function goPrev() { goTo(currentIndex - 1); }
export function getCurrentScreen() { return currentIndex; }

function updateNav() {
  dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  if (navPrev) navPrev.classList.toggle('visible', currentIndex > 0);
  if (navNext) navNext.classList.toggle('visible', currentIndex < SCREENS.length - 1);

  // Dark mode for film / video screens
  const topBar = document.querySelector('.top-bar');
  const vinylWidget = document.querySelector('.vinyl-widget');
  const isDark = currentIndex >= 2;
  topBar?.classList.toggle('dark-mode', isDark);
  vinylWidget?.classList.toggle('dark-mode', isDark);
}

function requesting(fn) { requestAnimationFrame(() => requestAnimationFrame(fn)); }

function emitScreenChange(screenId) {
  document.dispatchEvent(new CustomEvent('screenChange', { detail: { screenId } }));
}
