/* =============================================
   SAWAD - Portfolio Clone | Interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // 1. FADE-UP ANIMATIONS (Intersection Observer)
  const fadeUpElements = document.querySelectorAll('.fade-up');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeUpElements.forEach(el => {
    fadeUpObserver.observe(el);
  });

  // 2. FORM SUBMISSION HANDLING (Shared logic)
  const handleFormSubmit = (form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerText;

      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        submitBtn.innerText = 'Message Sent! ✅';
        submitBtn.style.background = '#4CAF50';
        submitBtn.style.opacity = '1';

        form.reset();

        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;

          // If it's in a modal, close it
          const modal = form.closest('.modal-overlay');
          if (modal) {
            closeModal();
          }
        }, 3000);
      }, 1500);
    });
  };

  const contactForm = document.getElementById('contactForm');
  if (contactForm) handleFormSubmit(contactForm);

  const modalForm = document.getElementById('modalContactForm');
  if (modalForm) handleFormSubmit(modalForm);

  // 3. CONTACT MODAL LOGIC
  const contactModal = document.getElementById('contactModal');
  const openModalBtns = document.querySelectorAll('.js-open-contact');
  const closeModalBtn = document.getElementById('closeModal');

  const openModal = () => {
    if (contactModal) {
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scroll
    }
  };

  const closeModal = () => {
    if (contactModal) {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close modal on click outside
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal();
    });
  }

  // 4. PAGE TRANSITION (Subtle)
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // 5. NAV ACTIVE STATE
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});
