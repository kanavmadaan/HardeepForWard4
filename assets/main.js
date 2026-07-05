
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

const mailForm = document.querySelector('[data-mailto-form]');
if (mailForm) {
  mailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(mailForm);
    const subject = encodeURIComponent(`Campaign contact: ${data.get('interest') || 'General inquiry'}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\nPhone: ${data.get('phone') || ''}\nInterest: ${data.get('interest') || ''}\n\nMessage:\n${data.get('message') || ''}`
    );
    window.location.href = `mailto:hello@hardeepghuman.ca?subject=${subject}&body=${body}`;
  });
}
