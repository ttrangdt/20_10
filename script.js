/**
 * 20/10 Gửi Mẹ Yêu - Interactive Script
 * Features: 3D Envelope Unfolding, Vinyl Player, Petals Canvas, Confetti & Hugs, Polaroid Lightbox & Live Customizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const envelopeHint = document.getElementById('envelope-hint');
  const mainContent = document.getElementById('main-content');
  const letterSection = document.getElementById('letter-section');

  // Zing MP3 Online Songs Configuration
  const ZING_SONGS = [
    {
      id: 'ZW80ZI60',
      title: 'Chưa Bao Giờ Mẹ Kể',
      artist: 'MIN, ERIK',
      fullName: 'Chưa Bao Giờ Mẹ Kể • MIN, ERIK',
      zingUrl: 'https://zingmp3.vn/album/Chua-Bao-Gio-Me-Ke-Single-MIN-ERIK/3COqAuOefVC.html',
      embedBase: 'https://zingmp3.vn/embed/song/ZW80ZI60'
    },
    {
      id: 'ZZEEWE8D',
      title: 'Ước Mơ Của Mẹ',
      artist: 'Văn Mai Hương',
      fullName: 'Ước Mơ Của Mẹ • Văn Mai Hương, Hứa Kim Tuyền',
      zingUrl: 'https://zingmp3.vn/bai-hat/Uoc-Mo-Cua-Me-Van-Mai-Huong/r0sOO1PNh7Kw.html',
      embedBase: 'https://zingmp3.vn/embed/song/ZZEEWE8D'
    }
  ];

  let currentSongIndex = 0;
  let isVinylSpinning = false;

  // Zing MP3 & Vinyl Elements
  const vinylTurntable = document.getElementById('vinyl-turntable');
  const vinylDisc = document.getElementById('vinyl-disc');
  const vinylTonearm = document.getElementById('vinyl-tonearm');
  const zingPlayerFrame = document.getElementById('zing-player-frame');
  const zingExternalLink = document.getElementById('zing-external-link');
  const trackTitle = document.getElementById('track-title');
  const btnTogglePlayerCollapse = document.getElementById('btn-toggle-player-collapse');
  const vinylWidget = document.getElementById('vinyl-player');
  const tabSong0 = document.getElementById('tab-song-0');
  const tabSong1 = document.getElementById('tab-song-1');

  // Hug & Climax Elements
  const btnSendHug = document.getElementById('btn-send-hug');
  const hugCountEl = document.getElementById('hug-count');
  const hugCounterText = document.getElementById('hug-counter-text');

  // Video Elements
  const momVideo = document.getElementById('mom-video');
  const videoOverlay = document.getElementById('video-overlay');
  const btnPlayVideo = document.getElementById('btn-play-video');
  const customVideoInput = document.getElementById('custom-video-input');

  // Lightbox Elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');

  // Customizer Elements
  const btnToggleCustomizer = document.getElementById('btn-toggle-customizer');
  const customizerModal = document.getElementById('customizer-modal');
  const btnCloseCustomizer = document.getElementById('btn-close-customizer');
  const btnSaveCustomizer = document.getElementById('btn-save-customizer');
  const inputMomName = document.getElementById('input-mom-name');
  const inputLetterContent = document.getElementById('input-letter-content');
  const inputSignature = document.getElementById('input-signature');
  const selectDefaultSong = document.getElementById('select-default-song');
  const letterSalutation = document.getElementById('letter-salutation');
  const letterBody = document.getElementById('letter-body');
  const signatureName = document.getElementById('signature-name');
  const customizerPhotoPicker = document.getElementById('customizer-photo-picker');
  const customizerVideoPicker = document.getElementById('customizer-video-picker');

  // General Buttons
  const btnShare = document.getElementById('btn-share');
  const btnBackToTop = document.getElementById('btn-back-to-top');
  const bulkPhotoInput = document.getElementById('bulk-photo-input');
  const btnQuickUploadPhoto = document.getElementById('btn-quick-upload-photo');

  let envelopeOpened = false;
  let webAudioCtx = null;

  // Initialize Hug Count from localStorage
  let currentHugs = parseInt(localStorage.getItem('mom_hug_count') || '0', 10);
  updateHugDisplay();

  // ==========================================================================
  // 1. WEB AUDIO SYNTHESIZER (Sweet Chimes on opening / hugs)
  // ==========================================================================
  function getAudioContext() {
    if (!webAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) webAudioCtx = new AudioCtx();
    }
    if (webAudioCtx && webAudioCtx.state === 'suspended') {
      webAudioCtx.resume();
    }
    return webAudioCtx;
  }

  // Play a soft sweet chime when opening envelope or sending hug
  function playSweetChime(chord = 'love') {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = chord === 'love' 
      ? [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 (Bright warm major)
      : [440, 554.37, 659.25, 880];       // A major warm chord

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 2.0);
    });
  }

  // ==========================================================================
  // 2. ZING MP3 PLAYER & VINYL TURNTABLE LOGIC
  // ==========================================================================
  function setVinylActive(active) {
    isVinylSpinning = active;
    if (vinylDisc) vinylDisc.classList.toggle('is-spinning', active);
    if (vinylTonearm) vinylTonearm.classList.toggle('is-active', active);
  }

  function switchZingSong(index, autoStart = true) {
    currentSongIndex = index;
    const song = ZING_SONGS[index];
    if (!song) return;

    // Update Tab UI
    if (tabSong0) tabSong0.classList.toggle('active', index === 0);
    if (tabSong1) tabSong1.classList.toggle('active', index === 1);
    if (tabSong0) tabSong0.setAttribute('aria-selected', index === 0);
    if (tabSong1) tabSong1.setAttribute('aria-selected', index === 1);

    // Update Titles & Links
    if (trackTitle) trackTitle.textContent = `${song.fullName} 🎵`;
    if (zingExternalLink) zingExternalLink.href = song.zingUrl;

    // Load in Zing MP3 Embed Player
    if (zingPlayerFrame) {
      const url = `${song.embedBase}?start=${autoStart ? 'true' : 'false'}`;
      zingPlayerFrame.src = url;
    }

    setVinylActive(true);
    showToast(`🎶 Đang phát: ${song.title} (${song.artist}) trên Zing MP3!`);
  }

  // Tab switch handlers
  if (tabSong0) {
    tabSong0.addEventListener('click', (e) => {
      e.stopPropagation();
      switchZingSong(0, true);
    });
  }

  if (tabSong1) {
    tabSong1.addEventListener('click', (e) => {
      e.stopPropagation();
      switchZingSong(1, true);
    });
  }

  // Turntable click: toggle spin & reload
  if (vinylTurntable) {
    vinylTurntable.addEventListener('click', () => {
      setVinylActive(!isVinylSpinning);
      if (isVinylSpinning) {
        switchZingSong(currentSongIndex, true);
      }
    });
  }

  // Collapse / Expand Player Widget
  if (btnTogglePlayerCollapse && vinylWidget) {
    btnTogglePlayerCollapse.addEventListener('click', (e) => {
      e.stopPropagation();
      vinylWidget.classList.toggle('is-collapsed');
      const isCollapsed = vinylWidget.classList.contains('is-collapsed');
      const icon = document.getElementById('collapse-icon');
      if (icon) icon.textContent = isCollapsed ? '▲' : '▼';
    });
  }

  // ==========================================================================
  // 3. ENVELOPE OPENING LOGIC
  // ==========================================================================
  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Open flap & trigger envelope CSS state
    envelope.classList.add('is-open');
    if (envelopeHint) envelopeHint.style.opacity = '0';

    playSweetChime('love');

    // Start Zing MP3 music online automatically upon opening
    switchZingSong(currentSongIndex, true);

    // After animation, reveal main content and smooth-scroll
    setTimeout(() => {
      mainContent.classList.remove('hidden');
      letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('🌸 Chúc mừng ngày 20/10 Mẹ yêu dấu!');
    }, 1100);
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', openEnvelope);
  }

  // ==========================================================================
  // 4. POLAROID SCRAPBOOK & LIGHTBOX
  // ==========================================================================
  const polaroidCards = document.querySelectorAll('.polaroid-card');

  polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-img');
      const caption = card.querySelector('.caption-text');
      if (img && lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Ảnh kỷ niệm';
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightboxModal.classList.remove('hidden');
      }
    });

    // Drag-and-drop replacement for individual cards
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      card.style.outline = '2px dashed #C85A68';
    });

    card.addEventListener('dragleave', () => {
      card.style.outline = 'none';
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.style.outline = 'none';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          const img = card.querySelector('.polaroid-img');
          if (img) {
            img.src = URL.createObjectURL(file);
            showToast('📷 Đã cập nhật ảnh Polaroid!');
          }
        }
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.add('hidden');
  }

  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Bulk Photo Upload helper
  if (btnQuickUploadPhoto && bulkPhotoInput) {
    btnQuickUploadPhoto.addEventListener('click', () => bulkPhotoInput.click());
    bulkPhotoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      if (files.length === 0) return;

      const imgs = document.querySelectorAll('.polaroid-img');
      files.forEach((file, idx) => {
        if (imgs[idx]) {
          imgs[idx].src = URL.createObjectURL(file);
        }
      });
      showToast(`📸 Đã cập nhật ${Math.min(files.length, imgs.length)} ảnh kỷ niệm!`);
    });
  }

  // ==========================================================================
  // 5. RETRO VIDEO CORNER
  // ==========================================================================
  if (momVideo && videoOverlay) {
    videoOverlay.addEventListener('click', () => {
      momVideo.play();
      videoOverlay.classList.add('is-playing');
      // Lower or pause background music so video sound is clear
      if (isAudioPlaying && bgAudio) {
        bgAudio.volume = 0.2;
      }
    });

    momVideo.addEventListener('pause', () => {
      videoOverlay.classList.remove('is-playing');
      if (isAudioPlaying && bgAudio) {
        bgAudio.volume = 1.0;
      }
    });

    momVideo.addEventListener('ended', () => {
      videoOverlay.classList.remove('is-playing');
      if (isAudioPlaying && bgAudio) {
        bgAudio.volume = 1.0;
      }
    });
  }

  if (customVideoInput && momVideo) {
    customVideoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('video/')) {
        momVideo.src = URL.createObjectURL(file);
        momVideo.load();
        showToast('📹 Đã tải video của mẹ thành công!');
      }
    });
  }

  // ==========================================================================
  // 6. CLIMAX: SEND A HUG (Heart Confetti & Toast)
  // ==========================================================================
  function updateHugDisplay() {
    if (!hugCountEl || !hugCounterText) return;
    hugCountEl.textContent = currentHugs;
    if (currentHugs === 0) {
      hugCounterText.innerHTML = 'Mẹ chưa gửi cái ôm nào. Chạm nút phía trên mẹ nhé! 💕';
    } else {
      hugCounterText.innerHTML = `Mẹ đã gửi cho con <strong id="hug-count">${currentHugs}</strong> cái ôm ấm áp 💕`;
    }
  }

  function launchHeartConfetti() {
    if (typeof confetti === 'function') {
      // Confetti burst from heart button
      const count = 75;
      const defaults = {
        origin: { y: 0.75 },
        spread: 100,
        ticks: 200,
        gravity: 0.7,
        decay: 0.94,
        startVelocity: 30,
        colors: ['#C85A68', '#E8959F', '#FDECEC', '#D4AF37', '#FF758F', '#FFB703']
      };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 45 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.5 });
      fire(0.1, { spread: 120, startVelocity: 40 });
    }
  }

  if (btnSendHug) {
    btnSendHug.addEventListener('click', () => {
      currentHugs += 1;
      localStorage.setItem('mom_hug_count', currentHugs.toString());
      updateHugDisplay();

      // Sound chime
      playSweetChime('hug');

      // Confetti explosion
      launchHeartConfetti();

      // Lovely toast message
      showToast('💖 Con đã nhận được cái ôm ấm áp của Mẹ rồi! Con yêu Mẹ nhiều lắm!');

      // Button pulse animation
      btnSendHug.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btnSendHug.style.transform = '';
      }, 150);
    });
  }

  // ==========================================================================
  // 7. CUSTOMIZER / LIVE EDIT PANEL
  // ==========================================================================
  function openCustomizer() {
    // Populate current text
    if (inputMomName && letterSalutation) {
      inputMomName.value = letterSalutation.textContent.trim();
    }
    if (inputLetterContent && letterBody) {
      inputLetterContent.value = Array.from(letterBody.querySelectorAll('p'))
        .map(p => p.textContent.trim())
        .join('\n\n');
    }
    if (inputSignature && signatureName) {
      inputSignature.value = signatureName.textContent.trim();
    }
    customizerModal.classList.remove('hidden');
  }

  function closeCustomizer() {
    customizerModal.classList.add('hidden');
  }

  if (btnToggleCustomizer) btnToggleCustomizer.addEventListener('click', openCustomizer);
  if (btnCloseCustomizer) btnCloseCustomizer.addEventListener('click', closeCustomizer);

  if (btnSaveCustomizer) {
    btnSaveCustomizer.addEventListener('click', () => {
      if (inputMomName && letterSalutation) {
        letterSalutation.textContent = inputMomName.value;
      }
      if (inputLetterContent && letterBody) {
        const paragraphs = inputLetterContent.value
          .split('\n\n')
          .filter(t => t.trim().length > 0);
        letterBody.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
      }
      if (inputSignature && signatureName) {
        signatureName.textContent = inputSignature.value;
      }

      // Handle photos from customizer picker
      if (customizerPhotoPicker && customizerPhotoPicker.files.length > 0) {
        const files = Array.from(customizerPhotoPicker.files);
        const imgs = document.querySelectorAll('.polaroid-img');
        files.forEach((file, idx) => {
          if (imgs[idx]) imgs[idx].src = URL.createObjectURL(file);
        });
      }

      // Handle default Zing MP3 song from customizer
      if (selectDefaultSong) {
        const chosenIdx = parseInt(selectDefaultSong.value, 10);
        if (chosenIdx !== currentSongIndex) {
          switchZingSong(chosenIdx, true);
        }
      }

      // Handle video from customizer picker
      if (customizerVideoPicker && customizerVideoPicker.files.length > 0 && momVideo) {
        momVideo.src = URL.createObjectURL(customizerVideoPicker.files[0]);
      }

      closeCustomizer();
      showToast('✓ Đã cập nhật lời chúc và hình ảnh!');
    });
  }

  // ==========================================================================
  // 8. SHARING & UTILITIES
  // ==========================================================================
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const shareData = {
        title: 'Gửi Mẹ Yêu • Chúc Mừng 20/10',
        text: 'Một bức thư đặc biệt con muốn gửi tới Mẹ nhân ngày Phụ Nữ Việt Nam!',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          copyToClipboard(window.location.href);
        }
      } else {
        copyToClipboard(window.location.href);
      }
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('🔗 Đã sao chép liên kết trang web!');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('🔗 Đã sao chép liên kết trang web!');
  }

  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Keyboard Escape to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeCustomizer();
    }
  });

  // Toast Function
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // ==========================================================================
  // 9. AMBIENT PETALS & SPARKLES CANVAS
  // ==========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numPetals = Math.min(30, Math.floor(width / 35));
    const petals = [];

    const petalColors = [
      'rgba(232, 149, 159, 0.45)', // Rose soft
      'rgba(244, 185, 193, 0.5)',  // Pastel pink
      'rgba(212, 175, 55, 0.35)',  // Warm gold sparkle
      'rgba(253, 236, 236, 0.6)'   // Light blush
    ];

    for (let i = 0; i < numPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 6 + 5,
        dx: Math.random() * 1.2 - 0.6,
        dy: Math.random() * 1.4 + 0.8,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        isSparkle: Math.random() > 0.65
      });
    }

    let isCanvasActive = true;
    document.addEventListener('visibilitychange', () => {
      isCanvasActive = !document.hidden;
    });

    function renderCanvas() {
      if (!isCanvasActive) {
        requestAnimationFrame(renderCanvas);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.x += p.dx + Math.sin(p.angle) * 0.4;
        p.y += p.dy;
        p.angle += p.angularSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.fillStyle = p.color;
        ctx.beginPath();

        if (p.isSparkle) {
          // 4-point star sparkle
          const s = p.r * 0.8;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
        } else {
          // Petal curve
          ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
        }

        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }
});
