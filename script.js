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
  const pageTurnSound = document.getElementById('pageTurnSound');
  const soundToggleBtn = document.getElementById('soundToggleBtn');

  let currentPageIndex = 0;
  let isSoundMuted = false;
  let hasUserInteracted = false;
  let isOpening = false;

  // Pré-carregamento imediato do áudio para eliminar qualquer delay na virada de página
  if (pageTurnSound) {
    pageTurnSound.preload = 'auto';
    pageTurnSound.load();
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

  // Reproduzir som de virar página de forma instantânea
  const playPageTurnSound = () => {
    if (isSoundMuted || !hasUserInteracted || !pageTurnSound) return;
    try {
      pageTurnSound.currentTime = 0;
      pageTurnSound.volume = 0.55;
      const playPromise = pageTurnSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Bloqueio de autoplay do navegador tratado silenciosamente
        });
      }
    } catch (e) {
      // Ignora erro de áudio
    }
  };

  // Atualizar estado e classes das páginas
  const updatePagination = (playAudio = true) => {
    if (playAudio) {
      playPageTurnSound();
    }

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

  const goToPage = (index, playAudio = true) => {
    if (index < 0 || index >= pages.length || index === currentPageIndex) return;
    currentPageIndex = index;
    updatePagination(playAudio);
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

  // Inicializa a primeira página sem tocar áudio
  updatePagination(false);

  // Abertura do Envelope
  const openInvitation = () => {
    if (isOpening) return;
    isOpening = true;
    hasUserInteracted = true;

    // "Acorda" e pré-carrega o áudio no primeiro gesto do usuário
    if (pageTurnSound) {
      pageTurnSound.load();
      // Executa um play/pause instantâneo para desbloquear o buffer de áudio no iOS / Android
      const unlockAudio = pageTurnSound.play();
      if (unlockAudio !== undefined) {
        unlockAudio.then(() => {
          pageTurnSound.pause();
          pageTurnSound.currentTime = 0;
        }).catch(() => {});
      }
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
        if (pageTurnSound) pageTurnSound.pause();
      } else {
        soundToggleBtn.classList.remove('is-muted');
        soundToggleBtn.setAttribute('title', 'Som ativado');
        playPageTurnSound();
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
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    bookContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    }, { passive: true });
  }

  const handleSwipeGesture = () => {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Se o movimento horizontal for predominante em relação ao vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX < 0) {
        // Swipe para esquerda -> Próxima página
        nextPage();
      } else {
        // Swipe para direita -> Página anterior
        prevPage();
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
});
