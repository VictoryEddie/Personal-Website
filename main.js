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

      // Open WhatsApp synchronously
      const waText = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\n${message}`);
      const waLink = `https://wa.me/2349130635266?text=${waText}`;
      window.open(waLink, '_blank');

      showToast("Sending email...", "success");

      // Send Email via EmailJS
      if (typeof emailjs !== 'undefined') {
        emailjs.send("service_al83kmj", "template_5wkj4dl", {
          name: name,
          email: email,
          budget: budget,
          message: message
        }, "hvJxZu9tebkJrh45Y").then(
          (response) => {
            console.log('EmailJS Success!', response.status, response.text);
            showToast("Email Sent! ✅", "success");

            setTimeout(() => {
              form.reset();
              submitBtn.innerText = originalText;
              submitBtn.style.background = '';
              submitBtn.disabled = false;
              const modal = form.closest('.modal-overlay');
              if (modal) closeModal();
            }, 2000);
          },
          (err) => {
            const errorMsg = err.text || err.message || JSON.stringify(err);
            showToast("EmailJS failed: " + errorMsg, "error");
            console.error("EmailJS details:", err);

            submitBtn.innerText = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }
        );
      } else {
        showToast("EmailJS didn't load from CDN.", "error");
        console.error("EmailJS script not loaded.");
        submitBtn.innerText = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }
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

  // 6. THEME TOGGLE
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');

  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  const applyTheme = (theme) => {
    if (theme === 'light') {
      htmlEl.setAttribute('data-theme', 'light');
      if (themeToggleBtn) themeToggleBtn.innerHTML = moonIcon;
    } else {
      htmlEl.removeAttribute('data-theme');
      if (themeToggleBtn) themeToggleBtn.innerHTML = sunIcon;
    }
  };

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }

});
