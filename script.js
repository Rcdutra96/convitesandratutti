document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const replayBtn = document.getElementById('replayEnvelopeBtn');

  // Modais
  const rsvpBtn = document.getElementById('openRsvpBtn');
  const giftsBtn = document.getElementById('openGiftsBtn');
  const rsvpModal = document.getElementById('rsvpModal');
  const giftsModal = document.getElementById('giftsModal');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

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
  // Fallback de segurança para o loader
  setTimeout(hideLoader, 1200);

  let isOpening = false;

  // Função para abrir o convite
  const openInvitation = () => {
    if (isOpening) return;
    isOpening = true;

    // 1. Quebra o lacre de cera e esconde "CLIQUE PARA ABRIR"
    envelopeWrapper.classList.add('seal-breaking');

    // 2. Desliza as abas esquerda e direita suavemente e revela o interior
    setTimeout(() => {
      envelopeWrapper.classList.add('is-opening');
      document.body.classList.add('is-opened');
    }, 650);

    // 3. Desativa ponteiros da camada do envelope após a transição de 1.5s
    setTimeout(() => {
      envelopeWrapper.classList.add('opened');
    }, 2300);
  };

  // Função para rever a animação do envelope
  const closeInvitation = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    envelopeWrapper.classList.remove('opened');
    document.body.classList.remove('is-opened');

    requestAnimationFrame(() => {
      envelopeWrapper.classList.remove('is-opening');
      setTimeout(() => {
        envelopeWrapper.classList.remove('seal-breaking');
        isOpening = false;
      }, 1100);
    });
  };

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openInvitation);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', closeInvitation);
  }

  // Controle dos Modais (Confirmar Presença e Lista de Presentes)
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (rsvpBtn) {
    rsvpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(rsvpModal);
    });
  }

  if (giftsBtn) {
    giftsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(giftsModal);
    });
  }

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) {
        rsvpSuccess.style.display = 'block';
      }
    });
  }
});

