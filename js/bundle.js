/**
 * ============================================================================
 * Gửi Mẹ Yêu • Chúc Mừng 20/10 - Universal Bundle
 * Works seamlessly on both http://localhost:3000 and file:/// protocol!
 * Modular source files are maintained under /js and /css.
 * ============================================================================
 */

(() => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. SCREEN MANAGER
  // --------------------------------------------------------------------------
  const SCREENS = ['screen-envelope', 'screen-letter', 'screen-photos', 'screen-video'];
  let currentIndex = 0;
  let isTransitioning = false;
  const dots = [];

  function initScreenManager() {
    const dotsWrap = document.getElementById('nav-dots');
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      SCREENS.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'nav-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Màn hình ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    const firstScreen = document.getElementById(SCREENS[0]);
    if (firstScreen) {
      firstScreen.classList.add('active', 'slide-enter');
    }
    updateNav();
  }

  function goTo(index) {
    if (isTransitioning || index === currentIndex) return;
    if (index < 0 || index >= SCREENS.length) return;
    isTransitioning = true;

    const leaving = document.getElementById(SCREENS[currentIndex]);
    const entering = document.getElementById(SCREENS[index]);
    if (!leaving || !entering) {
      isTransitioning = false;
      return;
    }

    const forward = index > currentIndex;

    entering.classList.remove('active', 'slide-exit');
    entering.classList.add('slide-enter');
    entering.style.transform = forward ? 'translateX(100%)' : 'translateX(-100%)';
    entering.style.opacity = '0';
    entering.style.pointerEvents = 'none';

    // Force reflow
    entering.getBoundingClientRect();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
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
    });
  }

  function goNext() { goTo(currentIndex + 1); }
  function goPrev() { goTo(currentIndex - 1); }

  function updateNav() {
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    if (navPrev) navPrev.classList.toggle('visible', currentIndex > 0);
    if (navNext) navNext.classList.toggle('visible', currentIndex < SCREENS.length - 1);

    const topBar = document.querySelector('.top-bar');
    const musicPill = document.querySelector('.music-pill');
    const musicDrawer = document.querySelector('.music-drawer');
    const isDark = currentIndex >= 2;
    if (topBar) topBar.classList.toggle('dark-mode', isDark);
    if (musicPill) musicPill.classList.toggle('dark-mode', isDark);
    if (musicDrawer) musicDrawer.classList.toggle('dark-mode', isDark);
  }

  function emitScreenChange(screenId) {
    document.dispatchEvent(new CustomEvent('screenChange', { detail: { screenId } }));
  }

  // --------------------------------------------------------------------------
  // 2. ENVELOPE (SCREEN 1)
  // --------------------------------------------------------------------------
  let opened = false;
  function initEnvelope() {
    const env = document.getElementById('envelope-3d');
    if (!env) return;

    env.addEventListener('click', openEnvelope);
    env.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openEnvelope();
    });
    env.setAttribute('tabindex', '0');
    env.setAttribute('role', 'button');
    env.setAttribute('aria-label', 'Mở phong bì thư');
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;

    const env = document.getElementById('envelope-3d');
    if (env) env.classList.add('is-open');

    playSweetChime();

    const hint = document.getElementById('env-hint');
    if (hint) hint.style.opacity = '0';

    setTimeout(() => {
      goNext();
    }, 950);
  }

  // --------------------------------------------------------------------------
  // 3. PHOTO SLIDESHOW (SCREEN 3)
  // --------------------------------------------------------------------------
  const PHOTOS = [
    { src: 'assets/photos/mami.jpg',       caption: 'Mẹ yêu thương của con 🌸' },
    { src: 'assets/photos/mami1.jpg',      caption: 'Nụ cười đẹp nhất đời con ☀️' },
    { src: 'assets/photos/thanhminh.jpg',  caption: 'Khoảnh khắc bên mẹ 💕' },
    { src: 'assets/photos/thanhminh1.jpg', caption: 'Ký ức ngọt ngào không phai 🌷' },
    { src: 'assets/photos/thanhminh2.jpg', caption: 'Luôn bên nhau mẹ nhé ✨' },
    { src: 'assets/photos/allfam.jpg',     caption: 'Gia đình mình hạnh phúc mãi 🏠' },
    { src: 'assets/photos/2_child.jpg',    caption: 'Những năm tháng tuổi thơ tươi đẹp 🌻' },
    { src: 'assets/photos/3_child.jpg',    caption: 'Con lớn lên nhờ bàn tay mẹ 💗' },
    { src: 'assets/photos/meee.jpg',       caption: 'Con yêu mẹ nhiều lắm! ❤️' },
    { src: 'assets/photos/minh.jpg',       caption: 'Cảm ơn mẹ vì tất cả 🙏' },
  ];

  const SWAYS = ['-3deg', '2.5deg', '-2deg', '3.5deg', '-1.5deg', '2deg', '-3.5deg', '1.5deg', '-2.5deg', '3deg'];
  let currentPhoto = 0;
  let autoTimer = null;
  let autoPlaying = true;

  function initPhotos() {
    const container = document.querySelector('.photo-slide-area');
    const progressBar = document.querySelector('.film-progress');
    const counter = document.querySelector('.photo-counter');
    if (!container) return;

    container.innerHTML = '';
    if (progressBar) progressBar.innerHTML = '';

    PHOTOS.forEach((p, i) => {
      const slide = document.createElement('div');
      slide.className = 'photo-slide' + (i === 0 ? ' active' : '');
      slide.innerHTML = `
        <div class="photo-frame" style="--sway:${SWAYS[i % SWAYS.length]}">
          <img src="${p.src}" alt="${p.caption}" loading="${i === 0 ? 'eager' : 'lazy'}">
          <p class="photo-caption">${p.caption}</p>
        </div>`;
      container.appendChild(slide);

      if (progressBar) {
        const tick = document.createElement('div');
        tick.className = 'film-tick' + (i === 0 ? ' active' : '');
        progressBar.appendChild(tick);
      }
    });

    updatePhotoCounter(counter);
    setupPhotoControls();
    startPhotoAutoPlay();
  }

  function showPhoto(index) {
    const slides = document.querySelectorAll('.photo-slide');
    const ticks = document.querySelectorAll('.film-tick');
    const counter = document.querySelector('.photo-counter');

    slides[currentPhoto]?.classList.remove('active');
    ticks[currentPhoto]?.classList.remove('active');

    currentPhoto = (index + PHOTOS.length) % PHOTOS.length;

    slides[currentPhoto]?.classList.add('active');
    ticks[currentPhoto]?.classList.add('active');

    updatePhotoCounter(counter);
  }

  function updatePhotoCounter(counter) {
    if (counter) counter.textContent = `${currentPhoto + 1} / ${PHOTOS.length}`;
  }

  function setupPhotoControls() {
    document.getElementById('slide-prev')?.addEventListener('click', () => {
      showPhoto(currentPhoto - 1);
      resetPhotoAutoPlay();
    });
    document.getElementById('slide-next')?.addEventListener('click', () => {
      showPhoto(currentPhoto + 1);
      resetPhotoAutoPlay();
    });
    document.getElementById('photo-next-btn')?.addEventListener('click', () => {
      stopPhotoAutoPlay();
      goNext();
    });

    let touchStartX = 0;
    const slideArea = document.querySelector('.photo-slide-area');
    slideArea?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    slideArea?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        showPhoto(currentPhoto + (dx < 0 ? 1 : -1));
        resetPhotoAutoPlay();
      }
    }, { passive: true });
  }

  function startPhotoAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!autoPlaying) return;
      const next = currentPhoto + 1;

      if (next >= PHOTOS.length) {
        // Automatically proceed to video screen after full slideshow run
        stopPhotoAutoPlay();
        document.getElementById('photo-next-btn')?.classList.add('highlight');
        setTimeout(() => {
          goNext();
        }, 1500);
        return;
      }

      showPhoto(next);
    }, 3800);
  }

  function stopPhotoAutoPlay() {
    autoPlaying = false;
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetPhotoAutoPlay() {
    stopPhotoAutoPlay();
    autoPlaying = true;
    startPhotoAutoPlay();
  }

  // --------------------------------------------------------------------------
  // 4. VIDEO GALLERY (SCREEN 4)
  // --------------------------------------------------------------------------
  const VIDEOS = [
    { src: 'assets/video/mami.mp4',    label: 'Mẹ yêu thương 💕' },
    { src: 'assets/video/1_child.mp4', label: 'Kỷ niệm con thơ 🌻' },
    { src: 'assets/video/2_child.mp4', label: 'Bên mẹ luôn vui ☀️' },
  ];

  let currentVideo = 0;
  let hugCount = parseInt(localStorage.getItem('hug_count') || '0', 10);

  function initVideoGallery() {
    buildVideoThumbs();
    setupMainVideoPlayer();
    setupHugButton();
    loadVideo(0);
  }

  function buildVideoThumbs() {
    const thumbsWrap = document.getElementById('video-thumbs');
    if (!thumbsWrap) return;
    thumbsWrap.innerHTML = '';

    VIDEOS.forEach((v, i) => {
      const item = document.createElement('div');
      item.className = 'thumb-item' + (i === 0 ? ' active' : '');
      item.dataset.index = i;
      item.innerHTML = `
        <video src="${v.src}" preload="metadata" muted playsinline></video>
        <p class="thumb-label">${v.label}</p>`;
      item.addEventListener('click', () => loadVideo(i));
      thumbsWrap.appendChild(item);
    });
  }

  function loadVideo(index) {
    currentVideo = index;
    const mainVid = document.getElementById('main-video');
    const overlay = document.getElementById('video-play-overlay');
    const titleEl = document.getElementById('video-title');
    const countEl = document.getElementById('video-count');

    if (!mainVid) return;

    mainVid.pause();
    mainVid.src = VIDEOS[index].src;
    mainVid.load();

    if (titleEl) titleEl.textContent = VIDEOS[index].label;
    if (countEl) countEl.textContent = `${index + 1} / ${VIDEOS.length}`;

    overlay?.classList.remove('hidden');

    document.querySelectorAll('.thumb-item').forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });

    mainVid.onended = () => {
      const next = index + 1;
      if (next < VIDEOS.length) {
        loadVideo(next);
        document.getElementById('main-video')?.play();
        document.getElementById('video-play-overlay')?.classList.add('hidden');
      } else {
        document.getElementById('video-end-section')?.classList.add('visible');
      }
    };
  }

  function setupMainVideoPlayer() {
    const mainVid = document.getElementById('main-video');
    const overlay = document.getElementById('video-play-overlay');
    const playBtn = document.getElementById('play-btn-main');

    if (!mainVid || !overlay) return;

    function doPlay() {
      mainVid.play().then(() => {
        overlay.classList.add('hidden');
      }).catch(() => {});
    }

    overlay.addEventListener('click', doPlay);
    playBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      doPlay();
    });
  }

  function setupHugButton() {
    const btn = document.getElementById('hug-btn');
    const ctr = document.getElementById('hug-counter');
    updateHugDisplay(ctr);

    btn?.addEventListener('click', () => {
      hugCount++;
      localStorage.setItem('hug_count', hugCount);
      updateHugDisplay(ctr);
      playHugChime();

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.75 },
          colors: ['#C85A68', '#E8959F', '#FDECEC', '#D4AF37', '#FF758F'],
          gravity: 0.65,
        });
      }
    });
  }

  function updateHugDisplay(el) {
    if (!el) return;
    el.textContent = hugCount === 0
      ? 'Bấm để gửi cái ôm đến con mẹ nhé 💕'
      : `Mẹ đã gửi ${hugCount} cái ôm ấm áp cho con 💖`;
  }

  // --------------------------------------------------------------------------
  // 5. ZING MP3 PLAYER & WEB AUDIO
  // --------------------------------------------------------------------------
  const ZING_SONGS = [
    {
      id: 'ZW80ZI60',
      name: 'Chưa Bao Giờ Mẹ Kể',
      artist: 'MIN, ERIK',
      full: 'Chưa Bao Giờ Mẹ Kể • MIN, ERIK',
      url: 'https://zingmp3.vn/album/Chua-Bao-Gio-Me-Ke-Single-MIN-ERIK/3COqAuOefVC.html',
      embed: 'https://zingmp3.vn/embed/song/ZW80ZI60',
    },
    {
      id: 'ZZEEWE8D',
      name: 'Ước Mơ Của Mẹ',
      artist: 'Văn Mai Hương',
      full: 'Ước Mơ Của Mẹ • Văn Mai Hương',
      url: 'https://zingmp3.vn/bai-hat/Uoc-Mo-Cua-Me-Van-Mai-Huong/r0sOO1PNh7Kw.html',
      embed: 'https://zingmp3.vn/embed/song/ZZEEWE8D',
    },
  ];

  let currentSong = 0;
  let spinning = false;

  function initPlayer() {
    const pill       = document.getElementById('music-pill');
    const drawer     = document.getElementById('music-drawer');
    const closeBtn   = document.getElementById('music-drawer-close');
    const miniVinyl  = document.getElementById('mini-vinyl');
    const togglePlay = document.getElementById('drawer-toggle-play');
    const btn0       = document.getElementById('song-btn-0');
    const btn1       = document.getElementById('song-btn-1');

    pill?.addEventListener('click', (e) => {
      e.stopPropagation();
      drawer?.classList.toggle('open');
    });

    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      drawer?.classList.remove('open');
    });

    document.addEventListener('click', (e) => {
      if (drawer && !drawer.contains(e.target) && !pill?.contains(e.target)) {
        drawer.classList.remove('open');
      }
    });

    btn0?.addEventListener('click', (e) => {
      e.stopPropagation();
      switchSong(0, true);
    });

    btn1?.addEventListener('click', (e) => {
      e.stopPropagation();
      switchSong(1, true);
    });

    togglePlay?.addEventListener('click', (e) => {
      e.stopPropagation();
      spinning = !spinning;
      miniVinyl?.classList.toggle('spinning', spinning);
      const icon = document.getElementById('play-pause-icon');
      const text = document.getElementById('play-pause-text');
      const statusEl = document.getElementById('music-pill-status');
      const iframe = document.getElementById('zing-iframe');

      if (spinning) {
        if (icon) icon.textContent = '⏸️';
        if (text) text.textContent = 'Tạm dừng';
        if (statusEl) statusEl.textContent = `${ZING_SONGS[currentSong].artist} • Đang phát`;
        switchSong(currentSong, true);
      } else {
        if (icon) icon.textContent = '▶️';
        if (text) text.textContent = 'Tiếp tục phát';
        if (statusEl) statusEl.textContent = 'Đã tạm dừng';
        if (iframe) iframe.src = 'about:blank';
      }
    });

    const autoStart = () => {
      if (!spinning) {
        spinning = true;
        miniVinyl?.classList.add('spinning');
        switchSong(0, true);
      }
      document.removeEventListener('click', autoStart);
      document.removeEventListener('keydown', autoStart);
      document.removeEventListener('touchstart', autoStart);
    };

    document.addEventListener('click', autoStart);
    document.addEventListener('keydown', autoStart);
    document.addEventListener('touchstart', autoStart, { passive: true });

    setTimeout(() => autoStart(), 200);
  }

  function switchSong(index, autoStart = true) {
    currentSong = index;
    const song = ZING_SONGS[index];
    if (!song) return;

    document.getElementById('song-btn-0')?.classList.toggle('active', index === 0);
    document.getElementById('song-btn-1')?.classList.toggle('active', index === 1);

    const titleEl = document.getElementById('music-pill-title');
    const statusEl = document.getElementById('music-pill-status');
    if (titleEl) titleEl.textContent = song.name;
    if (statusEl) statusEl.textContent = `${song.artist} • Đang phát`;

    const iframe = document.getElementById('zing-iframe');
    if (iframe) {
      iframe.src = `${song.embed}?start=${autoStart ? 'true' : 'false'}`;
    }
  }

  function playSweetChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 1.3);
      });
    } catch (_) {}
  }

  function playHugChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 1.6);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 1.7);
      });
    } catch (_) {}
  }

  // --------------------------------------------------------------------------
  // 6. FLOATING TULIP PETALS
  // --------------------------------------------------------------------------
  function initPetals() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const PETAL_COUNT = 24;
    const petals = [];
    const COLORS = [
      'rgba(244, 166, 175, 0.45)',
      'rgba(232, 120, 135, 0.35)',
      'rgba(255, 209, 220, 0.50)',
      'rgba(248, 187, 208, 0.40)',
      'rgba(255, 240, 245, 0.60)',
    ];

    class Petal {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = 8 + Math.random() * 12;
        this.speedY = 0.6 + Math.random() * 1.2;
        this.speedX = Math.sin(Math.random() * 2) * 0.8;
        this.angle = Math.random() * 360;
        this.angularSpeed = (Math.random() - 0.5) * 1.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.swing = Math.random() * 2;
        this.swingCount = Math.random() * 100;
      }
      update() {
        this.swingCount += 0.02;
        this.x += Math.sin(this.swingCount) * this.swing + this.speedX;
        this.y += this.speedY;
        this.angle += this.angularSpeed;
        if (this.y > height + 20 || this.x < -30 || this.x > width + 30) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.3, this.size * 0.4, this.size * 0.8);
        ctx.quadraticCurveTo(0, this.size, -this.size * 0.4, this.size * 0.8);
        ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.3, 0, -this.size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());

    function loop() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  // --------------------------------------------------------------------------
  // 7. TOAST HELPER & APP INITIALIZATION
  // --------------------------------------------------------------------------
  function showToast(message, duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  function triggerHeartConfetti() {
    if (typeof confetti !== 'function') return;
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.2 },
        colors: ['#E8959F', '#C85A68', '#FDECEC', '#FFD1DC', '#D4AF37'],
        disableForReducedMotion: true,
      });
    } catch (_) {}
  }

  // Boot on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initScreenManager();
    initEnvelope();
    initPhotos();
    initVideoGallery();
    initPlayer();
    initPetals();

    // Nav controls
    document.getElementById('nav-prev')?.addEventListener('click', () => goPrev());
    document.getElementById('nav-next')?.addEventListener('click', () => goNext());
    document.getElementById('letter-next-btn')?.addEventListener('click', () => goNext());

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    });

    // Share link
    document.getElementById('btn-share')?.addEventListener('click', async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'Gửi Mẹ Yêu • Chúc Mừng 20/10',
            text: 'Món quà con dành tặng mẹ nhân ngày 20/10 ❤️',
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          showToast('Đã sao chép liên kết vào bộ nhớ tạm! Gửi cho mẹ nhé 💕');
        }
      } catch (_) {
        showToast('Đã sao chép liên kết vào bộ nhớ tạm! 💕');
      }
    });

    // Screen change events
    document.addEventListener('screenChange', ({ detail }) => {
      if (detail.screenId === 'screen-letter') {
        triggerHeartConfetti();
      }

      if (detail.screenId === 'screen-photos') {
        autoPlaying = true;
        startPhotoAutoPlay();
      } else {
        stopPhotoAutoPlay();
      }

      const mainVid = document.getElementById('main-video');
      const overlay = document.getElementById('video-play-overlay');
      if (detail.screenId === 'screen-video') {
        if (mainVid) {
          mainVid.play().then(() => {
            overlay?.classList.add('hidden');
          }).catch(() => {});
        }
      } else {
        if (mainVid && !mainVid.paused) {
          mainVid.pause();
          overlay?.classList.remove('hidden');
        }
      }
    });
  });
})();
