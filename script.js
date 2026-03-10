const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const revealItems = document.querySelectorAll('.reveal');
const modal = document.querySelector('#bookingModal');
const bookingForm = document.querySelector('#bookingForm');
const bookingStatus = document.querySelector('#bookingFormStatus');
const bookingTreatment = document.querySelector('#bookingTreatment');
const selectedTreatment = document.querySelector('#selectedTreatment');
const modalTitle = document.querySelector('#bookingModalTitle');
const philosophySlides = document.querySelectorAll('.philosophy-slide');
const isEnglishPage = document.documentElement.lang.toLowerCase().startsWith('en');
const uiText = isEnglishPage
  ? {
      modalDefaultTitle: 'Request your treatment',
      formMissing: 'Please fill in name, email, treatment and message before sending.',
      formSuccessPrefix: 'Request received for'
    }
  : {
      modalDefaultTitle: 'Richiedi il tuo trattamento',
      formMissing: 'Compila nome, email, trattamento e messaggio prima di inviare.',
      formSuccessPrefix: 'Richiesta ricevuta per'
    };

if (header && menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a, button').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setModalOpen(isOpen) {
  if (!modal) {
    return;
  }

  modal.classList.toggle('is-open', isOpen);
  modal.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
  document.body.classList.toggle('modal-open', isOpen);

  if (bookingStatus && isOpen) {
    bookingStatus.textContent = '';
  }
}

function syncTreatment(trigger) {
  if (!bookingTreatment || !selectedTreatment || !modalTitle) {
    return;
  }

  const treatment = String(trigger?.dataset.treatment || '').trim();

  if (treatment) {
    bookingTreatment.value = treatment;
    selectedTreatment.value = treatment;
    modalTitle.textContent = isEnglishPage
      ? `Request information about ${treatment}`
      : `Richiedi informazioni su ${treatment}`;
  } else {
    bookingTreatment.value = '';
    selectedTreatment.value = '';
    modalTitle.textContent = uiText.modalDefaultTitle;
  }
}

document.querySelectorAll('[data-open-modal="true"]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    syncTreatment(trigger);
    setModalOpen(true);
  });
});

document.querySelectorAll('[data-close-modal="true"]').forEach((trigger) => {
  trigger.addEventListener('click', () => setModalOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setModalOpen(false);
  }
});

if (bookingTreatment && selectedTreatment) {
  bookingTreatment.addEventListener('change', () => {
    selectedTreatment.value = bookingTreatment.value;
  });
}

if (bookingForm && bookingStatus) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(bookingForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const treatment = String(data.get('treatment') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !email || !treatment || !message) {
      bookingStatus.textContent = uiText.formMissing;
      return;
    }

    bookingStatus.textContent = isEnglishPage
      ? `${uiText.formSuccessPrefix} ${treatment}. We will contact you shortly with availability and confirmation.`
      : `${uiText.formSuccessPrefix} ${treatment}. Ti ricontatteremo a breve per conferma e disponibilita.`;
    bookingForm.reset();
    selectedTreatment.value = '';
    modalTitle.textContent = uiText.modalDefaultTitle;
  });
}

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (philosophySlides.length > 1) {
  let activeSlide = 0;

  window.setInterval(() => {
    philosophySlides[activeSlide].classList.remove('is-active');
    activeSlide = (activeSlide + 1) % philosophySlides.length;
    philosophySlides[activeSlide].classList.add('is-active');
  }, 3200);
}
