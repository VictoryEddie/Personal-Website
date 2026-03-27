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

  // 2. MODERN TOAST SYSTEM
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close">&times;</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    const removeToast = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    };

    toast.querySelector('.toast-close').addEventListener('click', removeToast);

    setTimeout(removeToast, 5000);
  };

  // 3. FORM SUBMISSION HANDLING (Shared logic)
  const handleFormSubmit = (form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      form.querySelectorAll('.error-tooltip').forEach(h => h.remove());

      const formData = new FormData(form);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const budget = formData.get('budget') || '';
      const message = formData.get('message') || '';

      let errors = [];
      const addError = (fieldName, msg) => {
        errors.push(msg);
        const input = form.querySelector(`[name="${fieldName}"]`);
        if (!input) return;

        const group = input.parentElement;
        group.classList.add('error');

        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        tooltip.innerHTML = `
          <div class="error-tooltip-icon">!</div>
          <div class="error-tooltip-text">${msg}</div>
          <div class="error-tooltip-arrow"></div>
        `;
        group.appendChild(tooltip);
      };

      const nameRegex = /^[A-Za-z\s]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

      if (!name.trim()) addError('name', 'Please fill out this field.');
      else if (!nameRegex.test(name)) addError('name', 'Letters and spaces only.');

      if (!email.trim()) addError('email', 'Email is required.');
      else if (!emailRegex.test(email) || emojiRegex.test(email)) addError('email', 'Valid email required.');

      if (!budget) addError('budget', 'Please select your budget.');
      if (!message.trim()) addError('message', 'Message is required.');

      if (errors.length > 0) {
        showToast("Please fix the highlighted fields", "error");
        return;
      }

      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerText;

      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      const subject = encodeURIComponent(`Project Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:viceddie124@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        window.location.href = mailtoLink;

        showToast("Message prepared! ✅", "success");
        submitBtn.innerText = 'Redirecting...';
        submitBtn.style.background = '#4CAF50';
        submitBtn.style.opacity = '1';

        form.reset();

        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;

          const modal = form.closest('.modal-overlay');
          if (modal) closeModal();
        }, 3000);
      }, 1000);
    });
  };

  const contactForm = document.getElementById('contactForm');
  if (contactForm) handleFormSubmit(contactForm);

  const modalForm = document.getElementById('modalContactForm');
  if (modalForm) handleFormSubmit(modalForm);

  // 4. CONTACT MODAL LOGIC (Enhanced for scrolling)
  const contactModal = document.getElementById('contactModal');
  const openModalBtns = document.querySelectorAll('.js-open-contact');
  const closeModalBtn = document.getElementById('closeModal');

  const openModal = () => {
    if (contactModal) {
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      contactModal.scrollTop = 0;
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

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal();
    });
  }

  // 5. UX ENHANCEMENTS & NAV
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) link.classList.add('active');
    else link.classList.remove('active');
  });

});
