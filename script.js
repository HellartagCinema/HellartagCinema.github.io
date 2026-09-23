async function loadScreenings() {
  const container = document.getElementById('screenings-container');
  try {
    const res = await fetch('content/screenings.json');
    const data = await res.json();
    const items = data.screenings || [];

    if (items.length === 0) {
      container.innerHTML = '<p class="screenings-loading">New screenings coming soon.</p>';
      return;
    }

    container.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'screening-post';
      const media = item.video
        ? `<video src="${item.video}" muted loop playsinline></video>`
        : `<img src="${item.image}" alt="${item.title}">`;
      card.innerHTML = `
        ${media}
        <span class="post-tag">Screening</span>
        <div class="post-overlay">
          <h3>${item.title}</h3>
          <p>${item.date || ''}</p>
        </div>
      `;
      container.appendChild(card);
    });
    setupVideoAutoplay();
  } catch (err) {
    container.innerHTML = '<p class="screenings-loading">Unable to load screenings right now.</p>';
  }
}

function setupVideoAutoplay() {
  const videos = document.querySelectorAll('.screening-post video');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.5 });
  videos.forEach(v => observer.observe(v));
}

async function loadContactInfo() {
  try {
    const res = await fetch('content/contact.json');
    const data = await res.json();
    const targets = [
      { phone: document.getElementById('contact-phone'), email: document.getElementById('contact-email'), wa: document.getElementById('contact-whatsapp') },
      { phone: document.getElementById('footer-phone'), email: document.getElementById('footer-email') }
    ];
    targets.forEach(t => {
      if (t.phone) { t.phone.textContent = formatPhone(data.phone); t.phone.href = 'tel:' + data.phone; }
      if (t.email) { t.email.textContent = data.email; t.email.href = 'mailto:' + data.email; }
      if (t.wa) { t.wa.href = 'https://wa.me/254' + data.phone.replace(/^0/, ''); }
    });
  } catch (err) {}
}

function formatPhone(p) {
  return p.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

function setupBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const school = document.getElementById('school-name').value;
    const contact = document.getElementById('contact-person').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value;

    const text =
      `New Booking Request%0A` +
      `School: ${school}%0A` +
      `Contact Person: ${contact}%0A` +
      `Phone: ${phone}%0A` +
      `Preferred Date: ${date}%0A` +
      `Event Details: ${message}`;

    window.open(`https://wa.me/254769698345?text=${encodeURIComponent(decodeURIComponent(text))}`, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadScreenings();
  loadContactInfo();
  setupNavToggle();
  setupBookingForm();
  document.getElementById('footer-year').textContent = new Date().getFullYear();
});
