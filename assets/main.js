
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const countdown = document.querySelector('[data-countdown]');
if (countdown) {
  const target = new Date('2026-10-26T20:00:00-04:00');
  const now = new Date();
  const days = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
  countdown.textContent = days > 0 ? `${days} days to Election Day` : 'Election Day is here';
}

document.querySelectorAll('[data-mailto-form]').forEach((mailForm) => {
  mailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(mailForm);
    const interest = data.get('interest') || 'General inquiry';
    const grouped = {};
    for (const [key, value] of data.entries()) {
      if (!value) continue;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(value);
    }
    const labels = {
      name: 'Name', email: 'Email', phone: 'Phone', interest: 'Interest',
      street_address: 'Street Address', availability: 'Availability',
      help_with: 'How they want to help', message: 'Message'
    };
    const lines = Object.keys(grouped).map((key) => `${labels[key] || key}: ${grouped[key].join(', ')}`);
    const subject = encodeURIComponent(`Campaign contact: ${interest}`);
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:info@hardeepghuman.ca?subject=${subject}&body=${body}`;
  });
});

// Count-up metrics when the campaign facts section scrolls into view.
const countItems = document.querySelectorAll('.count-up');
if (countItems.length) {
  const animateCount = (el) => {
    if (el.dataset.done === 'true') return;
    el.dataset.done = 'true';
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.count-up').forEach(animateCount);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  const metricSection = document.querySelector('.campaign-metrics');
  if (metricSection) observer.observe(metricSection);
}

// Copy e-Transfer email helper.
document.querySelectorAll('[data-copy-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const oldText = button.textContent;
      button.textContent = 'Copied';
      button.classList.add('copied');
      setTimeout(() => { button.textContent = oldText; button.classList.remove('copied'); }, 1400);
    } catch (err) {
      button.textContent = 'Copy manually';
    }
  });
});

// Action form tabs.
document.querySelectorAll('.action-center').forEach((center) => {
  const tabs = center.querySelectorAll('[data-action-tab]');
  const panels = center.querySelectorAll('[data-action-panel]');
  const activate = (name) => {
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.actionTab === name));
    panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.actionPanel === name));
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => activate(tab.dataset.actionTab)));
  const hash = window.location.hash.replace('#', '');
  if (hash === 'volunteer' || hash === 'sign' || hash === 'contact') activate(hash);
});
