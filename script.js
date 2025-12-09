document.addEventListener('DOMContentLoaded', () => {

  // hero slideshow
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');
  let current = 0;
  let timer = null;

  const setActiveDot = i =>
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));

  function initSlides() {
    slides.forEach((s, i) => {
      s.style.transition = 'none';
      s.style.opacity = i === 0 ? '1' : '0';
      s.style.transform = 'translateX(0)';
    });
    setActiveDot(0);

    requestAnimationFrame(() => {
      slides.forEach(s => (s.style.transition = ''));
      startTimer();
    });
  }

  function animateTo(nextIndex, dir = 'right') {
    if (nextIndex === current) return;

    const curr = slides[current];
    const next = slides[nextIndex];

    next.style.transition = 'none';
    next.style.opacity = '1';
    next.style.transform = dir === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
    void next.offsetWidth;

    curr.style.transition = 'opacity 0.6s ease-in-out';
    curr.style.opacity = '0';

    next.style.transition = 'transform 0.8s ease-in-out';
    next.style.transform = 'translateX(0)';

    setTimeout(() => {
      slides.forEach((s, i) => {
        s.style.transition = 'none';
        s.style.transform = 'translateX(0)';
        s.style.opacity = i === nextIndex ? '1' : '0';
      });
      current = nextIndex;
      setActiveDot(current);
    }, 850);
  }

  const nextSlide = (auto = false) => {
    animateTo((current + 1) % slides.length, 'right');
    if (!auto) restartTimer();
  };

  const prevSlide = () => {
    animateTo((current - 1 + slides.length) % slides.length, 'left');
    restartTimer();
  };

  const startTimer = () => {
    stopTimer();
    timer = setInterval(() => nextSlide(true), 6000);
  };

  const stopTimer = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const restartTimer = () => startTimer();

  nextBtn.addEventListener('click', () => nextSlide(false));
  prevBtn.addEventListener('click', () => prevSlide());
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const dir = i > current ? 'right' : 'left';
      animateTo(i, dir);
      restartTimer();
    });
  });

  initSlides();


  // slow, directional scroll reveal
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el = entry.target;

      if (entry.isIntersecting) {
        const fromBottom = entry.boundingClientRect.top > window.innerHeight / 2;

        el.classList.remove('from-top', 'from-bottom', 'visible');

        if (fromBottom) {
          el.classList.add('from-bottom'); // scroll down → glide up
        } else {
          el.classList.add('from-top');    // scroll up → glide down
        }

        void el.offsetWidth; // force reflow so transitions apply
        el.classList.add('visible');
      } else {
        el.classList.remove('visible', 'from-top', 'from-bottom');
      }
    });
  }, { threshold: 0.25 });

  reveals.forEach(r => revealObserver.observe(r));
});