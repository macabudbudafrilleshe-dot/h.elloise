// =========================================================
// HERO FADE-IN SEQUENCE (on load)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const heroLines = document.querySelectorAll('#hero [data-fade]');
  heroLines.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 550);
  });

  // =========================================================
  // SCROLL-TRIGGERED REVEALS
  // =========================================================
  const revealEls = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));

  // =========================================================
  // ENVELOPE BUTTON -> SCROLL TO MESSAGES
  // =========================================================
  const envelopeBtn = document.getElementById('envelope-btn');
  const messagesSection = document.getElementById('messages-section');

  if (envelopeBtn && messagesSection) {
    envelopeBtn.addEventListener('click', () => {
      messagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // =========================================================
  // RENDER FRIENDS' MESSAGES FROM data/messages.js
  // =========================================================
  const grid = document.getElementById('messages-grid');

  if (grid && typeof messages !== 'undefined') {
    messages.forEach((msg, i) => {
      const card = document.createElement('article');
      card.className = 'msg-card';
      card.setAttribute('data-reveal', '');

      const tilt = (i % 2 === 0 ? -1 : 1) * (0.6 + (i % 3) * 0.4);
      card.style.setProperty('--tilt', `${tilt}deg`);

      const inner = document.createElement('button');
      inner.type = 'button';
      inner.className = 'msg-card-inner';
      inner.setAttribute('aria-expanded', 'false');
      inner.setAttribute('aria-label', `Open ${msg.from}'s message`);

      const front = document.createElement('div');
      front.className = 'msg-face msg-face--front';
      front.innerHTML = `
        <p class="msg-front-label">a letter from</p>
        <p class="msg-front-name">${msg.from}</p>
        <span class="msg-front-icon">
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 15C9 15 1 10.2 1 5.2C1 2.6 3.1 1 5.4 1C6.9 1 8.2 1.8 9 3C9.8 1.8 11.1 1 12.6 1C14.9 1 17 2.6 17 5.2C17 10.2 9 15 9 15Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="msg-front-hint">tap to open</span>
      `;

      const back = document.createElement('div');
      back.className = 'msg-face msg-face--back' + (msg.photo ? '' : ' no-photo');

      if (msg.photo) {
        const photo = document.createElement('div');
        photo.className = 'msg-back-photo';
        photo.style.backgroundImage = `url(${msg.photo})`;
        back.appendChild(photo);
      }

      const content = document.createElement('div');
      content.className = 'msg-back-content';

      const textWrap = document.createElement('div');
      textWrap.className = 'msg-text-wrap';
      const p = document.createElement('p');
      p.textContent = msg.text;
      textWrap.appendChild(p);

      const from = document.createElement('span');
      from.className = 'msg-back-from';
      from.textContent = `— ${msg.from}`;

      content.appendChild(textWrap);
      content.appendChild(from);
      back.appendChild(content);

      inner.appendChild(front);
      inner.appendChild(back);

      inner.addEventListener('click', () => {
        const isFlipped = card.classList.toggle('is-flipped');
        inner.setAttribute('aria-expanded', String(isFlipped));
      });

      card.appendChild(inner);
      grid.appendChild(card);

      observer.observe(card);
    });
  }
});

// =========================================================
// AMBIENT SPARKLES (skipped for reduced-motion users)
// =========================================================
function initSparkles() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const colors = ['var(--cream)', 'var(--beige)', 'var(--sage)'];
  const targets = document.querySelectorAll('[data-sparkle]');

  targets.forEach(section => {
    if (section.querySelector('.sparkle-layer')) return;

    const layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    layer.setAttribute('aria-hidden', 'true');

    const count = window.innerWidth < 600 ? 20 : 38;

    for (let i = 0; i < count; i++) {
      const isStar = Math.random() < 0.15;
      const el = document.createElement('span');
      el.className = isStar ? 'sparkle sparkle--star' : 'sparkle';

      const size = isStar ? (6 + Math.random() * 6) : (1.5 + Math.random() * 2.5);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.animationDuration = `${3 + Math.random() * 4}s`;
      el.style.animationDelay = `${Math.random() * 6}s`;
      el.style.setProperty('--spark-color', colors[Math.floor(Math.random() * colors.length)]);

      layer.appendChild(el);
    }

    section.insertBefore(layer, section.firstChild);
  });
}

document.addEventListener('DOMContentLoaded', initSparkles);