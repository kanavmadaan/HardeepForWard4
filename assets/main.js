
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

// 2026 Halton Hills voting popup.
// Desktop: split campaign card. Mobile: bounded bottom sheet.
(() => {
  const now = new Date();
  const onlineOpen = new Date('2026-10-09T09:00:00-04:00');
  const onlineClose = new Date('2026-10-25T00:00:00-04:00');
  const electionOpen = new Date('2026-10-26T10:00:00-04:00');
  const electionClose = new Date('2026-10-26T20:00:00-04:00');

  // The election is over: do not show a voting popup.
  if (now >= electionClose) return;

  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem('ward4VotingPopupSeen') === '1'; } catch (e) {}
  if (alreadySeen) return;

  const isBeforeOnline = now < onlineOpen;
  const isOnline = now >= onlineOpen && now < onlineClose;
  const isElectionDay = now >= electionOpen && now < electionClose;

  let title;
  let message;
  let timeTitle;
  let timeDetail;
  let primaryText;
  let primaryHref;
  let visualTitle;
  let visualSub;

  if (isBeforeOnline) {
    title = 'Online voting opens today.';
    message = 'Ward 4 residents can vote online through the official Town of Halton Hills voting portal.';
    timeTitle = 'Opens Friday, October 9 at 9:00 a.m.';
    timeDetail = 'Online advance voting continues until October 24 at 11:59 p.m.';
    primaryText = 'Go to Voting Portal →';
    primaryHref = 'https://vote2026.haltonhills.ca/';
    visualTitle = 'Vote Online';
    visualSub = 'October 9–24, 2026';
  } else if (isOnline) {
    title = 'Online voting is now open.';
    message = 'If you are an eligible Ward 4 voter, you can cast your ballot online through the official Town portal.';
    timeTitle = 'Online voting: October 9–24';
    timeDetail = 'Available until Saturday, October 24 at 11:59 p.m.';
    primaryText = 'Vote Online / Register →';
    primaryHref = 'https://vote2026.haltonhills.ca/';
    visualTitle = 'Vote Online';
    visualSub = 'Official Halton Hills portal';
  } else if (isElectionDay) {
    title = 'Election Day is today.';
    message = 'Ward 4 voters can vote in person at their designated Ward 4 voting location.';
    timeTitle = 'Monday, October 26';
    timeDetail = 'In-person voting is open from 10:00 a.m. to 8:00 p.m.';
    primaryText = 'Find Voting Locations →';
    primaryHref = 'https://www.haltonhills.ca/voting-locations';
    visualTitle = 'Election Day';
    visualSub = '10:00 a.m.–8:00 p.m.';
  } else {
    title = 'Make your Election Day plan.';
    message = 'Online voting has ended. Ward 4 residents can vote in person on Election Day.';
    timeTitle = 'Election Day: Monday, October 26';
    timeDetail = 'In-person voting runs from 10:00 a.m. to 8:00 p.m.';
    primaryText = 'View Official Voting Info →';
    primaryHref = 'https://www.haltonhills.ca/voting-locations';
    visualTitle = 'Vote In Person';
    visualSub = 'October 26, 2026';
  }

  const layer = document.createElement('div');
  layer.className = 'vote-popup-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `
    <section class="vote-popup-panel" role="dialog" aria-modal="true" aria-labelledby="vote-popup-title" aria-describedby="vote-popup-desc">
      <button class="vote-popup-close" type="button" aria-label="Close voting notice">×</button>
      <div class="vote-popup-visual" aria-hidden="true">
        <span class="vote-popup-badge">Ward 4 · Halton Hills</span>
        <div class="vote-popup-mark"><span>✓</span></div>
        <div>
          <strong>${visualTitle}</strong>
          <small>${visualSub}</small>
        </div>
      </div>
      <div class="vote-popup-copy">
        <span class="vote-popup-kicker">2026 Municipal Election</span>
        <h2 id="vote-popup-title">${title}</h2>
        <p id="vote-popup-desc">${message}</p>
        <div class="vote-popup-time">
          <span class="vote-popup-time-icon" aria-hidden="true">🗳️</span>
          <div><strong>${timeTitle}</strong><span>${timeDetail}</span></div>
        </div>
        <div class="vote-popup-actions">
          <a class="btn vote-popup-primary" href="${primaryHref}" target="_blank" rel="noopener noreferrer">${primaryText}</a>
          <a class="btn vote-popup-secondary" href="vote.html">Voting details</a>
        </div>
        <p class="vote-popup-official">Official voting links provided by the Town of Halton Hills.</p>
      </div>
    </section>`;

  document.body.appendChild(layer);
  const panel = layer.querySelector('.vote-popup-panel');
  const closeButton = layer.querySelector('.vote-popup-close');
  const primaryButton = layer.querySelector('.vote-popup-primary');
  const detailsButton = layer.querySelector('.vote-popup-secondary');
  let previousFocus = null;

  const markSeen = () => {
    try { sessionStorage.setItem('ward4VotingPopupSeen', '1'); } catch (e) {}
  };

  const closePopup = () => {
    markSeen();
    layer.classList.remove('is-open');
    layer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('vote-popup-open');
    window.setTimeout(() => {
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    }, 220);
  };

  const openPopup = () => {
    previousFocus = document.activeElement;
    layer.classList.add('is-open');
    layer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('vote-popup-open');
    window.setTimeout(() => closeButton.focus(), 80);
  };

  closeButton.addEventListener('click', closePopup);
  primaryButton.addEventListener('click', markSeen);
  detailsButton.addEventListener('click', markSeen);
  layer.addEventListener('click', (event) => {
    if (event.target === layer) closePopup();
  });
  document.addEventListener('keydown', (event) => {
    if (!layer.classList.contains('is-open')) return;
    if (event.key === 'Escape') closePopup();
    if (event.key === 'Tab') {
      const focusable = panel.querySelectorAll('button:not([disabled]),a[href]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // A short delay lets the page settle before the notice appears.
  window.setTimeout(openPopup, 650);
})();
