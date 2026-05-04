/* LUXE — Hero Slider Component */

export function renderHeroSlider(slides) {
  let html = '<div class="hero" id="hero-slider">';
  slides.forEach((s, i) => {
    html += `
      <div class="hero-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
        <img src="${s.bg}" alt="${s.title.replace('\n',' ')}" class="hero-slide-bg" />
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="hero-tag">${s.tag}</span>
          <h1 class="hero-title">${s.title.replace('\n', '<br>')}</h1>
          <p class="hero-desc">${s.desc}</p>
          <div class="hero-actions">
            <a href="${s.link}" data-link class="btn btn-primary btn-lg">${s.cta}</a>
            <a href="/products" data-link class="btn btn-secondary btn-lg" style="color:#fff;border-color:rgba(255,255,255,0.4)">View All</a>
          </div>
        </div>
      </div>`;
  });
  html += `<div class="hero-dots">${slides.map((_, i) => `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>`).join('')}</div>`;
  html += `<div class="hero-arrows">
    <button class="btn-icon" id="hero-prev" style="background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.3);color:#fff">◀</button>
    <button class="btn-icon" id="hero-next" style="background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.3);color:#fff">▶</button>
  </div></div>`;
  return html;
}

export function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.hero-dot');
  let current = 0, timer;

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function start() { timer = setInterval(next, 5000); }
  function stop() { clearInterval(timer); }

  dots.forEach(d => d.addEventListener('click', () => { stop(); goTo(+d.dataset.slide); start(); }));
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stop(); next(); start(); });
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  start();
}
