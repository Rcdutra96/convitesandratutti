document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSealBtn = document.getElementById('waxSealBtn');

  // Elementos da Paginação / Livro
  const bookContainer = document.getElementById('bookContainer');
  const pages = Array.from(document.querySelectorAll('.book-page'));
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageIndicators = document.querySelectorAll('.page-indicators .dot');
  const bgMusic = document.getElementById('bgMusic');
  let audioCtx;
  let gainNode;
  const soundToggleBtn = document.getElementById('soundToggleBtn');

  let currentPageIndex = 0;
  let isSoundMuted = false;
  let hasUserInteracted = false;
  let isOpening = false;

  if (bgMusic) {
    bgMusic.preload = 'auto';
    bgMusic.load();
  }

  // Oculta o loader rapidamente após fontes/DOM estarem prontos
  const hideLoader = () => {
    if (loader) {
      loader.classList.add('hidden');
    }
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      setTimeout(hideLoader, 250);
    });
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 300));
  }
  setTimeout(hideLoader, 1200);

  // Atualizar estado e classes das páginas
  const updatePagination = () => {

    pages.forEach((page, index) => {
      page.classList.remove('page-active', 'page-prev', 'page-next');
      if (index === currentPageIndex) {
        page.classList.add('page-active');
        // Reseta o scroll interno da página atual para o topo
        page.scrollTop = 0;
      } else if (index < currentPageIndex) {
        page.classList.add('page-prev');
      } else {
        page.classList.add('page-next');
      }
    });

    // Atualiza botões de navegação
    if (prevPageBtn) {
      if (currentPageIndex === 0) {
        prevPageBtn.classList.add('disabled');
        prevPageBtn.setAttribute('disabled', 'true');
      } else {
        prevPageBtn.classList.remove('disabled');
        prevPageBtn.removeAttribute('disabled');
      }
    }

    if (nextPageBtn) {
      if (currentPageIndex === pages.length - 1) {
        nextPageBtn.classList.add('disabled');
        nextPageBtn.setAttribute('disabled', 'true');
      } else {
        nextPageBtn.classList.remove('disabled');
        nextPageBtn.removeAttribute('disabled');
      }
    }

    // Atualiza dots indicadores
    pageIndicators.forEach((dot, index) => {
      if (index === currentPageIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const goToPage = (index) => {
    if (index < 0 || index >= pages.length || index === currentPageIndex) return;
    currentPageIndex = index;
    updatePagination();
  };

  const nextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      goToPage(currentPageIndex + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      goToPage(currentPageIndex - 1);
    }
  };

  // Inicializa a primeira página
  updatePagination();

  // Abertura do Envelope
  const openInvitation = () => {
    if (isOpening) return;
    isOpening = true;
    hasUserInteracted = true;

    if (bgMusic && !isSoundMuted) {
      // Inicializa o contexto de áudio no primeiro clique do usuário
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        const track = audioCtx.createMediaElementSource(bgMusic);
        gainNode = audioCtx.createGain();
        
        // Define o ganho (volume real) para 17%
        gainNode.gain.value = 0.17; 
        
        track.connect(gainNode).connect(audioCtx.destination);
      }
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      bgMusic.play().catch(() => {});
    }

    // 1. Quebra o lacre de cera e esconde prompt
    envelopeWrapper.classList.add('seal-breaking');

    // 2. Desliza abas e revela livro
    setTimeout(() => {
      envelopeWrapper.classList.add('is-opening');
      document.body.classList.add('is-opened');
    }, 650);

    // 3. Desativa ponteiros do envelope
    setTimeout(() => {
      envelopeWrapper.classList.add('opened');
    }, 2300);
  };

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openInvitation);
  }

  // Controles de clique das setas
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextPage(); // ou prevPage
      prevPage();
    });
  }

  // Garantindo handler correto de prev e next
  if (prevPageBtn) {
    prevPageBtn.onclick = (e) => {
      e.stopPropagation();
      prevPage();
    };
  }

  if (nextPageBtn) {
    nextPageBtn.onclick = (e) => {
      e.stopPropagation();
      nextPage();
    };
  }

  // Clique nos dots indicadores
  pageIndicators.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(targetIndex)) {
        goToPage(targetIndex);
      }
    });
  });

  // Botão de Som Mute / Unmute
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isSoundMuted = !isSoundMuted;
      
      if (isSoundMuted) {
        soundToggleBtn.classList.add('is-muted');
        soundToggleBtn.setAttribute('title', 'Som desativado');
        if (bgMusic) bgMusic.pause();
      } else {
        soundToggleBtn.classList.remove('is-muted');
        soundToggleBtn.setAttribute('title', 'Som ativado');
        if (bgMusic) {
          if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
          bgMusic.play().catch(() => {});
        }
      }
    });
  }

  // ===================================================
  // SUPORTE A SWIPE (TOUCH) NO LIVRO
  // ===================================================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 45; // pixels mínimos para disparar swipe

  if (bookContainer) {
    bookContainer.addEventListener('touchstart', (e) => {
      // Ignora se for gesto com mais de 1 dedo (ex: pinça para zoom)
      if (e.touches.length > 1) return;
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    bookContainer.addEventListener('touchend', (e) => {
      // Só processa o swipe se não for um gesto multitoque
      if (e.changedTouches.length > 1) return;
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    }, { passive: true });
  }

  const handleSwipeGesture = () => {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Se o movimento horizontal for predominante (virar a página)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX < 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
    // NOVO: Se o movimento vertical para baixo for predominante (pull-to-refresh)
    else if (Math.abs(diffY) > Math.abs(diffX) && diffY > 80) {
      const activePage = document.querySelector('.book-page.page-active');
      // Verifica se a página existe e se o usuário está no topo dela (scroll 0)
      if (activePage && activePage.scrollTop <= 0) {
        window.location.reload();
      }
    }
  };

  // Suporte a teclas direcionais (Desktop / Teclado)
  window.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('is-opened')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevPage();
    }
  });

  // ===================================================
  // ELEMENTO DINÂMICO: PARTÍCULAS DOURADAS FLUTUANTES
  // ===================================================
  const initGoldenParticles = () => {
    if (!bookContainer) return;

    let particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) {
      particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles-container';
      particlesContainer.setAttribute('aria-hidden', 'true');
      bookContainer.prepend(particlesContainer);
    }

    const particleCount = 18; // Entre 15 e 20 partículas leves
    particlesContainer.innerHTML = '';

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const left = Math.random() * 96 + 2; // 2% a 98%
      const startTop = Math.random() * 80 + 20; // 20% a 100%
      const duration = (Math.random() * 5 + 6).toFixed(1); // 6s a 11s
      const delay = (Math.random() * 7).toFixed(1); // 0s a 7s
      const driftX = (Math.random() * 24 - 12).toFixed(0); // -12px a +12px
      const maxOpacity = (Math.random() * 0.4 + 0.45).toFixed(2); // 0.45 a 0.85
      const size = (Math.random() * 2 + 2).toFixed(1); // 2px a 4px

      p.style.left = `${left}%`;
      p.style.top = `${startTop}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.setProperty('--p-duration', `${duration}s`);
      p.style.setProperty('--p-delay', `${delay}s`);
      p.style.setProperty('--p-drift-x', `${driftX}px`);
      p.style.setProperty('--p-max-opacity', maxOpacity);

      particlesContainer.appendChild(p);
    }
  };

  initGoldenParticles();


  // ===================================================
  // CONTAGEM REGRESSIVA PARA 06/02/2027 17:00
  // ===================================================
  const targetDate = new Date('2027-02-06T17:00:00-03:00').getTime();
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  const updateCountdown = () => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMins) cdMins.textContent = '00';
      if (cdSecs) cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===================================================
  // ADICIONAR AO GOOGLE CALENDAR / ICS
  // ===================================================
  const addToCalBtn = document.getElementById('addToCalBtn');
  if (addToCalBtn) {
    addToCalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = encodeURIComponent('Casamento Sandra & Tutti');
      const details = encodeURIComponent('Celebração do casamento de Sandra Maria Santi e Jorge de Oliveira (Tutti). Início às 17h.');
      const location = encodeURIComponent('Paróquia Nossa Senhora do Bom Parto, Nova Prata do Iguaçu - PR');
      // 06 de Fevereiro de 2027 das 17h às 23h (UTC-3: 200000Z até 020000Z do dia seguinte)
      const dates = '20270206T200000Z/20270207T030000Z';
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank');
    });
  }
});

// Previne o zoom nativo prolongado (pinch) no iOS Safari
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});
